import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer, SourceRect } from '@/types';
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
export default class ImageElement extends RenderableDOMElement {
    assetData?: LottieAsset | null;
    sourceRect: SourceRect | null;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createContent(): void;
    sourceRectAtTime(): SourceRect | null;
}
