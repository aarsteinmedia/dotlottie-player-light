import type { Shape } from '../types';
export default class SVGElementsRenderer {
    static createRenderFunction(data: Shape): typeof SVGElementsRenderer.renderFill | typeof SVGElementsRenderer.renderGradient | typeof SVGElementsRenderer.renderPath | null;
    private static renderContentTransform;
    private static renderFill;
    private static renderGradient;
    private static renderGradientStroke;
    private static renderNoop;
    private static renderPath;
    private static renderStroke;
}
export type CreateRenderFunction = typeof SVGElementsRenderer.createRenderFunction;
