export default class Matrix {
    private props;
    private _identity;
    private _identityCalculated;
    constructor();
    reset(): this;
    rotate(angle: number): this;
    rotateX(angle: number): this;
    rotateY(angle: number): this;
    rotateZ(angle: number): this;
    shear(sx: number, sy: number): this;
    skew(ax: number, ay: number): this;
    skewFromAxis(ax: number, angle: number): this;
    scale(sx: number, sy: number, sz?: number): this;
    setTransform(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number): this;
    translate(tx: number, ty: number, tz?: number): this;
    transform(a2: number, b2: number, c2: number, d2: number, e2: number, f2: number, g2: number, h2: number, i2: number, j2: number, k2: number, l2: number, m2: number, n2: number, o2: number, p2: number): this;
    multiply(matrix: Matrix): this;
    isIdentity(): boolean;
    equals(matr: Matrix): boolean;
    clone(matr: Matrix): Matrix;
    cloneFromProps(props: number[]): this;
    applyToPoint(x: number, y: number, z: number): {
        x: number;
        y: number;
        z: number;
    };
    applyToX(x: number, y: number, z: number): number;
    applyToY(x: number, y: number, z: number): number;
    applyToZ(x: number, y: number, z: number): number;
    getInverseMatrix(): Matrix;
    inversePoint(pt: number[]): {
        x: number;
        y: number;
        z: number;
    };
    inversePoints(pts: number[][]): {
        x: number;
        y: number;
        z: number;
    }[];
    applyToTriplePoints(pt1: number[], pt2: number[], pt3: number[]): Float32Array;
    applyToPointArray(x: number, y: number, z: number): number[];
    applyToPointStringified(x: number, y: number): string;
    toCSS(): string;
    to2dCSS(): string;
    private roundMatrixProperty;
    private _t;
}
