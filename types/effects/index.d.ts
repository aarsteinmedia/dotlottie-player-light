import type { ElementInterface, PropertyHandler, ShapeData } from '@/types';
export declare function SliderEffect(this: {
    p: PropertyHandler;
}, data: ShapeData, elem: ElementInterface, container?: ElementInterface): void;
export declare function AngleEffect(this: {
    p: PropertyHandler;
}, data: ShapeData, elem: ElementInterface, container?: ElementInterface): void;
export declare function ColorEffect(this: {
    p: PropertyHandler;
}, data: ShapeData, elem: ElementInterface, container?: ElementInterface): void;
export declare function PointEffect(this: {
    p: PropertyHandler;
}, data: ShapeData, elem: ElementInterface, container?: ElementInterface): void;
export declare function LayerIndexEffect(this: {
    p: PropertyHandler;
}, data: ShapeData, elem: ElementInterface, container?: ElementInterface): void;
export declare function MaskIndexEffect(this: {
    p: PropertyHandler;
}, data: ShapeData, elem: ElementInterface, container?: ElementInterface): void;
export declare function CheckboxEffect(this: {
    p: PropertyHandler;
}, data: ShapeData, elem: ElementInterface, container?: ElementInterface): void;
export declare function NoValueEffect(this: {
    p: object;
}): void;
