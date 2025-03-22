import type {
  Caching,
  ElementInterfaceIntersect,
  Keyframe,
  KeyframesMetadata,
  Mask,
  Merge,
  Shape,
  StrokeData,
  Vector2,
} from '@/types'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'

import ShapeElement from '@/elements/ShapeElement'
import { degToRads } from '@/utils'
import { getBezierEasing } from '@/utils/BezierFactory'
import { initialDefaultFrame, roundCorner } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'
import { clone, newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapePath from '@/utils/shapes/ShapePath'
/**
 *
 */
export function getConstructorFunction() {
  return ShapeProperty
}

/**
 *
 */
export function getKeyframedConstructorFunction() {
  return KeyframedShapeProperty
}

/**
 *
 */
export function getShapeProp(
  elem: ShapeElement,
  data: Merge<Shape, Mask>,
  type: number,
  _?: unknown
) {
  let prop
  if (type === 3 || type === 4) {
    const dataProp = type === 3 ? data.pt : data.ks
    const keys = dataProp?.k
    if (keys?.length) {
      prop = new KeyframedShapeProperty(elem, data, type)
    } else {
      prop = new ShapeProperty(elem, data, type)
    }
  } else if (type === 5) {
    prop = new RectShapeProperty(elem as ElementInterfaceIntersect, data)
  } else if (type === 6) {
    prop = new EllShapeProperty(elem as ElementInterfaceIntersect, data)
  } else if (type === 7) {
    prop = new StarShapeProperty(elem, data)
  }
  if (prop?.k) {
    elem.addDynamicProperty(prop as any)
  }
  return prop
}

abstract class ShapeBaseProperty extends DynamicPropertyContainer {
  _caching?: Caching
  public comp?: ElementInterfaceIntersect
  public data?: Partial<Shape & Mask>
  public effectsSequence?: any[]
  public elem?: ShapeElement
  frameId?: number
  public k?: boolean
  keyframes?: Keyframe[]
  keyframesMetadata?: KeyframesMetadata[]
  public kf?: boolean
  public localShapeCollection?: ShapeCollection
  lock?: boolean
  offsetTime: number = 0
  public paths?: ShapeCollection
  public pv?: ShapePath
  public v?: ShapePath
  interpolateShape(
    frameNum: number,
    previousValue: ShapePath,
    caching?: Caching
  ) {
    let iterationIndex = caching?.lastIndex
    let keyPropS
    let keyPropE
    let isHold
    let perc = 0
    let vertexValue
    const kf = this.keyframes
    if (!kf) {
      throw new Error('ShapeBaseProperty: Could not read keyframe data')
    }
    if (frameNum < kf[0].t - this.offsetTime) {
      keyPropS = kf[0].s[0]
      isHold = true
      iterationIndex = 0
    } else if (frameNum >= kf[kf.length - 1].t - this.offsetTime) {
      keyPropS = kf[kf.length - 1].s
        ? kf[kf.length - 1].s[0]
        : kf[kf.length - 2].e[0]
      /* if(kf[kf.length - 1].s){
                keyPropS = kf[kf.length - 1].s[0];
            }else{
                keyPropS = kf[kf.length - 2].e[0];
            } */
      isHold = true
    } else {
      let i = Number(iterationIndex)
      const len = kf.length - 1
      let flag = true
      let keyData
      let nextKeyData
      while (flag) {
        keyData = kf[i]
        nextKeyData = kf[i + 1]
        if (nextKeyData.t - this.offsetTime > frameNum) {
          break
        }
        if (i < len - 1) {
          i++
        } else {
          flag = false
        }
      }
      if (!keyData || !nextKeyData) {
        throw new Error('ShapeBaseProperty: Could not set keyframe data')
      }
      const keyframeMetadata = this.keyframesMetadata?.[i] || {}
      isHold = keyData.h === 1
      iterationIndex = i
      if (!isHold) {
        if (frameNum >= nextKeyData.t - this.offsetTime) {
          perc = 1
        } else if (frameNum < keyData.t - this.offsetTime) {
          perc = 0
        } else {
          let fnc
          if (keyframeMetadata.__fnct) {
            fnc = keyframeMetadata.__fnct
          } else if (
            typeof keyData.o.x === 'number' &&
            typeof keyData.o.y === 'number' &&
            typeof keyData.i.x === 'number' &&
            typeof keyData.i.y === 'number'
          ) {
            fnc = getBezierEasing(
              keyData.o.x,
              keyData.o.y,
              keyData.i.x,
              keyData.i.y
            ).get
            keyframeMetadata.__fnct = fnc
          }
          perc =
            fnc?.(
              (frameNum - (keyData.t - this.offsetTime)) /
                (nextKeyData.t -
                  this.offsetTime -
                  (keyData.t - this.offsetTime))
            ) || 0
        }
        keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0]
      }
      keyPropS = keyData.s[0]
    }
    const jLen = previousValue._length
    const kLen = keyPropS.i[0].length
    caching!.lastIndex = Number(iterationIndex)

    for (let j = 0; j < jLen; j++) {
      for (let k = 0; k < kLen; k++) {
        vertexValue = isHold
          ? keyPropS.i[j][k]
          : keyPropS.i[j][k] + (keyPropE.i[j][k] - keyPropS.i[j][k]) * perc
        previousValue.i[j][k] = vertexValue
        vertexValue = isHold
          ? keyPropS.o[j][k]
          : keyPropS.o[j][k] + (keyPropE.o[j][k] - keyPropS.o[j][k]) * perc
        previousValue.o[j][k] = vertexValue
        vertexValue = isHold
          ? keyPropS.v[j][k]
          : keyPropS.v[j][k] + (keyPropE.v[j][k] - keyPropS.v[j][k]) * perc
        previousValue.v[j][k] = vertexValue
      }
    }
  }
  interpolateShapeCurrentTime() {
    if (!this.pv) {
      throw new Error('ShapeBaseProperty: Cannot parse ShapePath v value')
    }
    const frameNum = Number(this.comp?.renderedFrame) - this.offsetTime,
      initTime = Number(this.keyframes?.[0].t) - this.offsetTime,
      endTime =
        Number(this.keyframes?.[Number(this.keyframes.length) - 1].t) -
        this.offsetTime,
      lastFrame = Number(this._caching?.lastFrame)
    if (
      !(
        lastFrame !== initialDefaultFrame &&
        ((lastFrame < initTime && frameNum < initTime) ||
          (lastFrame > endTime && frameNum > endTime))
      )
    ) {
      this._caching!.lastIndex =
        lastFrame < frameNum ? Number(this._caching?.lastIndex) : 0
      this.interpolateShape(frameNum, this.pv, this._caching)
    }
    this._caching!.lastFrame = frameNum
    return this.pv
  }
  processEffectsSequence() {
    if (this.elem?.globalData?.frameId === this.frameId || 0) {
      return
    }
    if (!this.effectsSequence?.length) {
      this._mdf = false
      return
    }
    if (this.lock && this.pv) {
      this.setVValue(this.pv)
      return
    }
    this.lock = true
    this._mdf = false
    let finalValue
    if (this.kf) {
      finalValue = this.pv
    } else if (this.data?.ks) {
      finalValue = this.data.ks.k
    } else {
      finalValue = this.data?.pt?.k
    }
    let i
    const len = this.effectsSequence.length
    for (i = 0; i < len; i++) {
      finalValue = this.effectsSequence?.[i](finalValue)
    }
    this.setVValue(finalValue)
    this.lock = false
    this.frameId = this.elem?.globalData?.frameId || 0
  }
  reset() {
    this.paths = this.localShapeCollection
  }
  setVValue(newPath: ShapePath) {
    if (!this.v) {
      throw new Error('ShapeBaseProperty: ShapePath is not set')
    }
    if (!this.shapesEqual(this.v, newPath)) {
      this.v = clone(newPath)
      this.localShapeCollection?.releaseShapes()
      this.localShapeCollection?.addShape(this.v)
      this._mdf = true
      this.paths = this.localShapeCollection
    }
  }
  shapesEqual(shape1: ShapePath, shape2: ShapePath) {
    if (shape1._length !== shape2._length || shape1.c !== shape2.c) {
      return false
    }
    const len = shape1._length || 0
    for (let i = 0; i < len; i++) {
      if (
        shape1.v[i]?.[0] !== shape2.v[i]?.[0] ||
        shape1.v[i]?.[1] !== shape2.v[i]?.[1] ||
        shape1.o[i]?.[0] !== shape2.o[i]?.[0] ||
        shape1.o[i]?.[1] !== shape2.o[i]?.[1] ||
        shape1.i[i]?.[0] !== shape2.i[i]?.[0] ||
        shape1.i[i]?.[1] !== shape2.i[i]?.[1]
      ) {
        return false
      }
    }
    return true
  }
}

