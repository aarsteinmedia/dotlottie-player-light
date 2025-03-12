import type { ElementInterfaceIntersect, Vector2 } from '@/types';
import type { MultiDimensionalProperty, NoProperty, ValueProperty } from '@/utils/Properties';
import TextSelectorProperty from '@/utils/text/TextSelectorProperty';
export default class TextAnimatorDataProperty {
    a?: {
        a: ValueProperty | NoProperty;
        fb: ValueProperty | NoProperty;
        fc: ValueProperty | NoProperty;
        fh: ValueProperty | NoProperty;
        fs: ValueProperty | NoProperty;
        o: ValueProperty | NoProperty;
        p: MultiDimensionalProperty<Vector2> | NoProperty;
        r: ValueProperty | NoProperty;
        rx: ValueProperty | NoProperty;
        ry: ValueProperty | NoProperty;
        s: ValueProperty | NoProperty;
        sa: ValueProperty | NoProperty;
        sc: ValueProperty | NoProperty;
        sk: ValueProperty | NoProperty;
        sw: ValueProperty | NoProperty;
        t: ValueProperty | NoProperty;
    };
    s?: TextSelectorProperty;
    constructor(elem: ElementInterfaceIntersect, animatorProps?: TextAnimatorDataProperty, container?: ElementInterfaceIntersect);
}
