import type { ElementInterfaceIntersect, TextRangeValue } from '@/types';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
import { ValueProperty } from '@/utils/Properties';
export default class TextSelectorProperty extends DynamicPropertyContainer {
    _currentTextLength: number;
    a: ValueProperty;
    b?: any;
    comp?: ElementInterfaceIntersect;
    data: TextRangeValue;
    e: ValueProperty | {
        v: number;
    };
    elem: ElementInterfaceIntersect;
    finalE: number;
    finalS: number;
    k: boolean;
    ne: any;
    o: any;
    rn?: number;
    s: ValueProperty;
    sm: any;
    totalChars?: number;
    xe: any;
    constructor(elem: ElementInterfaceIntersect, data: TextRangeValue);
    getMult(indFromProps: number, _val?: number): number | number[];
    getValue(newCharsFlag?: boolean): void;
}