export class RectShapeProperty extends ShapeBaseProperty {
  d?: number
  ir?: ValueProperty
  is?: ValueProperty
  or?: ValueProperty
  os?: ValueProperty
  p: MultiDimensionalProperty<Vector2>
  pt?: ValueProperty
  r: ValueProperty
  s: MultiDimensionalProperty<Vector2>

  constructor(elem: ElementInterfaceIntersect, data: Merge<Shape, Mask>) {
    super()
    this.v = newElement()
    this.v.c = true
    this.localShapeCollection = newShapeCollection()
    this.localShapeCollection.addShape(this.v)
    this.paths = this.localShapeCollection
    this.elem = elem
    this.comp = elem.comp
    this.frameId = -1
    this.d = data.d as number
    this.initDynamicPropertyContainer(elem)
    this.p = PropertyFactory(
      elem,
      data.p,
      1,
      0,
      this
    ) as MultiDimensionalProperty<Vector2>
    this.s = PropertyFactory(
      elem,
      data.s,
      1,
      0,
      this
    ) as MultiDimensionalProperty<Vector2>
    this.r = PropertyFactory(elem, data.r, 0, 0, this) as ValueProperty
    if (this.dynamicProperties?.length) {
      this.k = true
    } else {
      this.k = false
      this.convertRectToPath()
    }
  }
  convertRectToPath() {
    const p0 = this.p.v[0]
    const p1 = this.p.v[1]
    const v0 = this.s.v[0] / 2
    const v1 = this.s.v[1] / 2
    const round = Math.min(v0, v1, Number(this.r?.v))
    const cPoint = round * (1 - roundCorner)
    this.v!._length = 0

    if (this.d === 2 || this.d === 1) {
      this.v?.setTripleAt(
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + cPoint,
        0,
        true
      )
      this.v?.setTripleAt(
        p0 + v0,
        p1 + v1 - round,
        p0 + v0,
        p1 + v1 - cPoint,
        p0 + v0,
        p1 + v1 - round,
        1,
        true
      )
      if (round === 0) {
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          p0 - v0,
          p1 + v1,
          2
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1,
          p0 - v0,
          p1 - v1 + cPoint,
          p0 - v0,
          p1 - v1,
          3
        )
      } else {
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          2,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          p0 - v0 + round,
          p1 + v1,
          3,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - cPoint,
          4,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + cPoint,
          p0 - v0,
          p1 - v1 + round,
          5,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          6,
          true
        )
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - cPoint,
          p1 - v1,
          p0 + v0 - round,
          p1 - v1,
          7,
          true
        )
      }
    } else {
      this.v?.setTripleAt(
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + cPoint,
        p0 + v0,
        p1 - v1 + round,
        0,
        true
      )
      if (round === 0) {
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          p0 - v0,
          p1 - v1,
          1,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1,
          p0 - v0,
          p1 + v1 - cPoint,
          p0 - v0,
          p1 + v1,
          2,
          true
        )
        this.v?.setTripleAt(
          p0 + v0,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          p0 + v0,
          p1 + v1,
          3,
          true
        )
      } else {
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - cPoint,
          p1 - v1,
          1,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          p0 - v0 + round,
          p1 - v1,
          2,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + cPoint,
          3,
          true
        )
        this.v?.setTripleAt(
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - cPoint,
          p0 - v0,
          p1 + v1 - round,
          4,
          true
        )
        this.v?.setTripleAt(
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          5,
          true
        )
        this.v?.setTripleAt(
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          p0 + v0 - round,
          p1 + v1,
          6,
          true
        )
        this.v?.setTripleAt(
          p0 + v0,
          p1 + v1 - round,
          p0 + v0,
          p1 + v1 - round,
          p0 + v0,
          p1 + v1 - cPoint,
          7,
          true
        )
      }
    }
  }
  override getValue() {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return
    }
    if (this.elem?.globalData?.frameId) {
      this.frameId = this.elem.globalData.frameId
    }

    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertRectToPath()
    }
  }
}

