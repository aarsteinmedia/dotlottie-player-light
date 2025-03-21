import type { ValueProperty } from '@/utils/Properties'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'

import { SVGShapeData } from '@/elements/helpers/shapes'
import { ElementInterfaceIntersect, Shape, Vector2 } from '@/types'
import { getNewSegment, getSegmentsLength } from '@/utils/Bezier'
import { segmentsLengthPool } from '@/utils/pooling'
import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'
import ShapePath from '@/utils/shapes/ShapePath'

export default class TrimModifier extends ShapeModifier {
  e?: ValueProperty

  eValue?: number

  m?: Shape['m']
  o?: ValueProperty

  s?: ValueProperty

  sValue?: number

  addPaths(newPaths: ShapePath[], localShapeCollection: ShapeCollection) {
    const { length } = newPaths
    for (let i = 0; i < length; i++) {
      localShapeCollection.addShape(newPaths[i])
    }
  }
  addSegment(
    pt1: Vector2,
    pt2: Vector2,
    pt3: Vector2,
    pt4: Vector2,
    shapePath: ShapePath,
    pos: number,
    newShape?: boolean
  ) {
    shapePath.setXYAt(pt2[0], pt2[1], 'o', pos)
    shapePath.setXYAt(pt3[0], pt3[1], 'i', pos + 1)
    if (newShape) {
      shapePath.setXYAt(pt1[0], pt1[1], 'v', pos)
    }
    shapePath.setXYAt(pt4[0], pt4[1], 'v', pos + 1)
  }
  addSegmentFromArray(
    points: number[],
    shapePath: ShapePath,
    pos: number,
    newShape?: boolean
  ) {
    shapePath.setXYAt(points[1], points[5], 'o', pos)
    shapePath.setXYAt(points[2], points[6], 'i', pos + 1)
    if (newShape) {
      shapePath.setXYAt(points[0], points[4], 'v', pos)
    }
    shapePath.setXYAt(points[3], points[7], 'v', pos + 1)
  }
  addShapes(shapeData: any, shapeSegment: any, shapePathFromProps?: ShapePath) {
    let shapePath = shapePathFromProps
    const pathsData = shapeData.pathsData
    const shapePaths = shapeData.shape.paths.shapes
    let i
    const len = shapeData.shape.paths._length
    let j
    let jLen
    let addedLength = 0
    let currentLengthData
    let segmentCount
    let lengths
    let segment: number[]
    const shapes: ShapePath[] = []
    let initPos
    let newShape = true
    if (shapePath) {
      segmentCount = shapePath._length
      initPos = shapePath._length
    } else {
      shapePath = newElement()
      segmentCount = 0
      initPos = 0
    }
    if (shapePath) {
      shapes.push(shapePath)
    }

    for (i = 0; i < len; i++) {
      if (!shapePath) {
        continue
      }
      lengths = pathsData[i].lengths
      shapePath.c = shapePaths[i].c
      jLen = shapePaths[i].c ? lengths.length : lengths.length + 1
      for (j = 1; j < jLen; j++) {
        currentLengthData = lengths[j - 1]
        if (addedLength + currentLengthData.addedLength < shapeSegment.s) {
          addedLength += currentLengthData.addedLength
          shapePath.c = false
          continue
        }
        if (addedLength > shapeSegment.e) {
          shapePath.c = false
          break
        }
        if (
          shapeSegment.s <= addedLength &&
          shapeSegment.e >= addedLength + currentLengthData.addedLength
        ) {
          this.addSegment(
            shapePaths[i].v[j - 1],
            shapePaths[i].o[j - 1],
            shapePaths[i].i[j],
            shapePaths[i].v[j],
            shapePath,
            segmentCount,
            newShape
          )
          newShape = false
        } else {
          segment = getNewSegment(
            shapePaths[i].v[j - 1],
            shapePaths[i].v[j],
            shapePaths[i].o[j - 1],
            shapePaths[i].i[j],
            (shapeSegment.s - addedLength) / currentLengthData.addedLength,
            (shapeSegment.e - addedLength) / currentLengthData.addedLength,
            lengths[j - 1]
          ) as number[]
          this.addSegmentFromArray(segment, shapePath, segmentCount, newShape)
          newShape = false
          shapePath.c = false
        }
        addedLength += currentLengthData.addedLength
        segmentCount += 1
      }
      if (shapePaths[i].c && lengths.length) {
        currentLengthData = lengths[j - 1]
        if (addedLength <= shapeSegment.e) {
          const segmentLength = lengths[j - 1].addedLength
          if (
            shapeSegment.s <= addedLength &&
            shapeSegment.e >= addedLength + segmentLength
          ) {
            this.addSegment(
              shapePaths[i].v[j - 1],
              shapePaths[i].o[j - 1],
              shapePaths[i].i[0],
              shapePaths[i].v[0],
              shapePath,
              segmentCount,
              newShape
            )
            newShape = false
          } else {
            segment = getNewSegment(
              shapePaths[i].v[j - 1],
              shapePaths[i].v[0],
              shapePaths[i].o[j - 1],
              shapePaths[i].i[0],
              (shapeSegment.s - addedLength) / segmentLength,
              (shapeSegment.e - addedLength) / segmentLength,
              lengths[j - 1]
            ) as number[]
            this.addSegmentFromArray(segment, shapePath, segmentCount, newShape)
            newShape = false
            shapePath.c = false
          }
        } else {
          shapePath.c = false
        }
        addedLength += currentLengthData.addedLength
        segmentCount += 1
      }
      if (shapePath._length) {
        shapePath.setXYAt(
          shapePath.v[initPos][0],
          shapePath.v[initPos][1],
          'i',
          initPos
        )
        shapePath.setXYAt(
          shapePath.v[shapePath._length - 1][0],
          shapePath.v[shapePath._length - 1][1],
          'o',
          shapePath._length - 1
        )
      }
      if (addedLength > shapeSegment.e) {
        break
      }
      if (i < len - 1) {
        shapePath = newElement()
        newShape = true
        if (shapePath) {
          shapes.push(shapePath)
        }

        segmentCount = 0
      }
    }
    return shapes
  }
  override addShapeToModifier(shapeData: SVGShapeData) {
    ;(shapeData as any).pathsData = [] // TODO: Find cases and drill for types
  }
  calculateShapeEdges(
    s: any,
    e: any,
    shapeLength: number,
    addedLength: number,
    totalModifierLength: number
  ) {
    const segments = []
    if (e <= 1) {
      segments.push({
        e,
        s,
      })
    } else if (s >= 1) {
      segments.push({
        e: e - 1,
        s: s - 1,
      })
    } else {
      segments.push({
        e: 1,
        s: s,
      })
      segments.push({
        e: e - 1,
        s: 0,
      })
    }
    const shapeSegments = []
    const { length } = segments
    for (let i = 0; i < length; i++) {
      if (
        !(
          segments[i].e * totalModifierLength < addedLength ||
          segments[i].s * totalModifierLength > addedLength + shapeLength
        )
      ) {
        let shapeS
        let shapeE
        if (segments[i].s * totalModifierLength <= addedLength) {
          shapeS = 0
        } else {
          shapeS =
            (segments[i].s * totalModifierLength - addedLength) / shapeLength
        }
        if (segments[i].e * totalModifierLength >= addedLength + shapeLength) {
          shapeE = 1
        } else {
          shapeE =
            (segments[i].e * totalModifierLength - addedLength) / shapeLength
        }
        shapeSegments.push([shapeS, shapeE])
      }
    }
    if (!shapeSegments.length) {
      shapeSegments.push([0, 0])
    }
    return shapeSegments
  }

