import type {
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
  AnimationEventName,
  DocumentData,
  LottieAsset,
  MarkerData,
  Vector2,
} from '@/types'

import DataManager from '@/DataManager'
import { RendererType } from '@/enums'
import {
  BaseEvent,
  BMCompleteEvent,
  BMCompleteLoopEvent,
  BMConfigErrorEvent,
  BMDestroyEvent,
  BMDrawnFrameEvent,
  BMEnterFrameEvent,
  BMRenderFrameErrorEvent,
  BMSegmentStartEvent,
  LottieEvent,
} from '@/events'
import SVGRenderer from '@/renderers/SVGRenderer'
import { markerParser } from '@/utils'
import AudioController from '@/utils/audio/AudioController'
import {
  createElementID,
  getExpressionsPlugin,
  getRegisteredRenderer,
  getRenderer,
  getSubframeEnabled,
} from '@/utils/getterSetter'
import ProjectInterface from '@/utils/helpers/ProjectInterface'
import ImagePreloader from '@/utils/ImagePreloader'

export default class AnimationItem extends BaseEvent {
  public __complete?: boolean
  public animationData: Partial<AnimationData>
  public animationID: string
  public assets: LottieAsset[]

  public assetsPath: string
  public audioController: AudioController
  public autoplay: boolean
  public currentFrame: number
  public currentRawFrame: number
  public drawnFrameEvent: LottieEvent
  public expressionsPlugin: ReturnType<typeof getExpressionsPlugin>
  public firstFrame: number
  public frameModifier: AnimationDirection
  public frameMult: number
  public frameRate: number
  public imagePreloader: null | ImagePreloader
  public isLoaded: boolean
  public isPaused: boolean
  public isSubframeEnabled: boolean
  public loop: boolean | number
  public markers: MarkerData[]
  public name: string
  public onError?: (arg: unknown) => void
  public path: string
  public playCount: number
  public playDirection: AnimationDirection
  public playSpeed: number
  public projectInterface: null | ProjectInterface

  public renderer: null | SVGRenderer
  public segmentPos: number
  public segments: Vector2[]
  public timeCompleted: number
  public totalFrames: number
  protected animType?: RendererType
  protected autoloadSegments: boolean = false
  protected fileName?: string
  protected initialSegment?: Vector2

  protected onComplete: null | ((arg: unknown) => void) = null
  protected onDestroy: null | ((arg: unknown) => void) = null
  protected onEnterFrame: null | ((arg: unknown) => void) = null
  protected onLoopComplete: null | ((arg: unknown) => void) = null
  protected onSegmentStart: null | ((arg: unknown) => void) = null
  protected wrapper: HTMLElement | null = null
  // private _cbs: null | any
  private _completedLoop: boolean
  private _idle: boolean
  constructor() {
    super()
    this._cbs = {}
    this.name = ''
    this.path = ''
    this.isLoaded = false
    this.currentFrame = 0
    this.currentRawFrame = 0
    this.firstFrame = 0
    this.totalFrames = 0
    this.frameRate = 60
    this.frameMult = 0
    this.playSpeed = 1
    this.playDirection = 1
    this.frameModifier = 1
    this.playCount = 0
    this.animationData = {}
    this.assets = []
    this.isPaused = true
    this.autoplay = false
    this.loop = true
    this.renderer = null
    this.animationID = createElementID()
    this.assetsPath = ''
    this.timeCompleted = 0
    this.segmentPos = 0
    this.isSubframeEnabled = getSubframeEnabled()
    this.segments = []
    this._idle = true
    this._completedLoop = false
    this.projectInterface = ProjectInterface()
    this.imagePreloader = new ImagePreloader()
    this.audioController = new AudioController()
    this.markers = []
    this.configAnimation = this.configAnimation.bind(this)
    this.onSetupError = this.onSetupError.bind(this)
    this.onSegmentComplete = this.onSegmentComplete.bind(this)
    this.drawnFrameEvent = new BMEnterFrameEvent('drawnFrame', 0, 0, 0)
    this.expressionsPlugin = getExpressionsPlugin()
  }

