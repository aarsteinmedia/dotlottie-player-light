import type { AnimationData, WorkerEvent } from '@/types'

import { completeData } from '@/DataFunctions'
import { isServer } from '@/utils'
import { loadAsset } from '@/utils/AssetLoader'
import { getWebWorker } from '@/utils/getterSetter'

let _counterId = 1,
  workerFn: (e: WorkerEvent) => void
const workerProxy: Worker = {
    addEventListener: <K extends keyof WorkerEventMap>(
      _type: K,
      _listener: (this: Worker, ev: WorkerEventMap[K]) => unknown,
      _options?: boolean | AddEventListenerOptions
    ): void => {
      throw new Error('Function not implemented.')
    },
    dispatchEvent: (_: Event): boolean => {
      throw new Error('Function not implemented.')
    },
    onerror: null,
    onmessage: (_: { data: string }) => {},
    onmessageerror: null,
    postMessage: (data: WorkerEvent['data']) => {
      workerFn({
        data,
      })
    },
    removeEventListener: <K extends keyof WorkerEventMap>(
      _type: K,
      _listener: (this: Worker, ev: WorkerEventMap[K]) => unknown,
      _options?: boolean | EventListenerOptions
    ): void => {
      throw new Error('Function not implemented.')
    },
    terminate: (): void => {
      throw new Error('Function not implemented.')
    },
  },
  _workerSelf: {
    postMessage: (data: {
      id: string
      payload?: unknown
      status: string
    }) => void
  } = {
    postMessage: (data: { id: string; payload?: unknown; status: string }) => {
      if (!workerProxy.onmessage) {
        return
      }
      workerProxy.onmessage({
        AT_TARGET: 2,
        bubbles: false,
        BUBBLING_PHASE: 3,
        cancelable: false,
        cancelBubble: false,
        CAPTURING_PHASE: 1,
        composed: false,
        composedPath: (): EventTarget[] => {
          throw new Error('Function not implemented.')
        },
        currentTarget: null,
        data: data,
        defaultPrevented: false,
        eventPhase: 0,
        initEvent: function (
          _type: string,
          _bubbles?: boolean,
          _cancelable?: boolean
        ): void {
          throw new Error('Function not implemented.')
        },
        initMessageEvent: (
          _type: string,
          _bubbles?: boolean,
          _cancelable?: boolean,
          _data?: unknown,
          _origin?: string,
          _lastEventId?: string,
          _source?: MessageEventSource | null,
          _ports?: MessagePort[]
        ): void => {
          throw new Error('Function not implemented.')
        },
        isTrusted: false,
        lastEventId: '',
        NONE: 0,
        origin: '',
        ports: [],
        preventDefault: (): void => {
          throw new Error('Function not implemented.')
        },
        returnValue: false,
        source: null,
        srcElement: null,
        stopImmediatePropagation: (): void => {
          throw new Error('Function not implemented.')
        },
        stopPropagation: (): void => {
          throw new Error('Function not implemented.')
        },
        target: null,
        timeStamp: 0,
        type: '',
      })
    },
  },
  processes: {
    [key: string]: {
      onComplete: (data: AnimationData) => void
      onError?: (error?: unknown) => void
    }
  } = {}
let workerInstance: Worker
/**
 *
 */
export function completeAnimation(
  animation: AnimationData,
  onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void
) {
  setupWorker()
  const processId = createProcess(onComplete, onError)
  workerInstance.postMessage({
    animation,
    id: processId,
    type: 'complete',
  })
}
/**
 *
 */
export function loadAnimation(
  path: string,
  onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void
) {
  if (isServer()) {
    return
  }
  setupWorker()
  const processId = createProcess(onComplete, onError)
  workerInstance.postMessage({
    fullPath: isServer()
      ? path
      : window.location.origin + window.location.pathname,
    id: processId,
    path: path,
    type: 'loadAnimation',
  })
}
/**
 *
 */
export function loadData(
  path: string,
  onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void
) {
  setupWorker()
  const processId = createProcess(onComplete, onError)
  workerInstance.postMessage({
    fullPath: isServer()
      ? path
      : window.location.origin + window.location.pathname,
    id: processId,
    path: path,
    type: 'loadData',
  })
}
/**
 *
 */
function createProcess(
  onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void
) {
  _counterId += 1
  const id = `processId_${_counterId}`
  try {
    processes[id] = {
      onComplete,
      onError,
    }
    return id
  } catch (err) {
    console.error(err)
    throw new Error('Could not create animation proccess')
  }
}
/**
 *
 */
function createWorker(fn: (e: WorkerEvent) => unknown): Worker {
  if (!isServer() && window.Worker && window.Blob && getWebWorker()) {
    const blob = new Blob(
      ['var _workerSelf = self; self.onmessage = ', fn.toString()],
      { type: 'text/javascript' }
    )
    const url = URL.createObjectURL(blob)
    return new Worker(url)
  }
  workerFn = fn
  return workerProxy
}
function setupWorker() {
  if (workerInstance) {
    return
  }
  workerInstance = createWorker((e) => {
    if (e.data.type === 'loadAnimation') {
      loadAsset(
        e.data.path,
        e.data.fullPath,
        (data) => {
          completeData(data)

          _workerSelf.postMessage({
            id: e.data.id,
            payload: data,
            status: 'success',
          })
        },
        () => {
          _workerSelf.postMessage({
            id: e.data.id,
            status: 'error',
          })
        }
      )
      return
    }
    if (e.data.type === 'complete') {
      const animation = e.data.animation
      completeData(animation)
      _workerSelf.postMessage({
        id: e.data.id,
        payload: animation,
        status: 'success',
      })
      return
    }
    if (e.data.type === 'loadData') {
      loadAsset(
        e.data.path,
        e.data.fullPath,
        (data) => {
          _workerSelf.postMessage({
            id: e.data.id,
            payload: data,
            status: 'success',
          })
        },
        () => {
          _workerSelf.postMessage({
            id: e.data.id,
            status: 'error',
          })
        }
      )
    }
  })

  workerInstance.onmessage = ({ data }) => {
    const { id } = data
    const process = processes[id]
    processes[id] = null as any
    if (data.status === 'success') {
      process.onComplete(data.payload)
      return
    }
    if (process.onError) {
      process.onError()
    }
  }
}
