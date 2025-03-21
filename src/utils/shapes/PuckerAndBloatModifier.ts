import type { ElementInterfaceIntersect, Shape } from '@/types'
import type { ValueProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'

import { newElement } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'

export default class PuckerAndBloatModifier extends ShapeModifier {
  amount?: ValueProperty
  override initModifierProperties(
    elem: ElementInterfaceIntersect,
    data: Shape
  ) {
    this.getValue = this.processKeys
    this.amount = PropertyFactory.getProp(
      elem,
      data.a,
      0,
      null,
      this
    ) as ValueProperty
    this._isAnimated = !!this.amount?.effectsSequence.length
  }

  processPath(path: ShapePath, amount: number) {
    const percent = amount / 100
    const centerPoint = [0, 0]
    const pathLength = Number(path._length)
    let i = 0
    for (i = 0; i < pathLength; i++) {
      centerPoint[0] += Number(path.v[i]?.[0])
      centerPoint[1] += Number(path.v[i]?.[1])
    }
    centerPoint[0] /= pathLength
    centerPoint[1] /= pathLength
    const clonedPath = newElement<ShapePath>()
    clonedPath.c = path.c
    let vX
    let vY
    let oX
    let oY
    let iX
    let iY
    for (i = 0; i < pathLength; i++) {
      vX =
        Number(path.v[i]?.[0]) +
        (centerPoint[0] - Number(path.v[i]?.[0])) * percent
      vY =
        Number(path.v[i]?.[1]) +
        (centerPoint[1] - Number(path.v[i]?.[1])) * percent
      oX =
        Number(path.o[i]?.[0]) +
        (centerPoint[0] - Number(path.o[i]?.[0])) * -percent
      oY =
        Number(path.o[i]?.[1]) +
        (centerPoint[1] - Number(path.o[i]?.[1])) * -percent
      iX =
        Number(path.i[i]?.[0]) +
        (centerPoint[0] - Number(path.i[i]?.[0])) * -percent
      iY =
        Number(path.i[i]?.[1]) +
        (centerPoint[1] - Number(path.i[i]?.[1])) * -percent
      clonedPath.setTripleAt(vX, vY, oX, oY, iX, iY, i)
    }
    return clonedPath
  }

  processShapes(_isFirstFrame: boolean) {
    let shapePaths
    const { length } = this.shapes || []
    let jLen: number
    const amount = this.amount?.v

    if (amount !== 0) {
      let shapeData
      let localShapeCollection
      for (let i = 0; i < length; i++) {
        shapeData = this.shapes?.[i]
        localShapeCollection = shapeData.localShapeCollection
        if (!(!shapeData.shape._mdf && !this._mdf && !_isFirstFrame)) {
          localShapeCollection?.releaseShapes()
          shapeData.shape._mdf = true
          shapePaths = shapeData.shape.paths.shapes
          jLen = shapeData.shape.paths._length
          for (let j = 0; j < jLen; j++) {
            localShapeCollection?.addShape(
              this.processPath(shapePaths[j], amount as number)
            )
          }
        }
        if (shapeData.localShapeCollection) {
          shapeData.shape.paths = shapeData.localShapeCollection
        }
      }
    }
    if (!this.dynamicProperties?.length) {
      this._mdf = false
    }
  }
}
