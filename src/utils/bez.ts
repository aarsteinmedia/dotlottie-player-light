import type { ShapeData, Vector2 } from '@/types'

import { ArrayType } from '@/enums'
import { getDefaultCurveSegments } from '@/utils/getterSetter'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'
import { bezierLengthPool, segmentsLengthPool } from '@/utils/pooling'
/**
 *
 */
export default function bezFunction() {
  /**
   *
   */
  function pointOnLine2D(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    const det1 = x1 * y2 + y1 * x3 + x2 * y3 - x3 * y2 - y3 * x1 - x2 * y1
    return det1 > -0.001 && det1 < 0.001
  }

  /**
   *
   */
  function pointOnLine3D(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    x3: number,
    y3: number,
    z3: number
  ) {
    if (z1 === 0 && z2 === 0 && z3 === 0) {
      return pointOnLine2D(x1, y1, x2, y2, x3, y3)
    }
    const dist1 = Math.sqrt(
      Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
    )
    const dist2 = Math.sqrt(
      Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2) + Math.pow(z3 - z1, 2)
    )
    const dist3 = Math.sqrt(
      Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2) + Math.pow(z3 - z2, 2)
    )
    let diffDist: number
    if (dist1 > dist2) {
      if (dist1 > dist3) {
        diffDist = dist1 - dist2 - dist3
      } else {
        diffDist = dist3 - dist2 - dist1
      }
    } else if (dist3 > dist2) {
      diffDist = dist3 - dist2 - dist1
    } else {
      diffDist = dist2 - dist1 - dist3
    }
    return diffDist > -0.0001 && diffDist < 0.0001
  }

  const getBezierLength = (
    () => (pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2) => {
      const curveSegments = getDefaultCurveSegments()
      let ptCoord
      let perc
      let addedLength = 0
      let ptDistance
      const point = []
      const lastPoint = []
      const lengthData: {
        percents: number[]
        lengths: number[]
        addedLength: number
      } = bezierLengthPool.newElement()
      const len = pt3.length
      for (let k = 0; k < curveSegments; k++) {
        perc = k / (curveSegments - 1)
        ptDistance = 0
        for (let i = 0; i < len; i++) {
          ptCoord =
            Math.pow(1 - perc, 3) * pt1[i] +
            3 * Math.pow(1 - perc, 2) * perc * pt3[i] +
            3 * (1 - perc) * Math.pow(perc, 2) * pt4[i] +
            Math.pow(perc, 3) * pt2[i]
          point[i] = ptCoord
          if (lastPoint[i] !== null) {
            ptDistance += Math.pow(point[i] - lastPoint[i], 2)
          }
          lastPoint[i] = point[i]
        }
        if (ptDistance) {
          ptDistance = Math.sqrt(ptDistance)
          addedLength += ptDistance
        }
        lengthData.percents[k] = perc
        lengthData.lengths[k] = addedLength
      }
      lengthData.addedLength = addedLength
      return lengthData
    }
  )()

  /**
   *
   */
  function getSegmentsLength(shapeData: ShapeData) {
    const segmentsLength: {
      lengths: any[]
      totalLength: number
    } = segmentsLengthPool.newElement()
    const closed = shapeData.c
    const pathV = shapeData.v
    const pathO = shapeData.o
    const pathI = shapeData.i
    let i
    const len = shapeData._length || 0
    const lengths = segmentsLength.lengths
    let totalLength = 0
    for (i = 0; i < len - 1; i++) {
      lengths[i] = getBezierLength(
        pathV[i] as Vector2,
        pathV[i + 1] as Vector2,
        pathO[i] as Vector2,
        pathI[i + 1] as Vector2
      )
      totalLength += lengths[i].addedLength
    }
    if (closed && len) {
      lengths[i] = getBezierLength(
        pathV[i] as Vector2,
        pathV[0] as Vector2,
        pathO[i] as Vector2,
        pathI[0] as Vector2
      )
      totalLength += lengths[i].addedLength
    }
    segmentsLength.totalLength = totalLength
    return segmentsLength
  }

  /**
   *
   */
  function BezierData(this: any, length: number) {
    this.segmentLength = 0
    this.points = new Array(length)
  }

  /**
   *
   */
  function PointData(this: any, partial: number, point: Vector2) {
    this.partialLength = partial
    this.point = point
  }

  const buildBezierData = (() => {
    const storedData = {} as any

    return function (pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2) {
      const bezierName = `${pt1[0]}_${pt1[1]}_${pt2[0]}_${pt2[1]}_${pt3[0]}_${
        pt3[1]
      }_${pt4[0]}_${pt4[1]}`.replace(/\./g, 'p')
      if (!storedData[bezierName]) {
        let curveSegments = getDefaultCurveSegments()
        let k
        let i
        let ptCoord
        let perc
        let addedLength = 0
        let ptDistance
        let point
        let lastPoint = null
        if (
          pt1.length === 2 &&
          (pt1[0] !== pt2[0] || pt1[1] !== pt2[1]) &&
          pointOnLine2D(
            pt1[0],
            pt1[1],
            pt2[0],
            pt2[1],
            pt1[0] + pt3[0],
            pt1[1] + pt3[1]
          ) &&
          pointOnLine2D(
            pt1[0],
            pt1[1],
            pt2[0],
            pt2[1],
            pt2[0] + pt4[0],
            pt2[1] + pt4[1]
          )
        ) {
          curveSegments = 2
        }
        const bezierData = new (BezierData as any)(curveSegments)
        const len = pt3.length
        for (k = 0; k < curveSegments; k += 1) {
          point = createSizedArray(len)
          perc = k / (curveSegments - 1)
          ptDistance = 0
          for (i = 0; i < len; i++) {
            ptCoord =
              Math.pow(1 - perc, 3) * pt1[i] +
              3 * Math.pow(1 - perc, 2) * perc * (pt1[i] + pt3[i]) +
              3 * (1 - perc) * Math.pow(perc, 2) * (pt2[i] + pt4[i]) +
              Math.pow(perc, 3) * pt2[i]
            point[i] = ptCoord
            if (lastPoint !== null) {
              ptDistance += Math.pow(Number(point[i]) - Number(lastPoint[i]), 2)
            }
          }
          ptDistance = Math.sqrt(ptDistance)
          addedLength += ptDistance
          bezierData.points[k] = new (PointData as any)(ptDistance, point)
          lastPoint = point
        }
        bezierData.segmentLength = addedLength
        storedData[bezierName] = bezierData
      }
      return storedData[bezierName]
    }
  })()

  /**
   *
   */
  function getDistancePerc(perc: number, bezierData: any) {
    const percents = bezierData.percents
    const lengths = bezierData.lengths
    const len = percents.length
    let initPos = Math.floor((len - 1) * perc)
    const lengthPos = perc * bezierData.addedLength
    let lPerc = 0
    if (
      initPos === len - 1 ||
      initPos === 0 ||
      lengthPos === lengths[initPos]
    ) {
      return percents[initPos]
    }
    const dir = lengths[initPos] > lengthPos ? -1 : 1
    let flag = true
    while (flag) {
      if (lengths[initPos] <= lengthPos && lengths[initPos + 1] > lengthPos) {
        lPerc =
          (lengthPos - lengths[initPos]) /
          (lengths[initPos + 1] - lengths[initPos])
        flag = false
      } else {
        initPos += dir
      }
      if (initPos < 0 || initPos >= len - 1) {
        // FIX for TypedArrays that don't store floating point values with enough accuracy
        if (initPos === len - 1) {
          return percents[initPos]
        }
        flag = false
      }
    }
    return (
      percents[initPos] + (percents[initPos + 1] - percents[initPos]) * lPerc
    )
  }

  /**
   *
   */
  function getPointInSegment(
    pt1: Vector2,
    pt2: Vector2,
    pt3: Vector2,
    pt4: Vector2,
    percent: number,
    bezierData: unknown
  ): Vector2 {
    const t1 = getDistancePerc(percent, bezierData)
    const u1 = 1 - t1
    const ptX =
      Math.round(
        (u1 * u1 * u1 * pt1[0] +
          (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[0] +
          (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[0] +
          t1 * t1 * t1 * pt2[0]) *
          1000
      ) / 1000
    const ptY =
      Math.round(
        (u1 * u1 * u1 * pt1[1] +
          (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * pt3[1] +
          (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * pt4[1] +
          t1 * t1 * t1 * pt2[1]) *
          1000
      ) / 1000
    return [ptX, ptY]
  }

  const bezierSegmentPoints = createTypedArray(ArrayType.Float32, 8)

  /**
   *
   */
  function getNewSegment(
    pt1: number[],
    pt2: number[],
    pt3: number[],
    pt4: number[],
    startPerc: number,
    endPerc: number,
    bezierData: unknown
  ) {
    if (startPerc < 0) {
      // TODO:
      // eslint-disable-next-line no-param-reassign
      startPerc = 0
    } else if (startPerc > 1) {
      // TODO:
      // eslint-disable-next-line no-param-reassign
      startPerc = 1
    }
    const t0 = getDistancePerc(startPerc, bezierData)
    // TODO:
    // eslint-disable-next-line no-param-reassign
    endPerc = endPerc > 1 ? 1 : endPerc
    const t1 = getDistancePerc(endPerc, bezierData)
    const u0 = 1 - t0
    const u1 = 1 - t1
    const u0u0u0 = u0 * u0 * u0
    const t0u0u0_3 = t0 * u0 * u0 * 3
    const t0t0u0_3 = t0 * t0 * u0 * 3
    const t0t0t0 = t0 * t0 * t0
    //
    const u0u0u1 = u0 * u0 * u1
    const t0u0u1_3 = t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1
    const t0t0u1_3 = t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1
    const t0t0t1 = t0 * t0 * t1
    //
    const u0u1u1 = u0 * u1 * u1
    const t0u1u1_3 = t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1
    const t0t1u1_3 = t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1
    const t0t1t1 = t0 * t1 * t1
    //
    const u1u1u1 = u1 * u1 * u1
    const t1u1u1_3 = t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1
    const t1t1u1_3 = t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1
    const t1t1t1 = t1 * t1 * t1
    for (let i = 0; i < pt1.length; i++) {
      bezierSegmentPoints[i * 4] =
        Math.round(
          (u0u0u0 * pt1[i] +
            t0u0u0_3 * pt3[i] +
            t0t0u0_3 * pt4[i] +
            t0t0t0 * pt2[i]) *
            1000
        ) / 1000
      bezierSegmentPoints[i * 4 + 1] =
        Math.round(
          (u0u0u1 * pt1[i] +
            t0u0u1_3 * pt3[i] +
            t0t0u1_3 * pt4[i] +
            t0t0t1 * pt2[i]) *
            1000
        ) / 1000
      bezierSegmentPoints[i * 4 + 2] =
        Math.round(
          (u0u1u1 * pt1[i] +
            t0u1u1_3 * pt3[i] +
            t0t1u1_3 * pt4[i] +
            t0t1t1 * pt2[i]) *
            1000
        ) / 1000
      bezierSegmentPoints[i * 4 + 3] =
        Math.round(
          (u1u1u1 * pt1[i] +
            t1u1u1_3 * pt3[i] +
            t1t1u1_3 * pt4[i] +
            t1t1t1 * pt2[i]) *
            1000
        ) / 1000
    }

    return bezierSegmentPoints
  }

  return {
    buildBezierData,
    getNewSegment,
    getPointInSegment,
    getSegmentsLength,
    pointOnLine2D,
    pointOnLine3D,
  }
}
