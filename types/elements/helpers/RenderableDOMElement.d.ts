import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default abstract class RenderableDOMElement extends RenderableElement {
    createContainerElements: any;
    createRenderableComponents: any;
    initRendererElement: any;
    innerElem?: SVGElement | null;
    renderElement: any;
    createContent(): void;
    destroy(): void;
    destroyBaseElement(): void;
    initElement(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect): void;
    prepareFrame(num: number): void;
    renderFrame(_frame?: number | null): void;
    renderInnerContent(): void;
}
