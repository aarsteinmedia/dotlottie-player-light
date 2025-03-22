export default class PoolFactory {
    private _create;
    private _length;
    private _maxLength;
    private _release?;
    private pool;
    constructor(initialLength: number, _create: () => void, _release?: <Release = unknown>(el: Release) => void);
    newElement<T = unknown>(): T;
    release<T = unknown>(element: T): void;
}
export declare function double(arr: unknown[]): unknown[];
export declare const pointPool: PoolFactory, bezierLengthPool: PoolFactory, segmentsLengthPool: PoolFactory;
