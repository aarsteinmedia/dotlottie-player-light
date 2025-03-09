declare function extendPrototype(sources: any[], destination: any): void;
declare function getDescriptor(object: object, prop: string): PropertyDescriptor | undefined;
declare function createProxyFunction<T = unknown>(prototype: T): {
    (): void;
    prototype: T;
};
export { extendPrototype, getDescriptor, createProxyFunction };
