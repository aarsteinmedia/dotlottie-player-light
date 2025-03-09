import type { ItemData, Shape, ShapeDataInterface, StyleData } from '@/types';
declare const SVGElementsRenderer: {
    createRenderFunction: (data: Shape) => ((_: StyleData, itemData: ItemData, isFirstFrame: boolean) => void) | ((styleData: StyleData, itemData: ShapeDataInterface, isFirstFrame: boolean) => void) | null;
};
export default SVGElementsRenderer;
