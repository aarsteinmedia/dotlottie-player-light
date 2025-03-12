import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '@/types';
import FrameElement from '@/elements/helpers/FrameElement';
export default class FootageElement extends FrameElement {
    assetData: null | LottieAsset;
    footageData: SVGElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    getBaseElement(): null;
    getFootageData(): SVGElement;
    initExpressions(): void;
    initRenderable(): void;
    setMatte(_id: string): void;
}
