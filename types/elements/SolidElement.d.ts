import type { GlobalData, LottieLayer } from '../types';
import ImageElement from '../elements/ImageElement';
export default class SolidElement extends ImageElement {
    constructor(data: LottieLayer, globalData: GlobalData, comp: any);
    createContent(): void;
}
