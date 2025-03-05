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
  private props: Float32Array
  private _identity: boolean
  private _identityCalculated: boolean

  constructor() {
    this.props = createTypedArray(ArrayType.Float32, 16) as Float32Array
    this._identity = true
    this._identityCalculated = false
    this.reset()
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

  translate(tx: number, ty: number, tz: number = 0): this {
    if (tx !== 0 || ty !== 0 || tz !== 0) {
      return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1)
    }
    return this
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

  multiply(matrix: Matrix): this {
    // @ts-expect-error: spread
    return this.transform(...matrix.props)
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

  equals(matr: Matrix): boolean {
    return this.props.every((val, i) => val === matr.props[i])
  }

  clone(matr: Matrix): Matrix {
    matr.props.set(this.props)
    return matr
  }

  cloneFromProps(props: number[]): this {
    this.props.set(props)
    return this
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

  toCSS(): string {
    let cssValue = 'matrix3d('
    const v = 10000
    for (let i = 0; i < 16; i++) {
      cssValue += Math.round(this.props[i] * v) / v
      cssValue += i === 15 ? ')' : ','
    }
    return cssValue
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

  private roundMatrixProperty(val: number): number {
    const v = 10000
    if ((val < 0.000001 && val > 0) || (val > -0.000001 && val < 0)) {
      return Math.round(val * v) / v
    }
    return val
  }

  private _t(...args: number[]): this {
    // @ts-expect-error: spread
    return this.transform(...args)
  }
}

// /* !
//  Transformation Matrix v2.0
//  (c) Epistemex 2014-2015
//  www.epistemex.com
//  By Ken Fyrstenberg
//  Contributions by leeoniya.
//  License: MIT, header required.
//  */

// import { ArrayType } from '@/enums'
// import { createTypedArray } from '@/utils/helpers/arrays'

// /**
//  * 2D transformation matrix object initialized with identity matrix.
//  *
//  * The matrix can synchronize a canvas context by supplying the context
//  * as an argument, or later apply current absolute transform to an
//  * existing context.
//  *
//  * All values are handled as floating point values.
//  *
//  * @param {CanvasRenderingContext2D} [context] - Optional context to sync with Matrix
//  * @prop {number} a - scale x
//  * @prop {number} b - shear y
//  * @prop {number} c - shear x
//  * @prop {number} d - scale y
//  * @prop {number} e - translate x
//  * @prop {number} f - translate y
//  * @prop {CanvasRenderingContext2D|null} [context=null] - set or get current canvas context
//  * @constructor
//  */

// const Matrix = (() => {
//   /**
//    *
//    */
//   function reset(this: { props: number[] }) {
//     this.props[0] = 1
//     this.props[1] = 0
//     this.props[2] = 0
//     this.props[3] = 0
//     this.props[4] = 0
//     this.props[5] = 1
//     this.props[6] = 0
//     this.props[7] = 0
//     this.props[8] = 0
//     this.props[9] = 0
//     this.props[10] = 1
//     this.props[11] = 0
//     this.props[12] = 0
//     this.props[13] = 0
//     this.props[14] = 0
//     this.props[15] = 1
//     return this
//   }

//   /**
//    *
//    */
//   function rotate(this: any, angle: number) {
//     if (angle === 0) {
//       return this
//     }
//     const mCos = Math.cos(angle)
//     const mSin = Math.sin(angle)
//     return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
//   }

//   /**
//    *
//    */
//   function rotateX(this: any, angle: number) {
//     if (angle === 0) {
//       return this
//     }
//     const mCos = Math.cos(angle)
//     const mSin = Math.sin(angle)
//     return this._t(1, 0, 0, 0, 0, mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1)
//   }

//   /**
//    *
//    */
//   function rotateY(this: any, angle: number) {
//     if (angle === 0) {
//       return this
//     }
//     const mCos = Math.cos(angle)
//     const mSin = Math.sin(angle)
//     return this._t(mCos, 0, mSin, 0, 0, 1, 0, 0, -mSin, 0, mCos, 0, 0, 0, 0, 1)
//   }

//   /**
//    *
//    */
//   function rotateZ(this: any, angle: number) {
//     if (angle === 0) {
//       return this
//     }
//     const mCos = Math.cos(angle)
//     const mSin = Math.sin(angle)
//     return this._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
//   }

//   /**
//    *
//    */
//   function shear(this: any, sx: number, sy: number) {
//     return this._t(1, sy, sx, 1, 0, 0)
//   }

//   /**
//    *
//    */
//   function skew(this: any, ax: number, ay: number) {
//     return this.shear(Math.tan(ax), Math.tan(ay))
//   }

//   /**
//    *
//    */
//   function skewFromAxis(this: any, ax: number, angle: number) {
//     const mCos = Math.cos(angle)
//     const mSin = Math.sin(angle)
//     return this._t(mCos, mSin, 0, 0, -mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
//       ._t(1, 0, 0, 0, Math.tan(ax), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
//       ._t(mCos, -mSin, 0, 0, mSin, mCos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
//     // return this._t(mCos, mSin, -mSin, mCos, 0, 0)._t(1, 0, Math.tan(ax), 1, 0, 0)._t(mCos, -mSin, mSin, mCos, 0, 0);
//   }

//   /**
//    *
//    */
//   function scale(this: any, sx: number, sy: number, szFromProps: number) {
//     let sz = szFromProps
//     if (!sz && sz !== 0) {
//       sz = 1
//     }
//     if (sx === 1 && sy === 1 && sz === 1) {
//       return this
//     }
//     return this._t(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1)
//   }

//   /**
//    *
//    */
//   function setTransform(
//     this: any,
//     a: number,
//     b: number,
//     c: number,
//     d: number,
//     e: number,
//     f: number,
//     g: number,
//     h: number,
//     i: number,
//     j: number,
//     k: number,
//     l: number,
//     m: number,
//     n: number,
//     o: number,
//     p: number
//   ) {
//     this.props[0] = a
//     this.props[1] = b
//     this.props[2] = c
//     this.props[3] = d
//     this.props[4] = e
//     this.props[5] = f
//     this.props[6] = g
//     this.props[7] = h
//     this.props[8] = i
//     this.props[9] = j
//     this.props[10] = k
//     this.props[11] = l
//     this.props[12] = m
//     this.props[13] = n
//     this.props[14] = o
//     this.props[15] = p
//     return this
//   }

//   /**
//    *
//    */
//   function translate(this: any, tx: number, ty: number, tzFromProps: number) {
//     let tz = tzFromProps
//     tz = tz || 0
//     if (tx !== 0 || ty !== 0 || tz !== 0) {
//       return this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1)
//     }
//     return this
//   }

//   /**
//    *
//    */
//   function transform(
//     this: any,
//     a2: number,
//     b2: number,
//     c2: number,
//     d2: number,
//     e2: number,
//     f2: number,
//     g2: number,
//     h2: number,
//     i2: number,
//     j2: number,
//     k2: number,
//     l2: number,
//     m2: number,
//     n2: number,
//     o2: number,
//     p2: number
//   ) {
//     const _p = this.props

//     if (
//       a2 === 1 &&
//       b2 === 0 &&
//       c2 === 0 &&
//       d2 === 0 &&
//       e2 === 0 &&
//       f2 === 1 &&
//       g2 === 0 &&
//       h2 === 0 &&
//       i2 === 0 &&
//       j2 === 0 &&
//       k2 === 1 &&
//       l2 === 0
//     ) {
//       // NOTE: commenting this condition because TurboFan deoptimizes code when present
//       // if(m2 !== 0 || n2 !== 0 || o2 !== 0){
//       _p[12] = _p[12] * a2 + _p[15] * m2
//       _p[13] = _p[13] * f2 + _p[15] * n2
//       _p[14] = _p[14] * k2 + _p[15] * o2
//       _p[15] *= p2
//       // }
//       this._identityCalculated = false
//       return this
//     }

//     const a1 = _p[0]
//     const b1 = _p[1]
//     const c1 = _p[2]
//     const d1 = _p[3]
//     const e1 = _p[4]
//     const f1 = _p[5]
//     const g1 = _p[6]
//     const h1 = _p[7]
//     const i1 = _p[8]
//     const j1 = _p[9]
//     const k1 = _p[10]
//     const l1 = _p[11]
//     const m1 = _p[12]
//     const n1 = _p[13]
//     const o1 = _p[14]
//     const p1 = _p[15]

//     /* matrix order (canvas compatible):
//      * ace
//      * bdf
//      * 001
//      */
//     _p[0] = a1 * a2 + b1 * e2 + c1 * i2 + d1 * m2
//     _p[1] = a1 * b2 + b1 * f2 + c1 * j2 + d1 * n2
//     _p[2] = a1 * c2 + b1 * g2 + c1 * k2 + d1 * o2
//     _p[3] = a1 * d2 + b1 * h2 + c1 * l2 + d1 * p2

//     _p[4] = e1 * a2 + f1 * e2 + g1 * i2 + h1 * m2
//     _p[5] = e1 * b2 + f1 * f2 + g1 * j2 + h1 * n2
//     _p[6] = e1 * c2 + f1 * g2 + g1 * k2 + h1 * o2
//     _p[7] = e1 * d2 + f1 * h2 + g1 * l2 + h1 * p2

//     _p[8] = i1 * a2 + j1 * e2 + k1 * i2 + l1 * m2
//     _p[9] = i1 * b2 + j1 * f2 + k1 * j2 + l1 * n2
//     _p[10] = i1 * c2 + j1 * g2 + k1 * k2 + l1 * o2
//     _p[11] = i1 * d2 + j1 * h2 + k1 * l2 + l1 * p2

//     _p[12] = m1 * a2 + n1 * e2 + o1 * i2 + p1 * m2
//     _p[13] = m1 * b2 + n1 * f2 + o1 * j2 + p1 * n2
//     _p[14] = m1 * c2 + n1 * g2 + o1 * k2 + p1 * o2
//     _p[15] = m1 * d2 + n1 * h2 + o1 * l2 + p1 * p2

//     this._identityCalculated = false
//     return this
//   }

//   /**
//    *
//    */
//   function multiply(this: any, matrix: { props: any }) {
//     const matrixProps = matrix.props
//     return this.transform(
//       matrixProps[0],
//       matrixProps[1],
//       matrixProps[2],
//       matrixProps[3],
//       matrixProps[4],
//       matrixProps[5],
//       matrixProps[6],
//       matrixProps[7],
//       matrixProps[8],
//       matrixProps[9],
//       matrixProps[10],
//       matrixProps[11],
//       matrixProps[12],
//       matrixProps[13],
//       matrixProps[14],
//       matrixProps[15]
//     )
//   }

//   /**
//    *
//    */
//   function isIdentity(this: any) {
//     if (!this._identityCalculated) {
//       this._identity = !(
//         this.props[0] !== 1 ||
//         this.props[1] !== 0 ||
//         this.props[2] !== 0 ||
//         this.props[3] !== 0 ||
//         this.props[4] !== 0 ||
//         this.props[5] !== 1 ||
//         this.props[6] !== 0 ||
//         this.props[7] !== 0 ||
//         this.props[8] !== 0 ||
//         this.props[9] !== 0 ||
//         this.props[10] !== 1 ||
//         this.props[11] !== 0 ||
//         this.props[12] !== 0 ||
//         this.props[13] !== 0 ||
//         this.props[14] !== 0 ||
//         this.props[15] !== 1
//       )
//       this._identityCalculated = true
//     }
//     return this._identity
//   }

//   /**
//    *
//    */
//   function equals(this: any, matr: { props: any[] }) {
//     let i = 0
//     while (i < 16) {
//       if (matr.props[i] !== this.props[i]) {
//         return false
//       }
//       i++
//     }
//     return true
//   }

//   /**
//    *
//    */
//   function clone(this: any, matr: { props: any[] }) {
//     let i
//     for (i = 0; i < 16; i++) {
//       matr.props[i] = this.props[i]
//     }
//     return matr
//   }

//   /**
//    *
//    */
//   function cloneFromProps(this: any, props: any[]) {
//     let i
//     for (i = 0; i < 16; i++) {
//       this.props[i] = props[i]
//     }
//   }

//   /**
//    *
//    */
//   function applyToPoint(this: any, x: number, y: number, z: number) {
//     return {
//       x:
//         x * this.props[0] +
//         y * this.props[4] +
//         z * this.props[8] +
//         this.props[12],
//       y:
//         x * this.props[1] +
//         y * this.props[5] +
//         z * this.props[9] +
//         this.props[13],
//       z:
//         x * this.props[2] +
//         y * this.props[6] +
//         z * this.props[10] +
//         this.props[14],
//     }
//     /* return {
//          x: x * me.a + y * me.c + me.e,
//          y: x * me.b + y * me.d + me.f
//          }; */
//   }
//   /**
//    *
//    */
//   function applyToX(this: any, x: number, y: number, z: number) {
//     return (
//       x * this.props[0] + y * this.props[4] + z * this.props[8] + this.props[12]
//     )
//   }
//   /**
//    *
//    */
//   function applyToY(this: any, x: number, y: number, z: number) {
//     return (
//       x * this.props[1] + y * this.props[5] + z * this.props[9] + this.props[13]
//     )
//   }
//   /**
//    *
//    */
//   function applyToZ(this: any, x: number, y: number, z: number) {
//     return (
//       x * this.props[2] +
//       y * this.props[6] +
//       z * this.props[10] +
//       this.props[14]
//     )
//   }

//   /**
//    *
//    */
//   function getInverseMatrix(this: any) {
//     const determinant =
//       this.props[0] * this.props[5] - this.props[1] * this.props[4]
//     const a = this.props[5] / determinant
//     const b = -this.props[1] / determinant
//     const c = -this.props[4] / determinant
//     const d = this.props[0] / determinant
//     const e =
//       (this.props[4] * this.props[13] - this.props[5] * this.props[12]) /
//       determinant
//     const f =
//       -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) /
//       determinant
//     // @ts-expect-error: constructor
//     const inverseMatrix = new Matrix()
//     inverseMatrix.props[0] = a
//     inverseMatrix.props[1] = b
//     inverseMatrix.props[4] = c
//     inverseMatrix.props[5] = d
//     inverseMatrix.props[12] = e
//     inverseMatrix.props[13] = f
//     return inverseMatrix
//   }

//   /**
//    *
//    */
//   function inversePoint(this: any, pt: any[]) {
//     const inverseMatrix = this.getInverseMatrix()
//     return inverseMatrix.applyToPointArray(pt[0], pt[1], pt[2] || 0)
//   }

//   /**
//    *
//    */
//   function inversePoints(pts: string | any[]) {
//     let i
//     const len = pts.length
//     const retPts = []
//     for (i = 0; i < len; i++) {
//       retPts[i] = inversePoint(pts[i])
//     }
//     return retPts
//   }

//   /**
//    *
//    */
//   function applyToTriplePoints(
//     this: any,
//     pt1: number[],
//     pt2: number[],
//     pt3: number[]
//   ) {
//     const arr = createTypedArray(ArrayType.Float32, 6)
//     if (this.isIdentity()) {
//       arr[0] = pt1[0]
//       arr[1] = pt1[1]
//       arr[2] = pt2[0]
//       arr[3] = pt2[1]
//       arr[4] = pt3[0]
//       arr[5] = pt3[1]
//     } else {
//       const p0 = this.props[0]
//       const p1 = this.props[1]
//       const p4 = this.props[4]
//       const p5 = this.props[5]
//       const p12 = this.props[12]
//       const p13 = this.props[13]
//       arr[0] = pt1[0] * p0 + pt1[1] * p4 + p12
//       arr[1] = pt1[0] * p1 + pt1[1] * p5 + p13
//       arr[2] = pt2[0] * p0 + pt2[1] * p4 + p12
//       arr[3] = pt2[0] * p1 + pt2[1] * p5 + p13
//       arr[4] = pt3[0] * p0 + pt3[1] * p4 + p12
//       arr[5] = pt3[0] * p1 + pt3[1] * p5 + p13
//     }
//     return arr
//   }

//   /**
//    *
//    */
//   function applyToPointArray(this: any, x: number, y: number, z: number) {
//     let arr
//     if (this.isIdentity()) {
//       arr = [x, y, z]
//     } else {
//       arr = [
//         x * this.props[0] +
//           y * this.props[4] +
//           z * this.props[8] +
//           this.props[12],
//         x * this.props[1] +
//           y * this.props[5] +
//           z * this.props[9] +
//           this.props[13],
//         x * this.props[2] +
//           y * this.props[6] +
//           z * this.props[10] +
//           this.props[14],
//       ]
//     }
//     return arr
//   }

//   /**
//    *
//    */
//   function applyToPointStringified(this: any, x: number, y: number) {
//     if (this.isIdentity()) {
//       return `${x},${y}`
//     }
//     const _p = this.props
//     return `${Math.round((x * _p[0] + y * _p[4] + _p[12]) * 100) / 100},${
//       Math.round((x * _p[1] + y * _p[5] + _p[13]) * 100) / 100
//     }`
//   }

//   /**
//    *
//    */
//   function toCSS(this: any) {
//     // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
//     /* if(this.isIdentity()) {
//             return '';
//         } */
//     let i = 0
//     const props = this.props
//     let cssValue = 'matrix3d('
//     const v = 10000
//     while (i < 16) {
//       cssValue += Math.round(props[i] * v) / v
//       cssValue += i === 15 ? ')' : ','
//       i++
//     }
//     return cssValue
//   }

//   /**
//    *
//    */
//   function roundMatrixProperty(val: number) {
//     const v = 10000
//     if ((val < 0.000001 && val > 0) || (val > -0.000001 && val < 0)) {
//       return Math.round(val * v) / v
//     }
//     return val
//   }

//   /**
//    *
//    */
//   function to2dCSS(this: any) {
//     // Doesn't make much sense to add this optimization. If it is an identity matrix, it's very likely this will get called only once since it won't be keyframed.
//     /* if(this.isIdentity()) {
//             return '';
//         } */
//     const props = this.props
//     const _a = roundMatrixProperty(props[0])
//     const _b = roundMatrixProperty(props[1])
//     const _c = roundMatrixProperty(props[4])
//     const _d = roundMatrixProperty(props[5])
//     const _e = roundMatrixProperty(props[12])
//     const _f = roundMatrixProperty(props[13])
//     return `matrix(${_a},${_b},${_c},${_d},${_e},${_f})`
//   }

//   return function (this: any) {
//     this.reset = reset
//     this.rotate = rotate
//     this.rotateX = rotateX
//     this.rotateY = rotateY
//     this.rotateZ = rotateZ
//     this.skew = skew
//     this.skewFromAxis = skewFromAxis
//     this.shear = shear
//     this.scale = scale
//     this.setTransform = setTransform
//     this.translate = translate
//     this.transform = transform
//     this.multiply = multiply
//     this.applyToPoint = applyToPoint
//     this.applyToX = applyToX
//     this.applyToY = applyToY
//     this.applyToZ = applyToZ
//     this.applyToPointArray = applyToPointArray
//     this.applyToTriplePoints = applyToTriplePoints
//     this.applyToPointStringified = applyToPointStringified
//     this.toCSS = toCSS
//     this.to2dCSS = to2dCSS
//     this.clone = clone
//     this.cloneFromProps = cloneFromProps
//     this.equals = equals
//     this.inversePoints = inversePoints
//     this.inversePoint = inversePoint
//     this.getInverseMatrix = getInverseMatrix
//     this._t = this.transform
//     this.isIdentity = isIdentity
//     this._identity = true
//     this._identityCalculated = false

//     this.props = createTypedArray(ArrayType.Float32, 16)
//     this.reset()
//   }
// })()

// export default Matrix