class StarShapeProperty extends ShapeBaseProperty {
  d?: StrokeData[]
  ir?: ValueProperty
  is?: ValueProperty
  or: ValueProperty
  os: ValueProperty
  p: MultiDimensionalProperty<Vector2>
  pt: ValueProperty
  r: ValueProperty
  s?: ValueProperty
  constructor(elem: any, data: any) {
    super()
    this.v = newElement()
    this.v.setPathData(true, 0)
    this.elem = elem
    this.comp = elem.comp
    this.data = data
    this.frameId = -1
    this.d = data.d
    this.initDynamicPropertyContainer(elem)
    if (data.sy === 1) {
      this.ir = PropertyFactory(elem, data.ir, 0, 0, this) as ValueProperty
      this.is = PropertyFactory(elem, data.is, 0, 0.01, this) as ValueProperty
      this.convertToPath = this.convertStarToPath
    } else {
      this.convertToPath = this.convertPolygonToPath
    }
    this.pt = PropertyFactory(elem, data.pt, 0, 0, this) as ValueProperty
    this.p = PropertyFactory(
      elem,
      data.p,
      1,
      0,
      this
    ) as MultiDimensionalProperty<Vector2>
    this.r = PropertyFactory(elem, data.r, 0, degToRads, this) as ValueProperty
    this.or = PropertyFactory(elem, data.or, 0, 0, this) as ValueProperty
    this.os = PropertyFactory(elem, data.os, 0, 0.01, this) as ValueProperty
    this.localShapeCollection = newShapeCollection()
    this.localShapeCollection.addShape(this.v)
    this.paths = this.localShapeCollection
    if (this.dynamicProperties?.length) {
      this.k = true
    } else {
      this.k = false
      this.convertToPath()
    }
  }

