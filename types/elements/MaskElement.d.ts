import type { GlobalData, LottieLayer, Mask } from '@/types';
export default function MaskElement(this: {
    data: LottieLayer;
    element: any;
    globalData: GlobalData;
    storedData: unknown[];
    masksProperties: LottieLayer['masksProperties'];
    maskElement: SVGElement | null;
    viewData: any[];
    solidPath: string;
    createLayerSolidPath: () => string;
    drawPath: (mask: Mask, b: any, c: any) => void;
}, data: LottieLayer, element: any, globalData: GlobalData): void;
