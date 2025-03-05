import type { Constructor } from '@/types';
declare function extendPrototype<T>(sources: (() => void)[], destination: Constructor<T>): void;
declare function getDescriptor(object: object, prop: string): PropertyDescriptor | undefined;
declare function createProxyFunction<T = unknown>(prototype: T): {
    (): void;
    prototype: T;
};
export { extendPrototype, getDescriptor, createProxyFunction };
