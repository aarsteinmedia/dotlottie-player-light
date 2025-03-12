import type MaskElement from '@/elements/MaskElement';
import type { ElementInterfaceIntersect, GlobalData, ItemsData, LottieLayer, Shape } from '@/types';
import EffectsManager from '@/effects/EffectsManager';
import ProjectInterface from '@/utils/helpers/ProjectInterface';
export default abstract class BaseElement {
    baseElement?: SVGGElement;
    comp?: ElementInterfaceIntersect;
    compInterface?: ProjectInterface;
    data?: LottieLayer;
    effectsManager?: EffectsManager;
    globalData?: GlobalData;
    itemsData?: ItemsData[];
    layerElement?: SVGGElement;
    layerId?: string;
    layerInterface?: ProjectInterface;
    maskManager?: MaskElement;
    shapesData?: Shape[];
    type?: unknown;
    checkMasks(): boolean;
    getType(): unknown;
    initBaseData(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect): void;
    initExpressions(): void;
    setBlendMode(): void;
}
