import { createSizedArray } from '@/utils/helpers/arrays'
import { pooling } from '@/utils/pooling'
import shapePool from '@/utils/pooling/shapePool'
import ShapeCollection from '@/utils/shapes/ShapeCollection'

const shapeCollectionPool = (function () {
  let _length = 0
  let _maxLength = 4
  let pool = createSizedArray(_maxLength)

  /**
   *
   */
  function newShapeCollection() {
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
  function release(shapeCollection: ShapeCollection) {
    for (let i = 0; i < shapeCollection._length; i++) {
      shapePool.release(shapeCollection.shapes[i])
    }
    shapeCollection._length = 0

    if (_length === _maxLength) {
      pool = pooling.double(pool)
      _maxLength *= 2
    }
    pool[_length] = shapeCollection
    _length += 1
  }

  return {
    newShapeCollection,
    release,
  }
})()

export default shapeCollectionPool
