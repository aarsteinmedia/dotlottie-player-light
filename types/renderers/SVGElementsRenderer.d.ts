import type { Shape } from '@/types';
declare const SVGElementsRenderer: {
    createRenderFunction: (data: Shape) => ((styleData: any, itemData: any, isFirstFrame: boolean) => void) | null;
};
export default SVGElementsRenderer;
