import type { GlobalData, LottieLayer } from '@/types';
import EffectsManager from '@/effects/EffectsManager';
export default class BaseElement {
    comp: any;
    data: LottieLayer;
    effectsManager: EffectsManager;
    globalData: GlobalData;
    layerId: string;
    checkMasks(): boolean;
    getType(): any;
    initBaseData(data: LottieLayer, globalData: GlobalData, comp: any): void;
    initExpressions(): void;
    setBlendMode(): void;
}
