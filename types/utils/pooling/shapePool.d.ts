import ShapePath from '@/utils/shapes/ShapePath';
export default abstract class ShapePool {
    private static _factory;
    static newElement: <T = unknown>() => T;
    static release: <T = unknown>(element: T) => void;
    static clone(shape: ShapePath): ShapePath;
    private static _create;
    private static _release;
}
