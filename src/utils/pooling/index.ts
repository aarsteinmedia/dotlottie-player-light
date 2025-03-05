import { getDefaultCurveSegments } from '@/utils/getterSetter'
import { ArrayType } from '@/enums'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'

export const poolFactory = <Release = unknown>(
    initialLength: number,
    _create: () => void,
    _release?: (el: Release) => void
  ) => {
    let _length = 0
    let _maxLength = initialLength
    let pool = createSizedArray(_maxLength)

    const newElement = <T = unknown>() => {
        let element
        if (_length) {
          _length -= 1
          element = pool[_length]
        } else {
          element = _create()
        }
        return element as T
      },
      release = <T extends Release>(element: T) => {
        if (_length === _maxLength) {
          pool = pooling.double(pool)
          _maxLength *= 2
        }
        if (_release) {
          _release(element)
        }
        pool[_length] = element
        _length += 1
      },
      obj = {
        newElement,
        release,
      }

    return obj
  },
  pointPool = (() =>
    poolFactory(8, () => createTypedArray(ArrayType.Float32, 2)))(),
  pooling = (function () {
    /**
     *
     */
    function double(arr: unknown[]) {
      return arr.concat(createSizedArray(arr.length))
    }

    return {
      double: double,
    }
  })(),
  bezierLengthPool = (() =>
    poolFactory(8, () => ({
      addedLength: 0,
      lengths: createTypedArray(ArrayType.Float32, getDefaultCurveSegments()),
      percents: createTypedArray(ArrayType.Float32, getDefaultCurveSegments()),
    })))(),
  segmentsLengthPool = (() =>
    poolFactory(
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
