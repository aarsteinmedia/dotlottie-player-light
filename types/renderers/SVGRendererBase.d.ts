import type { AnimationData, ElementInterfaceIntersect, LottieLayer, SVGRendererConfig } from '@/types';
import ImageElement from '@/elements/ImageElement';
import NullElement from '@/elements/NullElement';
import SolidElement from '@/elements/SolidElement';
import SVGShapeElement from '@/elements/svg/SVGShapeElement';
import SVGTextLottieElement from '@/elements/svg/SVGTextElement';
import BaseRenderer from '@/renderers/BaseRenderer';
export default class SVGRendererBase extends BaseRenderer {
    destroyed?: boolean;
    renderConfig?: SVGRendererConfig;
    renderedFrame?: number;
    svgElement?: SVGSVGElement;
    appendElementInPos(element: ElementInterfaceIntersect, pos: number): void;
    buildItem(pos: number): void;
    checkPendingElements(): void;
    configAnimation(animData: AnimationData): void;
    createImage(data: LottieLayer): ImageElement;
    createNull(data: LottieLayer): NullElement;
    createShape(data: LottieLayer): SVGShapeElement;
    createSolid(data: LottieLayer): SolidElement;
    createText(data: LottieLayer): SVGTextLottieElement;
    destroy(): void;
    findIndexByInd(ind?: number): number;
    hide(): void;
    renderFrame(numFromProps?: number | null): void;
    show(): void;
    updateContainerSize(_width?: number, _height?: number): void;
}
