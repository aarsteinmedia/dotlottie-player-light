import type { AnimationData, WorkerEvent } from '@/types'

import DataFunctionManager from '@/DataFunctionsManager'
import { isServer } from '@/utils'
import AssetLoader from '@/utils/AssetLoader'
import { getWebWorker } from '@/utils/getterSetter'

export default class DataManager {
  private static _counterId = 1
  private static workerFn: (e: WorkerEvent) => void
  private static workerProxy: Worker = {
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
      this.workerFn({
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
  }
  private static _workerSelf: {
    assetLoader?: typeof AssetLoader
    dataManager?: typeof DataFunctionManager
    postMessage: (data: {
      id: string
      payload?: unknown
      status: string
    }) => void
  } = {
    postMessage: (data: { id: string; payload?: unknown; status: string }) => {
      if (!this.workerProxy.onmessage) {
        return
      }
      this.workerProxy.onmessage({
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
  }
  private static processes: {
    [key: string]: {
      onComplete: (data: AnimationData) => void
      onError?: (error?: unknown) => void
    }
  } = {}
  private static workerInstance: Worker
  static completeAnimation(
    animation: AnimationData,
    onComplete: (data: AnimationData) => void,
    onError?: (error?: unknown) => void
  ) {
    this.setupWorker()
    const processId = this.createProcess(onComplete, onError)
    this.workerInstance.postMessage({
      animation,
      id: processId,
      type: 'complete',
    })
  }
  static loadAnimation(
    path: string,
    onComplete: (data: AnimationData) => void,
    onError?: (error?: unknown) => void
  ) {
    if (isServer()) {
      return
    }
    this.setupWorker()
    const processId = this.createProcess(onComplete, onError)
    this.workerInstance.postMessage({
      fullPath: isServer()
        ? path
        : window.location.origin + window.location.pathname,
      id: processId,
      path: path,
      type: 'loadAnimation',
    })
  }
  static loadData(
    path: string,
    onComplete: (data: AnimationData) => void,
    onError?: (error?: unknown) => void
  ) {
    this.setupWorker()
    const processId = this.createProcess(onComplete, onError)
    this.workerInstance.postMessage({
      fullPath: isServer()
        ? path
        : window.location.origin + window.location.pathname,
      id: processId,
      path: path,
      type: 'loadData',
    })
  }
  private static createProcess(
    onComplete: (data: AnimationData) => void,
    onError?: (error?: unknown) => void
  ) {
    this._counterId += 1
    const id = `processId_${this._counterId}`
    try {
      this.processes[id] = {
        onComplete,
        onError,
      }
      return id
    } catch (err) {
      console.error(err)
      throw new Error('Could not create animation proccess')
    }
  }
  private static createWorker(fn: (e: WorkerEvent) => unknown): Worker {
    if (!isServer() && window.Worker && window.Blob && getWebWorker()) {
      const blob = new Blob(
        ['var _workerSelf = self; self.onmessage = ', fn.toString()],
        { type: 'text/javascript' }
      )
      // var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob)
      return new Worker(url)
    }
    this.workerFn = fn
    return this.workerProxy
  }
  private static setupWorker() {
    if (this.workerInstance) {
      return
    }
    this.workerInstance = this.createWorker((e) => {
      if (!this._workerSelf.dataManager) {
        this._workerSelf.dataManager = DataFunctionManager
      }

      if (!this._workerSelf.assetLoader) {
        this._workerSelf.assetLoader = AssetLoader
      }

      if (e.data.type === 'loadAnimation') {
        this._workerSelf.assetLoader.load(
          e.data.path,
          e.data.fullPath,
          (data) => {
            this._workerSelf.dataManager?.completeData?.(data)

            this._workerSelf.postMessage({
              id: e.data.id,
              payload: data,
              status: 'success',
            })
          },
          () => {
            this._workerSelf.postMessage({
              id: e.data.id,
              status: 'error',
            })
          }
        )
        return
      }
      if (e.data.type === 'complete') {
        const animation = e.data.animation
        this._workerSelf.dataManager.completeData?.(animation)
        this._workerSelf.postMessage({
          id: e.data.id,
          payload: animation,
          status: 'success',
        })
        return
      }
      if (e.data.type === 'loadData') {
        this._workerSelf.assetLoader?.load(
          e.data.path,
          e.data.fullPath,
          (data) => {
            this._workerSelf.postMessage({
              id: e.data.id,
              payload: data,
              status: 'success',
            })
          },
          () => {
            this._workerSelf.postMessage({
              id: e.data.id,
              status: 'error',
            })
          }
        )
      }
    })

    this.workerInstance.onmessage = ({ data }) => {
      const { id } = data
      const process = this.processes[id]
      this.processes[id] = null as any
      if (data.status === 'success') {
        process.onComplete(data.payload)
        return
      }
      if (process.onError) {
        process.onError()
      }
    }
  }
}
