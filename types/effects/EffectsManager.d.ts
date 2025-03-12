import type { Effect, ElementInterfaceIntersect, LottieLayer } from '../types';
import { AngleEffect, CheckboxEffect, ColorEffect, LayerIndexEffect, MaskIndexEffect, NoValueEffect, PointEffect, SliderEffect } from '../effects';
import DynamicPropertyContainer from '../utils/helpers/DynamicPropertyContainer';
export default class EffectsManager {
    effectElements: EffectInterface[];
    constructor(data: LottieLayer, element: ElementInterfaceIntersect);
}
export declare class GroupEffect extends DynamicPropertyContainer {
    data?: Effect;
    effectElements?: EffectInterface[];
    getValue: () => void;
    constructor(data: Effect, element: ElementInterfaceIntersect, layer: LottieLayer);
    init(data: Effect, element: ElementInterfaceIntersect, layer: LottieLayer): void;
}
export type EffectInterface = GroupEffect | EffectsManager | SliderEffect | AngleEffect | ColorEffect | PointEffect | CheckboxEffect | LayerIndexEffect | MaskIndexEffect | NoValueEffect;
