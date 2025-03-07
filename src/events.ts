import type AnimationItem from '@/animation/AnimationItem'

import { AnimationDirection, AnimationEventName } from '@/types'

export class BMEnterFrameEvent {
  currentTime: number
  direction: AnimationDirection
  target?: AnimationItem
  totalTime: number
  type: AnimationEventName
  constructor(
    type: AnimationEventName,
    currentTime: number,
    totalTime: number,
    frameMultiplier: number
  ) {
    this.type = type
    this.currentTime = currentTime
    this.totalTime = totalTime
    this.direction = frameMultiplier < 0 ? -1 : 1
  }
}

export class BMCompleteEvent {
  direction: AnimationDirection
  target?: AnimationItem
  type: AnimationEventName
  constructor(type: AnimationEventName, frameMultiplier: number) {
    this.type = type
    this.direction = frameMultiplier < 0 ? -1 : 1
  }
}

export class BMDrawnFrameEvent {
  currentTime: number
  direction: AnimationDirection
  target?: AnimationItem
  totalTime: number
  type: AnimationEventName
  constructor(
    type: AnimationEventName,
    currentTime: number,
    direction: AnimationDirection,
    totalTime: number
  ) {
    this.type = type
    this.direction = direction
    this.currentTime = currentTime
    this.totalTime = totalTime
  }
}

export class BMCompleteLoopEvent {
  currentLoop: number
  direction: AnimationDirection
  target?: AnimationItem
  totalLoops: number | boolean
  type: AnimationEventName
  constructor(
    type: AnimationEventName,
    totalLoops: number | boolean,
    currentLoop: number,
    frameMultiplier: number
  ) {
    this.type = type
    this.currentLoop = currentLoop
    this.totalLoops = totalLoops
    this.direction = frameMultiplier < 0 ? -1 : 1
  }
}

export class BMSegmentStartEvent {
  firstFrame: number
  target?: AnimationItem
  totalFrames: number
  type: AnimationEventName
  constructor(
    type: AnimationEventName,
    firstFrame: number,
    totalFrames: number
  ) {
    this.type = type
    this.firstFrame = firstFrame
    this.totalFrames = totalFrames
  }
}

export class BMDestroyEvent {
  target: AnimationItem
  type: AnimationEventName
  constructor(type: AnimationEventName, target: AnimationItem) {
    this.type = type
    this.target = target
  }
}

export class BMRenderFrameErrorEvent {
  currentTime: number
  nativeError: unknown
  target?: AnimationItem
  type: AnimationEventName
  constructor(nativeError: unknown, currentTime: number) {
    this.type = 'renderFrameError'
    this.nativeError = nativeError
    this.currentTime = currentTime
  }
}

export class BMConfigErrorEvent {
  nativeError: unknown
  target?: AnimationItem
  type: AnimationEventName
  constructor(nativeError: unknown, _: number) {
    this.type = 'configError'
    this.nativeError = nativeError
  }
}

export class BMAnimationConfigErrorEvent {
  nativeError: unknown
  target?: AnimationItem
  type: AnimationEventName
  constructor(type: AnimationEventName, nativeError: unknown) {
    this.type = type
    this.nativeError = nativeError
  }
}

export class BaseEvent {
  _cbs: Partial<
    Record<AnimationEventName, ((ev?: LottieEvent) => unknown)[] | null>
  > = {}

  addEventListener(
    eventName: AnimationEventName,
    callback: (ev?: LottieEvent) => unknown
  ): () => void {
    if (!this._cbs[eventName]) {
      this._cbs[eventName] = []
    }
    this._cbs[eventName].push(callback)

    return () => {
      this.removeEventListener(eventName, callback)
    }
  }

  removeEventListener(
    eventName: AnimationEventName,
    callback?: (ev: LottieEvent) => unknown
  ): void {
    if (!callback) {
      this._cbs[eventName] = null
      return
    }

    if (this._cbs[eventName]) {
      let i = 0
      let len = this._cbs[eventName].length
      while (i < len) {
        if (this._cbs[eventName][i] === callback) {
          this._cbs[eventName].splice(i, 1)
          i--
          len--
        }
        i++
      }
      if (this._cbs[eventName].length === 0) {
        this._cbs[eventName] = null
      }
    }
  }

  triggerEvent(eventName: AnimationEventName, ev?: LottieEvent): void {
    if (this._cbs[eventName]) {
      const { length } = this._cbs[eventName]
      for (let i = 0; i < length; i++) {
        this._cbs[eventName][i](ev)
      }
    }
  }
}

export type LottieEvent =
  | BMAnimationConfigErrorEvent
  | BMEnterFrameEvent
  | BMCompleteEvent
  | BMCompleteLoopEvent
  | BMSegmentStartEvent
  | BMAnimationConfigErrorEvent
  | BMConfigErrorEvent
  | BMDestroyEvent
  | BMDrawnFrameEvent
