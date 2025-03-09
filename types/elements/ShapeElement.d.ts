import type { CompInterface, Shape } from '@/types';
import { ProcessedElement } from '@/elements/helpers/shapes';
declare class ShapeElement {
    processedElements: ProcessedElement[];
    addProcessedElement(elem: CompInterface, pos: number): void;
    addShapeToModifiers(data: Shape): void;
    isShapeInAnimatedModifiers(data: Shape): boolean;
    prepareFrame(num: number): void;
    renderModifiers(): void;
    searchProcessedElement(elem: any): number;
}
export default ShapeElement;
