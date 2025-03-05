import type { ShapeData } from '@/types';
export default class ShapeCollection {
    constructor();
    _length: number;
    _maxLength: number;
    shapes: ShapeData[];
    addShape(shapeData: ShapeData): void;
    releaseShapes(): void;
}
