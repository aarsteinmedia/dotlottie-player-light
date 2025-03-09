import type { KeyframedValueProperty, MultiDimensionalProperty, ValueProperty } from '@/utils/Properties';
import { ShapeType } from '@/enums';
import { CompInterface, LottieLayerData, Shape, ShapeDataProperty, Transformer } from '@/types';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
import DashProperty from '@/utils/shapes/DashProperty';
import GradientProperty from '@/utils/shapes/GradientProperty';
export declare class ShapeGroupData {
    gr: SVGGElement;
    it: unknown[];
    prevViewData: unknown[];
    constructor();
}
export declare class SVGShapeData {
    _isAnimated: boolean;
    caches: unknown[];
    hd?: boolean;
    lStr: string;
    lvl: number;
    sh: ShapeDataProperty;
    styles: any[];
    transformers: Transformer[];
    ty?: ShapeType;
    constructor(transformers: Transformer[], level: number, shape: ShapeDataProperty);
    setAsAnimated(): void;
}
export declare class SVGTransformData {
    _isAnimated: boolean;
    elements: CompInterface[];
    transform: Transformer;
    constructor(mProps: Transformer['mProps'], op: Transformer['op'], container: unknown);
}
export declare class SVGStyleData {
    _mdf: boolean;
    closed: boolean;
    d: string;
    data: SVGShapeData;
    lvl: number;
    msElem: null | SVGMaskElement | SVGPathElement;
    pElem: SVGPathElement;
    type?: ShapeType;
    constructor(data: SVGShapeData, level: number);
    reset(): void;
}
export declare class ProcessedElement {
    elem: LottieLayerData;
    pos: number;
    constructor(element: LottieLayerData, position: number);
}
export declare class SVGGradientFillStyleData extends DynamicPropertyContainer {
    a?: MultiDimensionalProperty;
    cst?: SVGElement[];
    e?: MultiDimensionalProperty;
    g?: GradientProperty;
    getValue: () => void;
    gf?: SVGGradientElement;
    h?: KeyframedValueProperty;
    maskId?: string;
    ms?: SVGMaskElement;
    o?: ValueProperty;
    of?: SVGElement;
    ost?: SVGStopElement[];
    s?: MultiDimensionalProperty;
    stops?: SVGStopElement[];
    style?: SVGStyleData;
    constructor(elem: any, data: Shape, styleData: SVGStyleData);
    initGradientData(elem: any, data: Shape, styleData: SVGStyleData): void;
    setGradientData(pathElement: SVGElement, data: Shape): void;
    setGradientOpacity(data: Shape, styleData: SVGStyleData): void;
}
export declare class SVGGradientStrokeStyleData extends SVGGradientFillStyleData {
    d: DashProperty;
    w?: ValueProperty;
    constructor(elem: CompInterface, data: Shape, styleData: SVGStyleData);
}
export declare class SVGStrokeStyleData extends DynamicPropertyContainer {
    c?: MultiDimensionalProperty;
    d: DashProperty;
    getValue: () => void;
    o?: ValueProperty;
    style: SVGStyleData;
    w?: ValueProperty;
    constructor(elem: CompInterface, data: Shape, styleObj: SVGStyleData);
}
export declare class SVGFillStyleData extends DynamicPropertyContainer {
    c?: MultiDimensionalProperty;
    getValue: () => void;
    o?: ValueProperty;
    style: SVGStyleData;
    constructor(elem: CompInterface, data: Shape, styleObj: SVGStyleData);
}
export declare class SVGNoStyleData extends DynamicPropertyContainer {
    getValue: () => void;
    style: SVGStyleData;
    constructor(elem: CompInterface, _data: SVGShapeData, styleObj: SVGStyleData);
}
