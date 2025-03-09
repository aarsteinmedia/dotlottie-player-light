import type { CompInterface, LottieLayer, Shape } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
import Matrix from '@/utils/Matrix';
import ShapeModifier from '@/utils/shapes/ShapeModifier';
export default class RepeaterModifier extends ShapeModifier {
    matrix: Matrix;
    pMatrix: Matrix;
    rMatrix: Matrix;
    sMatrix: Matrix;
    tMatrix: Matrix;
    applyTransforms(pMatrix: Matrix, rMatrix: Matrix, sMatrix: Matrix, transform: any, perc: number, inv?: boolean): void;
    changeGroupRender(elements: Shape[], renderFlag?: boolean): void;
    cloneElements(elements: Shape[]): any;
    init(elem: CompInterface, arr: LottieLayer[], posFromProps: number, elemsData: ShapePath): void;
    initModifierProperties(elem: CompInterface, data: Shape): void;
    processShapes(_isFirstFrame: boolean): boolean;
    resetElements(elements: Shape[]): void;
}
