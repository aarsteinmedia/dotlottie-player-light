import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import type { KeyframedValueProperty } from '../../utils/Properties';
import SVGBaseElement from '../../elements/svg/SVGBaseElement';
export default class SVGCompElement extends SVGBaseElement {
    _debug?: boolean;
    _mdf?: boolean;
    supports3d: boolean;
    tm?: KeyframedValueProperty;
    constructor(data: LottieLayer, globalData: GlobalData, comp: any);
    createComp(data: LottieLayer): SVGCompElement;
    destroy(): void;
    initElement(_data: LottieLayer, _globalData: GlobalData, _comp: ElementInterfaceIntersect): void;
    prepareFrame(_val: number): void;
    renderFrame(): void;
}
