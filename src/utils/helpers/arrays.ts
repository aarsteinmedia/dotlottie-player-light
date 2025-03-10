import { ArrayType } from '@/enums'

const createTypedArray = (() => {
  /**
   *
   */
  function createRegularArray(type: ArrayType, len: number) {
    const arr = []
    let value
    switch (type) {
      case ArrayType.Int16:
      case ArrayType.Uint8c:
        value = 1
        break
      default:
        value = 1.1
        break
    }
    for (let i = 0; i < len; i++) {
      arr.push(value)
    }
    return arr
  }
  /**
   *
   */
  function createTypedArrayFactory(type: ArrayType, len: number) {
    if (type === ArrayType.Float32) {
      return new Float32Array(len)
    }
    if (type === ArrayType.Int16) {
      return new Int16Array(len)
    }
    if (type === ArrayType.Uint8c) {
      return new Uint8ClampedArray(len)
    }
    return createRegularArray(type, len)
  }
  if (
    typeof Uint8ClampedArray === 'function' &&
    typeof Float32Array === 'function'
  ) {
    return createTypedArrayFactory
  }
  return createRegularArray
})()

/**
 *
 */
function createSizedArray<T = unknown>(length: number) {
  return Array.from<T>({ length })
}

export { createTypedArray, createSizedArray }
