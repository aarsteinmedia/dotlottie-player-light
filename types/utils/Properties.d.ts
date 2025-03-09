import type { Caching, CompInterface, Keyframe, Shape, Vector2, VectorProperty } from '@/types';
import { type BezierData } from '@/utils/Bezier';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
declare class BaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    _isFirstFrame?: boolean;
    _placeholder?: boolean;
    comp?: CompInterface;
    data?: any;
    e?: any;
    effectsSequence?: any;
    elem?: any;
    frameId?: number;
    g?: any;
    getValue?: (val?: unknown) => unknown;
    initFrame: number;
    k?: boolean;
    keyframes?: Keyframe[];
    keyframesMetadata?: {
        bezierData?: BezierData;
        __fnct?: ((val: number) => number) | ((val: number) => number)[];
    }[];
    kf?: boolean;
    lock?: boolean;
    mult?: number;
    offsetTime?: number;
    propType: false | 'multidimensional' | 'unidimensional';
    pv?: string | number | any[];
    s?: any;
    sh?: Shape;
    v?: string | number | any[];
    vel?: number | any[];
    addEffect(effectFunction: any): void;
    getValueAtCurrentTime(): string | number | any[] | undefined;
    interpolateValue(frameNum: number, caching?: Caching): number | number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer> | undefined;
    processEffectsSequence(): void;
    setVValue(val: number | number[]): void;
}
export declare class ValueProperty extends BaseProperty {
    constructor(elem: CompInterface, data: VectorProperty, mult?: null | number, container?: CompInterface | null);
}
export declare class MultiDimensionalProperty<T extends Array<any> = Vector2> extends BaseProperty {
    constructor(elem: CompInterface, data: VectorProperty<T>, mult?: null | number, container?: CompInterface | null);
}
export declare class KeyframedValueProperty extends BaseProperty {
    constructor(elem: CompInterface, data: VectorProperty<Keyframe[]>, mult?: null | number, container?: CompInterface | null);
}
export declare class KeyframedMultidimensionalProperty extends BaseProperty {
    constructor(elem: CompInterface, data: VectorProperty<any[]>, mult?: null | number, container?: CompInterface | null);
}
export declare class NoProperty extends BaseProperty {
    constructor();
}
export {};
