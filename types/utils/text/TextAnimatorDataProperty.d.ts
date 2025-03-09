import type { ValueProperty } from '@/utils/Properties';
import { CompInterface } from '@/types';
import TextSelectorProperty from '@/utils/text/TextSelectorProperty';
export default class TextAnimatorDataProperty {
    a?: {
        a: ValueProperty;
        fb: ValueProperty;
        fc: ValueProperty;
        fh: ValueProperty;
        fs: ValueProperty;
        o: ValueProperty;
        p: ValueProperty;
        r: ValueProperty;
        rx: ValueProperty;
        ry: ValueProperty;
        s: ValueProperty;
        sa: ValueProperty;
        sc: ValueProperty;
        sk: ValueProperty;
        sw: ValueProperty;
        t: ValueProperty;
    };
    s?: TextSelectorProperty;
    constructor(elem: CompInterface, animatorProps?: TextAnimatorDataProperty, container?: CompInterface);
}
