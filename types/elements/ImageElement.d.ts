import type { CompInterface, GlobalData, LottieLayer } from '@/types';
export default class ImageElement {
    constructor(data: LottieLayer, globalData: GlobalData, comp: CompInterface);
    createContent(): void;
    sourceRectAtTime(): any;
}
