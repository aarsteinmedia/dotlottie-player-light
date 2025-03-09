import type { CompInterface, LottieComp, Mask, Shape, StrokeData } from '@/types';
import type { ValueProperty } from '@/utils/Properties';
import type ShapeCollection from '@/utils/shapes/ShapeCollection';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
import ShapePath from '@/utils/shapes/ShapePath';
export default class ShapePropertyFactory {
    static getConstructorFunction(): typeof ShapeProperty;
    static getKeyframedConstructorFunction(): typeof KeyframedShapeProperty;
    static getShapeProp(elem: CompInterface, data: Shape | Mask, type: number, _?: unknown): ShapeProperty | KeyframedShapeProperty | RectShapeProperty | EllShapeProperty | StarShapeProperty | undefined;
}
declare class RectShapeProperty extends DynamicPropertyContainer {
    comp: any;
    d?: number;
    data: any;
    elem: any;
    frameId: number;
    ir?: ValueProperty;
    is?: ValueProperty;
    k: boolean;
    localShapeCollection: ShapeCollection;
    or?: ValueProperty;
    os?: ValueProperty;
    p: ValueProperty;
    paths: ShapeCollection;
    pt?: ValueProperty;
    r: ValueProperty;
    reset: typeof resetShape;
    s: ValueProperty;
    v: any;
    constructor(elem: any, data: any);
    convertRectToPath(): void;
    getValue(): void;
}
declare class StarShapeProperty extends DynamicPropertyContainer {
    comp: any;
    convertToPath: () => void;
    d?: StrokeData[];
    data: any;
    elem: any;
    frameId: number;
    ir?: ValueProperty;
    is?: ValueProperty;
    k: boolean;
    localShapeCollection: ShapeCollection;
    or: ValueProperty;
    os: ValueProperty;
    p: ValueProperty;
    paths: ShapeCollection;
    pt: ValueProperty;
    r: ValueProperty;
    reset: typeof resetShape;
    s?: ValueProperty;
    v: ShapePath;
    constructor(elem: any, data: any);
    convertPolygonToPath(): void;
    convertStarToPath(): void;
    getValue(): void;
}
declare class EllShapeProperty extends DynamicPropertyContainer {
    comp: any;
    d?: StrokeData[];
    elem: any;
    frameId: number;
    k: boolean;
    localShapeCollection: ShapeCollection;
    p: ValueProperty;
    paths: ShapeCollection;
    reset: typeof resetShape;
    s: ValueProperty;
    v: ShapePath;
    private _cPoint;
    constructor(elem: any, data: Shape);
    convertEllToPath(): void;
    getValue(): void;
}
export declare class ShapeProperty {
    _mdf: boolean;
    addEffect: (func: any) => void;
    comp: LottieComp;
    container: unknown;
    data: Shape;
    effectsSequence: unknown[];
    elem: CompInterface;
    getValue: () => void;
    interpolateShape: (frame: number, previousValue: any, caching: any) => void;
    k: boolean;
    kf: boolean;
    localShapeCollection: ShapeCollection;
    paths: ShapeCollection;
    propType: string;
    pv: ShapePath;
    reset: typeof resetShape;
    setVValue: (shape: ShapePath) => void;
    v: ShapePath;
    constructor(elem: CompInterface, data: Shape, type: number);
}
declare class KeyframedShapeProperty {
    _caching: {
        lastFrame: number;
        lastIndex: number;
    };
    addEffect: (func: any) => void;
    comp: any;
    container: any;
    effectsSequence: (typeof interpolateShapeCurrentTime)[];
    elem: any;
    getValue: () => void;
    interpolateShape: (frame: number, previousValue: any, caching: any) => void;
    k: boolean;
    keyframes: any;
    keyframesMetadata: unknown[];
    kf: boolean;
    lastFrame: number;
    localShapeCollection: ShapeCollection;
    offsetTime: any;
    paths: ShapeCollection;
    propType: string;
    pv: ShapePath;
    reset: typeof resetShape;
    setVValue: (shape: ShapePath) => void;
    v: ShapePath;
    constructor(elem: any, data: any, type: number);
}
declare function resetShape(this: {
    paths: ShapeCollection;
    localShapeCollection: ShapeCollection;
}): void;
declare function interpolateShapeCurrentTime(this: any): any;
export {};
