import type { ElementInterfaceIntersect, Shape } from '@/types';
import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
import type { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers';
import type ShapePath from '@/utils/shapes/ShapePath';
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
import { ProcessedElement, type SVGShapeData } from '@/elements/helpers/shapes';
export default class ShapeElement extends RenderableDOMElement {
    _length?: number;
    processedElements?: ProcessedElement[];
    shapeModifiers?: ShapeModifierInterface[];
    shapes?: SVGShapeData[] | ShapePath[];
    addDynamicProperty(_prop: DynamicPropertyContainer): void;
    addProcessedElement(elem: ElementInterfaceIntersect, pos: number): void;
    addShapeToModifiers(data: SVGShapeData): void;
    isShapeInAnimatedModifiers(data: Shape): boolean;
    prepareFrame(num: number): void;
    prepareProperties(_val: number, _flag?: boolean): void;
    renderModifiers(): void;
    searchProcessedElement(elem: ElementInterfaceIntersect): number;
}
