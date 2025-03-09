import type { GlobalData, LottieAsset, LottieLayer } from '@/types';
import BaseElement from '@/elements/BaseElement';
import FrameElement from '@/elements/helpers/FrameElement';
import RenderableElement from '@/elements/helpers/RenderableElement';
declare class FootageElement extends FrameElement {
    assetData: null | LottieAsset;
    footageData: SVGElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: any);
    getBaseElement(): null;
    getFootageData(): SVGElement;
    initExpressions(): void;
}
interface FootageElement extends RenderableElement, BaseElement {
}
export default FootageElement;
