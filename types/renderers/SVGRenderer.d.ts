import type AnimationItem from '@/animation/AnimationItem';
import type { GlobalData, LottieLayer, SVGRendererConfig } from '@/types';
import SVGCompElement from '@/elements/svg/SVGCompElement';
import { RendererType } from '@/enums';
import SVGRendererBase from '@/renderers/SVGRendererBase';
export default class SVGRenderer extends SVGRendererBase {
    animationItem: AnimationItem;
    destroyed: boolean;
    elements: any[];
    globalData: GlobalData;
    layerElement: SVGGElement;
    layers: LottieLayer[];
    pendingElements: any[];
    renderConfig: SVGRendererConfig;
    renderedFrame: number;
    rendererType: RendererType;
    svgElement: SVGSVGElement;
    constructor(animationItem: AnimationItem, config?: SVGRendererConfig);
    createComp(data: LottieLayer): SVGCompElement;
}
