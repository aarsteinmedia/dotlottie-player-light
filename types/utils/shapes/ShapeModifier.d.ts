import type { ElementInterfaceIntersect, ElementInterfaceUnion, Shape } from '../../types';
import { type SVGShapeData } from '../../elements/helpers/shapes';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
declare class ShapeModifier extends DynamicPropertyContainer {
    closed?: boolean;
    elem?: ElementInterfaceIntersect;
    frameId?: number;
    k?: boolean;
    shapes?: any[];
    addShape(data: SVGShapeData): void;
    addShapeToModifier(_shapeData: SVGShapeData): void;
    init(elem: ElementInterfaceIntersect, data?: any, _a?: any, _b?: any): void;
    initModifierProperties(_elem: ElementInterfaceUnion, _data: Shape): void;
    isAnimatedWithShape(_data: Shape): void;
    processKeys(): void;
}
export default ShapeModifier;
