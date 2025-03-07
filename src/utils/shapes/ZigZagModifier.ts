import PolynomialBezier from '@/elements/PolynomialBezier'
import { AnimationDirection, Shape, ShapeData } from '@/types'
import { getProjectingAngle, setPoint } from '@/utils'
import ShapePool from '@/utils/pooling/ShapePool'
import PropertyFactory, { type PropertyType } from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'

class ZigZagModifier extends ShapeModifier {
  amplitude?: PropertyType
  frequency?: PropertyType
  getValue!: () => void
  pointsType?: PropertyType
  static zigZagCorner(
    outputBezier: ShapeData,
    path: ShapeData,
    cur: number,
    amplitude: number,
    frequency: number,
    pointType: number,
    direction: AnimationDirection
  ) {
    const angle = getProjectingAngle(path, cur),
      point = path.v[cur % Number(path._length)],
      prevPoint = path.v[cur === 0 ? Number(path._length) - 1 : cur - 1],
      nextPoint = path.v[(cur + 1) % Number(path._length)],
      prevDist =
        pointType === 2
          ? Math.sqrt(
              Math.pow(Number(point?.[0]) - Number(prevPoint?.[0]), 2) +
                Math.pow(Number(point?.[1]) - Number(prevPoint?.[1]), 2)
            )
          : 0,
      nextDist =
        pointType === 2
          ? Math.sqrt(
              Math.pow(Number(point?.[0]) - Number(nextPoint?.[0]), 2) +
                Math.pow(Number(point?.[1]) - Number(nextPoint?.[1]), 2)
            )
          : 0

    setPoint(
      outputBezier,
      path.v[cur % Number(path._length)] || [0, 0],
      angle,
      direction,
      amplitude,
      nextDist / ((frequency + 1) * 2),
      prevDist / ((frequency + 1) * 2)
      // pointType
    )
  }
  /**
   *
   */
  static zigZagSegment(
    outputBezier: ShapeData,
    segment: any,
    amplitude: number,
    frequency: number,
    pointType: number,
    directionFromProps: AnimationDirection
  ) {
    let direction = directionFromProps
    for (let i = 0; i < frequency; i++) {
      const t = (i + 1) / (frequency + 1),
        dist =
          pointType === 2
            ? Math.sqrt(
                Math.pow(segment.points[3][0] - segment.points[0][0], 2) +
                  Math.pow(segment.points[3][1] - segment.points[0][1], 2)
              )
            : 0,
        angle = segment.normalAngle(t),
        point = segment.point(t)
      setPoint(
        outputBezier,
        point,
        angle,
        direction,
        amplitude,
        dist / ((frequency + 1) * 2),
        dist / ((frequency + 1) * 2)
        // pointType
      )

      direction = -direction as AnimationDirection
    }

    return direction
  }

  initModifierProperties(elem: any, data: Shape) {
    this.getValue = this.processKeys
    this.amplitude = PropertyFactory.getProp(elem, data.s, 0, null, this)
    this.frequency = PropertyFactory.getProp(elem, data.r, 0, null, this)
    this.pointsType = PropertyFactory.getProp(elem, data.pt, 0, null, this)
    this._isAnimated =
      this.amplitude?.effectsSequence.length !== 0 ||
      this.frequency?.effectsSequence.length !== 0 ||
      this.pointsType?.effectsSequence.length !== 0
  }

  processPath(
    path: any,
    amplitude: number,
    frequency: number,
    pointType: number
  ) {
    let count = path._length
    const clonedPath = ShapePool.newElement<ShapeData>()
    clonedPath.c = path.c

    if (!path.c) {
      count -= 1
    }

    if (count === 0) {
      return clonedPath
    }

    let direction: AnimationDirection = -1,
      segment = PolynomialBezier.shapeSegment(path, 0)
    ZigZagModifier.zigZagCorner(
      clonedPath,
      path,
      0,
      amplitude,
      frequency,
      pointType,
      direction
    )

    for (let i = 0; i < count; i++) {
      direction = zigZagSegment(
        clonedPath,
        segment,
        amplitude,
        frequency,
        pointType,
        -direction as AnimationDirection
      )

      if (i === count - 1 && !path.c) {
        segment = null
      } else {
        segment = PolynomialBezier.shapeSegment(path, (i + 1) % count)
      }

      ZigZagModifier.zigZagCorner(
        clonedPath,
        path,
        i + 1,
        amplitude,
        frequency,
        pointType,
        direction as AnimationDirection
      )
    }

    return clonedPath
  }

  processShapes(_isFirstFrame: boolean) {
    let shapePaths
    let i
    const len = this.shapes.length
    let j
    let jLen
    const amplitude = this.amplitude?.v
    const frequency = Math.max(0, Math.round(Number(this.frequency?.v)))
    const pointType = this.pointsType?.v

    if (amplitude !== 0) {
      let shapeData
      let localShapeCollection
      for (i = 0; i < len; i++) {
        shapeData = this.shapes[i]
        localShapeCollection = shapeData.localShapeCollection
        if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection?.releaseShapes()
          shapeData.shape._mdf = true
          shapePaths = shapeData.shape.paths.shapes
          jLen = shapeData.shape.paths._length
          for (j = 0; j < jLen; j++) {
            localShapeCollection?.addShape(
              this.processPath(shapePaths[j], amplitude, frequency, pointType)
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
}

export default ZigZagModifier
