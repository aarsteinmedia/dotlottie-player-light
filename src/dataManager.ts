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

// const dataManager = (() => {
//   let _counterId = 1
//   const processes: Process[] = []
//   let workerFn: (e: WorkerEvent) => void
//   let workerInstance: Worker
//   const workerProxy: Worker = {
//     addEventListener: <K extends keyof WorkerEventMap>(
//       _type: K,
//       _listener: (this: Worker, ev: WorkerEventMap[K]) => unknown,
//       _options?: boolean | AddEventListenerOptions
//     ): void => {
//       throw new Error('Function not implemented.')
//     },
//     dispatchEvent: (_: Event): boolean => {
//       throw new Error('Function not implemented.')
//     },
//     onerror: null,
//     onmessage: (_: { data: string }) => {},
//     onmessageerror: null,
//     postMessage: (path: WorkerEvent['data']) => {
//       workerFn({
//         data: path,
//       })
//     },
//     removeEventListener: <K extends keyof WorkerEventMap>(
//       _type: K,
//       _listener: (this: Worker, ev: WorkerEventMap[K]) => unknown,
//       _options?: boolean | EventListenerOptions
//     ): void => {
//       throw new Error('Function not implemented.')
//     },
//     terminate: (): void => {
//       throw new Error('Function not implemented.')
//     },
//   }
//   const _workerSelf: {
//     assetLoader?: {
//       load: AssetLoader
//     }
//     dataManager?: typeof DataFunctionManager
//     postMessage: (data: {
//       id: string
//       payload?: AnimationData | AnimationItem
//       status: string
//     }) => void
//   } = {
//     postMessage: (data: {
//       id: string
//       payload?: AnimationData | AnimationItem
//       status: string
//     }) => {
//       if (!workerProxy.onmessage) {
//         return
//       }
//       workerProxy.onmessage({
//         AT_TARGET: 2,
//         bubbles: false,
//         BUBBLING_PHASE: 3,
//         cancelable: false,
//         cancelBubble: false,
//         CAPTURING_PHASE: 1,
//         composed: false,
//         composedPath: (): EventTarget[] => {
//           throw new Error('Function not implemented.')
//         },
//         currentTarget: null,
//         data: data,
//         defaultPrevented: false,
//         eventPhase: 0,
//         initEvent: function (
//           _type: string,
//           _bubbles?: boolean,
//           _cancelable?: boolean
//         ): void {
//           throw new Error('Function not implemented.')
//         },
//         initMessageEvent: (
//           _type: string,
//           _bubbles?: boolean,
//           _cancelable?: boolean,
//           _data?: unknown,
//           _origin?: string,
//           _lastEventId?: string,
//           _source?: MessageEventSource | null,
//           _ports?: MessagePort[]
//         ): void => {
//           throw new Error('Function not implemented.')
//         },
//         isTrusted: false,
//         lastEventId: '',
//         NONE: 0,
//         origin: '',
//         ports: [],
//         preventDefault: (): void => {
//           throw new Error('Function not implemented.')
//         },
//         returnValue: false,
//         source: null,
//         srcElement: null,
//         stopImmediatePropagation: (): void => {
//           throw new Error('Function not implemented.')
//         },
//         stopPropagation: (): void => {
//           throw new Error('Function not implemented.')
//         },
//         target: null,
//         timeStamp: 0,
//         type: '',
//       })
//     },
//   }
//   /**
//    *
//    */
//   function createWorker(fn: (e: WorkerEvent) => unknown): Worker {
//     if (!isServer() && window.Worker && window.Blob && getWebWorker()) {
//       const blob = new Blob(
//         ['var _workerSelf = self; self.onmessage = ', fn.toString()],
//         { type: 'text/javascript' }
//       )
//       // var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
//       const url = URL.createObjectURL(blob)
//       return new Worker(url)
//     }
//     workerFn = fn
//     return workerProxy
//   }

//   function setupWorker() {
//     if (workerInstance) {
//       return
//     }
//     workerInstance = createWorker(function workerStart(e) {
//       if (!_workerSelf.dataManager) {
//         _workerSelf.dataManager = DataFunctionManager
//       }

//       if (!_workerSelf.assetLoader) {
//         _workerSelf.assetLoader = (() => {
//           /**
//            *
//            */
//           function formatResponse(xhr: XMLHttpRequest) {
//             // using typeof doubles the time of execution of this method,
//             // so if available, it's better to use the header to validate the type
//             const contentTypeHeader = xhr.getResponseHeader('content-type')
//             if (
//               contentTypeHeader &&
//               xhr.responseType === 'json' &&
//               contentTypeHeader.indexOf('json') !== -1
//             ) {
//               return xhr.response
//             }
//             if (xhr.response && typeof xhr.response === 'object') {
//               return xhr.response
//             }
//             if (xhr.response && typeof xhr.response === 'string') {
//               return JSON.parse(xhr.response)
//             }
//             if (xhr.responseText) {
//               return JSON.parse(xhr.responseText)
//             }
//             return null
//           }

