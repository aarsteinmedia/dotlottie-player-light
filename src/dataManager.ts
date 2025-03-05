/* eslint-disable max-depth */
import type {
  AnimationData,
  AssetLoader,
  LottieLayer,
  DataFunctionManager,
  Process,
  Shape,
  Vector3,
  WorkerEvent,
  LottieAsset,
} from '@/types'
import { isServer } from '@/utils'
import { ShapeType } from '@/enums'
import { getWebWorker } from '@/utils/getterSetter'
import type AnimationItem from '@/animation/AnimationItem'

const dataManager = (() => {
  let _counterId = 1
  const processes: Process[] = []
  let workerFn: (e: WorkerEvent) => void
  let workerInstance: Worker
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
    postMessage: (path: WorkerEvent['data']) => {
      workerFn({
        data: path,
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
  const _workerSelf: {
    assetLoader?: {
      load: AssetLoader
    }
    dataManager?: DataFunctionManager
    postMessage: (data: {
      id: string
      payload?: AnimationData | AnimationItem
      status: string
    }) => void
  } = {
    postMessage: (data: {
      id: string
      payload?: AnimationData | AnimationItem
      status: string
    }) => {
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
      // var blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
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
    workerInstance = createWorker(function workerStart(e) {
      /**
       *
       */
      function dataFunctionManager() {
        /**
         *
         */
        function completeLayers(layers: LottieLayer[], comps: any[]) {
          const { length } = layers
          let j
          let jLen
          let k
          let kLen
          for (let i = 0; i < length; i++) {
            if (!('ks' in layers[i]) || layers[i].completed) {
              continue
            }
            layers[i].completed = true
            if (layers[i].hasMask) {
              const maskProps = layers[i].masksProperties
              jLen = maskProps?.length || 0
              for (j = 0; j < jLen; j++) {
                if (maskProps?.[j].pt.k.i) {
                  convertPathsToAbsoluteValues(maskProps[j].pt.k)
                  continue
                }
                kLen = (maskProps?.[j].pt.k.length as unknown as number) || 0
                for (k = 0; k < kLen; k++) {
                  // @ts-expect-error: ignore
                  if (maskProps?.[j].pt.k[k].s) {
                    // @ts-expect-error: ignore
                    convertPathsToAbsoluteValues(maskProps[j].pt.k[k].s[0])
                  }
                  // @ts-expect-error: ignore
                  if (maskProps?.[j].pt.k[k].e) {
                    // @ts-expect-error: ignore
                    convertPathsToAbsoluteValues(maskProps[j].pt.k[k].e[0])
                  }
                }
              }
            }
            if (layers[i].ty === 0) {
              layers[i].layers = findCompLayers(layers[i].refId, comps)
              completeLayers(layers[i].layers as LottieLayer[], comps)
            } else if (layers[i].ty === 4) {
              completeShapes(layers[i].shapes || [])
            } else if (layers[i].ty === 5) {
              completeText(layers[i])
            }
          }
        }

        /**
         *
         */
        function completeChars(
          chars: any[],
          assets: (LottieLayer | LottieAsset)[]
        ) {
          if (!chars) {
            return
          }
          const { length } = chars
          for (let i = 0; i < length; i++) {
            if (chars[i].t !== 1) {
              continue
            }
            // var compData = findComp(chars[i].data.refId, assets);
            // @ts-expect-error: ignore
            chars[i].data.layers = findCompLayers(chars[i].data.refId, assets)
            // chars[i].data.ip = 0;
            // chars[i].data.op = 99999;
            // chars[i].data.st = 0;
            // chars[i].data.sr = 1;
            // chars[i].w = compData.w;
            // chars[i].data.ks = {
            //   a: { k: [0, 0, 0], a: 0 },
            //   p: { k: [0, -compData.h, 0], a: 0 },
            //   r: { k: 0, a: 0 },
            //   s: { k: [100, 100], a: 0 },
            //   o: { k: 100, a: 0 },
            // };
            completeLayers(chars[i].data.layers, assets)
          }
        }

        /**
         *
         */
        function findComp(id: string, comps: LottieLayer[]) {
          let i = 0
          const len = comps.length
          while (i < len) {
            if (comps[i].id === id) {
              return comps[i]
            }
            i++
          }
          return null
        }

        /**
         *
         */
        function findCompLayers(id?: string, comps?: LottieLayer[]) {
          if (!id || !comps) {
            return
          }
          const comp = findComp(id, comps)
          if (comp) {
            if (!comp.layers?.__used) {
              // @ts-expect-error: ignore
              comp.layers.__used = true
              return comp.layers
            }
            return JSON.parse(JSON.stringify(comp.layers))
          }
          return null
        }

        /**
         *
         */
        function completeShapes(arr: Shape[]) {
          const { length } = arr
          let j
          let jLen
          for (let i = length - 1; i >= 0; i -= 1) {
            if (arr[i].ty === 'sh') {
              if (arr[i].ks?.k.i) {
                convertPathsToAbsoluteValues(arr[i].ks?.k)
              } else {
                jLen = (arr[i].ks?.k.length as unknown as number) || 0
                for (j = 0; j < jLen; j++) {
                  // @ts-expect-error: ignore
                  if (arr[i].ks.k[j]?.s) {
                    // @ts-expect-error: ignore
                    convertPathsToAbsoluteValues(arr[i].ks.k[j]?.s[0])
                  }
                  // @ts-expect-error: ignore
                  if (arr[i].ks.k[j]?.e) {
                    // @ts-expect-error: ignore
                    convertPathsToAbsoluteValues(arr[i].ks.k[j]?.e[0])
                  }
                }
              }
              continue
            }
            if (arr[i].ty === 'gr') {
              completeShapes(arr[i].it as Shape[])
            }
          }
        }

        /**
         *
         */
        function convertPathsToAbsoluteValues(path: any) {
          const { length } = path.i
          for (let i = 0; i < length; i++) {
            path.i[i][0] += path.v[i][0]
            path.i[i][1] += path.v[i][1]
            path.o[i][0] += path.v[i][0]
            path.o[i][1] += path.v[i][1]
          }
        }

        /**
         *
         */
        function checkVersion(minimum: Vector3, animVersionString: string) {
          const animVersion = animVersionString
            ? animVersionString.split('.').map((str) => Number(str))
            : [100, 100, 100]
          if (minimum[0] > animVersion[0]) {
            return true
          }
          if (animVersion[0] > minimum[0]) {
            return false
          }
          if (minimum[1] > animVersion[1]) {
            return true
          }
          if (animVersion[1] > minimum[1]) {
            return false
          }
          if (minimum[2] > animVersion[2]) {
            return true
          }
          if (animVersion[2] > minimum[2]) {
            return false
          }
          return null
        }

        const checkText = (function () {
          const minimumVersion: Vector3 = [4, 4, 14]

          /**
           *
           */
          function updateTextLayer(textLayer: LottieLayer) {
            const documentData = textLayer.t?.d
            if (!textLayer.t?.d || !documentData) {
              return
            }
            // @ts-expect-error: Missing porperties
            textLayer.t.d = {
              k: [
                {
                  s: documentData,
                  t: 0,
                },
              ],
            }
          }

          /**
           *
           */
          function iterateLayers(layers: LottieLayer[]) {
            const { length } = layers
            for (let i = 0; i < length; i++) {
              if (layers[i].ty === 5) {
                updateTextLayer(layers[i])
              }
            }
          }

          return (animationData: AnimationData) => {
            if (checkVersion(minimumVersion, animationData.v)) {
              iterateLayers(animationData.layers)
              if (animationData.assets) {
                let i
                const len = animationData.assets.length
                for (i = 0; i < len; i++) {
                  if (animationData.assets[i].layers) {
                    iterateLayers(animationData.assets[i].layers!)
                  }
                }
              }
            }
          }
        })()

        const checkChars = (() => {
          const minimumVersion: Vector3 = [4, 7, 99]
          return (animationData: AnimationData) => {
            if (
              !animationData.chars ||
              checkVersion(minimumVersion, animationData.v)
            ) {
              return
            }
            const { length } = animationData.chars
            for (let i = 0; i < length; i++) {
              if (
                animationData.chars[i].data &&
                animationData.chars[i].data.shapes
              ) {
                completeShapes(animationData.chars[i].data.shapes || [])
                animationData.chars[i].data.ip = 0
                animationData.chars[i].data.op = 99999
                animationData.chars[i].data.st = 0
                animationData.chars[i].data.sr = 1
                // @ts-expect-error: TODO:
                animationData.chars[i].data.ks = {
                  a: { a: 0, k: [0, 0] },
                  o: { a: 0, k: 100 },
                  p: { a: 0, k: [0, 0] },
                  r: { a: 0, k: 0 },
                  s: { a: 0, k: [100, 100] },
                }
                if (!animationData.chars[i].t) {
                  animationData.chars[i].data.shapes?.push({
                    ty: ShapeType.NoStyle,
                  })
                  animationData.chars[i].data.shapes?.[0].it?.push({
                    a: { a: 0, k: [0, 0] },
                    o: { a: 0, k: 100 },
                    p: { a: 0, k: [0, 0] },
                    r: { a: 0, k: 0 },
                    s: { a: 0, k: [100, 100] },
                    sa: { a: 0, k: 0 },
                    sk: { a: 0, k: 0 },
                    ty: ShapeType.Transform,
                  })
                }
              }
            }
          }
        })()

        const checkPathProperties = (() => {
          const minimumVersion: Vector3 = [5, 7, 15]

          /**
           *
           */
          function updateTextLayer(textLayer: LottieLayer) {
            const pathData = textLayer.t?.p
            if (!pathData) {
              return
            }
            if (typeof pathData.a === 'number') {
              pathData.a = {
                a: 0,
                k: pathData.a,
              }
            }
            if (typeof pathData.p === 'number') {
              pathData.p = {
                a: 0,
                k: pathData.p,
              }
            }
            if (typeof pathData.r === 'number') {
              pathData.r = {
                a: 0,
                k: pathData.r,
              }
            }
          }

          /**
           *
           */
          function iterateLayers(layers: LottieLayer[]) {
            const { length } = layers
            for (let i = 0; i < length; i++) {
              if (layers[i].ty === 5) {
                updateTextLayer(layers[i])
              }
            }
          }

          return (animationData: AnimationData) => {
            if (checkVersion(minimumVersion, animationData.v)) {
              iterateLayers(animationData.layers)
              if (animationData.assets) {
                const { length } = animationData.assets
                for (let i = 0; i < length; i++) {
                  if (animationData.assets[i].layers) {
                    iterateLayers(animationData.assets[i].layers!)
                  }
                }
              }
            }
          }
        })()

        const checkColors = (() => {
          const minimumVersion: Vector3 = [4, 1, 9]

          /**
           *
           */
          function iterateShapes(shapes?: Shape[]) {
            if (!shapes) {
              return
            }
            const { length } = shapes
            let j
            let jLen
            for (let i = 0; i < length; i++) {
              if (shapes[i].ty === 'gr') {
                iterateShapes(shapes[i].it)
                continue
              }
              if (shapes[i].ty !== 'fl' && shapes[i].ty !== 'st') {
                continue
              }
              // @ts-expect-error: ignore
              if (shapes[i].c?.k && shapes[i].c.k[0].i) {
                // @ts-expect-error: ignore
                jLen = shapes[i].c?.k.length || 0
                for (j = 0; j < jLen; j++) {
                  // @ts-expect-error: ignore
                  if (shapes[i].c.k[j].s) {
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].s[0] /= 255
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].s[1] /= 255
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].s[2] /= 255
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].s[3] /= 255
                  }
                  // @ts-expect-error: ignore
                  if (shapes[i].c.k[j].e) {
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].e[0] /= 255
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].e[1] /= 255
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].e[2] /= 255
                    // @ts-expect-error: ignore
                    shapes[i].c.k[j].e[3] /= 255
                  }
                }
                continue
              }
              // @ts-expect-error: ignore
              shapes[i].c.k[0] /= 255
              // @ts-expect-error: ignore
              shapes[i].c.k[1] /= 255
              // @ts-expect-error: ignore
              shapes[i].c.k[2] /= 255
              // @ts-expect-error: ignore
              shapes[i].c.k[3] /= 255
            }
          }

          /**
           *
           */
          function iterateLayers(layers: LottieLayer[]) {
            const len = layers.length
            for (let i = 0; i < len; i++) {
              if (layers[i].ty === 4) {
                iterateShapes(layers[i].shapes)
              }
            }
          }

          return (animationData: AnimationData) => {
            if (checkVersion(minimumVersion, animationData.v)) {
              iterateLayers(animationData.layers)
              if (animationData.assets) {
                const len = animationData.assets.length
                for (let i = 0; i < len; i++) {
                  if (animationData.assets[i].layers) {
                    iterateLayers(animationData.assets[i].layers!)
                  }
                }
              }
            }
          }
        })()

        const checkShapes = (() => {
          const minimumVersion: Vector3 = [4, 4, 18]

          /**
           *
           */
          function completeClosingShapes(arr: Shape[]) {
            const { length } = arr
            let j
            let jLen
            for (let i = length - 1; i >= 0; i--) {
              if (arr[i].ty === 'gr') {
                completeClosingShapes(arr[i].it as Shape[])
                continue
              }
              if (arr[i].ty !== 'sh') {
                continue
              }
              if (arr[i].ks?.k.i) {
                // @ts-expect-error: ignore
                arr[i].ks.k.c = arr[i].closed
                continue
              }
              jLen = Number(arr[i].ks?.k.length)
              for (j = 0; j < jLen; j++) {
                // @ts-expect-error: ignore
                if (arr[i].ks.k[j]?.s) {
                  // @ts-expect-error: ignore
                  arr[i].ks.k[j].s[0].c = arr[i].closed
                }
                // @ts-expect-error: ignore
                if (arr[i].ks.k[j]?.e) {
                  // @ts-expect-error: ignore
                  arr[i].ks.k[j].e[0].c = arr[i].closed
                }
              }
            }
          }

          /**
           *
           */
          function iterateLayers(layers: LottieLayer[]) {
            const { length } = layers
            let j
            let jLen
            let k
            let kLen
            for (let i = 0; i < length; i++) {
              if (layers[i].hasMask) {
                const maskProps = layers[i].masksProperties
                jLen = Number(maskProps?.length)
                for (j = 0; j < jLen; j++) {
                  if (maskProps?.[j].pt.k.i) {
                    maskProps[j].pt.k.c = !!maskProps[j].cl
                    continue
                  }
                  kLen = maskProps?.[j].pt.k.length as unknown as number
                  for (k = 0; k < kLen; k += 1) {
                    // @ts-expect-error: TODO: Check if this is error or wrong typing
                    if (maskProps[j].pt.k[k].s) {
                      // @ts-expect-error: TODO: Check if this is error or wrong typing
                      maskProps[j].pt.k[k].s[0].c = !!maskProps?.[j].cl
                    }
                    // @ts-expect-error: TODO: Check if this is error or wrong typing
                    if (maskProps[j].pt.k[k].e) {
                      // @ts-expect-error: TODO: Check if this is error or wrong typing
                      maskProps[j].pt.k[k].e[0].c = !!maskProps?.[j].cl
                    }
                  }
                }
              }
              if (layers[i].ty === 4) {
                completeClosingShapes(layers[i].shapes || [])
              }
            }
          }

          return (animationData: AnimationData) => {
            if (checkVersion(minimumVersion, animationData.v)) {
              iterateLayers(animationData.layers)
              if (animationData.assets) {
                const { length } = animationData.assets
                for (let i = 0; i < length; i++) {
                  if (animationData.assets[i].layers) {
                    iterateLayers(animationData.assets[i]?.layers || [])
                  }
                }
              }
            }
          }
        })()

        /**
         *
         */
        function completeData(animationData: AnimationData) {
          if (animationData.__complete) {
            return
          }
          checkColors(animationData)
          checkText(animationData)
          checkChars(animationData)
          checkPathProperties(animationData)
          checkShapes(animationData)
          completeLayers(animationData.layers, animationData.assets)
          completeChars(animationData.chars || [], animationData.assets)
          animationData.__complete = true
        }

        /**
         *
         */
        function completeText(data: LottieLayer) {
          if (data.t?.a.length === 0 && !('m' in data.t.p)) {
            // data.singleShape = true;
          }
        }

        return {
          checkChars,
          checkColors,
          checkPathProperties,
          checkShapes,
          completeData,
          completeLayers,
        }
      }
      if (!_workerSelf.dataManager) {
        // @ts-expect-error: ignore
        _workerSelf.dataManager = dataFunctionManager()
      }

      if (!_workerSelf.assetLoader) {
        // @ts-expect-error: ignore
        _workerSelf.assetLoader = (() => {
          /**
           *
           */
          function formatResponse(xhr: XMLHttpRequest) {
            // using typeof doubles the time of execution of this method,
            // so if available, it's better to use the header to validate the type
            const contentTypeHeader = xhr.getResponseHeader('content-type')
            if (
              contentTypeHeader &&
              xhr.responseType === 'json' &&
              contentTypeHeader.indexOf('json') !== -1
            ) {
              return xhr.response
            }
            if (xhr.response && typeof xhr.response === 'object') {
              return xhr.response
            }
            if (xhr.response && typeof xhr.response === 'string') {
              return JSON.parse(xhr.response)
            }
            if (xhr.responseText) {
              return JSON.parse(xhr.responseText)
            }
            return null
          }

          /**
           *
           */
          function loadAsset(
            path: string,
            fullPath: string,
            callback: (asset: LottieAsset) => void,
            errorCallback: (err: unknown) => void
          ) {
            let response
            const xhr = new XMLHttpRequest()
            // set responseType after calling open or IE will break.
            try {
              // This crashes on Android WebView prior to KitKat
              xhr.responseType = 'json'
            } catch (_) {} // eslint-disable-line no-empty
            xhr.onreadystatechange = function () {
              if (xhr.readyState !== 4) {
                return
              }
              if (xhr.status === 200) {
                response = formatResponse(xhr)
                callback(response)
                return
              }
              try {
                response = formatResponse(xhr)
                callback(response)
              } catch (err) {
                if (errorCallback) {
                  errorCallback(err)
                }
              }
            }
            try {
              // Hack to workaround banner validation
              xhr.open(['G', 'E', 'T'].join(''), path, true)
            } catch (_) {
              // Hack to workaround banner validation
              xhr.open(['G', 'E', 'T'].join(''), `${fullPath}/${path}`, true)
            }
            xhr.send()
          }
          return {
            load: loadAsset,
          }
        })()
      }

      if (e.data.type === 'loadAnimation') {
        _workerSelf.assetLoader?.load(
          e.data.path,
          e.data.fullPath,
          (data) => {
            if (_workerSelf.dataManager?.completeData) {
              _workerSelf.dataManager.completeData(data)
            }

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
        if (_workerSelf.dataManager?.completeData) {
          _workerSelf.dataManager.completeData(animation)
        }
        _workerSelf.postMessage({
          id: e.data.id,
          payload: animation,
          status: 'success',
        })
        return
      }
      if (e.data.type === 'loadData') {
        _workerSelf.assetLoader?.load(
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
      // @ts-expect-error: ignore
      processes[id] = null
      if (data.status === 'success') {
        process.onComplete(data.payload)
        return
      }
      if (process.onError) {
        process.onError()
      }
    }
  }

  /**
   *
   */
  function createProcess<T = unknown>(
    onComplete: (x: T) => void,
    onError?: (x?: unknown) => void
  ) {
    _counterId += 1
    const id = `processId_${_counterId}`
    // @ts-expect-error: TODO: weak typing
    processes[id] = {
      onComplete,
      onError,
    }
    return id
  }

  /**
   *
   */
  function loadAnimation(
    path: string,
    onComplete: (data: AnimationData) => void,
    onError?: (x?: unknown) => void
  ) {
    if (isServer()) {
      return
    }
    setupWorker()
    const processId = createProcess(onComplete, onError)
    workerInstance.postMessage({
      fullPath: window.location.origin + window.location.pathname,
      id: processId,
      path: path,
      type: 'loadAnimation',
    })
  }

  /**
   *
   */
  function loadData<T = unknown>(
    path: string,
    onComplete: (data: T) => void,
    onError?: (x?: unknown) => void
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
  function completeAnimation(
    animation: AnimationData,
    onComplete: (data: AnimationData) => void,
    onError?: (x?: unknown) => void
  ) {
    setupWorker()
    const processId = createProcess(onComplete, onError)
    workerInstance.postMessage({
      animation,
      id: processId,
      type: 'complete',
    })
  }

  return {
    completeAnimation,
    loadAnimation,
    loadData,
  }
})()

export default dataManager
