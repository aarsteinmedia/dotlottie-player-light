import type { AnimatedContent, ElementInterfaceIntersect, GlobalData, ItemsData, LottieLayer, Shape, ShapeDataInterface, Transformer } from '../../types';
import { ShapeGroupData, SVGFillStyleData, SVGGradientFillStyleData, SVGNoStyleData, SVGShapeData, SVGStyleData, SVGTransformData } from '../../elements/helpers/shapes';
import ShapeElement from '../../elements/ShapeElement';
export default class SVGShapeElement extends ShapeElement {
    _debug?: boolean;
    animatedContents: AnimatedContent[];
    prevViewData: ItemsData['prevViewData'];
    stylesList: SVGStyleData[];
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    addToAnimatedContents(data: any, element: any): void;
    buildExpressionInterface(): void;
    createContent(): void;
    createGroupElement(data: Shape): ShapeGroupData;
    createShapeElement(data: Shape, ownTransformers: Transformer[], level: number): SVGShapeData;
    createStyleElement(data: Shape, level: number): SVGFillStyleData | SVGGradientFillStyleData | SVGNoStyleData | undefined;
    createTransformElement(data: Shape, container: SVGGElement): SVGTransformData;
    destroy(): void;
    filterUniqueShapes(): void;
    initSecondaryElement(): void;
    reloadShapes(): void;
    renderInnerContent(): void;
    renderShape(): void;
    searchShapes(arr: Shape[], itemsData: any, prevViewData: any, container: SVGGElement, level: number, transformers: any, renderFromProps: boolean): void;
    setElementStyles(elementData: any): void;
    setShapesAsAnimated(shapes: ShapeDataInterface[]): void;
}
