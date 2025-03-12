import type { Caching, ElementInterfaceIntersect, Keyframe, Shape, Vector2, VectorProperty } from '../types';
import { type BezierData } from '../utils/Bezier';
import DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
declare abstract class BaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    _isFirstFrame?: boolean;
    _placeholder?: boolean;
    comp?: ElementInterfaceIntersect;
    data?: any;
    e?: any;
    effectsSequence?: any;
    elem?: any;
    frameId?: number;
    g?: any;
    getValueAtTime?: (a: number, b?: number) => any;
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
    pv?: string | number | any[];
    s?: any;
    sh?: Shape;
    v?: string | number | any[];
    vel?: number | any[];
    addEffect(effectFunction: any): void;
    getValueAtCurrentTime(): string | number | any[] | undefined;
    interpolateValue(frameNum: number, caching?: Caching): any;
    processEffectsSequence(): void;
    setVValue(val: number | number[]): void;
}
export declare class ValueProperty extends BaseProperty {
    pv: number | string;
    v: number | string;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class MultiDimensionalProperty<T extends Array<any> = Vector2> extends BaseProperty {
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<T>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class KeyframedValueProperty extends BaseProperty {
    pv: number;
    v: number;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<Keyframe[]>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class KeyframedMultidimensionalProperty<T extends Array<any> = Vector2> extends BaseProperty {
    pv: T;
    v: T;
    constructor(elem: ElementInterfaceIntersect, data: VectorProperty<any[]>, mult?: null | number, container?: ElementInterfaceIntersect | null);
}
export declare class NoProperty extends BaseProperty {
    constructor();
}
export {};
