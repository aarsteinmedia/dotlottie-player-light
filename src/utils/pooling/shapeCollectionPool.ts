import { createSizedArray } from '@/utils/helpers/arrays'
import { pooling } from '@/utils/pooling'
import ShapePool from '@/utils/pooling/ShapePool'
import ShapeCollection from '@/utils/shapes/ShapeCollection'

export default class ShapeCollectionPool {
  private static _length = 0
  private static _maxLength = 4
  private static pool = createSizedArray(this._maxLength)
  static newShapeCollection() {
    let shapeCollection
    if (this._length) {
      this._length -= 1
      shapeCollection = this.pool[this._length]
    } else {
      shapeCollection = new ShapeCollection()
    }
    return shapeCollection as ShapeCollection
  }
  static release(shapeCollection: ShapeCollection) {
    for (let i = 0; i < shapeCollection._length; i++) {
      ShapePool.release(shapeCollection.shapes[i])
    }
    shapeCollection._length = 0

    if (this._length === this._maxLength) {
      this.pool = pooling.double(this.pool)
      this._maxLength *= 2
    }
    this.pool[this._length] = shapeCollection
    this._length += 1
  }
}
