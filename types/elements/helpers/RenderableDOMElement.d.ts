import type { CompInterface, GlobalData, LottieLayer } from '@/types';
declare class RenderableDOMElement {
    _isFirstFrame?: boolean;
    _mdf?: boolean;
    baseElement?: SVGGElement;
    data: LottieLayer;
    hidden?: boolean;
    isInRange?: boolean;
    isTransparent?: boolean;
    layerElement: SVGGElement;
    prepareRenderableFrame: (num: number) => void;
    destroy(): void;
    hide(): void;
    initElement(data: LottieLayer, globalData: GlobalData, comp: CompInterface): void;
    prepareFrame(num: number): void;
    renderFrame(): void;
    renderInnerContent(): void;
    show(): void;
}
export default RenderableDOMElement;
