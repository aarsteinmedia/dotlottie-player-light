import type ShapePath from '../../utils/shapes/ShapePath';
export default class ShapeCollection {
    _length: number;
    _maxLength: number;
    shapes: ShapePath[];
    constructor();
    addShape(shapeData: ShapePath): void;
    releaseShapes(): void;
}
