import PoolFactory, { pointPool } from '@/utils/pooling'
import ShapePath from '@/utils/shapes/ShapePath'

export default class ShapePool {
  private static _factory = new PoolFactory(4, this._create, this._release)

  static newElement = this._factory.newElement

  static release = this._factory.release

  static clone(shape: ShapePath) {
    const cloned = ShapePool.newElement<ShapePath>()
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

  private static _create() {
    return new ShapePath()
  }

  private static _release(shapePath: ShapePath) {
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
}
