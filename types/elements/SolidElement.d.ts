import type { CompInterface, GlobalData, LottieLayer } from '@/types';
import ImageElement from '@/elements/ImageElement';
declare class ISolidElement extends ImageElement {
    data: LottieLayer;
    initElement: (data: LottieLayer, globalData: GlobalData, comp: CompInterface) => void;
    layerElement?: SVGGElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: CompInterface);
    createContent(): void;
}
export default ISolidElement;