//           /**
//            *
//            */
//           function loadAsset(
//             path: string,
//             fullPath: string,
//             callback: (asset: LottieAsset) => void,
//             errorCallback: (err: unknown) => void
//           ) {
//             let response
//             const xhr = new XMLHttpRequest()
//             // set responseType after calling open or IE will break.
//             try {
//               // This crashes on Android WebView prior to KitKat
//               xhr.responseType = 'json'
//             } catch (_) {} // eslint-disable-line no-empty
//             xhr.onreadystatechange = function () {
//               if (xhr.readyState !== 4) {
//                 return
//               }
//               if (xhr.status === 200) {
//                 response = formatResponse(xhr)
//                 callback(response)
//                 return
//               }
//               try {
//                 response = formatResponse(xhr)
//                 callback(response)
//               } catch (err) {
//                 if (errorCallback) {
//                   errorCallback(err)
//                 }
//               }
//             }
//             try {
//               // Hack to workaround banner validation
//               xhr.open(['G', 'E', 'T'].join(''), path, true)
//             } catch (_) {
//               // Hack to workaround banner validation
//               xhr.open(['G', 'E', 'T'].join(''), `${fullPath}/${path}`, true)
//             }
//             xhr.send()
//           }
//           return {
//             load: loadAsset,
//           }
//         })()
//       }

//       if (e.data.type === 'loadAnimation') {
//         _workerSelf.assetLoader?.load(
//           e.data.path,
//           e.data.fullPath,
//           (data) => {
//             if (_workerSelf.dataManager?.completeData) {
//               _workerSelf.dataManager.completeData(data)
//             }

//             _workerSelf.postMessage({
//               id: e.data.id,
//               payload: data,
//               status: 'success',
//             })
//           },
//           () => {
//             _workerSelf.postMessage({
//               id: e.data.id,
//               status: 'error',
//             })
//           }
//         )
//         return
//       }
//       if (e.data.type === 'complete') {
//         const animation = e.data.animation
//         if (_workerSelf.dataManager?.completeData) {
//           _workerSelf.dataManager.completeData(animation)
//         }
//         _workerSelf.postMessage({
//           id: e.data.id,
//           payload: animation,
//           status: 'success',
//         })
//         return
//       }
//       if (e.data.type === 'loadData') {
//         _workerSelf.assetLoader?.load(
//           e.data.path,
//           e.data.fullPath,
//           (data) => {
//             _workerSelf.postMessage({
//               id: e.data.id,
//               payload: data,
//               status: 'success',
//             })
//           },
//           () => {
//             _workerSelf.postMessage({
//               id: e.data.id,
//               status: 'error',
//             })
//           }
//         )
//       }
//     })

//     workerInstance.onmessage = ({ data }) => {
//       const { id } = data
//       const process = processes[id]
//       // @ts-expect-error: ignore
//       processes[id] = null
//       if (data.status === 'success') {
//         process.onComplete(data.payload)
//         return
//       }
//       if (process.onError) {
//         process.onError()
//       }
//     }
//   }

//   /**
//    *
//    */
//   function createProcess<T = unknown>(
//     onComplete: (x: T) => void,
//     onError?: (x?: unknown) => void
//   ) {
//     _counterId += 1
//     const id = `processId_${_counterId}`
//     processes[id] = {
//       onComplete,
//       onError,
//     }
//     return id
//   }

//   /**
//    *
//    */
//   function loadAnimation(
//     path: string,
//     onComplete: (data: AnimationData) => void,
//     onError?: (x?: unknown) => void
//   ) {
//     if (isServer()) {
//       return
//     }
//     setupWorker()
//     const processId = createProcess(onComplete, onError)
//     workerInstance.postMessage({
//       fullPath: window.location.origin + window.location.pathname,
//       id: processId,
//       path: path,
//       type: 'loadAnimation',
//     })
//   }

//   /**
//    *
//    */
//   function loadData<T = unknown>(
//     path: string,
//     onComplete: (data: T) => void,
//     onError?: (x?: unknown) => void
//   ) {
//     setupWorker()
//     const processId = createProcess(onComplete, onError)
//     workerInstance.postMessage({
//       fullPath: isServer()
//         ? path
//         : window.location.origin + window.location.pathname,
//       id: processId,
//       path: path,
//       type: 'loadData',
//     })
//   }

//   /**
//    *
//    */
//   function completeAnimation(
//     animation: AnimationData,
//     onComplete: (data: AnimationData) => void,
//     onError?: (x?: unknown) => void
//   ) {
//     setupWorker()
//     const processId = createProcess(onComplete, onError)
//     workerInstance.postMessage({
//       animation,
//       id: processId,
//       type: 'complete',
//     })
//   }

//   return {
//     completeAnimation,
//     loadAnimation,
//     loadData,
//   }
// })()

// export default dataManager
