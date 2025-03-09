import type { SVGStrokeStyleData } from '@/elements/helpers/shapes';
import type { CompInterface, StrokeData } from '@/types';
import { RendererType } from '@/enums';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
export default class DashProperty extends DynamicPropertyContainer {
    dashArray: Float32Array;
    dashoffset: Float32Array;
    dashStr: string;
    dataProps: StrokeData[];
    elem: CompInterface;
    frameId: number;
    k: boolean;
    renderer: RendererType;
    constructor(elem: CompInterface, data: StrokeData[], renderer: RendererType, container: SVGStrokeStyleData);
    getValue(forceRender?: boolean): void;
}
