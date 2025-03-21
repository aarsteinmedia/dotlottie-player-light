import PoolFactory, { pointPool } from '@/utils/pooling'
import ShapePath from '@/utils/shapes/ShapePath'

const _factory = new PoolFactory(4, _create, _release as any)

export const newElement = _factory.newElement,
  release = _factory.release

/**
 *
 */
export function clone(shape: ShapePath) {
  const cloned = newElement<ShapePath>()
  const len = shape._length === undefined ? shape.v.length : shape._length
  cloned.setLength(len)
  cloned.c = shape.c

  for (let i = 0; i < len; i++) {
    cloned.setTripleAt(
      shape.v[i][0],
      shape.v[i][1],
      shape.o[i][0],
      shape.o[i][1],
      shape.i[i][0],
      shape.i[i][1],
      i
    )
  }
  return cloned
}

/**
 *
 */
function _create() {
  return new ShapePath()
}

/**
 *
 */
function _release(shapePath: ShapePath) {
  const len = shapePath._length
  for (let i = 0; i < len; i++) {
    pointPool.release(shapePath.v[i])
    pointPool.release(shapePath.i[i])
    pointPool.release(shapePath.o[i])
    shapePath.v[i] = null as any
    shapePath.i[i] = null as any
    shapePath.o[i] = null as any
  }
  shapePath._length = 0
  shapePath.c = false
}
