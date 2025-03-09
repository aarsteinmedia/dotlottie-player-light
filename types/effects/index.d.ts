import type { GroupEffect } from '@/effects/EffectsManager';
import type { EffectValue, CompInterface } from '@/types';
import type { ValueProperty } from '@/utils/Properties';
export declare class SliderEffect {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: CompInterface, container: GroupEffect);
}
export declare class AngleEffect {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: CompInterface, container: GroupEffect);
}
export declare class ColorEffect {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: CompInterface, container: GroupEffect);
}
export declare class PointEffect {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: CompInterface, container: GroupEffect);
}
export declare class LayerIndexEffect {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: CompInterface, container: GroupEffect);
}
export declare class MaskIndexEffect {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: CompInterface, container: GroupEffect);
}
export declare class CheckboxEffect {
    p?: ValueProperty;
    constructor(data: EffectValue, elem: CompInterface, container: GroupEffect);
}
export declare class NoValueEffect {
    p: object;
    constructor();
}
