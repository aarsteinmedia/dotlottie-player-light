import type { MultiDimensionalProperty, ValueProperty } from '@/utils/Properties';
import type ShapePath from '@/utils/shapes/ShapePath';
import { AnimationDirection, Shape, Vector2 } from '@/types';
import ShapeModifier from '@/utils/shapes/ShapeModifier';
declare class ZigZagModifier extends ShapeModifier {
    amplitude?: ValueProperty;
    frequency?: ValueProperty;
    getValue: () => void;
    pointsType?: MultiDimensionalProperty;
    static zigZagCorner(outputBezier: ShapePath, path: ShapePath, cur: number, amplitude: number, frequency: number, pointType: number, direction: AnimationDirection): void;
    static zigZagSegment(outputBezier: ShapePath, segment: Vector2, amplitude: number, frequency: number, pointType: number, directionFromProps: AnimationDirection): AnimationDirection;
    initModifierProperties(elem: any, data: Shape): void;
    processPath(path: any, amplitude: number, frequency: number, pointType: number): ShapeData;
    processShapes(_isFirstFrame: boolean): void;
}
export default ZigZagModifier;
