import type { GlobalData, LottieLayer, Mask } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
export default class MaskElement {
    data: LottieLayer;
    element: any;
    globalData: GlobalData;
    maskElement: SVGElement | null;
    masksProperties: null | Mask[];
    solidPath: string;
    storedData: any[];
    viewData: any[];
    constructor(data: LottieLayer, element: any, globalData: GlobalData);
    createLayerSolidPath(): string;
    destroy(): void;
    drawPath(pathData: null | Mask, pathNodes: ShapePath, viewData: any): void;
    getMaskelement(): SVGElement | null;
    getMaskProperty(pos: number): any;
    renderFrame(isFirstFrame?: boolean): void;
}
