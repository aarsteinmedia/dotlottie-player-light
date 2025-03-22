import type SVGEffects from '../../elements/svg/SVGEffects';
import type { ElementInterfaceIntersect, Transformer, Vector3 } from '../../types';
import BaseElement from '../../elements/BaseElement';
import Matrix from '../../utils/Matrix';
export declare const effectTypes: {
    TRANSFORM_EFFECT: string;
};
export default class TransformElement extends BaseElement {
    _isFirstFrame?: boolean;
    finalTransform?: Transformer;
    hierarchy?: ElementInterfaceIntersect[];
    localTransforms?: Transformer[];
    mHelper: Matrix;
    renderableEffectsManager?: SVGEffects;
    globalToLocal(point: Vector3): Vector3;
    initTransform(): void;
    renderLocalTransform(): void;
    renderTransform(): void;
    searchEffectTransforms(): void;
}
