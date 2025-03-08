/* eslint-disable max-depth */
import type {
  ElementInterface,
  Vector2,
  Vector3,
  VectorProperty,
} from '@/types'

import { ArrayType } from '@/enums'
import { createQuaternion, quaternionToEuler, slerp } from '@/utils'
import Bezier from '@/utils/Bezier'
import BezierFactory from '@/utils/BezierFactory'
import { initialDefaultFrame } from '@/utils/getterSetter'
import { createTypedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

const initFrame = initialDefaultFrame

class BaseProperty extends DynamicPropertyContainer {
  _caching?: {
    _lastKeyframeIndex?: number
    lastFrame: number
    lastIndex: number
    value: number | number[]
  }
  _isFirstFrame?: boolean
  _placeholder?: boolean
  comp?: any
  data?: any
  e?: any
  effectsSequence?: any
  elem?: any
  frameId?: number
  g?: any
  getValue?: (val?: unknown) => unknown
  interpolateValue?: (
    frame: number,
    caching: {
      lastFrame: number
      lastIndex: number
      value: number[]
    }
  ) => void
  k?: boolean
  keyframes?: number[]
  keyframesMetadata?: unknown[]
  kf?: boolean
  mult?: number
  offsetTime?: number
  propType!: false | 'multidimensional' | 'unidimensional'

  pv?: string | number | any[]
  s?: any
  setVValue?: (val: any) => void
  v?: string | number | any[]
  vel?: number | any[]
  addEffect(effectFunction: any) {
    this.effectsSequence.push(effectFunction)
    this.container?.addDynamicProperty(this)
  }
  processEffectsSequence() {
    if (
      this.elem.globalData.frameId === this.frameId ||
      !this.effectsSequence.length
    ) {
      return
    }
    if (this.lock) {
      this.setVValue(this.pv as any)
      return
    }
    this.lock = true
    this._mdf = !!this._isFirstFrame
    const len = this.effectsSequence.length
    let finalValue = this.kf ? this.pv : this.data.k
    for (let i = 0; i < len; i++) {
      finalValue = this.effectsSequence[i](finalValue)
    }
    this.setVValue(finalValue)
    this._isFirstFrame = false
    this.lock = false
    this.frameId = this.elem.globalData.frameId
  }
}
export class ValueProperty extends BaseProperty {
  constructor(
    elem: ElementInterface,
    data: VectorProperty,
    mult: null | number = null,
    container: ElementInterface | null = null
  ) {
    super()
    this.propType = 'unidimensional'
    this.mult = mult ?? 1
    this.data = data
    this.v = data.k * (mult ?? 1)
    this.pv = data.k
    this._mdf = false
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.k = false
    this.kf = false
    this.vel = 0
    this.effectsSequence = []
    this._isFirstFrame = true
    this.getValue = this.processEffectsSequence
    this.setVValue = setVValue
  }
}

export class MultiDimensionalProperty<
  T extends Array<any> = Vector2,
> extends BaseProperty {
  constructor(
    elem: ElementInterface,
    data: VectorProperty<T>,
    mult: null | number = null,
    container: ElementInterface | null = null
  ) {
    super()
    this.propType = 'multidimensional'
    this.mult = mult || 1
    this.data = data
    this._mdf = false
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.k = false
    this.kf = false
    this.frameId = -1
    const { length } = data.k
    this.v = createTypedArray(ArrayType.Float32, length) as any[]
    this.pv = createTypedArray(ArrayType.Float32, length) as any[]
    this.vel = createTypedArray(ArrayType.Float32, length) as any[]
    for (let i = 0; i < length; i++) {
      this.v[i] = data.k[i] * this.mult
      this.pv[i] = data.k[i]
    }
    this._isFirstFrame = true
    this.effectsSequence = []
    this.getValue = this.processEffectsSequence
    this.setVValue = setVValue
  }
}
export class KeyframedValueProperty extends BaseProperty {
  constructor(
    elem: ElementInterface,
    data: VectorProperty<number[]>,
    mult: null | number = null,
    container: ElementInterface | null = null
  ) {
    super()
    this.propType = 'unidimensional'
    this.keyframes = data.k
    this.keyframesMetadata = []
    this.offsetTime = elem.data.st
    this.frameId = -1
    this._caching = {
      _lastKeyframeIndex: -1,
      lastFrame: initFrame,
      lastIndex: 0,
      value: 0,
    }
    this.k = true
    this.kf = true
    this.data = data
    this.mult = mult || 1
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.v = initFrame
    this.pv = initFrame
    this._isFirstFrame = true
    this.getValue = this.processEffectsSequence
    this.setVValue = setVValue
    this.interpolateValue = interpolateValue
    this.effectsSequence = [getValueAtCurrentTime.bind(this)]
  }
}

export class KeyframedMultidimensionalProperty extends BaseProperty {
  constructor(
    elem: any,
    data: VectorProperty<any[]>,
    mult: null | number = null,
    container: ElementInterface | null = null
  ) {
    super()
    this.propType = 'multidimensional'
    let i
    const len = data.k.length
    let s
    let e
    let to
    let ti
    for (i = 0; i < len - 1; i++) {
      if (data.k[i].to && data.k[i].s && data.k[i + 1] && data.k[i + 1].s) {
        s = data.k[i].s
        e = data.k[i + 1].s
        to = data.k[i].to
        ti = data.k[i].ti
        if (
          (s.length === 2 &&
            !(s[0] === e[0] && s[1] === e[1]) &&
            Bezier.pointOnLine2D(
              s[0],
              s[1],
              e[0],
              e[1],
              s[0] + to[0],
              s[1] + to[1]
            ) &&
            Bezier.pointOnLine2D(
              s[0],
              s[1],
              e[0],
              e[1],
              e[0] + ti[0],
              e[1] + ti[1]
            )) ||
          (s.length === 3 &&
            !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) &&
            Bezier.pointOnLine3D(
              s[0],
              s[1],
              s[2],
              e[0],
              e[1],
              e[2],
              s[0] + to[0],
              s[1] + to[1],
              s[2] + to[2]
            ) &&
            Bezier.pointOnLine3D(
              s[0],
              s[1],
              s[2],
              e[0],
              e[1],
              e[2],
              e[0] + ti[0],
              e[1] + ti[1],
              e[2] + ti[2]
            ))
        ) {
          data.k[i].to = null
          data.k[i].ti = null
        }
        if (
          s[0] === e[0] &&
          s[1] === e[1] &&
          to[0] === 0 &&
          to[1] === 0 &&
          ti[0] === 0 &&
          ti[1] === 0
        ) {
          if (s.length === 2 || (s[2] === e[2] && to[2] === 0 && ti[2] === 0)) {
            data.k[i].to = null
            data.k[i].ti = null
          }
        }
      }
    }
    this.effectsSequence = [getValueAtCurrentTime.bind(this)]
    this.data = data
    this.keyframes = data.k
    this.keyframesMetadata = []
    this.offsetTime = elem.data.st
    this.k = true
    this.kf = true
    this._isFirstFrame = true
    this.mult = mult || 1
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.getValue = this.processEffectsSequence
    this.setVValue = setVValue
    this.interpolateValue = interpolateValue
    this.frameId = -1
    const arrLen = data.k[0].s.length
    this.v = createTypedArray(ArrayType.Float32, arrLen) as number[]
    this.pv = createTypedArray(ArrayType.Float32, arrLen) as number[]
    for (i = 0; i < arrLen; i++) {
      this.v[i] = initFrame
      this.pv[i] = initFrame
    }
    this._caching = {
      lastFrame: initFrame,
      lastIndex: 0,
      value: createTypedArray(ArrayType.Float32, arrLen) as number[],
    }
  }
}

