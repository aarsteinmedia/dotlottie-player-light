import type { ShapeData, Vector2 } from '@/types';
export default function bezFunction(): {
    buildBezierData: (pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2) => any;
    getNewSegment: (pt1: number[], pt2: number[], pt3: number[], pt4: number[], startPerc: number, endPerc: number, bezierData: unknown) => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>;
    getPointInSegment: (pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2, percent: number, bezierData: unknown) => Vector2;
    getSegmentsLength: (shapeData: ShapeData) => {
        lengths: any[];
        totalLength: number;
    };
    pointOnLine2D: (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => boolean;
    pointOnLine3D: (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number) => boolean;
};
