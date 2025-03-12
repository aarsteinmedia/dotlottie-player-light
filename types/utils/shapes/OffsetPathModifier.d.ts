import type { ElementInterfaceIntersect, Shape } from '../../types';
import type { ValueProperty } from '../../utils/Properties';
import ShapeModifier from '../../utils/shapes/ShapeModifier';
import ShapePath from '../../utils/shapes/ShapePath';
export default class OffsetPathModifier extends ShapeModifier {
    amount?: ValueProperty;
    lineJoin?: number;
    miterLimit?: ValueProperty;
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processPath(inputBezier: ShapePath, amount: number, lineJoin: number, miterLimit: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
