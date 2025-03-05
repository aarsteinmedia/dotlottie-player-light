import { RendererType } from '@/enums';
import type AnimationItem from '@/animation/AnimationItem';
import type { GlobalData, LottieLayer, SVGRendererConfig } from '@/types';
export default function SVGRenderer(this: {
    animationItem: AnimationItem;
    layers: null | LottieLayer[];
    renderedFrame: number;
    svgElement: SVGSVGElement;
    layerElement: SVGGElement;
    renderConfig: SVGRendererConfig;
    globalData: GlobalData;
    elements: any[];
    pendingElements: any[];
    destroyed: boolean;
    rendererType: RendererType;
}, animationItem: AnimationItem, config?: SVGRendererConfig): void;