  public adjustSegment(arr: Vector2, offset: number) {
    this.playCount = 0
    if (arr[1] < arr[0]) {
      if (this.frameModifier > 0) {
        if (this.playSpeed < 0) {
          this.setSpeed(-this.playSpeed)
        } else {
          this.setDirection(-1)
        }
      }
      this.totalFrames = arr[0] - arr[1]
      this.timeCompleted = this.totalFrames
      this.firstFrame = arr[1]
      this.setCurrentRawFrameValue(this.totalFrames - 0.001 - offset)
    } else if (arr[1] > arr[0]) {
      if (this.frameModifier < 0) {
        if (this.playSpeed < 0) {
          this.setSpeed(-this.playSpeed)
        } else {
          this.setDirection(1)
        }
      }
      this.totalFrames = arr[1] - arr[0]
      this.timeCompleted = this.totalFrames
      this.firstFrame = arr[0]
      this.setCurrentRawFrameValue(0.001 + offset)
    }
    this.trigger('segmentStart')
  }
  public advanceTime(value: number) {
    if (this.isPaused === true || this.isLoaded === false) {
      return
    }
    let nextValue = this.currentRawFrame + value * this.frameModifier
    let _isComplete = false
    // Checking if nextValue > totalFrames - 1 for addressing non looping and looping animations.
    // If animation won't loop, it should stop at totalFrames - 1. If it will loop it should complete the last frame and then loop.
    if (nextValue >= this.totalFrames - 1 && this.frameModifier > 0) {
      if (!this.loop || this.playCount === this.loop) {
        if (
          !this.checkSegments(
            nextValue > this.totalFrames ? nextValue % this.totalFrames : 0
          )
        ) {
          _isComplete = true
          nextValue = this.totalFrames - 1
        }
      } else if (nextValue >= this.totalFrames) {
        this.playCount += 1
        if (!this.checkSegments(nextValue % this.totalFrames)) {
          this.setCurrentRawFrameValue(nextValue % this.totalFrames)
          this._completedLoop = true
          this.trigger('loopComplete')
        }
      } else {
        this.setCurrentRawFrameValue(nextValue)
      }
    } else if (nextValue < 0) {
      if (!this.checkSegments(nextValue % this.totalFrames)) {
        if (this.loop && !(this.playCount-- <= 0 && this.loop !== true)) {
          this.setCurrentRawFrameValue(
            this.totalFrames + (nextValue % this.totalFrames)
          )
          if (this._completedLoop) {
            this.trigger('loopComplete')
          } else {
            this._completedLoop = true
          }
        } else {
          _isComplete = true
          nextValue = 0
        }
      }
    } else {
      this.setCurrentRawFrameValue(nextValue)
    }
    if (_isComplete) {
      this.setCurrentRawFrameValue(nextValue)
      this.pause()
      this.trigger('complete')
    }
  }
  public checkLoaded() {
    if (
      !this.isLoaded &&
      this.renderer?.globalData?.fontManager?.isLoaded &&
      (this.imagePreloader?.loadedImages() ||
        this.renderer.rendererType !== 'canvas') &&
      this.imagePreloader?.loadedFootages()
    ) {
      this.isLoaded = true
      const expressionsPlugin = getExpressionsPlugin()
      if (expressionsPlugin) {
        expressionsPlugin.initExpressions(this)
      }
      this.renderer?.initItems()
      setTimeout(
        function (this: AnimationItem) {
          this.trigger('DOMLoaded')
        }.bind(this),
        0
      )
      this.gotoFrame()
      if (this.autoplay) {
        this.play()
      }
    }
  }
  public checkSegments(offset: number) {
    if (this.segments.length) {
      this.adjustSegment(this.segments.shift()!, offset)
      return true
    }
    return false
  }
  public configAnimation(animData: AnimationData) {
    if (!this.renderer) {
      return
    }
    try {
      this.animationData = animData
      if (this.initialSegment) {
        this.totalFrames = Math.floor(
          this.initialSegment[1] - this.initialSegment[0]
        )
        this.firstFrame = Math.round(this.initialSegment[0])
      } else {
        this.totalFrames = Math.floor(
          (this.animationData.op || 1) - (this.animationData.ip || 0)
        )
        this.firstFrame = Math.round(this.animationData.ip || 0)
      }
      this.renderer.configAnimation(animData)
      if (!animData.assets) {
        animData.assets = []
      }

      this.assets = this.animationData.assets ?? this.assets
      this.frameRate = this.animationData.fr ?? this.frameRate
      if (typeof this.animationData.fr !== 'undefined') {
        this.frameMult = this.animationData.fr / 1000
      }
      this.renderer.searchExtraCompositions(animData.assets)
      this.markers = markerParser(animData.markers || []) as MarkerData[]
      this.trigger('config_ready')
      this.preloadImages()
      this.loadSegments()
      this.updaFrameModifier()
      this.waitForFontsLoaded()
      if (this.isPaused) {
        this.audioController.pause()
      }
    } catch (error) {
      this.triggerConfigError(error)
    }
  }
  public destroy(name?: string) {
    if ((name && this.name !== name) || !this.renderer) {
      return
    }
    this.renderer.destroy()
    this.imagePreloader?.destroy()
    this.trigger('destroy')
    this._cbs = {}
    this.onEnterFrame = null
    this.onLoopComplete = null
    this.onComplete = null
    this.onSegmentStart = null
    this.onDestroy = null
    this.renderer = null
    this.expressionsPlugin = null
    this.imagePreloader = null
    this.projectInterface = null
  }
  public getAssetData(id: string) {
    let i = 0
    const len = this.assets.length
    while (i < len) {
      if (id === this.assets[i].id) {
        return this.assets[i]
      }
      i++
    }
    return null
  }
  public getAssetsPath(assetData: null | LottieAsset) {
    if (!assetData) {
      return ''
    }
    let path = ''
    if (assetData.e) {
      path = assetData.p || ''
    } else if (this.assetsPath) {
      let imagePath = assetData?.p
      if (imagePath?.indexOf('images/') !== -1) {
        imagePath = imagePath?.split('/')[1]
      }
      path = this.assetsPath + imagePath
    } else {
      path = this.path
      path += assetData.u ? assetData.u : ''
      path += assetData.p
    }
    return path
  }
  public getDuration(isFrame?: boolean) {
    return isFrame ? this.totalFrames : this.totalFrames / this.frameRate
  }
  public getMarkerData(markerName: number) {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].payload?.name === markerName) {
        return this.markers[i]
      }
    }
    return null
  }
  public getPath() {
    return this.path
  }
  public getVolume() {
    return this.audioController.getVolume()
  }
  public goToAndPlay(value: number, isFrame?: boolean, name?: string) {
    if (name && this.name !== name) {
      return
    }
    const numValue = Number(value)
    if (isNaN(numValue)) {
      const marker = this.getMarkerData(value)
      if (marker) {
        if (marker.duration) {
          this.playSegments([marker.time, marker.time + marker.duration], true)
        } else {
          this.goToAndStop(marker.time, true)
        }
      }
    } else {
      this.goToAndStop(numValue, isFrame, name)
    }
    this.play()
  }
  public goToAndStop(value: number, isFrame?: boolean, name?: string) {
    if (name && this.name !== name) {
      return
    }
    const numValue = Number(value)
    if (isNaN(numValue)) {
      const marker = this.getMarkerData(value)
      if (marker) {
        this.goToAndStop(marker.time, true)
      }
    } else if (isFrame) {
      this.setCurrentRawFrameValue(value)
    } else {
      this.setCurrentRawFrameValue(value * this.frameModifier)
    }
    this.pause()
  }
  public gotoFrame() {
    this.currentFrame = this.isSubframeEnabled
      ? this.currentRawFrame
      : ~~this.currentRawFrame

    if (
      this.timeCompleted !== this.totalFrames &&
      this.currentFrame > this.timeCompleted
    ) {
      this.currentFrame = this.timeCompleted
    }
    this.trigger('enterFrame')
    this.renderFrame()
    this.trigger('drawnFrame')
  }
  public hide() {
    this.renderer?.hide()
  }
  public imagesLoaded() {
    this.trigger('loaded_images')
    this.checkLoaded()
  }
  public includeLayers(data: AnimationData) {
    if (this.animationData.op && data.op > this.animationData.op) {
      this.animationData.op = data.op
      this.totalFrames = Math.floor(data.op - (this.animationData.ip || 0))
    }
    const layers = this.animationData.layers || []
    let i
    let len = layers.length
    const newLayers = data.layers
    let j
    const jLen = newLayers.length
    for (j = 0; j < jLen; j++) {
      i = 0
      while (i < len) {
        if (layers[i].id === newLayers[j].id) {
          layers[i] = newLayers[j]
          break
        }
        i++
      }
    }
    if (data.chars || data.fonts) {
      this.renderer?.globalData?.fontManager?.addChars(data.chars)
      this.renderer?.globalData?.fontManager?.addFonts(
        data.fonts,
        this.renderer.globalData.defs
      )
    }
    if (data.assets) {
      len = data.assets.length
      for (i = 0; i < len; i++) {
        this.animationData.assets?.push(data.assets[i])
      }
    }
    this.animationData.__complete = false
    DataManager.completeAnimation(
      this.animationData as AnimationData,
      this.onSegmentComplete
    )
  }
  public loadNextSegment() {
    const segments = this.animationData.segments
    if (!segments || segments.length === 0 || !this.autoloadSegments) {
      this.trigger('data_ready')
      this.timeCompleted = this.totalFrames
      return
    }
    const segment = segments.shift()
    this.timeCompleted = Number(segment?.time) * this.frameRate
    const segmentPath = `${this.path + this.fileName}_${this.segmentPos}.json`
    this.segmentPos++
    DataManager.loadData(
      segmentPath,
      this.includeLayers.bind(this),
      function (this: AnimationItem) {
        this.trigger('data_failed')
      }.bind(this)
    )
  }
  public loadSegments() {
    const segments = this.animationData.segments
    if (!segments) {
      this.timeCompleted = this.totalFrames
    }
    this.loadNextSegment()
  }
  public mute(name?: string) {
    if (name && this.name !== name) {
      return
    }
    this.audioController.mute()
  }
  public onSegmentComplete(data: AnimationData) {
    this.animationData = data
    const expressionsPlugin = getExpressionsPlugin()
    if (expressionsPlugin) {
      expressionsPlugin.initExpressions(this)
    }
    this.loadNextSegment()
  }
  public onSetupError() {
    this.trigger('data_failed')
  }
  public pause(name?: string) {
    if (name && this.name !== name) {
      return
    }
    if (this.isPaused === false) {
      this.isPaused = true
      this.trigger('_pause')
      this._idle = true
      this.trigger('_idle')
      this.audioController.pause()
    }
  }
  public play(name?: string) {
    if (name && this.name !== name) {
      return
    }
    if (this.isPaused === true) {
      this.isPaused = false
      this.trigger('_play')
      this.audioController.resume()
      if (this._idle) {
        this._idle = false
        this.trigger('_active')
      }
    }
  }
  public playSegments(arr: Vector2 | Vector2[], forceFlag?: boolean) {
    if (forceFlag) {
      this.segments.length = 0
    }
    if (Array.isArray(arr[0])) {
      const { length } = arr
      for (let i = 0; i < length; i++) {
        this.segments.push(arr[i] as Vector2)
      }
    } else {
      this.segments.push(arr as Vector2)
    }
    if (this.segments.length && forceFlag) {
      this.adjustSegment(this.segments.shift()!, 0)
    }
    if (this.isPaused) {
      this.play()
    }
  }
  public preloadImages() {
    if (!this.imagePreloader) {
      return
    }
    this.imagePreloader.setAssetsPath(this.assetsPath)
    this.imagePreloader.setPath(this.path)
    this.imagePreloader.loadAssets(
      this.animationData.assets || [],
      this.imagesLoaded.bind(this)
    )
  }
  public renderFrame(_num?: number) {
    if (this.isLoaded === false || !this.renderer) {
      return
    }
    try {
      if (this.expressionsPlugin) {
        this.expressionsPlugin.resetFrame()
      }
      this.renderer.renderFrame(this.currentFrame + this.firstFrame)
    } catch (error) {
      this.triggerRenderFrameError(error)
    }
  }
  public resetSegments(forceFlag?: boolean) {
    this.segments.length = 0
    this.segments.push([this.animationData.ip!, this.animationData.op!])
    if (forceFlag) {
      this.checkSegments(0)
    }
  }
  public resize(width?: number, height?: number) {
    // Adding this validation for backwards compatibility in case an event object was being passed down
    const _width = typeof width === 'number' ? width : undefined
    const _height = typeof height === 'number' ? height : undefined
    this.renderer?.updateContainerSize(_width, _height)
  }
  public setCurrentRawFrameValue(value: number) {
    this.currentRawFrame = value
    this.gotoFrame()
  }

  public setData(wrapper: HTMLElement, animationDatFromProps?: AnimationData) {
    let animationData = animationDatFromProps
    if (animationData) {
      if (typeof animationData !== 'object') {
        animationData = JSON.parse(animationData)
      }
    }

    const params: AnimationConfiguration = {
      animationData,
      wrapper,
    }
    const wrapperAttributes = wrapper.attributes

    params.path =
      wrapperAttributes.getNamedItem('data-animation-path')?.value ??
      wrapperAttributes.getNamedItem('data-bm-path')?.value ??
      wrapperAttributes.getNamedItem('bm-path')?.value ??
      ''
    const animType =
      wrapperAttributes.getNamedItem('data-anim-type')?.value ??
      wrapperAttributes.getNamedItem('data-bm-type')?.value ??
      wrapperAttributes.getNamedItem('bm-type')?.value ??
      wrapperAttributes.getNamedItem('data-bm-renderer')?.value ??
      wrapperAttributes.getNamedItem('bm-renderer')?.value ??
      (getRegisteredRenderer() || RendererType.Canvas)

    if (Object.values(RendererType).includes(animType as RendererType)) {
      params.animType = animType as RendererType
    } else {
      params.animType = RendererType.Canvas
    }

    const loop =
      wrapperAttributes.getNamedItem('data-anim-loop')?.value ??
      wrapperAttributes.getNamedItem('data-bm-loop')?.value ??
      wrapperAttributes.getNamedItem('bm-loop')?.value ??
      ''
    if (loop === 'false') {
      params.loop = false
    } else if (loop === 'true') {
      params.loop = true
    } else if (loop !== '') {
      params.loop = parseInt(loop, 10)
    }
    const autoplay =
      wrapperAttributes.getNamedItem('data-anim-autoplay')?.value ??
      wrapperAttributes.getNamedItem('data-bm-autoplay')?.value ??
      wrapperAttributes.getNamedItem('bm-autoplay')?.value ??
      true
    params.autoplay = autoplay !== 'false'

    params.name =
      wrapperAttributes.getNamedItem('data-name')?.value ??
      wrapperAttributes.getNamedItem('data-bm-name')?.value ??
      wrapperAttributes.getNamedItem('bm-name')?.value ??
      ''
    const prerender =
      wrapperAttributes.getNamedItem('data-anim-prerender')?.value ??
      wrapperAttributes.getNamedItem('data-bm-prerender')?.value ??
      wrapperAttributes.getNamedItem('bm-prerender')?.value ??
      ''

    if (prerender === 'false') {
      params.prerender = false
    }
    if (params.path) {
      this.setParams(params)
    } else {
      this.trigger('destroy')
    }
  }
  public setDirection(val: AnimationDirection, name?: string) {
    if (name && this.name !== name) {
      return
    }
    this.playDirection = val < 0 ? -1 : 1
    this.updaFrameModifier()
  }
  public setLoop(isLooping: boolean) {
    this.loop = isLooping
  }
  public setParams(params: AnimationConfiguration) {
    if (params.wrapper || params.container) {
      this.wrapper = params.wrapper || params.container || null
    }
    let animType = RendererType.SVG
    if (params.animType) {
      animType = params.animType
    } else if (params.renderer) {
      animType = params.renderer
    }
    const RendererClass = getRenderer(animType)
    this.renderer = new RendererClass(this, params.rendererSettings)
    this.imagePreloader?.setCacheType(animType, this.renderer?.globalData.defs)
    this.renderer?.setProjectInterface(this.projectInterface)
    this.animType = animType
    if (
      params.loop === '' ||
      params.loop === null ||
      params.loop === undefined ||
      params.loop === true
    ) {
      this.loop = true
    } else if (params.loop === false) {
      this.loop = false
    } else {
      this.loop = parseInt(`${params.loop}`, 10)
    }
    this.autoplay = !!('autoplay' in params ? params.autoplay : true)
    this.name = params.name ? params.name : ''
    this.autoloadSegments = !!(Object.prototype.hasOwnProperty.call(
      params,
      'autoloadSegments'
    )
      ? params.autoloadSegments
      : true)
    this.assetsPath = params.assetsPath ?? this.assetsPath
    this.initialSegment = params.initialSegment
    if (params.audioFactory) {
      this.audioController.setAudioFactory(params.audioFactory)
    }
    if (params.animationData) {
      this.setupAnimation(params.animationData)
    } else if (params.path) {
      if (params.path.lastIndexOf('\\') === -1) {
        this.path = params.path.substring(0, params.path.lastIndexOf('/') + 1)
      } else {
        this.path = params.path.substring(0, params.path.lastIndexOf('\\') + 1)
      }
      this.fileName = params.path.substring(params.path.lastIndexOf('/') + 1)
      this.fileName = this.fileName.substring(
        0,
        this.fileName.lastIndexOf('.json')
      )
      DataManager.loadAnimation(
        params.path,
        this.configAnimation,
        this.onSetupError
      )
    }
  }
  public setSegment(init: number, end: number) {
    let pendingFrame = -1
    if (this.isPaused) {
      if (this.currentRawFrame + this.firstFrame < init) {
        pendingFrame = init
      } else if (this.currentRawFrame + this.firstFrame > end) {
        pendingFrame = end - init
      }
    }

    this.firstFrame = init
    this.totalFrames = end - init
    this.timeCompleted = this.totalFrames
    if (pendingFrame !== -1) {
      this.goToAndStop(pendingFrame, true)
    }
  }
  public setSpeed(val: number, name?: string) {
    if (name && this.name !== name) {
      return
    }
    this.playSpeed = val
    this.updaFrameModifier()
  }
  public setSubframe(flag: boolean) {
    this.isSubframeEnabled = !!flag
  }
  public setupAnimation(data: AnimationData) {
    DataManager.completeAnimation(data, this.configAnimation)
  }
  public setVolume(val: number, name?: string) {
    if (name && this.name !== name) {
      return
    }
    this.audioController.setVolume(val)
  }
  public show() {
    this.renderer?.show()
  }
  public stop(name?: string) {
    if (name && this.name !== name) {
      return
    }
    this.pause()
    this.playCount = 0
    this._completedLoop = false
    this.setCurrentRawFrameValue(0)
  }
  public togglePause(name?: string) {
    if (name && this.name !== name) {
      return
    }
    if (this.isPaused === true) {
      this.play()
    } else {
      this.pause()
    }
  }
  public trigger(name: AnimationEventName) {
    if (this._cbs?.[name]) {
      switch (name) {
        case 'enterFrame':
          this.triggerEvent(
            name,
            new BMEnterFrameEvent(
              name,
              this.currentFrame,
              this.totalFrames,
              this.frameModifier
            )
          )
          break
        case 'drawnFrame':
          this.triggerEvent(
            name,
            new BMDrawnFrameEvent(
              name,
              this.currentFrame,
              this.frameModifier,
              this.totalFrames
            )
          )
          break
        case 'loopComplete':
          this.triggerEvent(
            name,
            new BMCompleteLoopEvent(
              name,
              Number(this.loop),
              this.playCount,
              this.frameMult
            )
          )
          break
        case 'complete':
          this.triggerEvent(name, new BMCompleteEvent(name, this.frameMult))
          break
        case 'segmentStart':
          this.triggerEvent(
            name,
            new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames)
          )
          break
        case 'destroy':
          this.triggerEvent(name, new BMDestroyEvent(name, this))
          break
        default:
          this.triggerEvent(name)
      }
    }
    if (name === 'enterFrame' && this.onEnterFrame) {
      this.onEnterFrame.call(
        this,
        new BMEnterFrameEvent(
          name,
          this.currentFrame,
          this.totalFrames,
          this.frameMult
        )
      )
    }
    if (name === 'loopComplete' && this.onLoopComplete) {
      this.onLoopComplete.call(
        this,
        new BMCompleteLoopEvent(name, this.loop, this.playCount, this.frameMult)
      )
    }
    if (name === 'complete' && this.onComplete) {
      this.onComplete.call(this, new BMCompleteEvent(name, this.frameMult))
    }
    if (name === 'segmentStart' && this.onSegmentStart) {
      this.onSegmentStart.call(
        this,
        new BMSegmentStartEvent(name, this.firstFrame, this.totalFrames)
      )
    }
    if (name === 'destroy' && this.onDestroy) {
      this.onDestroy.call(this, new BMDestroyEvent(name, this))
    }
  }
  public triggerConfigError(nativeError: unknown) {
    const error = new BMConfigErrorEvent(nativeError, this.currentFrame)
    this.triggerEvent('error', error)

    if (this.onError) {
      this.onError.call(this, error)
    }
  }
  public triggerRenderFrameError(nativeError: unknown) {
    const error = new BMRenderFrameErrorEvent(nativeError, this.currentFrame)

    this.triggerEvent('error', error)

    this.onError?.call(this, error)
  }
  public unmute(name?: string) {
    if (name && this.name !== name) {
      return
    }
    this.audioController.unmute()
  }
  public updaFrameModifier() {
    this.frameModifier = (this.frameMult *
      this.playSpeed *
      this.playDirection) as AnimationDirection
    this.audioController.setRate(this.playSpeed * this.playDirection)
  }

  public updateDocumentData(
    path: string,
    documentData: DocumentData,
    index: number
  ) {
    try {
      const element = this.renderer?.getElementByPath(path)
      element.updateDocumentData(documentData, index)
    } catch (_error) {
      // TODO: decide how to handle catch case
    }
  }
  public waitForFontsLoaded() {
    if (!this.renderer) {
      return
    }
    if (this.renderer?.globalData?.fontManager?.isLoaded) {
      this.checkLoaded()
    } else {
      setTimeout(this.waitForFontsLoaded.bind(this), 20)
    }
  }
}
