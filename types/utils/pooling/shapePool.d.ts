import type { ShapeData } from '@/types';
declare const shapePool: {
    clone: (shape: ShapeData) => ShapeData;
    newElement: <T = unknown>() => T;
    release: <T extends ShapeData>(element: T) => void;
};
export default shapePool;
