import type { ShapeData } from '@/types'

import shapePool from '@/utils/pooling/shapePool'
import PropertyFactory, { type PropertyType } from '@/utils/PropertyFactory'
import ShapeModifier from '@/utils/shapes/ShapeModifier'

export default class PuckerAndBloatModifier extends ShapeModifier {
  amount?: PropertyType
  getValue!: () => void
  initModifierProperties(elem: any, data: any) {
    this.getValue = this.processKeys
    this.amount = PropertyFactory.getProp(elem, data.a, 0, null, this)
    this._isAnimated = !!this.amount?.effectsSequence.length
  }

  processPath(path: ShapeData, amount: number) {
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
    const clonedPath = shapePool.newElement<ShapeData>()
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
    let i
    const len = this.shapes.length
    let j
    let jLen
    const amount = this.amount?.v

    if (amount !== 0) {
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
              this.processPath(shapePaths[j], amount)
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
