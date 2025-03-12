import type { ElementInterfaceIntersect, StrokeData } from '../../types';
import { RendererType } from '../../enums';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
export default class DashProperty extends DynamicPropertyContainer {
    dashArray: Float32Array;
    dashoffset: Float32Array;
    dashStr: string;
    dataProps: StrokeData[];
    elem: ElementInterfaceIntersect;
    frameId: number;
    k: boolean;
    renderer: RendererType;
    constructor(elem: ElementInterfaceIntersect, data: StrokeData[], renderer: RendererType, container: ElementInterfaceIntersect);
    getValue(forceRender?: boolean): void;
}
