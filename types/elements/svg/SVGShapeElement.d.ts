import type { AnimatedContent, GlobalData, ItemsData, LottieLayer, Shape, ShapeDataInterface } from '@/types';
import BaseElement from '@/elements/BaseElement';
import FrameElement from '@/elements/helpers/FrameElement';
import HierarchyElement from '@/elements/helpers/HierarchyElement';
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
import { ProcessedElement, SVGFillStyleData, SVGGradientFillStyleData, SVGNoStyleData, SVGShapeData, SVGStrokeStyleData, SVGStyleData, SVGTransformData } from '@/elements/helpers/shapes';
import ShapeElement from '@/elements/ShapeElement';
import SVGBaseElement from '@/elements/svg/SVGBaseElement';
declare class SVGShapeElement {
    animatedContents: AnimatedContent[];
    itemsData: ItemsData[];
    prevViewData: ItemsData['prevViewData'];
    processedElements: ProcessedElement[];
    shapeModifiers: any[];
    shapes: SVGShapeData[];
    shapesData: Shape[];
    stylesList: SVGStyleData[];
    constructor(data: LottieLayer, globalData: GlobalData, comp: any);
    addToAnimatedContents(data: any, element: any): void;
    buildExpressionInterface(): void;
    createContent(): void;
    createGroupElement(data: Shape): any;
    createShapeElement(data: Shape, ownTransformers: any, level: number): SVGShapeData;
    createStyleElement(data: SVGShapeData, level: number): SVGStrokeStyleData | SVGGradientFillStyleData | SVGFillStyleData | SVGNoStyleData | undefined;
    createTransformElement(data: Shape, container: SVGGElement): SVGTransformData;
    destroy(): void;
    filterUniqueShapes(): void;
    initSecondaryElement(): void;
    reloadShapes(): void;
    renderInnerContent: () => void;
    renderShape(): void;
    searchShapes(arr: Shape[], itemsData: any, prevViewData: any, container: SVGGElement, level: number, transformers: any, renderFromProps: boolean): void;
    setElementStyles(elementData: any): void;
    setShapesAsAnimated(shapes: ShapeDataInterface[]): void;
}
interface SVGShapeElement extends BaseElement, SVGBaseElement, ShapeElement, HierarchyElement, FrameElement, RenderableDOMElement {
}
export default SVGShapeElement;
