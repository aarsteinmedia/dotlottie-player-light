import type { IntersectData, Vector2 } from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import {
  floatZero,
  intersectData,
  intersectsImpl,
  lerpPoint,
  pointEqual,
  polynomialCoefficients,
  quadRoots,
  singlePoint,
} from '@/utils'

export default class PolynomialBezier {
  a: Vector2
  b: Vector2
  c: Vector2
  d: Vector2
  points: [Vector2, Vector2, Vector2, Vector2]
  constructor(
    p0: Vector2,
    p1FromProps: Vector2,
    p2FromProps: Vector2,
    p3: Vector2,
    linearize?: boolean
  ) {
    let p1 = p1FromProps,
      p2 = p2FromProps
    if (linearize && pointEqual(p0, p1)) {
      p1 = lerpPoint(p0, p3, 1 / 3)
    }
    if (linearize && pointEqual(p2, p3)) {
      p2 = lerpPoint(p0, p3, 2 / 3)
    }
    const coeffx = polynomialCoefficients(p0[0], p1[0], p2[0], p3[0]),
      coeffy = polynomialCoefficients(p0[1], p1[1], p2[1], p3[1])
    this.a = [coeffx[0], coeffy[0]]
    this.b = [coeffx[1], coeffy[1]]
    this.c = [coeffx[2], coeffy[2]]
    this.d = [coeffx[3], coeffy[3]]
    this.points = [p0, p1, p2, p3]
  }

  boundingBox() {
    const bounds = this.bounds()
    return {
      bottom: bounds.y.max,
      cx: (bounds.x.max + bounds.x.min) / 2,
      cy: (bounds.y.max + bounds.y.min) / 2,
      height: bounds.y.max - bounds.y.min,
      left: bounds.x.min,
      right: bounds.x.max,
      top: bounds.y.min,
      width: bounds.x.max - bounds.x.min,
    }
  }
  bounds() {
    return {
      x: this._extrema(this, 0),
      y: this._extrema(this, 1),
    }
  }

  derivative(t: number) {
    return [
      (3 * t * this.a[0] + 2 * this.b[0]) * t + this.c[0],
      (3 * t * this.a[1] + 2 * this.b[1]) * t + this.c[1],
    ]
  }
  inflectionPoints() {
    const denom = this.a[1] * this.b[0] - this.a[0] * this.b[1]
    if (floatZero(denom)) {
      return []
    }
    const tcusp =
      (-0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1])) / denom
    const square =
      tcusp * tcusp -
      ((1 / 3) * (this.b[1] * this.c[0] - this.b[0] * this.c[1])) / denom
    if (square < 0) {
      return []
    }
    const root = Math.sqrt(square)
    if (floatZero(root)) {
      if (root > 0 && root < 1) {
        return [tcusp]
      }
      return []
    }
    return [tcusp - root, tcusp + root].filter((r) => r > 0 && r < 1)
  }

  intersections(
    other: PolynomialBezier,
    toleranceFromProps: number,
    maxRecursionFromProps: number
  ) {
    let tolerance = toleranceFromProps
    let maxRecursion = maxRecursionFromProps
    if (tolerance === undefined) {
      tolerance = 2
    }
    if (maxRecursion === undefined) {
      maxRecursion = 7
    }
    const intersections: IntersectData[] = []
    intersectsImpl(
      intersectData(this, 0, 1),
      intersectData(other, 0, 1),
      0,
      tolerance,
      intersections,
      maxRecursion
    )
    return intersections
  }
  normalAngle(t: number) {
    const p = this.derivative(t)
    return Math.atan2(p[0], p[1])
  }

  point(t: number) {
    return [
      ((this.a[0] * t + this.b[0]) * t + this.c[0]) * t + this.d[0],
      ((this.a[1] * t + this.b[1]) * t + this.c[1]) * t + this.d[1],
    ]
  }

  split(t: number) {
    if (t <= 0) {
      return [singlePoint(this.points[0]), this]
    }
    if (t >= 1) {
      return [this, singlePoint(this.points[this.points.length - 1])]
    }
    const p10 = lerpPoint(this.points[0], this.points[1], t)
    const p11 = lerpPoint(this.points[1], this.points[2], t)
    const p12 = lerpPoint(this.points[2], this.points[3], t)
    const p20 = lerpPoint(p10, p11, t)
    const p21 = lerpPoint(p11, p12, t)
    const p3 = lerpPoint(p20, p21, t)
    return [
      new PolynomialBezier(this.points[0], p10, p20, p3, true),
      new PolynomialBezier(p3, p21, p12, this.points[3], true),
    ]
  }

  tangentAngle(t: number) {
    const p = this.derivative(t)
    return Math.atan2(p[1], p[0])
  }

  private _extrema(bez: PolynomialBezier, comp: number) {
    let min = bez.points[0][comp]
    let max = bez.points[bez.points.length - 1][comp]
    if (min > max) {
      const e = max
      max = min
      min = e
    }
    // Derivative roots to find min/max
    const f = quadRoots(3 * bez.a[comp], 2 * bez.b[comp], bez.c[comp])
    for (let i = 0; i < f.length; i++) {
      if (f[i] > 0 && f[i] < 1) {
        const val = bez.point(f[i])[comp]
        if (val < min) {
          min = val
        } else if (val > max) {
          max = val
        }
      }
    }
    return {
      max: max,
      min: min,
    }
  }
}

/**
 *
 */
export function shapeSegment(shapePath: ShapePath, index: number) {
  const nextIndex = (index + 1) % shapePath.length()
  return new PolynomialBezier(
    shapePath.v[index]!,
    shapePath.o[index]!,
    shapePath.i[nextIndex]!,
    shapePath.v[nextIndex]!,
    true
  )
}
/**
 *
 */
export function shapeSegmentInverted(shapePath: ShapePath, index: number) {
  const nextIndex = (index + 1) % shapePath.length()
  return new PolynomialBezier(
    shapePath.v[nextIndex]!,
    shapePath.i[nextIndex]!,
    shapePath.o[index]!,
    shapePath.v[index]!,
    true
  )
}
