import type { ElementInterfaceIntersect, Shape } from '@/types';
import type { ValueProperty } from '@/utils/Properties';
import type ShapePath from '@/utils/shapes/ShapePath';
import ShapeModifier from '@/utils/shapes/ShapeModifier';
export default class PuckerAndBloatModifier extends ShapeModifier {
    amount?: ValueProperty;
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processPath(path: ShapePath, amount: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
