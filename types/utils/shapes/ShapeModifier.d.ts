import type { CompInterface } from '@/types';
import { type SVGShapeData } from '@/elements/helpers/shapes';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
import { type ShapeProperty } from '@/utils/shapes/ShapeProperty';
declare class ShapeModifier extends DynamicPropertyContainer {
    closed: boolean;
    elem: CompInterface;
    frameId?: number;
    k: boolean;
    shapes: ShapeProperty[];
    addShape(data: SVGShapeData): void;
    init(elem: CompInterface, data: any, _a: any, _b: any): void;
    processKeys(): void;
}
export default ShapeModifier;
