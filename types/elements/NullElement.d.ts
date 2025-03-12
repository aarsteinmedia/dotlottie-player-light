import type { GlobalData, LottieLayer } from '@/types';
import FrameElement from '@/elements/helpers/FrameElement';
export default class NullElement extends FrameElement {
    constructor(data: LottieLayer, globalData: GlobalData, comp: any);
    getBaseElement(): null;
    prepareFrame(num: number): void;
    renderFrame(_frame?: number | null): void;
}
