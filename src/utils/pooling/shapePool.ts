// import ShapeP

import type { ShapeData } from '@/types'
import { pointPool, poolFactory } from '@/utils/pooling'
import ShapePath from '../shapes/ShapePath'

const shapePool = (function () {
  /**
   *
   */
  function create() {
    return new (ShapePath as any)()
  }

  /**
   *
   */
  function release(shapePath: ShapeData) {
    const len = shapePath._length || 0
    let i
    for (i = 0; i < len; i++) {
      pointPool.release(shapePath.v[i])
      pointPool.release(shapePath.i[i])
      pointPool.release(shapePath.o[i])
      shapePath.v[i] = null
      shapePath.i[i] = null
      shapePath.o[i] = null
    }
    shapePath._length = 0
    shapePath.c = false
  }

  /**
   *
   */
  function clone(shape: ShapeData) {
    const cloned = factory.newElement<ShapeData>()
    const len = shape._length === undefined ? shape.v.length : shape._length
    cloned.setLength(len)
    cloned.c = shape.c

    for (let i = 0; i < len; i++) {
      cloned.setTripleAt(
        Number(shape.v[i]?.[0]),
        Number(shape.v[i]?.[1]),
        Number(shape.o[i]?.[0]),
        Number(shape.o[i]?.[1]),
        Number(shape.i[i]?.[0]),
        Number(shape.i[i]?.[1]),
        i
      )
    }
    return cloned
  }

  const factory = {
    ...poolFactory(4, create, release),
    clone,
  }

  return factory
})()

export default shapePool
