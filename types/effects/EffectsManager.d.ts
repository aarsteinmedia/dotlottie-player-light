import type { Effect, CompInterface, LottieLayer } from '@/types';
import { AngleEffect, CheckboxEffect, ColorEffect, LayerIndexEffect, MaskIndexEffect, NoValueEffect, PointEffect, SliderEffect } from '@/effects';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
export default class EffectsManager {
    effectElements: EffectElement[];
    constructor(data: LottieLayer, element: CompInterface);
}
export declare class GroupEffect extends DynamicPropertyContainer {
    data?: Effect;
    effectElements?: EffectElement[];
    getValue: () => void;
    constructor(data: Effect, element: CompInterface);
    init(data: Effect, element: CompInterface): void;
}
type EffectElement = GroupEffect | EffectsManager | SliderEffect | AngleEffect | ColorEffect | PointEffect | CheckboxEffect | LayerIndexEffect | MaskIndexEffect | NoValueEffect;
export {};
