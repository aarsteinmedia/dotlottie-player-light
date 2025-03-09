import type { CompInterface, GlobalData, LottieLayer } from '@/types';
import CompElement from '@/elements/CompElement';
import SVGBaseElement from '@/elements/svg/SVGBaseElement';
import SVGRendererBase from '@/renderers/SVGRendererBase';
import { KeyframedValueProperty } from '@/utils/PropertyFactory';
declare class SVGCompElement extends SVGBaseElement {
    completeLayers: boolean;
    elements: any[];
    initElement: (data: LottieLayer, globalData: GlobalData, comp: CompInterface) => void;
    layers: LottieLayer[];
    pendingElements: any[];
    supports3d: boolean;
    tm?: KeyframedValueProperty;
    constructor(data: LottieLayer, globalData: GlobalData, comp: CompInterface);
    createComp(data: LottieLayer): SVGCompElement;
}
interface SVGCompElement extends SVGRendererBase, CompElement {
}
export default SVGCompElement;
