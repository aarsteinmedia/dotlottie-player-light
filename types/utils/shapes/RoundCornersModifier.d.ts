import type { CompInterface, LottieLayer } from '@/types';
import type { ValueProperty } from '@/utils/Properties';
import type ShapePath from '@/utils/shapes/ShapePath';
import ShapeModifier from '@/utils/shapes/ShapeModifier';
export default class RoundCornersModifier extends ShapeModifier {
    getValue: () => void;
    rd?: ValueProperty;
    initModifierProperties(elem: CompInterface, data: LottieLayer): void;
    processPath(path: ShapePath, round: number): ShapePath;
    processShapes(_isFirstFrame: boolean): void;
}
