const BezierFactory = (() => {
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

  const beziers: Record<string, string> = {}

  /**
   *
   */
  function getBezierEasing(
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
    const bezEasing = new (BezierEasing as any)([a, b, c, d])
    beziers[str] = bezEasing
    return bezEasing
  }

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  const NEWTON_ITERATIONS = 4
  const NEWTON_MIN_SLOPE = 0.001
  const SUBDIVISION_PRECISION = 0.0000001
  const SUBDIVISION_MAX_ITERATIONS = 10

  const kSplineTableSize = 11
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0)

  const float32ArraySupported = typeof Float32Array === 'function'

  /**
   *
   */
  function A(aA1: number, aA2: number) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1
  }
  /**
   *
   */
  function B(aA1: number, aA2: number) {
    return 3.0 * aA2 - 6.0 * aA1
  }
  /**
   *
   */
  function C(aA1: number) {
    return 3.0 * aA1
  }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  /**
   *
   */
  function calcBezier(aT: number, aA1: number, aA2: number) {
    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  /**
   *
   */
  function getSlope(aT: number, aA1: number, aA2: number) {
    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1)
  }

  /**
   *
   */
  function binarySubdivide(
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
      currentX = calcBezier(currentT, mX1, mX2) - aX
      if (currentX > 0.0) {
        aB = currentT
      } else {
        aA = currentT
      }
    } while (
      Math.abs(currentX) > SUBDIVISION_PRECISION &&
      ++i < SUBDIVISION_MAX_ITERATIONS
    )
    return currentT
  }

  /**
   *
   */
  function newtonRaphsonIterate(
    aX: number,
    aGuessTFromProps: number,
    mX1: number,
    mX2: number
  ) {
    let aGuessT = aGuessTFromProps
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2)
      if (currentSlope === 0.0) {
        return aGuessT
      }
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX
      aGuessT -= currentX / currentSlope
    }
    return aGuessT
  }

  /**
   * points is an array of [ mX1, mY1, mX2, mY2 ]
   */
  function BezierEasing(this: any, points: number[]) {
    this._p = points
    this._mSampleValues = float32ArraySupported
      ? new Float32Array(kSplineTableSize)
      : new Array(kSplineTableSize)
    this._precomputed = false

    this.get = this.get.bind(this)
  }

  BezierEasing.prototype = {
    _calcSampleValues: function () {
      const mX1 = this._p[0],
        mX2 = this._p[2]
      for (let i = 0; i < kSplineTableSize; ++i) {
        this._mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2)
      }
    },

    // Private part

    /**
     * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
     */
    _getTForX: function (aX: number) {
      const mX1 = this._p[0],
        mX2 = this._p[2],
        mSampleValues = this._mSampleValues

      let intervalStart = 0.0
      let currentSample = 1
      const lastSample = kSplineTableSize - 1

      for (
        ;
        currentSample !== lastSample && mSampleValues[currentSample] <= aX;
        ++currentSample
      ) {
        intervalStart += kSampleStepSize
      }
      --currentSample

      // Interpolate to provide an initial guess for t
      const dist =
        (aX - mSampleValues[currentSample]) /
        (mSampleValues[currentSample + 1] - mSampleValues[currentSample])
      const guessForT = intervalStart + dist * kSampleStepSize

      const initialSlope = getSlope(guessForT, mX1, mX2)
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2)
      }
      if (initialSlope === 0.0) {
        return guessForT
      }
      return binarySubdivide(
        aX,
        intervalStart,
        intervalStart + kSampleStepSize,
        mX1,
        mX2
      )
    },

    _precompute: function () {
      const mX1 = this._p[0],
        mY1 = this._p[1],
        mX2 = this._p[2],
        mY2 = this._p[3]
      this._precomputed = true
      if (mX1 !== mY1 || mX2 !== mY2) {
        this._calcSampleValues()
      }
    },

    get: function (x: number) {
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
      return calcBezier(this._getTForX(x), mY1, mY2)
    },
  }

  return { getBezierEasing }
})()

export default BezierFactory
