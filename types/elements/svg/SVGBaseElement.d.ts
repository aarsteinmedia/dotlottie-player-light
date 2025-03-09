import MaskElement from '@/elements/MaskElement';
import SVGEffects from '@/elements/svg/SVGEffects';
import { CompInterface, GlobalData, LottieLayer } from '@/types';
export default class SVGBaseElement {
    _sizeChanged?: boolean;
    baseElement?: SVGGElement;
    checkMasks: () => boolean;
    comp?: CompInterface;
    data: LottieLayer;
    finalTransform?: any;
    globalData: GlobalData;
    layerElement: SVGGElement;
    layerId: string;
    maskedElement?: SVGGElement;
    maskManager: MaskElement;
    matteElement?: SVGGElement;
    matteMasks?: {
        [key: number]: unknown;
    };
    renderableEffectsManager?: SVGEffects;
    searchEffectTransforms: () => void;
    setBlendMode: () => void;
    transformedElement?: SVGGElement;
    createContainerElements(): void;
    createRenderableComponents(): void;
    destroyBaseElement(): void;
    getBaseElement(): SVGGElement | null | undefined;
    getMatte(matteType: number): unknown;
    initRendererElement(): void;
    renderElement(): void;
    setMatte(id: string): void;
}
