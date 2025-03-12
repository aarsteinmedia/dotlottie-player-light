import type { KeyframedValueProperty, MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
import type { ShapeProperty } from '../../utils/shapes/ShapeProperty';
import { ShapeType } from '../../enums';
import { AnimatedProperty, ElementInterfaceIntersect, ElementInterfaceUnion, Shape, Transformer, Vector3 } from '../../types';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import DashProperty from '../../utils/shapes/DashProperty';
import GradientProperty from '../../utils/shapes/GradientProperty';
import TransformProperty from '../../utils/TransformProperty';
export declare class ShapeGroupData {
    _render?: boolean;
    gr: SVGGElement;
    it: Shape[];
    prevViewData: unknown[];
    constructor();
}
export declare class SVGShapeData {
    _isAnimated: boolean;
    _length?: number;
    caches: unknown[];
    hd?: boolean;
    lStr: string;
    lvl: number;
    sh: ShapeProperty;
    styles: any[];
    transformers: Transformer[];
    ty?: ShapeType;
    constructor(transformers: Transformer[], level: number, shape: ShapeProperty);
    setAsAnimated(): void;
}
export declare class SVGTransformData {
    _isAnimated: boolean;
    elements: ElementInterfaceIntersect[];
    transform: Transformer;
    constructor(mProps: TransformProperty, op: ValueProperty, container: SVGGElement);
}
export declare class SVGStyleData {
    _mdf: boolean;
    closed: boolean;
    d: string;
    data: Shape;
    hd?: boolean;
    lvl: number;
    msElem: null | SVGMaskElement | SVGPathElement;
    pElem: SVGPathElement;
    pt?: AnimatedProperty;
    t?: number;
    ty?: ShapeType;
    type?: ShapeType;
    constructor(data: Shape, level: number);
    reset(): void;
}
export declare class ProcessedElement {
    elem: ElementInterfaceUnion;
    pos: number;
    constructor(element: ElementInterfaceUnion, position: number);
}
export declare class SVGGradientFillStyleData extends DynamicPropertyContainer {
    a?: MultiDimensionalProperty;
    cst?: SVGElement[];
    e?: MultiDimensionalProperty;
    g?: GradientProperty;
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
    constructor(elem: ElementInterfaceUnion, data: Shape, styleData: SVGStyleData);
    initGradientData(elem: ElementInterfaceUnion, data: Shape, styleData: SVGStyleData): void;
    setGradientData(pathElement: SVGElement, data: Shape): void;
    setGradientOpacity(data: Shape, styleData: SVGStyleData): void;
}
export declare class SVGGradientStrokeStyleData extends SVGGradientFillStyleData {
    d: DashProperty;
    w?: ValueProperty;
    constructor(elem: ElementInterfaceUnion, data: Shape, styleData: SVGStyleData);
}
export declare class SVGFillStyleData extends DynamicPropertyContainer {
    c?: MultiDimensionalProperty<Vector3>;
    o?: ValueProperty;
    style: SVGStyleData;
    constructor(elem: ElementInterfaceUnion, data: Shape, styleObj: SVGStyleData);
}
export declare class SVGStrokeStyleData extends SVGFillStyleData {
    d: DashProperty;
    w?: ValueProperty;
    constructor(elem: ElementInterfaceUnion, data: Shape, styleObj: SVGStyleData);
}
export declare class SVGNoStyleData extends DynamicPropertyContainer {
    style: SVGStyleData;
    constructor(elem: ElementInterfaceUnion, _data: SVGShapeData, styleObj: SVGStyleData);
}
