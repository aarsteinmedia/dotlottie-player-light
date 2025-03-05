import type { ElementInterface, GlobalData, LottieAsset, LottieLayer } from '@/types';
interface ImageElement {
    assetData: LottieAsset | null;
    sourceRect: {
        height: number;
        left: number;
        top: number;
        width: number;
    };
    initElement: (data: LottieLayer, globalData: GlobalData, comp: any) => void;
    innerElem: SVGImageElement;
    globalData: GlobalData;
    layerElement: SVGElement;
}
export default function IImageElement(this: ImageElement, data: LottieLayer, globalData: GlobalData, comp: ElementInterface): void;
export {};