  convertPolygonToPath() {
    const numPts = Math.floor(Number(this.pt?.v))
    const angle = (Math.PI * 2) / numPts
    const rad = Number(this.or?.v)
    const roundness = Number(this.os?.v)
    const perimSegment = (2 * Math.PI * rad) / (numPts * 4)
    let i
    let currentAng = -Math.PI * 0.5
    const dir = this.data?.d === 3 ? -1 : 1
    currentAng += Number(this.r?.v)
    this.v!._length = 0
    for (i = 0; i < numPts; i++) {
      let x = rad * Math.cos(currentAng)
      let y = rad * Math.sin(currentAng)
      const ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y)
      const oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y)
      x += +this.p.v[0]
      y += +this.p.v[1]
      this.v?.setTripleAt(
        x,
        y,
        x - ox * perimSegment * roundness * dir,
        y - oy * perimSegment * roundness * dir,
        x + ox * perimSegment * roundness * dir,
        y + oy * perimSegment * roundness * dir,
        i,
        true
      )
      currentAng += angle * dir
    }
    ;(this.paths as any).length = 0 // TODO: Check if values are different in star shapes
    ;(this.paths as any)[0] = this.v // TODO:
  }
  convertStarToPath() {
    const numPts = Math.floor(Number(this.pt?.v)) * 2
    const angle = (Math.PI * 2) / numPts
    /* this.v.v.length = numPts;
              this.v.i.length = numPts;
              this.v.o.length = numPts; */
    let longFlag = true
    const longRad = Number(this.or?.v)
    const shortRad = Number(this.ir?.v)
    const longRound = Number(this.os?.v)
    const shortRound = Number(this.is?.v)
    const longPerimSegment = (2 * Math.PI * longRad) / (numPts * 2)
    const shortPerimSegment = (2 * Math.PI * shortRad) / (numPts * 2)
    let rad
    let roundness
    let perimSegment
    let currentAng = -Math.PI / 2
    currentAng += Number(this.r?.v)
    const dir = this.data?.d === 3 ? -1 : 1
    this.v!._length = 0
    for (let i = 0; i < numPts; i++) {
      rad = longFlag ? longRad : shortRad
      roundness = longFlag ? longRound : shortRound
      perimSegment = longFlag ? longPerimSegment : shortPerimSegment
      let x = rad * Math.cos(currentAng)
      let y = rad * Math.sin(currentAng)
      const ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y)
      const oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y)
      x += +this.p.v[0]
      y += +this.p.v[1]
      this.v?.setTripleAt(
        x,
        y,
        x - ox * perimSegment * roundness * dir,
        y - oy * perimSegment * roundness * dir,
        x + ox * perimSegment * roundness * dir,
        y + oy * perimSegment * roundness * dir,
        i,
        true
      )

      /* this.v.v[i] = [x,y];
                  this.v.i[i] = [x+ox*perimSegment*roundness*dir,y+oy*perimSegment*roundness*dir];
                  this.v.o[i] = [x-ox*perimSegment*roundness*dir,y-oy*perimSegment*roundness*dir];
                  this.v._length = numPts; */
      longFlag = !longFlag
      currentAng += angle * dir
    }
  }
  convertToPath() {
    throw new Error(
      'StarShapeProperty: Method convertToPath is not implemented'
    )
  }
  override getValue() {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem?.globalData?.frameId || 0
    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertToPath()
    }
  }
}

class EllShapeProperty extends ShapeBaseProperty {
  d?: number
  p: MultiDimensionalProperty<Vector2>
  s: MultiDimensionalProperty<Vector2>
  private _cPoint = roundCorner

