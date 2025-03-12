import type { AngleEffect, CheckboxEffect, ColorEffect, LayerIndexEffect, MaskIndexEffect, NoValueEffect, PointEffect, SliderEffect } from '../../effects';
import { ElementInterfaceIntersect } from '../../types';
type Filter = AngleEffect | CheckboxEffect | ColorEffect | LayerIndexEffect | MaskIndexEffect | NoValueEffect | PointEffect | SliderEffect;
export default class SVGEffects {
    static idPrefix: string;
    filters: Filter[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: string): (SliderEffect | AngleEffect | ColorEffect | PointEffect | CheckboxEffect | LayerIndexEffect | MaskIndexEffect | NoValueEffect)[];
    renderFrame(frame?: number | null): void;
}
export {};
