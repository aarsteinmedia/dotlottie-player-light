import type { ElementInterfaceIntersect, Shape } from '@/types'

import { type SVGShapeData } from '@/elements/helpers/shapes'
import { initialDefaultFrame } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import ShapeCollectionPool from '@/utils/pooling/ShapeCollectionPool'

class ShapeModifier extends DynamicPropertyContainer {
  // addShapeToModifier!: (data: SVGShapeData) => void
  closed!: boolean
  elem!: ElementInterfaceIntersect
  frameId?: number
  k!: boolean
  shapes!: any[]
  addShape(data: SVGShapeData) {
    // console.log(data)
    if (!this.closed) {
      // Adding shape to dynamic properties. It covers the case where a shape has no effects applied, to reset it's _mdf state on every tick.
      data.sh.container.addDynamicProperty(data.sh as any)
      const shapeData = {
        data: data,
        localShapeCollection: ShapeCollectionPool.newShapeCollection(),
        shape: data.sh,
      } as unknown as SVGShapeData
      this.shapes.push(shapeData)
      this.addShapeToModifier(shapeData)
      if (this._isAnimated) {
        data.setAsAnimated()
      }
    }
  }
  addShapeToModifier(_shapeData: SVGShapeData) {}
  init(elem: ElementInterfaceIntersect, data: any, _a: any, _b: any) {
    this.shapes = []
    this.elem = elem
    this.initDynamicPropertyContainer(elem)
    this.initModifierProperties?.(elem, data)
    this.frameId = initialDefaultFrame
    this.closed = false
    this.k = false
    if (this.dynamicProperties.length) {
      this.k = true
    } else {
      this.getValue(true)
    }
  }
  initModifierProperties(_elem: ElementInterfaceIntersect, _data: Shape) {}
  isAnimatedWithShape(_data: Shape) {}

  processKeys() {
    if (this.elem.globalData.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem.globalData.frameId
    this.iterateDynamicProperties()
  }
}

export default ShapeModifier