  override initModifierProperties(
    elem: ElementInterfaceIntersect,
    data: Shape
  ) {
    this.s = PropertyFactory.getProp(
      elem,
      data.s,
      0,
      0.01,
      this
    ) as ValueProperty
    this.e = PropertyFactory.getProp(
      elem,
      data.e,
      0,
      0.01,
      this
    ) as ValueProperty
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0, this) as ValueProperty
    this.sValue = 0
    this.eValue = 0
    this.getValue = this.processKeys
    this.m = data.m
    this._isAnimated =
      !!this.s.effectsSequence.length ||
      !!this.e.effectsSequence.length ||
      !!this.o.effectsSequence.length
  }

  processShapes(_isFirstFrame: boolean) {
    let s
    let e
    if (this._mdf || _isFirstFrame) {
      let o = (Number(this.o?.v) % 360) / 360
      if (o < 0) {
        o += 1
      }
      if (Number(this.s?.v) > 1) {
        s = 1 + o
      } else if (Number(this.s?.v) < 0) {
        s = 0 + o
      } else {
        s = Number(this.s?.v) + o
      }
      if (Number(this.e?.v) > 1) {
        e = 1 + o
      } else if (Number(this.e?.v) < 0) {
        e = 0 + o
      } else {
        e = Number(this.e?.v) + o
      }

      if (s > e) {
        const _s = s
        s = e
        e = _s
      }
      s = Math.round(s * 10000) * 0.0001
      e = Math.round(e * 10000) * 0.0001
      this.sValue = s
      this.eValue = e
    } else {
      s = this.sValue
      e = this.eValue
    }
    let shapePaths
    let i
    const { length } = this.shapes || []
    let j
    let jLen
    let pathsData
    let pathData
    let totalShapeLength
    let totalModifierLength = 0

    if (e === s) {
      for (i = 0; i < length; i++) {
        this.shapes?.[i].localShapeCollection.releaseShapes()
        if (this.shapes) {
          this.shapes[i].shape._mdf = true
          this.shapes[i].shape.paths = this.shapes?.[i].localShapeCollection
          if (this._mdf) {
            this.shapes[i].pathsData.length = 0
          }
        }
      }
    } else if (!((e === 1 && s === 0) || (e === 0 && s === 1))) {
      const segments = []
      let shapeData
      let localShapeCollection
      for (i = 0; i < length; i++) {
        shapeData = this.shapes?.[i]
        // if shape hasn't changed and trim properties haven't changed, cached previous path can be used
        if (
          !shapeData.shape._mdf &&
          !this._mdf &&
          !_isFirstFrame &&
          this.m !== 2
        ) {
          shapeData.shape.paths = shapeData.localShapeCollection
        } else {
          shapePaths = shapeData.shape.paths
          jLen = shapePaths._length
          totalShapeLength = 0
          if (!shapeData.shape._mdf && shapeData.pathsData.length) {
            totalShapeLength = shapeData.totalShapeLength
          } else {
            pathsData = this.releasePathsData(shapeData.pathsData)
            for (j = 0; j < jLen; j++) {
              pathData = getSegmentsLength(shapePaths.shapes[j])
              pathsData.push(pathData)
              totalShapeLength += pathData.totalLength
            }
            shapeData.totalShapeLength = totalShapeLength
            shapeData.pathsData = pathsData
          }

          totalModifierLength += totalShapeLength
          shapeData.shape._mdf = true
        }
      }
      let shapeS = s
      let shapeE = e
      let addedLength = 0
      let edges
      for (i = length - 1; i >= 0; i--) {
        shapeData = this.shapes?.[i]
        if (shapeData.shape._mdf) {
          localShapeCollection = shapeData.localShapeCollection
          localShapeCollection.releaseShapes()
          if (this.m === 2 && length > 1) {
            edges = this.calculateShapeEdges(
              s,
              e,
              shapeData.totalShapeLength,
              addedLength,
              totalModifierLength
            )
            addedLength += shapeData.totalShapeLength
          } else {
            edges = [[shapeS, shapeE]]
          }
          jLen = edges.length
          for (j = 0; j < jLen; j++) {
            shapeS = Number(edges[j][0])
            shapeE = Number(edges[j][1])
            segments.length = 0
            if (shapeE <= 1) {
              segments.push({
                e: shapeData.totalShapeLength * shapeE,
                s: shapeData.totalShapeLength * shapeS,
              })
            } else if (shapeS >= 1) {
              segments.push({
                e: shapeData.totalShapeLength * (shapeE - 1),
                s: shapeData.totalShapeLength * (shapeS - 1),
              })
            } else {
              segments.push({
                e: shapeData.totalShapeLength,
                s: shapeData.totalShapeLength * shapeS,
              })
              segments.push({
                e: shapeData.totalShapeLength * (shapeE - 1),
                s: 0,
              })
            }
            let newShapesData = this.addShapes(shapeData, segments[0])
            if (segments[0].s !== segments[0].e) {
              if (segments.length > 1) {
                const lastShapeInCollection =
                  shapeData.shape.paths.shapes[
                    shapeData.shape.paths._length - 1
                  ]
                if (lastShapeInCollection.c) {
                  const lastShape = newShapesData.pop()
                  this.addPaths(newShapesData, localShapeCollection)
                  newShapesData = this.addShapes(
                    shapeData,
                    segments[1],
                    lastShape
                  )
                } else {
                  this.addPaths(newShapesData, localShapeCollection)
                  newShapesData = this.addShapes(shapeData, segments[1])
                }
              }
              this.addPaths(newShapesData, localShapeCollection)
            }
          }
          shapeData.shape.paths = localShapeCollection
        }
      }
    } else if (this._mdf) {
      for (i = 0; i < length; i++) {
        // Releasign Trim Cached paths data when no trim applied in case shapes are modified inbetween.
        // Don't remove this even if it's losing cached info.
        if (!this.shapes) {
          continue
        }
        this.shapes[i].pathsData.length = 0
        this.shapes[i].shape._mdf = true
      }
    }
  }

  releasePathsData(pathsData: any) {
    const len = pathsData.length
    for (let i = 0; i < len; i++) {
      segmentsLengthPool.release(pathsData[i])
    }
    pathsData.length = 0
    return pathsData
  }
}
