import type { GlobalData, LottieLayer, SourceRect } from '../../types';
import SVGCompElement from '../../elements/svg/SVGCompElement';
import SVGShapeElement from '../../elements/svg/SVGShapeElement';
import TextElement from '../../elements/TextElement';
export default class SVGTextLottieElement extends TextElement {
    _sizeChanged?: boolean;
    bbox?: {
        height: number;
        left: number;
        top: number;
        width: number;
    };
    renderedFrame?: number;
    renderedLetters?: string[];
    textContainer?: SVGTextElement;
    textSpans: {
        childSpan?: null | SVGTextElement | SVGGElement;
        glyph: null | SVGCompElement | SVGShapeElement;
        span: null | SVGTextElement | SVGGElement;
    }[];
    private emptyShapeData;
    constructor(data: LottieLayer, globalData: GlobalData, comp: any);
    addDynamicProperty(_element: any): void;
    buildNewText(): void;
    buildShapeData(data: LottieLayer, scale: number): LottieLayer;
    buildTextContents(textArray: string[]): string[];
    createContent(): void;
    getValue(): void;
    renderInnerContent: (this: SVGTextLottieElement) => void;
    sourceRectAtTime(): SourceRect | null;
}
