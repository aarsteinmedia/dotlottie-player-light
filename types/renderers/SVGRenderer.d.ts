import type AnimationItem from '../animation/AnimationItem';
import type { LottieLayer, SVGRendererConfig } from '../types';
import SVGCompElement from '../elements/svg/SVGCompElement';
import { RendererType } from '../enums';
import SVGRendererBase from '../renderers/SVGRendererBase';
export default class SVGRenderer extends SVGRendererBase {
    rendererType: RendererType;
    constructor(animationItem: AnimationItem, config?: SVGRendererConfig);
    createComp(data: LottieLayer): SVGCompElement;
}
