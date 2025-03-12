import ShapeCollection from '@/utils/shapes/ShapeCollection';
export default abstract class ShapeCollectionPool {
    private static _length;
    private static _maxLength;
    private static pool;
    static newShapeCollection(): ShapeCollection;
    static release(shapeCollection: ShapeCollection): void;
}
