import type { ElementInterfaceIntersect, GradientColor } from '@/types';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
export default class GradientProperty extends DynamicPropertyContainer {
    _cmdf: boolean;
    _collapsable: boolean;
    _hasOpacity: number;
    _omdf: boolean;
    c: Uint8ClampedArray;
    data: GradientColor;
    k: any;
    o: Float32Array;
    prop: any;
    constructor(elem: ElementInterfaceIntersect, data: GradientColor, container: any);
    checkCollapsable(): boolean;
    comparePoints(values: number[], points: number): boolean;
    getValue(forceRender?: boolean): void;
}
