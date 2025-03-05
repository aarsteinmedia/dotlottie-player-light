/* eslint-disable max-depth */
import type { GlobalData, ItemData, Vector3, VectorProperty } from '@/types'

import { ArrayType } from '@/enums'
import { createQuaternion, quaternionToEuler, slerp } from '@/utils'
import bezFunction from '@/utils/bez'
import BezierFactory from '@/utils/BezierFactory'
import { initialDefaultFrame } from '@/utils/getterSetter'
import { createTypedArray } from '@/utils/helpers/arrays'

const initFrame = initialDefaultFrame

const bez = bezFunction()

/**
 *
 */
const PropertyFactory = (() => {
  const getProp = <T = unknown>(
    elem: T & { globalData?: GlobalData },
    dataFromProps?: any,
    type?: number,
    mult?: null | number,
    container?: any
  ) => {
    let data = dataFromProps
    if ('sid' in data && data.sid) {
      data = elem.globalData?.slotManager?.getProp(data)
    }
    let p
    if (!data.k.length) {
      p = new (ValueProperty as any)(elem, data, mult, container)
    } else if (typeof data.k[0] === 'number') {
      p = new (MultiDimensionalProperty as any)(elem, data, mult, container)
    } else {
      switch (type) {
        case 0:
          p = new (KeyframedValueProperty as any)(elem, data, mult, container)
          break
        case 1:
          p = new (KeyframedMultidimensionalProperty as any)(
            elem,
            data,
            mult,
            container
          )
          break
        default:
          break
      }
    }
    if (p.effectsSequence.length) {
      container.addDynamicProperty(p)
    }
    return p
  }

  const obj = {
    getProp,
  }
  return obj
})()

/**
 *
 */
function ValueProperty(
  this: ItemData,
  elem: ItemData,
  data: VectorProperty,
  mult: number,
  container: any
) {
  this.propType = 'unidimensional'
  this.mult = mult || 1
  this.data = data
  this.v = mult ? data.k * mult : data.k
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
  this.getValue = processEffectsSequence
  this.setVValue = setVValue
  this.addEffect = addEffect
}

/**
 *
 */
function MultiDimensionalProperty(
  this: ItemData,
  elem: ItemData,
  data: VectorProperty<number[]>,
  mult?: number,
  container?: unknown
) {
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
  this.v = createTypedArray(ArrayType.Float32, length) as number[]
  this.pv = createTypedArray(ArrayType.Float32, length) as number[]
  this.vel = createTypedArray(ArrayType.Float32, length) as number[]
  for (let i = 0; i < length; i++) {
    this.v[i] = data.k[i] * this.mult
    this.pv[i] = data.k[i]
  }
  this._isFirstFrame = true
  this.effectsSequence = []
  this.getValue = processEffectsSequence
  this.setVValue = setVValue
  this.addEffect = addEffect
}

/**
 *
 */
function KeyframedValueProperty(
  this: ItemData,
  elem: ItemData,
  data: VectorProperty<number[]>,
  mult?: number,
  container?: any
) {
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
  this.getValue = processEffectsSequence
  this.setVValue = setVValue
  this.interpolateValue = interpolateValue
  this.effectsSequence = [getValueAtCurrentTime.bind(this)]
  this.addEffect = addEffect
}

/**
 *
 */
