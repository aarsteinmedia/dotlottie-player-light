import type { CompInterface, TextRangeValue } from '@/types';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
import { ValueProperty } from '@/utils/Properties';
export default class TextSelectorProperty extends DynamicPropertyContainer {
    _currentTextLength: number;
    a: ValueProperty;
    comp: CompInterface;
    data: TextRangeValue;
    e: ValueProperty | {
        v: number;
    };
    elem: CompInterface;
    finalE: number;
    finalS: number;
    k: boolean;
    ne: any;
    o: any;
    s: ValueProperty;
    sm: any;
    xe: any;
    constructor(elem: CompInterface, data: TextRangeValue);
    getMult(indFromProps: number): number;
    getValue(newCharsFlag?: boolean): void;
}
