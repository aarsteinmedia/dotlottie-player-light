import type FrameElement from '@/elements/helpers/FrameElement';
import type RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
import type RenderableElement from '@/elements/helpers/RenderableElement';
import type ISolidElement from '@/elements/SolidElement';
import type { DocumentData, GlobalData, LottieLayer, Shape, Vector3 } from '@/types';
import type Matrix from '@/utils/Matrix';
import LetterProps from '@/utils/text/LetterProps';
import TextAnimatorProperty from '@/utils/text/TextAnimatorProperty';
declare class TextElement {
    emptyProp: LetterProps;
    lettersChangedFlag: boolean;
    textAnimator: TextAnimatorProperty;
    textProperty: any;
    applyTextPropertiesToMatrix(documentData: DocumentData, matrixHelper: Matrix, lineNumber: number, xPos: number, yPos: number): void;
    buildColor(colorData: Vector3): string;
    canResizeFont(_canResize: boolean): void;
    createPathShape(matrixHelper: Matrix, shapes: Shape[]): string;
    initElement(data: LottieLayer, globalData: GlobalData, comp: any): void;
    prepareFrame(num: number): void;
    setMinimumFontSize(_fontSize: number): void;
    updateDocumentData(newData: DocumentData, index: number): void;
    validateText(): void;
}
interface TextElement extends FrameElement, RenderableElement, RenderableDOMElement, ISolidElement, SVGTextElement {
}
export default TextElement;
