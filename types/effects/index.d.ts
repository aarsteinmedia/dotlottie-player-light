import type { EffectInterface, GroupEffect } from '../effects/EffectsManager';
import type { EffectValue, ElementInterfaceIntersect } from '../types';
import type { ValueProperty } from '../utils/Properties';
export declare class SliderEffect {
    p?: ValueProperty;
    type?: string;
    constructor(data: EffectValue, elem: EffectInterface, container: GroupEffect);
}
export declare class AngleEffect {
    p?: ValueProperty;
    type?: string;
    constructor(data: EffectValue, elem: EffectInterface, container: GroupEffect);
}
export declare class ColorEffect {
    p?: ValueProperty;
    type?: string;
    constructor(data: EffectValue, elem: EffectInterface, container: GroupEffect);
}
export declare class PointEffect {
    p?: ValueProperty;
    type?: string;
    constructor(data: EffectValue, elem: EffectInterface, container: GroupEffect);
}
export declare class LayerIndexEffect {
    p?: ValueProperty;
    type?: string;
    constructor(data: EffectValue, elem: ElementInterfaceIntersect, container: GroupEffect);
}
export declare class MaskIndexEffect {
    p?: ValueProperty;
    type?: string;
    constructor(data: EffectValue, elem: ElementInterfaceIntersect, container: GroupEffect);
}
export declare class CheckboxEffect {
    p?: ValueProperty;
    type?: string;
    constructor(data: EffectValue, elem: ElementInterfaceIntersect, container: GroupEffect);
}
export declare class NoValueEffect {
    p: object;
    type?: string;
    constructor();
}
