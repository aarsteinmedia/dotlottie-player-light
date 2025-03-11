import type { ElementInterface, Shape } from '@/types'
import type { ValueProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'

import { roundCorner } from '@/utils/getterSetter'
import ShapePool from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'

export default class RoundCornersModifier extends ShapeModifier {
  rd?: ValueProperty
  override initModifierProperties(elem: ElementInterface, data: Shape) {
    this.getValue = this.processKeys
    this.rd = PropertyFactory.getProp(elem, data.r, 0, null, this)
    this._isAnimated = !!this.rd?.effectsSequence.length
  }

  processPath(path: ShapePath, round: number) {
    const clonedPath = ShapePool.newElement<ShapePath>()
    clonedPath.c = path.c
    const len = Number(path._length)
    let currentV
    let currentI
    let currentO
    let closerV
    let distance
    let newPosPerc
    let index = 0
    let vX
    let vY
    let oX
    let oY
    let iX
    let iY
    for (let i = 0; i < len; i++) {
      currentV = path.v[i]
      currentO = path.o[i]
      currentI = path.i[i]
      if (
        currentV?.[0] === currentO?.[0] &&
        currentV?.[1] === currentO?.[1] &&
        currentV?.[0] === currentI?.[0] &&
        currentV?.[1] === currentI?.[1]
      ) {
        if ((i === 0 || i === len - 1) && !path.c) {
          clonedPath.setTripleAt(
            Number(currentV?.[0]),
            Number(currentV?.[1]),
            Number(currentO?.[0]),
            Number(currentO?.[1]),
            Number(currentI?.[0]),
            Number(currentI?.[1]),
            index
          )
          /* clonedPath.v[index] = currentV;
                clonedPath.o[index] = currentO;
                clonedPath.i[index] = currentI; */
          index += 1
        } else {
          if (i === 0) {
            closerV = path.v[len - 1]
          } else {
            closerV = path.v[i - 1]
          }
          distance = Math.sqrt(
            Math.pow(Number(currentV?.[0]) - Number(closerV?.[0]), 2) +
              Math.pow(Number(currentV?.[1]) - Number(closerV?.[1]), 2)
          )
          newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0
          iX =
            Number(currentV?.[0]) +
            (Number(closerV?.[0]) - Number(currentV?.[0])) * newPosPerc
          vX = iX
          iY =
            Number(currentV?.[1]) -
            (Number(currentV?.[1]) - Number(closerV?.[1])) * newPosPerc
          vY = iY
          oX = vX - (vX - Number(currentV?.[0])) * roundCorner
          oY = vY - (vY - Number(currentV?.[1])) * roundCorner
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index)
          index += 1

          if (i === len - 1) {
            closerV = path.v[0]
          } else {
            closerV = path.v[i + 1]
          }
          distance = Math.sqrt(
            Math.pow(Number(currentV?.[0]) - Number(closerV?.[0]), 2) +
              Math.pow(Number(currentV?.[1]) - Number(closerV?.[1]), 2)
          )
          newPosPerc = distance ? Math.min(distance / 2, round) / distance : 0
          oX =
            Number(currentV?.[0]) +
            (Number(closerV?.[0]) - Number(currentV?.[0])) * newPosPerc
          vX = oX
          oY =
            Number(currentV?.[1]) +
            (Number(closerV?.[1]) - Number(currentV?.[1])) * newPosPerc
          vY = oY
          iX = vX - (vX - Number(currentV?.[0])) * roundCorner
          iY = vY - (vY - Number(currentV?.[1])) * roundCorner
          clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, index)
          index += 1
        }
      } else {
        clonedPath.setTripleAt(
          Number(path.v[i]?.[0]),
          Number(path.v[i]?.[1]),
          Number(path.o[i]?.[0]),
          Number(path.o[i]?.[1]),
          Number(path.i[i]?.[0]),
          Number(path.i[i]?.[1]),
          index
        )
        index += 1
      }
    }
    return clonedPath
  }

  processShapes(_isFirstFrame: boolean) {
    let shapePaths
    let i
    const len = this.shapes.length
    let j
    let jLen
    const rd = this.rd?.v

    if (rd !== 0) {
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
              this.processPath(shapePaths[j], rd as number)
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
