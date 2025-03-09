import { ArrayType } from '@/enums'
import { getDefaultCurveSegments } from '@/utils/getterSetter'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'

export default class PoolFactory {
  private _create: () => void
  private _length = 0
  private _maxLength: number
  private _release?: <Release = unknown>(el: Release) => void
  private pool: unknown[]
  constructor(
    initialLength: number,
    _create: () => void,
    _release?: <Release = unknown>(el: Release) => void
  ) {
    this._maxLength = initialLength
    this._create = _create
    this._release = _release
    this.pool = createSizedArray(this._maxLength)

    this.newElement = this.newElement.bind(this)
    this.release = this.release.bind(this)
  }
  newElement<T = unknown>() {
    let element
    if (this._length) {
      this._length -= 1
      element = this.pool[this._length]
    } else {
      element = this._create()
    }
    return element as T
  }
  release<T = unknown>(element: T) {
    if (this._length === this._maxLength) {
      this.pool = pooling.double(this.pool)
      this._maxLength *= 2
    }
    if (this._release) {
      this._release(element)
    }
    this.pool[this._length] = element
    this._length += 1
  }
}

export class Pooling {
  static double(arr: unknown[]) {
    return arr.concat(createSizedArray(arr.length))
  }
}

export const pointPool = (() =>
    new PoolFactory(8, () => createTypedArray(ArrayType.Float32, 2)))(),
  bezierLengthPool = (() =>
    new PoolFactory(8, () => ({
      addedLength: 0,
      lengths: createTypedArray(ArrayType.Float32, getDefaultCurveSegments()),
      percents: createTypedArray(ArrayType.Float32, getDefaultCurveSegments()),
    })))(),
  segmentsLengthPool = (() =>
    new PoolFactory(
      8,
      () => ({
        lengths: [],
        totalLength: 0,
      }),
      (element: any) => {
        let i
        const len = element.lengths.length
        for (i = 0; i < len; i++) {
          bezierLengthPool.release(element.lengths[i])
        }
        element.lengths.length = 0
      }
    ))()
