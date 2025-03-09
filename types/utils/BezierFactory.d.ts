export default class BezierFactory {
    static getBezierEasing(a: number, b: number, c: number, d: number, nm?: string): BezierEasing;
}
declare class BezierEasing {
    private _mSampleValues;
    private _p;
    private _precomputed;
    private float32ArraySupported;
    private kSplineTableSize;
    private kSampleStepSize;
    private NEWTON_ITERATIONS;
    private NEWTON_MIN_SLOPE;
    private SUBDIVISION_MAX_ITERATIONS;
    private SUBDIVISION_PRECISION;
    constructor(points: number[]);
    _calcSampleValues(): void;
    _getTForX(aX: number): number;
    _precompute(): void;
    get(x: number): number;
    private A;
    private B;
    private binarySubdivide;
    private C;
    private calcBezier;
    private getSlope;
    private newtonRaphsonIterate;
}
export {};
