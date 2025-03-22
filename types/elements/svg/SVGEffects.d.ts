import { GroupEffect } from '../../effects/EffectsManager';
import { ElementInterfaceIntersect } from '../../types';
export default class SVGEffects {
    static idPrefix: string;
    filters: GroupEffect[];
    constructor(elem: ElementInterfaceIntersect);
    getEffects(type: string): GroupEffect[];
    renderFrame(frame?: number | null): void;
}
