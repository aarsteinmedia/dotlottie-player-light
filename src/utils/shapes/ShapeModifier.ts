import type {
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  Shape,
} from '@/types'

import { type SVGShapeData } from '@/elements/helpers/shapes'
import { initialDefaultFrame } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import { newShapeCollection } from '@/utils/pooling/ShapeCollectionPool'

export default class ShapeModifier extends DynamicPropertyContainer {
  closed?: boolean
  elem?: ElementInterfaceIntersect
  frameId?: number
  k?: boolean
  shapes?: any[]
  addShape(data: SVGShapeData) {
    if (!this.closed) {
      // Adding shape to dynamic properties. It covers the case where a shape has no effects applied, to reset it's _mdf state on every tick.
      data.sh.container?.addDynamicProperty(data.sh as any)
      const shapeData = {
        data: data,
        localShapeCollection: newShapeCollection(),
        shape: data.sh,
      } as unknown as SVGShapeData
      this.shapes?.push(shapeData)
      this.addShapeToModifier(shapeData)
      if (this._isAnimated) {
        data.setAsAnimated()
      }
    }
  }
  addShapeToModifier(_shapeData: SVGShapeData) {}
  init(elem: ElementInterfaceIntersect, data?: any, _a?: any, _b?: any) {
    this.shapes = []
    this.elem = elem as ElementInterfaceIntersect
    this.initDynamicPropertyContainer(elem)
    this.initModifierProperties?.(elem, data)
    this.frameId = initialDefaultFrame
    this.closed = false
    this.k = false
    if (this.dynamicProperties?.length) {
      this.k = true
    } else {
      this.getValue(true)
    }
  }
  initModifierProperties(_elem: ElementInterfaceUnion, _data: Shape) {}
  isAnimatedWithShape(_data: Shape) {}

  processKeys() {
    if (this.elem?.globalData.frameId === this.frameId) {
      return
    }
    this.frameId = this.elem?.globalData.frameId
    this.iterateDynamicProperties()
  }
}
