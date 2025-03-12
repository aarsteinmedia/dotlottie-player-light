import type { ElementInterfaceIntersect, Shape } from '../../types';
import type { ValueProperty } from '../../utils/Properties';
import type ShapePath from '../../utils/shapes/ShapePath';
import ShapeModifier from '../../utils/shapes/ShapeModifier';
export default class RoundCornersModifier extends ShapeModifier {
    rd?: ValueProperty;
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processPath(path: ShapePath, round: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
