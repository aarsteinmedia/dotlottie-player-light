import type { ElementInterfaceIntersect, GlobalData, LottieLayer, Mask } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
import { ValueProperty } from '@/utils/Properties';
export default class MaskElement {
    data: LottieLayer;
    element: ElementInterfaceIntersect;
    globalData: GlobalData;
    maskElement: SVGElement | null;
    masksProperties: null | Mask[];
    solidPath: string;
    storedData: {
        elem: SVGPathElement;
        expan: SVGFEMorphologyElement | null;
        filterId?: string;
        lastOperator: string;
        lastPath: string;
        lastRadius: number;
        x: ValueProperty | null;
    }[];
    viewData: any[];
    constructor(data: LottieLayer, element: ElementInterfaceIntersect, globalData: GlobalData);
    createLayerSolidPath(): string;
    destroy(): void;
    drawPath(pathData: null | Mask, pathNodes: ShapePath, viewData: any): void;
    getMaskelement(): SVGElement | null;
    getMaskProperty(pos: number): any;
    renderFrame(frame?: number | null): void;
}
