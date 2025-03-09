import type { GlobalData, LottieLayer } from '@/types';
export default class NullElement {
    constructor(data: LottieLayer, globalData: GlobalData, comp: any);
    destroy(): void;
    getBaseElement(): null;
    hide(): void;
    prepareFrame(num: number): void;
    renderFrame(): void;
    sourceRectAtTime(): void;
}
