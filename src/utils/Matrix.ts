/* !
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */

import { ArrayType } from '@/enums'
import { createTypedArray } from '@/utils/helpers/arrays'

/**
 * 2D transformation matrix object initialized with identity matrix.
 *
 * The matrix can synchronize a canvas context by supplying the context
 * as an argument, or later apply current absolute transform to an
 * existing context.
 *
 * All values are handled as floating point values.
 *
 * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
 * @prop {number} a - scale x
 * @prop {number} b - shear y
 * @prop {number} c - shear x
 * @prop {number} d - scale y
 * @prop {number} e - translate x
 * @prop {number} f - translate y
 * @prop {CanvasRenderingContext2D|null} [context=null] - set or get current canvas context
 */
export default class Matrix {
  private _identity: boolean
  private _identityCalculated: boolean
  props: Float32Array

  constructor() {
    this.props = createTypedArray(ArrayType.Float32, 16) as Float32Array
    this._identity = true
    this._identityCalculated = false
    this.reset()
  }

  applyToPoint(
    x: number,
    y: number,
    z: number
  ): { x: number; y: number; z: number } {
    return {
      x:
        x * this.props[0] +
        y * this.props[4] +
        z * this.props[8] +
        this.props[12],
      y:
        x * this.props[1] +
        y * this.props[5] +
        z * this.props[9] +
        this.props[13],
      z:
        x * this.props[2] +
        y * this.props[6] +
        z * this.props[10] +
        this.props[14],
    }
  }

  applyToPointArray(x: number, y: number, z: number): number[] {
    if (this.isIdentity()) {
      return [x, y, z]
    }
    return [
      x * this.props[0] +
        y * this.props[4] +
        z * this.props[8] +
        this.props[12],
      x * this.props[1] +
        y * this.props[5] +
        z * this.props[9] +
        this.props[13],
      x * this.props[2] +
        y * this.props[6] +
        z * this.props[10] +
        this.props[14],
    ]
  }

  applyToPointStringified(x: number, y: number): string {
    if (this.isIdentity()) {
      return `${x},${y}`
    }
    const _p = this.props
    return `${Math.round((x * _p[0] + y * _p[4] + _p[12]) * 100) / 100},${
      Math.round((x * _p[1] + y * _p[5] + _p[13]) * 100) / 100
    }`
  }

  applyToTriplePoints(
    pt1: number[],
    pt2: number[],
    pt3: number[]
  ): Float32Array {
    const arr = createTypedArray(ArrayType.Float32, 6) as Float32Array
    if (this.isIdentity()) {
      arr.set([pt1[0], pt1[1], pt2[0], pt2[1], pt3[0], pt3[1]])
    } else {
      const p0 = this.props[0]
      const p1 = this.props[1]
      const p4 = this.props[4]
      const p5 = this.props[5]
      const p12 = this.props[12]
      const p13 = this.props[13]
      arr.set([
        pt1[0] * p0 + pt1[1] * p4 + p12,
        pt1[0] * p1 + pt1[1] * p5 + p13,
        pt2[0] * p0 + pt2[1] * p4 + p12,
        pt2[0] * p1 + pt2[1] * p5 + p13,
        pt3[0] * p0 + pt3[1] * p4 + p12,
        pt3[0] * p1 + pt3[1] * p5 + p13,
      ])
    }
    return arr
  }

