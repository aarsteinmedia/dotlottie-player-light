import { createSizedArray } from '@/utils/helpers/arrays'
import { double } from '@/utils/pooling'
import { release } from '@/utils/pooling/ShapePool'
import ShapeCollection from '@/utils/shapes/ShapeCollection'

let _length = 0,
  _maxLength = 4,
  pool = createSizedArray(_maxLength)
/**
 *
 */
export function newShapeCollection() {
  let shapeCollection
  if (_length) {
    _length -= 1
    shapeCollection = pool[_length]
  } else {
    shapeCollection = new ShapeCollection()
  }
  return shapeCollection as ShapeCollection
}
/**
 *
 */
export function releaseShape(shapeCollection: ShapeCollection) {
  for (let i = 0; i < shapeCollection._length; i++) {
    release(shapeCollection.shapes[i])
  }
  shapeCollection._length = 0

  if (_length === _maxLength) {
    pool = double(pool)
    _maxLength *= 2
  }
  pool[_length] = shapeCollection
  _length += 1
}
