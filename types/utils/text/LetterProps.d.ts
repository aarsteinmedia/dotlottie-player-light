import type { Vector3, Vector4 } from '@/types';
export default class LetterProps {
    _mdf: {
        fc: boolean;
        m: boolean;
        o: boolean;
        p: boolean;
        sc: boolean;
        sw: boolean;
    };
    fc?: string | number[];
    m?: number | string;
    o?: number;
    p?: number | number[];
    sc?: string | number[];
    sw?: number;
    constructor(o?: number, sw?: number, sc?: string, fc?: string, m?: number | string, p?: number);
    update(o: number, sw: number, sc: Vector3 | Vector4, fc: Vector3 | Vector4, m: number, p: number | number[]): boolean;
}
