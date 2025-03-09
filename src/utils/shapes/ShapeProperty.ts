import type { ElementInterface, LottieComp, Shape, StrokeData } from '@/types'
import type { ValueProperty } from '@/utils/Properties'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'

import { degToRads } from '@/utils'
import BezierFactory from '@/utils/BezierFactory'
import { initialDefaultFrame, roundCorner } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import ShapeCollectionPool from '@/utils/pooling/ShapeCollectionPool'
import ShapePool from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapePath from '@/utils/shapes/ShapePath'

export default class ShapePropertyFactory {
  static getConstructorFunction() {
    return ShapeProperty
  }

  static getKeyframedConstructorFunction() {
    return KeyframedShapeProperty
  }

  static getShapeProp(
    elem: ElementInterface,
    data: Shape,
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
      prop = new RectShapeProperty(elem, data)
    } else if (type === 6) {
      prop = new EllShapeProperty(elem, data)
    } else if (type === 7) {
      prop = new StarShapeProperty(elem, data)
    }
    if (prop?.k) {
      elem.addDynamicProperty(prop)
    }
    return prop
  }
}

class RectShapeProperty extends DynamicPropertyContainer {
  comp: any
  d?: number
  data: any
  elem: any
  frameId: number
  ir?: ValueProperty
  is?: ValueProperty
  k: boolean
  localShapeCollection: ShapeCollection
  or?: ValueProperty
  os?: ValueProperty
  p: ValueProperty
  paths: ShapeCollection
  pt?: ValueProperty
  r: ValueProperty
  reset = resetShape
  s: ValueProperty
  v: any

