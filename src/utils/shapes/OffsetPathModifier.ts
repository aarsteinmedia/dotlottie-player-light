import { ShapeData } from '@/types'
import PolynomialBezier from '@/elements/PolynomialBezier'
import {
  joinLines,
  offsetSegmentSplit,
  pointEqual,
  pruneIntersections,
} from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'
import shapePool from '@/utils/pooling/shapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'

export default function OffsetPathModifier() {}

extendPrototype([ShapeModifier], OffsetPathModifier)
OffsetPathModifier.prototype.initModifierProperties = function (
  elem: any,
  data: any
) {
  this.getValue = this.processKeys
  this.amount = PropertyFactory.getProp(elem, data.a, 0, null, this)
  this.miterLimit = PropertyFactory.getProp(elem, data.ml, 0, null, this)
  this.lineJoin = data.lj
  this._isAnimated = this.amount.effectsSequence.length !== 0
}

OffsetPathModifier.prototype.processPath = function (
  inputBezier: ShapeData,
  amount: number,
  lineJoin: number,
  miterLimit: number
) {
  const outputBezier = shapePool.newElement<ShapeData>()
  outputBezier.c = inputBezier.c
  let count = inputBezier.length()
  if (!inputBezier.c) {
    count -= 1
  }
  let segment
  let multiSegments = []

  for (let i = 0; i < count; i++) {
    segment = PolynomialBezier.shapeSegment(inputBezier, i)
    multiSegments.push(offsetSegmentSplit(segment, amount))
  }

  if (!inputBezier.c) {
    for (let i = count - 1; i >= 0; i--) {
      segment = PolynomialBezier.shapeSegmentInverted(inputBezier, i)
      multiSegments.push(offsetSegmentSplit(segment, amount))
    }
  }

  multiSegments = pruneIntersections(multiSegments)

  // Add bezier segments to the output and apply line joints
  let lastPoint = null
  let lastSeg = null

  const { length } = multiSegments
  for (let i = 0; i < length; i++) {
    const multiSegment = multiSegments[i]

    if (lastSeg) {
      lastPoint = joinLines(
        outputBezier,
        lastSeg,
        multiSegment[0],
        lineJoin,
        miterLimit
      )
    }

    lastSeg = multiSegment[multiSegment.length - 1]

    const { length: mLength } = multiSegment
    for (let j = 0; j < mLength; j++) {
      segment = multiSegment[j]

      if (lastPoint && pointEqual(segment.points[0], lastPoint)) {
        outputBezier.setXYAt(
          segment.points[1][0],
          segment.points[1][1],
          'o',
          outputBezier.length() - 1
        )
      } else {
        outputBezier.setTripleAt(
          segment.points[0][0],
          segment.points[0][1],
          segment.points[1][0],
          segment.points[1][1],
          segment.points[0][0],
          segment.points[0][1],
          outputBezier.length()
        )
      }

      outputBezier.setTripleAt(
        segment.points[3][0],
        segment.points[3][1],
        segment.points[3][0],
        segment.points[3][1],
        segment.points[2][0],
        segment.points[2][1],
        outputBezier.length()
      )

      lastPoint = segment.points[3]
    }
  }

  if (multiSegments.length) {
    joinLines(outputBezier, lastSeg, multiSegments[0][0], lineJoin, miterLimit)
  }

  return outputBezier
}

OffsetPathModifier.prototype.processShapes = function (_isFirstFrame: boolean) {
  let shapePaths
  let i
  const len = this.shapes.length
  let j
  let jLen
  const amount = this.amount.v
  const miterLimit = this.miterLimit.v
  const lineJoin = this.lineJoin

  if (amount !== 0) {
    let shapeData
    let localShapeCollection
    for (i = 0; i < len; i++) {
      shapeData = this.shapes[i]
      localShapeCollection = shapeData.localShapeCollection
      if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
        localShapeCollection.releaseShapes()
        shapeData.shape._mdf = true
        shapePaths = shapeData.shape.paths.shapes
        jLen = shapeData.shape.paths._length
        for (j = 0; j < jLen; j++) {
          localShapeCollection.addShape(
            this.processPath(shapePaths[j], amount, lineJoin, miterLimit)
          )
        }
      }
      shapeData.shape.paths = shapeData.localShapeCollection
    }
  }
  if (!this.dynamicProperties.length) {
    this._mdf = false
  }
}
