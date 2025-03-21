import type ShapePath from '@/utils/shapes/ShapePath'

import { createSizedArray } from '@/utils/helpers/arrays'
import { release } from '@/utils/pooling/ShapePool'

export default class ShapeCollection {
  public _length: number
  public _maxLength: number
  public shapes: ShapePath[]
  constructor() {
    this._length = 0
    this._maxLength = 4
    this.shapes = createSizedArray(this._maxLength)
  }
  addShape(shapeData: ShapePath) {
    if (this._length === this._maxLength) {
      this.shapes = this.shapes.concat(createSizedArray(this._maxLength))
      this._maxLength *= 2
    }
    this.shapes[this._length] = shapeData
    this._length += 1
  }
  releaseShapes() {
    const { _length } = this
    for (let i = 0; i < _length; i++) {
      release(this.shapes[i])
    }
    this._length = 0
  }
}