export class NoProperty extends BaseProperty {
  constructor() {
    super()
    this.propType = false
  }
}

/**
 *
 */
function setVValue(val: number | number[]) {
  let multipliedValue
  if (typeof val === 'number' && this.propType === 'unidimensional') {
    multipliedValue = val * Number(this.mult)
    if (Math.abs((this.v as number) - multipliedValue) > 0.00001) {
      this.v = multipliedValue
      this._mdf = true
    }
    return
  }
  let i = 0
  const len = (this.v as number[]).length
  while (i < len) {
    multipliedValue = (val as number[])[i] * Number(this.mult)
    if (Math.abs((this.v as number[])[i] - multipliedValue) > 0.00001) {
      ;(this.v as number[])[i] = multipliedValue
      this._mdf = true
    }
    i++
  }
}

/**
 *
 */
function getValueAtCurrentTime() {
  const offsetTime = Number(this.offsetTime),
    frameNum = this.comp.renderedFrame - offsetTime,
    initTime = Number(this.keyframes?.[0].t) - offsetTime,
    length = Number(this.keyframes?.length) - 1,
    endTime = Number(this.keyframes?.[length].t) - offsetTime,
    lastFrame = Number(this._caching?.lastFrame)
  if (
    !(
      frameNum === lastFrame ||
      (lastFrame !== initialDefaultFrame &&
        ((lastFrame >= endTime && frameNum >= endTime) ||
          (lastFrame < initTime && frameNum < initTime)))
    )
  ) {
    if (lastFrame >= frameNum) {
      this._caching!._lastKeyframeIndex = -1
      this._caching!.lastIndex = 0
    }

    const renderResult = this.interpolateValue(frameNum, this._caching)
    this.pv = renderResult
  }
  this._caching!.lastFrame = frameNum
  return this.pv
}

