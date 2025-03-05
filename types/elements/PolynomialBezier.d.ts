import type { ShapeData, Vector2 } from '@/types';
declare function PolynomialBezier(this: {
    a: Vector2;
    b: Vector2;
    c: Vector2;
    d: Vector2;
    points: [Vector2, Vector2, Vector2, Vector2];
}, p0: Vector2, p1FromProps: Vector2, p2FromProps: Vector2, p3: Vector2, linearize?: boolean): void;
declare namespace PolynomialBezier {
    var shapeSegment: (shapePath: ShapeData, index: number) => any;
    var shapeSegmentInverted: (shapePath: ShapeData, index: number) => any;
}
export default PolynomialBezier;
