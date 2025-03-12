import type { DocumentData, ElementInterfaceIntersect, TextData } from '../../types';
import { RendererType } from '../../enums';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import LetterProps from '../../utils/text/LetterProps';
export default class TextAnimatorProperty extends DynamicPropertyContainer {
    _frameId: number;
    _isFirstFrame: boolean;
    defaultPropsArray: number[];
    lettersChangedFlag: boolean;
    renderedLetters: LetterProps[];
    private _animatorsData;
    private _elem;
    private _hasMaskedPath;
    private _moreOptions;
    private _pathData;
    private _renderType;
    private _textData;
    private mHelper;
    constructor(textData: TextData, renderType: RendererType, elem: ElementInterfaceIntersect);
    getMeasures(documentData: DocumentData, lettersChangedFlag?: boolean): void;
    getValue(): void;
    searchProperties(_: DynamicPropertyContainer[]): void;
}