function KeyframedMultidimensionalProperty(
  this: ItemData,
  elem: ItemData,
  data: VectorProperty<any[]>,
  mult?: number,
  container?: HTMLElement
) {
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
          bez.pointOnLine2D(
            s[0],
            s[1],
            e[0],
            e[1],
            s[0] + to[0],
            s[1] + to[1]
          ) &&
          bez.pointOnLine2D(
            s[0],
            s[1],
            e[0],
            e[1],
            e[0] + ti[0],
            e[1] + ti[1]
          )) ||
        (s.length === 3 &&
          !(s[0] === e[0] && s[1] === e[1] && s[2] === e[2]) &&
          bez.pointOnLine3D(
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
          bez.pointOnLine3D(
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
  this.getValue = processEffectsSequence
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
  this.addEffect = addEffect
}

/**
 *
 */
function setVValue(this: ItemData, val: number | number[]) {
  let multipliedValue
  if (typeof val === 'number' && this.propType === 'unidimensional') {
    multipliedValue = val * this.mult
    if (Math.abs((this.v as number) - multipliedValue) > 0.00001) {
      this.v = multipliedValue
      this._mdf = true
    }
    return
  }
  let i = 0
  const len = (this.v as number[]).length
  while (i < len) {
    multipliedValue = (val as number[])[i] * this.mult
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
function getValueAtCurrentTime(this: any) {
  const frameNum = this.comp.renderedFrame - this.offsetTime
  const initTime = this.keyframes[0].t - this.offsetTime
  const endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime
  if (
    !(
      frameNum === this._caching.lastFrame ||
      (this._caching.lastFrame !== initialDefaultFrame &&
        ((this._caching.lastFrame >= endTime && frameNum >= endTime) ||
          (this._caching.lastFrame < initTime && frameNum < initTime)))
    )
  ) {
    if (this._caching.lastFrame >= frameNum) {
      this._caching._lastKeyframeIndex = -1
      this._caching.lastIndex = 0
    }

    const renderResult = this.interpolateValue(frameNum, this._caching)
    this.pv = renderResult
  }
  this._caching.lastFrame = frameNum
  return this.pv
}

/**
 *
 */
function addEffect(this: any, effectFunction: any) {
  this.effectsSequence.push(effectFunction)
  this.container.addDynamicProperty(this)
}

/**
 *
 */
function processEffectsSequence(this: any) {
  if (
    this.elem.globalData.frameId === this.frameId ||
    !this.effectsSequence.length
  ) {
    return
  }
  if (this.lock) {
    this.setVValue(this.pv)
    return
  }
  this.lock = true
  this._mdf = this._isFirstFrame
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

/**
 *
 */
function interpolateValue(this: any, frameNum: number, caching: any) {
  const offsetTime = this.offsetTime
  let newValue
  if (this.propType === 'multidimensional') {
    newValue = createTypedArray(ArrayType.Float32, this.pv.length)
  }
  let iterationIndex = caching.lastIndex
  let i = iterationIndex
  let len = this.keyframes.length - 1
  let flag = true
  let keyData
  let nextKeyData

  while (flag) {
    keyData = this.keyframes[i]
    nextKeyData = this.keyframes[i + 1]
    if (i === len - 1 && frameNum >= nextKeyData.t - offsetTime) {
      if (keyData.h) {
        keyData = nextKeyData
      }
      iterationIndex = 0
      break
    }
    if (nextKeyData.t - offsetTime > frameNum) {
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
  const keyframeMetadata = this.keyframesMetadata[i] || {}

  let k
  let kLen
  let perc
  let jLen
  let j
  let fnc
  const nextKeyTime = nextKeyData.t - offsetTime
  const keyTime = keyData.t - offsetTime
  let endValue
  if (keyData.to) {
    if (!keyframeMetadata.bezierData) {
      keyframeMetadata.bezierData = bez.buildBezierData(
        keyData.s,
        nextKeyData.s || keyData.e,
        keyData.to,
        keyData.ti
      )
    }
    const bezierData = keyframeMetadata.bezierData
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
        const quatStart = createQuaternion(keyData.s)
        const quatEnd = createQuaternion(endValue)
        const time = (frameNum - keyTime) / (nextKeyTime - keyTime)
        quaternionToEuler(newValue as Vector3, slerp(quatStart, quatEnd, time))
      }
    } else {
      for (i = 0; i < len; i++) {
        if (keyData.h !== 1) {
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

export default PropertyFactory
