import shapeCollectionPool from '@/utils/pooling/shapeCollectionPool'
import { initialDefaultFrame } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import { extendPrototype } from '@/utils/functionExtensions'

export default function ShapeModifier() {}
ShapeModifier.prototype.initModifierProperties = function () {}
ShapeModifier.prototype.addShapeToModifier = function () {}
ShapeModifier.prototype.addShape = function (data: any) {
  if (!this.closed) {
    // Adding shape to dynamic properties. It covers the case where a shape has no effects applied, to reset it's _mdf state on every tick.
    data.sh?.container.addDynamicProperty(data.sh)
    const shapeData = {
      data: data,
      localShapeCollection: shapeCollectionPool.newShapeCollection(),
      shape: data.sh,
    }
    this.shapes.push(shapeData)
    this.addShapeToModifier(shapeData)
    if (this._isAnimated) {
      data.setAsAnimated()
    }
  }
}
ShapeModifier.prototype.init = function (elem: any, data: any) {
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
ShapeModifier.prototype.processKeys = function () {
  if (this.elem.globalData.frameId === this.frameId) {
    return
  }
  this.frameId = this.elem.globalData.frameId
  this.iterateDynamicProperties()
}

extendPrototype([DynamicPropertyContainer], ShapeModifier)
