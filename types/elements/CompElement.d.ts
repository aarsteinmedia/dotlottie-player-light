import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../types';
import SVGRendererBase from '../renderers/SVGRendererBase';
import { ValueProperty } from '../utils/Properties';
export default class CompElement extends SVGRendererBase {
    _mdf?: boolean;
    createContainerElements: any;
    createRenderableComponents: any;
    initRendererElement: any;
    isInRange?: boolean;
    tm?: ValueProperty;
    destroy(): void;
    destroyBaseElement(): void;
    destroyElements(): void;
    getElements(): ElementInterfaceIntersect[] | undefined;
    initElement(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect): void;
    initFrame(): void;
    initHierarchy(): void;
    initRenderable(): void;
    initTransform(): void;
    prepareFrame(_val: number): void;
    prepareProperties(_val: number, _isInRange?: boolean): void;
    prepareRenderableFrame(_val: number, _?: boolean): void;
    renderInnerContent(): void;
    setElements(elems: ElementInterfaceIntersect[]): void;
}
