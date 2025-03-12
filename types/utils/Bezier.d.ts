import type { Vector2 } from '../types';
import type ShapePath from '../utils/shapes/ShapePath';
export default class Bezier {
    private static bezierSegmentPoints;
    static buildBezierData(pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2): BezierData;
    static getNewSegment(pt1: number[], pt2: number[], pt3: number[], pt4: number[], startPerc: number, endPerc: number, bezierData: unknown): number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>;
    static getPointInSegment(pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2, percent: number, bezierData: unknown): Vector2;
    static getSegmentsLength(shapeData: ShapePath): {
        lengths: any[];
        totalLength: number;
    };
    static pointOnLine2D(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean;
    static pointOnLine3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number): boolean;
    private static getBezierLength;
    private static getDistancePerc;
}
export declare class BezierData {
    points: {
        point: number[];
        partialLength: number;
    }[];
    segmentLength: number;
    constructor(length: number);
}
