import { createSizedArray } from '@/utils/helpers/arrays'
import { pointPool } from '@/utils/pooling'

/**
 *
 */
export default function ShapePath(this: any) {
  this.c = false
  this._length = 0
  this._maxLength = 8
  this.v = createSizedArray(this._maxLength)
  this.o = createSizedArray(this._maxLength)
  this.i = createSizedArray(this._maxLength)
}

ShapePath.prototype.setPathData = function (closed: boolean, len: number) {
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

ShapePath.prototype.setLength = function (len: number) {
  while (this._maxLength < len) {
    this.doubleArrayLength()
  }
  this._length = len
}

ShapePath.prototype.doubleArrayLength = function () {
  this.v = this.v.concat(createSizedArray(this._maxLength))
  this.i = this.i.concat(createSizedArray(this._maxLength))
  this.o = this.o.concat(createSizedArray(this._maxLength))
  this._maxLength *= 2
}

ShapePath.prototype.setXYAt = function (
  x: number,
  y: number,
  type: string,
  pos: number,
  replace: boolean
) {
  let arr
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

ShapePath.prototype.setTripleAt = function (
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

ShapePath.prototype.reverse = function () {
  const newPath = new (ShapePath as any)()
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

  let i
  for (i = init; i < len; i++) {
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

ShapePath.prototype.length = function () {
  return this._length
}