  constructor(elem: any, data: any) {
    super()
    this.v = ShapePool.newElement()
    this.v.c = true
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection()
    this.localShapeCollection.addShape(this.v)
    this.paths = this.localShapeCollection
    this.elem = elem
    this.comp = elem.comp
    this.frameId = -1
    this.d = data.d
    this.initDynamicPropertyContainer(elem)
    this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this)
    this.s = PropertyFactory.getProp(elem, data.s, 1, 0, this)
    this.r = PropertyFactory.getProp(elem, data.r, 0, 0, this)
    if (this.dynamicProperties.length) {
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
    this.v._length = 0

    if (this.d === 2 || this.d === 1) {
      this.v.setTripleAt(
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + round,
        p0 + v0,
        p1 - v1 + cPoint,
        0,
        true
      )
      this.v.setTripleAt(
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
        this.v.setTripleAt(
          p0 - v0,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          p0 - v0,
          p1 + v1,
          2
        )
        this.v.setTripleAt(
          p0 - v0,
          p1 - v1,
          p0 - v0,
          p1 - v1 + cPoint,
          p0 - v0,
          p1 - v1,
          3
        )
      } else {
        this.v.setTripleAt(
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          2,
          true
        )
        this.v.setTripleAt(
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          p0 - v0 + round,
          p1 + v1,
          3,
          true
        )
        this.v.setTripleAt(
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - cPoint,
          4,
          true
        )
        this.v.setTripleAt(
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + cPoint,
          p0 - v0,
          p1 - v1 + round,
          5,
          true
        )
        this.v.setTripleAt(
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          6,
          true
        )
        this.v.setTripleAt(
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
      this.v.setTripleAt(
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
        this.v.setTripleAt(
          p0 - v0,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          p0 - v0,
          p1 - v1,
          1,
          true
        )
        this.v.setTripleAt(
          p0 - v0,
          p1 + v1,
          p0 - v0,
          p1 + v1 - cPoint,
          p0 - v0,
          p1 + v1,
          2,
          true
        )
        this.v.setTripleAt(
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
        this.v.setTripleAt(
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - round,
          p1 - v1,
          p0 + v0 - cPoint,
          p1 - v1,
          1,
          true
        )
        this.v.setTripleAt(
          p0 - v0 + round,
          p1 - v1,
          p0 - v0 + cPoint,
          p1 - v1,
          p0 - v0 + round,
          p1 - v1,
          2,
          true
        )
        this.v.setTripleAt(
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + round,
          p0 - v0,
          p1 - v1 + cPoint,
          3,
          true
        )
        this.v.setTripleAt(
          p0 - v0,
          p1 + v1 - round,
          p0 - v0,
          p1 + v1 - cPoint,
          p0 - v0,
          p1 + v1 - round,
          4,
          true
        )
        this.v.setTripleAt(
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + round,
          p1 + v1,
          p0 - v0 + cPoint,
          p1 + v1,
          5,
          true
        )
        this.v.setTripleAt(
          p0 + v0 - round,
          p1 + v1,
          p0 + v0 - cPoint,
          p1 + v1,
          p0 + v0 - round,
          p1 + v1,
          6,
          true
        )
        this.v.setTripleAt(
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
  getValue() {
    if (this.elem.globalData.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem.globalData.frameId
    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertRectToPath()
    }
  }
}

class StarShapeProperty extends DynamicPropertyContainer {
  comp: any
  convertToPath: () => void
  d?: StrokeData[]
  data: any
  elem: any
  frameId: number
  ir?: ValueProperty
  is?: ValueProperty
  k: boolean
  localShapeCollection: ShapeCollection
  or: ValueProperty
  os: ValueProperty
  p: ValueProperty
  paths: ShapeCollection
  pt: ValueProperty
  r: ValueProperty
  reset = resetShape
  s?: ValueProperty
  v: ShapePath

  constructor(elem: any, data: any) {
    super()
    this.v = ShapePool.newElement()
    this.v.setPathData(true, 0)
    this.elem = elem
    this.comp = elem.comp
    this.data = data
    this.frameId = -1
    this.d = data.d
    this.initDynamicPropertyContainer(elem)
    if (data.sy === 1) {
      this.ir = PropertyFactory.getProp(elem, data.ir, 0, 0, this)
      this.is = PropertyFactory.getProp(elem, data.is, 0, 0.01, this)
      this.convertToPath = this.convertStarToPath
    } else {
      this.convertToPath = this.convertPolygonToPath
    }
    this.pt = PropertyFactory.getProp(elem, data.pt, 0, 0, this)
    this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this)
    this.r = PropertyFactory.getProp(elem, data.r, 0, degToRads, this)
    this.or = PropertyFactory.getProp(elem, data.or, 0, 0, this)
    this.os = PropertyFactory.getProp(elem, data.os, 0, 0.01, this)
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection()
    this.localShapeCollection.addShape(this.v)
    this.paths = this.localShapeCollection
    if (this.dynamicProperties.length) {
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
    const dir = this.data.d === 3 ? -1 : 1
    currentAng += Number(this.r?.v)
    this.v._length = 0
    for (i = 0; i < numPts; i++) {
      let x = rad * Math.cos(currentAng)
      let y = rad * Math.sin(currentAng)
      const ox = x === 0 && y === 0 ? 0 : y / Math.sqrt(x * x + y * y)
      const oy = x === 0 && y === 0 ? 0 : -x / Math.sqrt(x * x + y * y)
      x += +this.p.v[0]
      y += +this.p.v[1]
      this.v.setTripleAt(
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
    this.paths.length = 0
    this.paths[0] = this.v
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
    const dir = this.data.d === 3 ? -1 : 1
    this.v._length = 0
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
      this.v.setTripleAt(
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
  getValue() {
    if (this.elem.globalData.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem.globalData.frameId
    this.iterateDynamicProperties()
    if (this._mdf) {
      this.convertToPath()
    }
  }
}

class EllShapeProperty extends DynamicPropertyContainer {
  comp: any

  d?: StrokeData[]
  elem: any
  frameId: number
  k: boolean
  localShapeCollection: ShapeCollection
  p: ValueProperty
  paths: ShapeCollection
  reset = resetShape
  s: ValueProperty
  v: ShapePath
  private _cPoint = roundCorner

  constructor(elem: any, data: Shape) {
    super()
    this.v = ShapePool.newElement()
    this.v.setPathData(true, 4)
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection()
    this.paths = this.localShapeCollection
    this.localShapeCollection.addShape(this.v)
    this.d = data.d
    this.elem = elem
    this.comp = elem.comp
    this.frameId = -1
    this.initDynamicPropertyContainer(elem)
    this.p = PropertyFactory.getProp(elem, data.p, 1, 0, this)
    this.s = PropertyFactory.getProp(elem, data.s, 1, 0, this)
    if (this.dynamicProperties.length) {
      this.k = true
    } else {
      this.k = false
      this.convertEllToPath()
    }
  }
  convertEllToPath() {
    const p0 = this.p.v[0]
    const p1 = this.p.v[1]
    const s0 = this.s.v[0] / 2
    const s1 = this.s.v[1] / 2
    const _cw = this.d !== 3
    const _v = this.v
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
  getValue() {
    if (this.elem.globalData.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem.globalData.frameId
    this.iterateDynamicProperties()

    if (this._mdf) {
      this.convertEllToPath()
    }
  }
}

export class ShapeProperty {
  public _mdf: boolean
  public addEffect: (func: any) => void
  public comp: LottieComp
  public container: unknown
  public data: Shape
  public effectsSequence: unknown[]
  public elem: ElementInterface
  public getValue: () => void
  public interpolateShape: (
    frame: number,
    previousValue: any,
    caching: any
  ) => void
  public k: boolean
  public kf: boolean
  public localShapeCollection: ShapeCollection
  public paths: ShapeCollection
  public propType: string
  public pv: ShapePath
  public reset
  public setVValue: (shape: ShapePath) => void
  public v: ShapePath
  constructor(elem: ElementInterface, data: Shape, type: number) {
    this.propType = 'shape'
    this.comp = elem.comp
    this.container = elem
    this.elem = elem
    this.data = data
    this.k = false
    this.kf = false
    this._mdf = false
    const pathData = type === 3 ? data.pt?.k : data.ks?.k
    if (!pathData) {
      throw new Error('Could now get Path Data')
    }
    this.v = ShapePool.clone(pathData as ShapePath)
    this.pv = ShapePool.clone(this.v)
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.reset = resetShape
    this.effectsSequence = []
    this.interpolateShape = interpolateShape
    this.getValue = processEffectsSequence
    this.setVValue = setVValue
    this.addEffect = addEffect
  }
}

class KeyframedShapeProperty {
  public _caching

  public addEffect: (func: any) => void
  public comp
  public container
  public effectsSequence
  public elem
  public getValue: () => void
  public interpolateShape: (
    frame: number,
    previousValue: any,
    caching: any
  ) => void
  public k
  public keyframes
  public keyframesMetadata: unknown[]
  public kf
  public lastFrame
  public localShapeCollection
  public offsetTime
  public paths
  public propType
  public pv
  public reset
  public setVValue: (shape: ShapePath) => void
  public v: ShapePath
  constructor(elem: any, data: any, type: number) {
    this.propType = 'shape'
    this.comp = elem.comp
    this.elem = elem
    this.container = elem
    this.offsetTime = elem.data.st
    this.keyframes = type === 3 ? data.pt.k : data.ks.k
    this.keyframesMetadata = []
    this.k = true
    this.kf = true
    const len = this.keyframes[0].s[0].i.length
    this.v = ShapePool.newElement()
    this.v.setPathData(this.keyframes[0].s[0].c, len)
    this.pv = ShapePool.clone(this.v)
    this.localShapeCollection = ShapeCollectionPool.newShapeCollection()
    this.paths = this.localShapeCollection
    this.paths.addShape(this.v)
    this.lastFrame = initialDefaultFrame
    this.reset = resetShape
    this._caching = { lastFrame: initialDefaultFrame, lastIndex: 0 }
    this.effectsSequence = [interpolateShapeCurrentTime.bind(this)]
    this.getValue = processEffectsSequence
    this.interpolateShape = interpolateShape
    this.setVValue = setVValue
    this.addEffect = addEffect
  }
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
  if (this.elem.globalData.frameId === this.frameId) {
    return
  }
  if (!this.effectsSequence.length) {
    this._mdf = false
    return
  }
  if (this.lock) {
    this.setVValue(this.pv)
    return
  }
  this.lock = true
  this._mdf = false
  let finalValue
  if (this.kf) {
    finalValue = this.pv
  } else if (this.data.ks) {
    finalValue = this.data.ks.k
  } else {
    finalValue = this.data.pt.k
  }
  let i
  const len = this.effectsSequence.length
  for (i = 0; i < len; i++) {
    finalValue = this.effectsSequence[i](finalValue)
  }
  this.setVValue(finalValue)
  this.lock = false
  this.frameId = this.elem.globalData.frameId
}

/**
 *
 */
function setVValue(this: any, newPath: ShapePath) {
  if (!shapesEqual(this.v, newPath)) {
    this.v = ShapePool.clone(newPath)
    this.localShapeCollection.releaseShapes()
    this.localShapeCollection.addShape(this.v)
    this._mdf = true
    this.paths = this.localShapeCollection
  }
}

/**
 *
 */
function interpolateShape(
  this: any,
  frameNum: number,
  previousValue: any,
  caching: any
) {
  let iterationIndex = caching.lastIndex
  let keyPropS
  let keyPropE
  let isHold
  let k
  let perc
  let vertexValue
  const kf = this.keyframes
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
    let i = iterationIndex
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
    const keyframeMetadata = this.keyframesMetadata[i] || {}
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
        } else {
          fnc = BezierFactory.getBezierEasing(
            keyData.o.x,
            keyData.o.y,
            keyData.i.x,
            keyData.i.y
          ).get
          keyframeMetadata.__fnct = fnc
        }
        perc = fnc(
          (frameNum - (keyData.t - this.offsetTime)) /
            (nextKeyData.t - this.offsetTime - (keyData.t - this.offsetTime))
        )
      }
      keyPropE = nextKeyData.s ? nextKeyData.s[0] : keyData.e[0]
    }
    keyPropS = keyData.s[0]
  }
  const jLen = previousValue._length
  const kLen = keyPropS.i[0].length
  caching.lastIndex = iterationIndex

  for (let j = 0; j < jLen; j++) {
    for (k = 0; k < kLen; k += 1) {
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

/**
 *
 */
function resetShape(this: {
  paths: ShapeCollection
  localShapeCollection: ShapeCollection
}) {
  this.paths = this.localShapeCollection
}

/**
 *
 */
function shapesEqual(shape1: ShapePath, shape2: ShapePath) {
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

/**
 *
 */
function interpolateShapeCurrentTime(this: any) {
  const frameNum = this.comp.renderedFrame - this.offsetTime
  const initTime = this.keyframes[0].t - this.offsetTime
  const endTime = this.keyframes[this.keyframes.length - 1].t - this.offsetTime
  const lastFrame = this._caching.lastFrame
  if (
    !(
      lastFrame !== initialDefaultFrame &&
      ((lastFrame < initTime && frameNum < initTime) ||
        (lastFrame > endTime && frameNum > endTime))
    )
  ) {
    // / /
    this._caching.lastIndex = lastFrame < frameNum ? this._caching.lastIndex : 0
    this.interpolateShape(frameNum, this.pv, this._caching)
    // / /
  }
  this._caching.lastFrame = frameNum
  return this.pv
}
