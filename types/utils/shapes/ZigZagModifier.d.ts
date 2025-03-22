import type { ValueProperty } from '../../utils/Properties';
import type ShapePath from '../../utils/shapes/ShapePath';
import { ElementInterfaceIntersect, Shape } from '../../types';
import ShapeModifier from '../../utils/shapes/ShapeModifier';
export default class ZigZagModifier extends ShapeModifier {
    amplitude?: ValueProperty;
    frequency?: ValueProperty;
    pointsType?: ValueProperty;
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processPath(path: ShapePath, amplitude: number, frequency: number, pointType: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
