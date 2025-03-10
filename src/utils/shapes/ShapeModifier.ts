import type { CompInterface } from '@/types'
// import type ShapePath from '@/utils/shapes/ShapePath'

import { type SVGShapeData } from '@/elements/helpers/shapes'
import { initialDefaultFrame } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import ShapeCollectionPool from '@/utils/pooling/ShapeCollectionPool'
import { type ShapeProperty } from '@/utils/shapes/ShapeProperty'

class ShapeModifier extends DynamicPropertyContainer {
  closed!: boolean
  elem!: CompInterface
  frameId?: number
  k!: boolean
  shapes!: ShapeProperty[]
  addShape(data: SVGShapeData) {
    // console.log(data)
    if (!this.closed) {
      // Adding shape to dynamic properties. It covers the case where a shape has no effects applied, to reset it's _mdf state on every tick.
      data.sh.container.addDynamicProperty(data.sh)
      const shapeData = {
        data: data,
        localShapeCollection: ShapeCollectionPool.newShapeCollection(),
        shape: data.sh,
      }
      this.shapes.push(shapeData)
      this.addShapeToModifier(shapeData)
      if (this._isAnimated) {
        data.setAsAnimated()
      }
    }
  }
  init(elem: CompInterface, data: any, _a: any, _b: any) {
    this.shapes = []
    this.elem = elem
    this.initDynamicPropertyContainer(elem)
    this.initModifierProperties(elem, data)
    this.frameId = initialDefaultFrame
    this.closed = false
    this.k = false
    if (this.dynamicProperties.length) {
      this.k = true
    } else {
      this.getValue(true)
    }
  }
  processKeys() {
    if (this.elem.globalData.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem.globalData.frameId
    this.iterateDynamicProperties()
  }
}

export default ShapeModifier