  applyToX(x: number, y: number, z: number): number {
    return (
      x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12]
    )
  }

  applyToY(x: number, y: number, z: number): number {
    return (
      x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13]
    )
  }

  applyToZ(x: number, y: number, z: number): number {
    return (
      x * this.props[2] +
      y * this.props[6] +
      z * this.props[10] +
      this.props[14]
    )
  }

  clone(matr: Matrix): Matrix {
    matr.props.set(this.props)
    return matr
  }

  cloneFromProps(props: number[]): this {
    this.props.set(props)
    return this
  }

  equals(matr: Matrix): boolean {
    return this.props.every((val, i) => val === matr.props[i])
  }

  getInverseMatrix(): Matrix {
    const determinant =
      this.props[0] * this.props[5] - this.props[1] * this.props[4]
    const a = this.props[5] / determinant
    const b = -this.props[1] / determinant
    const c = -this.props[4] / determinant
    const d = this.props[0] / determinant
    const e =
      (this.props[4] * this.props[13] - this.props[5] * this.props[12]) /
      determinant
    const f =
      -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) /
      determinant

    const inverseMatrix = new Matrix()
    inverseMatrix.setTransform(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, e, f, 0, 1)
    return inverseMatrix
  }

  inversePoint(pt: number[]): { x: number; y: number; z: number } {
    const inverseMatrix = this.getInverseMatrix()
    return inverseMatrix.applyToPoint(pt[0], pt[1], pt[2] || 0)
  }

  inversePoints(pts: number[][]): { x: number; y: number; z: number }[] {
    return pts.map((pt) => this.inversePoint(pt))
  }

  isIdentity(): boolean {
    if (!this._identityCalculated) {
      this._identity = !(
        this.props[0] !== 1 ||
        this.props[1] !== 0 ||
        this.props[2] !== 0 ||
        this.props[3] !== 0 ||
        this.props[4] !== 0 ||
        this.props[5] !== 1 ||
        this.props[6] !== 0 ||
        this.props[7] !== 0 ||
        this.props[8] !== 0 ||
        this.props[9] !== 0 ||
        this.props[10] !== 1 ||
        this.props[11] !== 0 ||
        this.props[12] !== 0 ||
        this.props[13] !== 0 ||
        this.props[14] !== 0 ||
        this.props[15] !== 1
      )
      this._identityCalculated = true
    }
    return this._identity
  }

  multiply(matrix: Matrix): this {
    // @ts-expect-error: spread
    return this.transform(...matrix.props)
  }

  reset(): this {
    this.props.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    return this
  }

  rotate(angle: number): this {
    if (angle === 0) {
      return this
    }
    const mCos = Math.cos(angle)
    const mSin = Math.sin(angle)
    return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }

  rotateX(angle: number): this {
    if (angle === 0) {
      return this
    }
    const mCos = Math.cos(angle)
    const mSin = Math.sin(angle)
    return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1)
  }

  rotateY(angle: number): this {
    if (angle === 0) {
      return this
    }
    const mCos = Math.cos(angle)
    const mSin = Math.sin(angle)
    return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1)
  }

  rotateZ(angle: number): this {
    if (angle === 0) {
      return this
    }
    const mCos = Math.cos(angle)
    const mSin = Math.sin(angle)
    return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }

  scale(sx: number, sy: number, sz: number = 1): this {
    if (sx === 1 && sy === 1 && sz === 1) {
      return this
    }
    return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1)
  }

  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
    j: number,
    k: number,
    l: number,
    m: number,
    n: number,
    o: number,
    p: number
  ): this {
    this.props.set([a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p])
    return this
  }

  shear(sx: number, sy: number): this {
    return this._t(1, sy, sx, 1, 0, 0)
  }

  skew(ax: number, ay: number): this {
    return this.shear(Math.tan(ax), Math.tan(ay))
  }

  skewFromAxis(ax: number, angle: number): this {
    const mCos = Math.cos(angle)
    const mSin = Math.sin(angle)
    return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
      ._t(1, 0, 0, 0, Math.tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
      ._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }

  to2dCSS(): string {
    const _a = this.roundMatrixProperty(this.props[0])
    const _b = this.roundMatrixProperty(this.props[1])
    const _c = this.roundMatrixProperty(this.props[4])
    const _d = this.roundMatrixProperty(this.props[5])
    const _e = this.roundMatrixProperty(this.props[12])
    const _f = this.roundMatrixProperty(this.props[13])
    return `matrix(${_a},${_b},${_c},${_d},${_e},${_f})`
  }

  toCSS(): string {
    let cssValue = 'matrix3d('
    const v = 10000
    for (let i = 0; i < 16; i++) {
      cssValue += Math.round(this.props[i] * v) / v
      cssValue += i === 15 ? ')' : ','
    }
    return cssValue
  }

  transform(
    a2: number,
    b2: number,
    c2: number,
    d2: number,
    e2: number,
    f2: number,
    g2: number,
    h2: number,
    i2: number,
    j2: number,
    k2: number,
    l2: number,
    m2: number,
    n2: number,
    o2: number,
    p2: number
  ): this {
    const _p = this.props

    if (
      a2 === 1 &&
      b2 === 0 &&
      c2 === 0 &&
      d2 === 0 &&
      e2 === 0 &&
      f2 === 1 &&
      g2 === 0 &&
      h2 === 0 &&
      i2 === 0 &&
      j2 === 0 &&
      k2 === 1 &&
      l2 === 0
    ) {
      _p[12] = _p[12] * a2 + _p[15] * m2
      _p[13] = _p[13] * f2 + _p[15] * n2
      _p[14] = _p[14] * k2 + _p[15] * o2
      _p[15] *= p2
      this._identityCalculated = false
      return this
    }

    const a1 = _p[0]
    const b1 = _p[1]
    const c1 = _p[2]
    const d1 = _p[3]
    const e1 = _p[4]
    const f1 = _p[5]
    const g1 = _p[6]
    const h1 = _p[7]
    const i1 = _p[8]
    const j1 = _p[9]
    const k1 = _p[10]
    const l1 = _p[11]
    const m1 = _p[12]
    const n1 = _p[13]
    const o1 = _p[14]
    const p1 = _p[15]

    _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2
    _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2
    _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2
    _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2

    _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2
    _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2
    _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2
    _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2

    _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2
    _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2
    _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2
    _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2

    _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2
    _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2
    _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2
    _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2

    this._identityCalculated = false
    return this
  }

  translate(tx: number, ty: number, tz: number = 0): this {
    if (tx !== 0 || ty !== 0 || tz !== 0) {
      return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1)
    }
    return this
  }

  private _t(...args: number[]): this {
    // @ts-expect-error: spread
    return this.transform(...args)
  }

  private roundMatrixProperty(val: number): number {
    const v = 10000
    if ((val < 0.000001 && val > 0) || (val > -0.000001 && val < 0)) {
      return Math.round(val * v) / v
    }
    return val
  }
}
