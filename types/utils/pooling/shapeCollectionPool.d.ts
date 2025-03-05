import ShapeCollection from '@/utils/shapes/ShapeCollection';
declare const shapeCollectionPool: {
    newShapeCollection: () => ShapeCollection;
    release: (shapeCollection: ShapeCollection) => void;
};
export default shapeCollectionPool;
