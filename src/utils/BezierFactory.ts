const beziers: Record<string, BezierEasing> = {}

/**
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 *
 * Credits: is based on Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = BezierEasing([ 0.25, 0.1, 0.25, 1.0 ])
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 *
 */
export function getBezierEasing(
  a: number,
  b: number,
  c: number,
  d: number,
  nm?: string
) {
  const str = nm || `bez_${a}_${b}_${c}_${d}`.replace(/\./g, 'p')
  if (beziers[str]) {
    return beziers[str]
  }
  const bezEasing = new BezierEasing([a, b, c, d])
  beziers[str] = bezEasing
  return bezEasing
}

class BezierEasing {
  private _mSampleValues: Float32Array | Array<unknown>
  private _p: number[]
  private _precomputed: boolean

  private float32ArraySupported = typeof Float32Array === 'function'
  private kSplineTableSize = 11
  private kSampleStepSize = 1.0 / (this.kSplineTableSize - 1.0)

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  private NEWTON_ITERATIONS = 4
  private NEWTON_MIN_SLOPE = 0.001

  private SUBDIVISION_MAX_ITERATIONS = 10
  private SUBDIVISION_PRECISION = 0.0000001

  constructor(points: number[]) {
    this._p = points
    this._mSampleValues = this.float32ArraySupported
      ? new Float32Array(this.kSplineTableSize)
      : new Array(this.kSplineTableSize)
    this._precomputed = false

    this.get = this.get.bind(this)
  }

  _calcSampleValues() {
    const mX1 = this._p[0],
      mX2 = this._p[2]
    for (let i = 0; i < this.kSplineTableSize; ++i) {
      this._mSampleValues[i] = this.calcBezier(
        i * this.kSampleStepSize,
        mX1,
        mX2
      )
    }
  }

  /**
   * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
   */
  _getTForX(aX: number) {
    const mX1 = this._p[0],
      mX2 = this._p[2],
      mSampleValues = this._mSampleValues

    let intervalStart = 0.0
    let currentSample = 1
    const lastSample = this.kSplineTableSize - 1

    for (
      ;
      currentSample !== lastSample &&
      Number(mSampleValues[currentSample]) <= aX;
      ++currentSample
    ) {
      intervalStart += this.kSampleStepSize
    }
    --currentSample

    // Interpolate to provide an initial guess for t
    const dist =
      (aX - Number(mSampleValues[currentSample])) /
      (Number(mSampleValues[currentSample + 1]) -
        Number(mSampleValues[currentSample]))
    const guessForT = intervalStart + dist * this.kSampleStepSize

    const initialSlope = this.getSlope(guessForT, mX1, mX2)
    if (initialSlope >= this.NEWTON_MIN_SLOPE) {
      return this.newtonRaphsonIterate(aX, guessForT, mX1, mX2)
    }
    if (initialSlope === 0.0) {
      return guessForT
    }
    return this.binarySubdivide(
      aX,
      intervalStart,
      intervalStart + this.kSampleStepSize,
      mX1,
      mX2
    )
  }
  _precompute() {
    const mX1 = this._p[0],
      mY1 = this._p[1],
      mX2 = this._p[2],
      mY2 = this._p[3]
    this._precomputed = true
    if (mX1 !== mY1 || mX2 !== mY2) {
      this._calcSampleValues()
    }
  }
  get(x: number) {
    const mX1 = this._p[0],
      mY1 = this._p[1],
      mX2 = this._p[2],
      mY2 = this._p[3]
    if (!this._precomputed) {
      this._precompute()
    }
    if (mX1 === mY1 && mX2 === mY2) {
      return x
    } // linear
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0
    }
    if (x === 1) {
      return 1
    }
    return this.calcBezier(this._getTForX(x), mY1, mY2)
  }
  private A(aA1: number, aA2: number) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1
  }
  private B(aA1: number, aA2: number) {
    return 3.0 * aA2 - 6.0 * aA1
  }
  private binarySubdivide(
    aX: number,
    aAFromProps: number,
    aBFropProps: number,
    mX1: number,
    mX2: number
  ) {
    let aA = aAFromProps
    let aB = aBFropProps
    let currentX,
      currentT,
      i = 0
    do {
      currentT = aA + (aB - aA) / 2.0
      currentX = this.calcBezier(currentT, mX1, mX2) - aX
      if (currentX > 0.0) {
        aB = currentT
      } else {
        aA = currentT
      }
    } while (
      Math.abs(currentX) > this.SUBDIVISION_PRECISION &&
      ++i < this.SUBDIVISION_MAX_ITERATIONS
    )
    return currentT
  }

  private C(aA1: number) {
    return 3.0 * aA1
  }

  // Private part

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  private calcBezier(aT: number, aA1: number, aA2: number) {
    return ((this.A(aA1, aA2) * aT + this.B(aA1, aA2)) * aT + this.C(aA1)) * aT
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  private getSlope(aT: number, aA1: number, aA2: number) {
    return (
      3.0 * this.A(aA1, aA2) * aT * aT +
      2.0 * this.B(aA1, aA2) * aT +
      this.C(aA1)
    )
  }

  private newtonRaphsonIterate(
    aX: number,
    aGuessTFromProps: number,
    mX1: number,
    mX2: number
  ) {
    let aGuessT = aGuessTFromProps
    for (let i = 0; i < this.NEWTON_ITERATIONS; ++i) {
      const currentSlope = this.getSlope(aGuessT, mX1, mX2)
      if (currentSlope === 0.0) {
        return aGuessT
      }
      const currentX = this.calcBezier(aGuessT, mX1, mX2) - aX
      aGuessT -= currentX / currentSlope
    }
    return aGuessT
  }
}
