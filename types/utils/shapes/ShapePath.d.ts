import type { Vector2 } from '../../types';
export default class ShapePath {
    _length: number;
    _maxLength: number;
    c: boolean;
    e?: ShapePath[];
    i: Vector2[];
    o: Vector2[];
    s?: ShapePath[];
    v: Vector2[];
    constructor();
    doubleArrayLength(): void;
    length(): number;
    reverse(): ShapePath;
    setLength(len: number): void;
    setPathData(closed: boolean, len: number): void;
    setTripleAt(vX: number, vY: number, oX: number, oY: number, iX: number, iY: number, pos: number, replace?: boolean): void;
    setXYAt(x: number, y: number, type: string, pos: number, replace?: boolean): void;
}
