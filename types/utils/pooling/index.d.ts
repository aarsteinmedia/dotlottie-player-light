export declare const poolFactory: <Release = unknown>(initialLength: number, _create: () => void, _release?: (el: Release) => void) => {
    newElement: <T = unknown>() => T;
    release: <T extends Release>(element: T) => void;
}, pointPool: {
    newElement: <T = unknown>() => T;
    release: <T extends unknown>(element: T) => void;
}, pooling: {
    double: (arr: unknown[]) => unknown[];
}, bezierLengthPool: {
    newElement: <T = unknown>() => T;
    release: <T extends unknown>(element: T) => void;
}, segmentsLengthPool: {
    newElement: <T = unknown>() => T;
    release: <T extends any>(element: T) => void;
};
