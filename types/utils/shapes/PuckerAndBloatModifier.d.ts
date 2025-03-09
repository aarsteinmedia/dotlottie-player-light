import type { ShapeData } from '@/types';
import { type PropertyType } from '@/utils/PropertyFactory';
import ShapeModifier from '@/utils/shapes/ShapeModifier';
export default class PuckerAndBloatModifier extends ShapeModifier {
    amount?: PropertyType;
    getValue: () => void;
    initModifierProperties(elem: any, data: any): void;
    processPath(path: ShapeData, amount: number): ShapeData;
    processShapes(_isFirstFrame: boolean): void;
}