/**
 *
 */
function interpolateValue(frameNum: number, caching: any) {
  const offsetTime = Number(this.offsetTime)
  let newValue
  if (this.propType === 'multidimensional') {
    newValue = createTypedArray(ArrayType.Float32, (this.pv as any[])?.length)
  }
  let iterationIndex = caching.lastIndex
  let i = iterationIndex
  let len = Number(this.keyframes?.length) - 1
  let flag = true
  let keyData
  let nextKeyData

  while (flag) {
    keyData = this.keyframes?.[i]
    nextKeyData = this.keyframes?.[i + 1]
    if (i === len - 1 && frameNum >= Number(nextKeyData?.t) - offsetTime) {
      if (keyData?.h) {
        keyData = nextKeyData
      }
      iterationIndex = 0
      break
    }
    if (Number(nextKeyData?.t) - offsetTime > frameNum) {
      iterationIndex = i
      break
    }
    if (i < len - 1) {
      i++
    } else {
      iterationIndex = 0
      flag = false
    }
  }
  const keyframeMetadata = this.keyframesMetadata?.[i] || {}

  let k
  let kLen
  let perc
  let jLen
  let j
  let fnc
  const nextKeyTime = Number(nextKeyData?.t) - offsetTime
  const keyTime = Number(keyData?.t) - offsetTime
  let endValue
  if (keyData?.to) {
    if (!keyframeMetadata?.bezierData) {
      keyframeMetadata.bezierData = Bezier.buildBezierData(
        keyData.s,
        nextKeyData.s || keyData.e,
        keyData.to,
        keyData.ti
      )
    }
    const bezierData = keyframeMetadata?.bezierData
    if (frameNum >= nextKeyTime || frameNum < keyTime) {
      const ind = frameNum >= nextKeyTime ? bezierData.points.length - 1 : 0
      kLen = bezierData.points[ind].point.length
      if (Array.isArray(newValue)) {
        for (k = 0; k < kLen; k++) {
          newValue[k] = bezierData.points[ind].point[k]
        }
      }
      // caching._lastKeyframeIndex = -1;
    } else {
      if (keyframeMetadata.__fnct) {
        fnc = keyframeMetadata.__fnct
      } else {
        fnc = BezierFactory.getBezierEasing(
          keyData.o.x,
          keyData.o.y,
          keyData.i.x,
          keyData.i.y,
          keyData.n
        ).get
        keyframeMetadata.__fnct = fnc
      }
      perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime))
      const distanceInLine = bezierData.segmentLength * perc

      let segmentPerc
      let addedLength =
        caching.lastFrame < frameNum && caching._lastKeyframeIndex === i
          ? caching._lastAddedLength
          : 0
      j =
        caching.lastFrame < frameNum && caching._lastKeyframeIndex === i
          ? caching._lastPoint
          : 0
      flag = true
      jLen = bezierData.points.length
      while (flag) {
        addedLength += bezierData.points[j].partialLength
        if (
          distanceInLine === 0 ||
          perc === 0 ||
          j === bezierData.points.length - 1
        ) {
          kLen = bezierData.points[j].point.length
          if (Array.isArray(newValue)) {
            for (k = 0; k < kLen; k += 1) {
              newValue[k] = bezierData.points[j].point[k]
            }
          }

          break
        } else if (
          distanceInLine >= addedLength &&
          distanceInLine < addedLength + bezierData.points[j + 1].partialLength
        ) {
          segmentPerc =
            (distanceInLine - addedLength) /
            bezierData.points[j + 1].partialLength
          kLen = bezierData.points[j].point.length
          if (Array.isArray(newValue)) {
            for (k = 0; k < kLen; k++) {
              newValue[k] =
                bezierData.points[j].point[k] +
                (bezierData.points[j + 1].point[k] -
                  bezierData.points[j].point[k]) *
                  segmentPerc
            }
          }

          break
        }
        if (j < jLen - 1) {
          j++
        } else {
          flag = false
        }
      }
      caching._lastPoint = j
      caching._lastAddedLength =
        addedLength - bezierData.points[j].partialLength
      caching._lastKeyframeIndex = i
    }
  } else {
    let outX
    let outY
    let inX
    let inY
    let keyValue
    len = keyData.s.length
    endValue = nextKeyData.s || keyData.e
    if (Array.isArray(newValue) && this.sh && keyData.h !== 1) {
      if (frameNum >= nextKeyTime) {
        newValue[0] = endValue[0]
        newValue[1] = endValue[1]
        newValue[2] = endValue[2]
      } else if (frameNum <= keyTime) {
        newValue[0] = keyData.s[0]
        newValue[1] = keyData.s[1]
        newValue[2] = keyData.s[2]
      } else {
        const quatStart = createQuaternion(keyData?.s)
        const quatEnd = createQuaternion(endValue)
        const time = (frameNum - keyTime) / (nextKeyTime - keyTime)
        quaternionToEuler(newValue as Vector3, slerp(quatStart, quatEnd, time))
      }
    } else {
      for (i = 0; i < len; i++) {
        if (keyData?.h !== 1) {
          if (frameNum >= nextKeyTime) {
            perc = 1
          } else if (frameNum < keyTime) {
            perc = 0
          } else {
            if (keyData.o.x.constructor === Array) {
              if (!keyframeMetadata.__fnct) {
                keyframeMetadata.__fnct = []
              }
              if (keyframeMetadata.__fnct[i]) {
                fnc = keyframeMetadata.__fnct[i]
              } else {
                outX =
                  keyData.o.x[i] === undefined ? keyData.o.x[0] : keyData.o.x[i]
                outY =
                  keyData.o.y[i] === undefined ? keyData.o.y[0] : keyData.o.y[i]
                inX =
                  keyData.i.x[i] === undefined ? keyData.i.x[0] : keyData.i.x[i]
                inY =
                  keyData.i.y[i] === undefined ? keyData.i.y[0] : keyData.i.y[i]
                fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get
                keyframeMetadata.__fnct[i] = fnc
              }
            } else if (keyframeMetadata.__fnct) {
              fnc = keyframeMetadata.__fnct
            } else {
              outX = keyData.o.x
              outY = keyData.o.y
              inX = keyData.i.x
              inY = keyData.i.y
              fnc = BezierFactory.getBezierEasing(outX, outY, inX, inY).get
              keyData.keyframeMetadata = fnc
            }
            perc = fnc((frameNum - keyTime) / (nextKeyTime - keyTime))
          }
        }

        endValue = nextKeyData.s || keyData.e
        keyValue =
          keyData.h === 1
            ? keyData.s[i]
            : keyData.s[i] + (endValue[i] - keyData.s[i]) * perc

        if (this.propType === 'multidimensional') {
          newValue[i] = keyValue
        } else {
          newValue = keyValue
        }
      }
    }
  }
  caching.lastIndex = iterationIndex
  return newValue
}
