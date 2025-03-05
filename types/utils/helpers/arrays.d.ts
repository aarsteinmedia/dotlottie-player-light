import { ArrayType } from '@/enums';
declare const createTypedArray: (type: ArrayType, len: number) => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>;
declare function createSizedArray<T = unknown>(length: number): T[];
export { createTypedArray, createSizedArray };
