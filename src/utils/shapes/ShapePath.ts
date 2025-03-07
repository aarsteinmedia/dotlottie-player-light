import { createSizedArray } from '@/utils/helpers/arrays'
import { pointPool } from '@/utils/pooling'

export default class ShapePath {
  _length: number
  _maxLength: number
  c: boolean
  i: number[][]
  o: number[][]
  v: number[][]
  constructor() {
    this.c = false
    this._length = 0
    this._maxLength = 8
    this.v = createSizedArray(this._maxLength) as number[][]
    this.o = createSizedArray(this._maxLength) as number[][]
    this.i = createSizedArray(this._maxLength) as number[][]
  }

  doubleArrayLength() {
    this.v = this.v.concat(createSizedArray(this._maxLength))
    this.i = this.i.concat(createSizedArray(this._maxLength))
    this.o = this.o.concat(createSizedArray(this._maxLength))
    this._maxLength *= 2
  }

  length() {
    return this._length
  }

  reverse() {
    const newPath = new ShapePath()
    newPath.setPathData(this.c, this._length)
    const vertices = this.v
    const outPoints = this.o
    const inPoints = this.i
    let init = 0
    if (this.c) {
      newPath.setTripleAt(
        vertices[0][0],
        vertices[0][1],
        inPoints[0][0],
        inPoints[0][1],
        outPoints[0][0],
        outPoints[0][1],
        0,
        false
      )
      init = 1
    }
    let cnt = this._length - 1
    const len = this._length

    for (let i = init; i < len; i++) {
      newPath.setTripleAt(
        vertices[cnt][0],
        vertices[cnt][1],
        inPoints[cnt][0],
        inPoints[cnt][1],
        outPoints[cnt][0],
        outPoints[cnt][1],
        i,
        false
      )
      cnt -= 1
    }
    return newPath
  }

  setLength(len: number) {
    while (this._maxLength < len) {
      this.doubleArrayLength()
    }
    this._length = len
  }

  setPathData(closed: boolean, len: number) {
    this.c = closed
    this.setLength(len)
    let i = 0
    while (i < len) {
      this.v[i] = pointPool.newElement()
      this.o[i] = pointPool.newElement()
      this.i[i] = pointPool.newElement()
      i++
    }
  }

  setTripleAt(
    vX: number,
    vY: number,
    oX: number,
    oY: number,
    iX: number,
    iY: number,
    pos: number,
    replace: boolean
  ) {
    this.setXYAt(vX, vY, 'v', pos, replace)
    this.setXYAt(oX, oY, 'o', pos, replace)
    this.setXYAt(iX, iY, 'i', pos, replace)
  }

  setXYAt(x: number, y: number, type: string, pos: number, replace: boolean) {
    let arr: number[][]
    this._length = Math.max(this._length, pos + 1)
    if (this._length >= this._maxLength) {
      this.doubleArrayLength()
    }
    switch (type) {
      case 'v':
        arr = this.v
        break
      case 'i':
        arr = this.i
        break
      case 'o':
        arr = this.o
        break
      default:
        arr = []
        break
    }
    if (!arr[pos] || (arr[pos] && !replace)) {
      arr[pos] = pointPool.newElement()
    }
    arr[pos][0] = x
    arr[pos][1] = y
  }
}
