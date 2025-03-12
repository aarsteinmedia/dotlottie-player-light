import type { Transformer } from '../../types';
import SVGEffects from '../../elements/svg/SVGEffects';
import BaseRenderer from '../../renderers/BaseRenderer';
export default abstract class SVGBaseElement extends BaseRenderer {
    _sizeChanged?: boolean;
    finalTransform?: Transformer;
    maskedElement?: SVGGElement;
    matteElement?: SVGGElement;
    matteMasks?: {
        [key: number]: string;
    };
    renderableEffectsManager?: SVGEffects;
    searchEffectTransforms: any;
    transformedElement?: SVGGElement;
    createContainerElements(): void;
    createRenderableComponents(): void;
    destroyBaseElement(): void;
    getBaseElement(): SVGGElement | null | undefined;
    getMatte(matteType?: number): string;
    initRendererElement(): void;
    renderElement(): void;
    setMatte(id: string): void;
}
