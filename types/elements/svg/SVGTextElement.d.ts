import type { CompInterface, GlobalData, LottieLayer } from '@/types';
import type Matrix from '@/utils/Matrix';
import BaseElement from '@/elements/BaseElement';
import FrameElement from '@/elements/helpers/FrameElement';
import HierarchyElement from '@/elements/helpers/HierarchyElement';
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
import SVGBaseElement from '@/elements/svg/SVGBaseElement';
import TextElement from '@/elements/TextElement';
import { RendererType } from '@/enums';
declare class SVGTextLottieElement {
    data: LottieLayer;
    layerElement: SVGGElement;
    mHelper: Matrix;
    renderType: RendererType;
    textSpans: {
        childSpan?: null | SVGTSpanElement;
        glyph: null | string;
        span: null | SVGTSpanElement;
    }[];
    private emptyShapeData;
    constructor(data: LottieLayer, globalData: GlobalData, comp: CompInterface);
    buildNewText(): void;
    buildShapeData(data: LottieLayer, scale: number): LottieLayer;
    buildTextContents(textArray: string[]): string[];
    createContent(): void;
    getValue(): void;
    renderInnerContent: () => void;
    sourceRectAtTime(): any;
}
interface SVGTextLottieElement extends BaseElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, TextElement {
}
export default SVGTextLottieElement;
