import type { ValueProperty } from '../../utils/Properties';
import type ShapePath from '../../utils/shapes/ShapePath';
import PolynomialBezier from '../../elements/PolynomialBezier';
import { AnimationDirection, ElementInterfaceIntersect, Shape } from '../../types';
import ShapeModifier from '../../utils/shapes/ShapeModifier';
export default class ZigZagModifier extends ShapeModifier {
    amplitude?: ValueProperty;
    frequency?: ValueProperty;
    pointsType?: ValueProperty;
    static zigZagCorner(outputBezier: ShapePath, path: ShapePath, cur: number, amplitude: number, frequency: number, pointType: number, direction: AnimationDirection): void;
    static zigZagSegment(outputBezier: ShapePath, segment: PolynomialBezier, amplitude: number, frequency: number, pointType: number, directionFromProps: AnimationDirection): AnimationDirection;
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processPath(path: ShapePath, amplitude: number, frequency: number, pointType: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
