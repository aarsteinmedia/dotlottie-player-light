import type AnimationItem from '@/animation/AnimationItem'

import { AnimationDirection, AnimationEventName, BMEvent } from '@/types'

export class BMEnterFrameEvent {
  currentTime: number
  direction: AnimationDirection
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
  type: AnimationEventName
  constructor(type: AnimationEventName, frameMultiplier: number) {
    this.type = type
    this.direction = frameMultiplier < 0 ? -1 : 1
  }
}

export class BMCompleteLoopEvent {
  currentLoop: number
  direction: AnimationDirection
  totalLoops: number
  type: AnimationEventName
  constructor(
    type: AnimationEventName,
    totalLoops: number,
    currentLoop: number,
    frameMultiplier: number
  ) {
    this.type = type
    this.currentLoop = currentLoop
    this.totalLoops = totalLoops
    this.direction = frameMultiplier < 0 ? -1 : 1
  }
}

/**
 *
 */
export function BMSegmentStartEvent(
  this: BMEvent,
  type: string,
  firstFrame: number,
  totalFrames: number
) {
  this.type = type
  this.firstFrame = firstFrame
  this.totalFrames = totalFrames
}

/**
 *
 */
export function BMDestroyEvent(this: BMEvent, type: string, target: BMEvent) {
  this.type = type
  this.target = target
}

/**
 *
 */
export function BMRenderFrameErrorEvent(
  this: BMEvent,
  nativeError: unknown,
  currentTime: number
) {
  this.type = 'renderFrameError'
  this.nativeError = nativeError
  this.currentTime = currentTime
}

/**
 *
 */
export function BMConfigErrorEvent(this: BMEvent, nativeError: unknown) {
  this.type = 'configError'
  this.nativeError = nativeError
}

/**
 *
 */
export function BMAnimationConfigErrorEvent(
  this: BMEvent,
  type: string,
  nativeError: unknown
) {
  this.type = type
  this.nativeError = nativeError
}

export function BaseEvent() {}
BaseEvent.prototype = {
  addEventListener: function (
    eventName: AnimationEventName,
    callback: (x?: unknown) => unknown
  ) {
    if (!this._cbs[eventName]) {
      this._cbs[eventName] = []
    }
    this._cbs[eventName].push(callback)

    return function (this: AnimationItem) {
      this.removeEventListener(eventName, callback)
    }.bind(this)
  },
  removeEventListener: function (
    eventName: string,
    callback: (x?: unknown) => unknown
  ) {
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
          len -= 1
        }
        i++
      }
      if (this._cbs[eventName].length) {
        return
      }
      this._cbs[eventName] = null
    }
  },
  triggerEvent: function (eventName: string, args: unknown[]) {
    if (this._cbs[eventName]) {
      const { length } = this._cbs[eventName]
      for (let i = 0; i < length; i++) {
        this._cbs[eventName][i](args)
      }
    }
  },
}