  constructor(elem: ElementInterfaceIntersect, data: Merge<Shape, Mask>) {
    super()
    this.v = newElement()
    this.v.setPathData(true, 4)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.localShapeCollection.addShape(this.v)
    this.d = data.d as number
    this.elem = elem
    this.comp = elem.comp
    this.frameId = -1
    this.initDynamicPropertyContainer(elem)
    this.p = PropertyFactory(
      elem,
      data.p,
      1,
      0,
      this
    ) as MultiDimensionalProperty<Vector2>
    this.s = PropertyFactory(
      elem,
      data.s,
      1,
      0,
      this
    ) as MultiDimensionalProperty<Vector2>
    if (this.dynamicProperties?.length) {
      this.k = true
    } else {
      this.k = false
      this.convertEllToPath()
    }
  }
  convertEllToPath() {
    const p0 = this.p.v[0],
      p1 = this.p.v[1],
      s0 = this.s.v[0] / 2,
      s1 = this.s.v[1] / 2,
      _cw = this.d !== 3,
      _v = this.v

    if (!_v) {
      throw new Error('EllShapeProperty: Could not get value of ellipse')
    }
    _v.v[0][0] = p0
    _v.v[0][1] = p1 - s1
    _v.v[1][0] = _cw ? p0 + s0 : p0 - s0
    _v.v[1][1] = p1
    _v.v[2][0] = p0
    _v.v[2][1] = p1 + s1
    _v.v[3][0] = _cw ? p0 - s0 : p0 + s0
    _v.v[3][1] = p1
    _v.i[0][0] = _cw ? p0 - s0 * this._cPoint : p0 + s0 * this._cPoint
    _v.i[0][1] = p1 - s1
    _v.i[1][0] = _cw ? p0 + s0 : p0 - s0
    _v.i[1][1] = p1 - s1 * this._cPoint
    _v.i[2][0] = _cw ? p0 + s0 * this._cPoint : p0 - s0 * this._cPoint
    _v.i[2][1] = p1 + s1
    _v.i[3][0] = _cw ? p0 - s0 : p0 + s0
    _v.i[3][1] = p1 + s1 * this._cPoint
    _v.o[0][0] = _cw ? p0 + s0 * this._cPoint : p0 - s0 * this._cPoint
    _v.o[0][1] = p1 - s1
    _v.o[1][0] = _cw ? p0 + s0 : p0 - s0
    _v.o[1][1] = p1 + s1 * this._cPoint
    _v.o[2][0] = _cw ? p0 - s0 * this._cPoint : p0 + s0 * this._cPoint
    _v.o[2][1] = p1 + s1
    _v.o[3][0] = _cw ? p0 - s0 : p0 + s0
    _v.o[3][1] = p1 - s1 * this._cPoint
  }
  override getValue() {
    if (this.elem?.globalData?.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem?.globalData?.frameId || 0
    this.iterateDynamicProperties()

    if (this._mdf) {
      this.convertEllToPath()
    }
  }
}

export class ShapeProperty extends ShapeBaseProperty {
  constructor(elem: ShapeElement, data: Partial<Shape & Mask>, type: number) {
    super()
    this.propType = 'shape'
    this.comp = elem.comp
    this.container = elem as any
    this.elem = elem
    this.data = data
    this.k = false
    this.kf = false
    this._mdf = false
    const pathData = type === 3 ? data.pt?.k : data.ks?.k
    if (!pathData) {
      throw new Error('Could now get Path Data')
    }
    this.v = clone(pathData as ShapePath)
    this.pv = clone(this.v)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.effectsSequence = []
    this.getValue = this.processEffectsSequence
  }
}

class KeyframedShapeProperty extends ShapeBaseProperty {
  public lastFrame
  constructor(elem: ShapeElement, data: Partial<Shape & Mask>, type: number) {
    super()
    this.propType = 'shape'
    this.comp = elem.comp
    this.elem = elem
    this.container = elem as any
    this.offsetTime = elem.data?.st || 0
    this.keyframes = (type === 3 ? data.pt?.k : (data.ks?.k ?? [])) as any
    this.keyframesMetadata = []
    this.k = true
    this.kf = true
    const len = this.keyframes?.[0]?.s?.[0].i.length || 0
    this.v = newElement()
    this.v.setPathData(!!this.keyframes?.[0].s?.[0].c, len)
    this.pv = clone(this.v)
    this.localShapeCollection = newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.lastFrame = initialDefaultFrame
    this._caching = { lastFrame: initialDefaultFrame, lastIndex: 0 } as Caching
    this.effectsSequence = [this.interpolateShapeCurrentTime.bind(this)]
    this.getValue = this.processEffectsSequence
  }
}
