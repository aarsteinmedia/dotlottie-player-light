import type { Caching, ElementInterfaceIntersect, Keyframe, KeyframesMetadata, Mask, Merge, Shape, StrokeData, Vector2 } from '../../types';
import type { MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
import type ShapeCollection from '../../utils/shapes/ShapeCollection';
import ShapeElement from '../../elements/ShapeElement';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import ShapePath from '../../utils/shapes/ShapePath';
export declare function getConstructorFunction(): typeof ShapeProperty;
export declare function getKeyframedConstructorFunction(): typeof KeyframedShapeProperty;
export declare function getShapeProp(elem: ShapeElement, data: Merge<Shape, Mask>, type: number, _?: unknown): ShapeProperty | KeyframedShapeProperty | RectShapeProperty | EllShapeProperty | StarShapeProperty | undefined;
declare abstract class ShapeBaseProperty extends DynamicPropertyContainer {
    _caching?: Caching;
    comp?: ElementInterfaceIntersect;
    data?: Partial<Shape & Mask>;
    effectsSequence?: any[];
    elem?: ShapeElement;
    frameId?: number;
    k?: boolean;
    keyframes?: Keyframe[];
    keyframesMetadata?: KeyframesMetadata[];
    kf?: boolean;
    localShapeCollection?: ShapeCollection;
    lock?: boolean;
    offsetTime: number;
    paths?: ShapeCollection;
    pv?: ShapePath;
    v?: ShapePath;
    interpolateShape(frameNum: number, previousValue: ShapePath, caching?: Caching): void;
    interpolateShapeCurrentTime(): ShapePath;
    processEffectsSequence(): void;
    reset(): void;
    setVValue(newPath: ShapePath): void;
    shapesEqual(shape1: ShapePath, shape2: ShapePath): boolean;
}
export declare class RectShapeProperty extends ShapeBaseProperty {
    d?: number;
    ir?: ValueProperty;
    is?: ValueProperty;
    or?: ValueProperty;
    os?: ValueProperty;
    p: MultiDimensionalProperty<Vector2>;
    pt?: ValueProperty;
    r: ValueProperty;
    s: MultiDimensionalProperty<Vector2>;
    constructor(elem: ElementInterfaceIntersect, data: Merge<Shape, Mask>);
    convertRectToPath(): void;
    getValue(): void;
}
declare class StarShapeProperty extends ShapeBaseProperty {
    d?: StrokeData[];
    ir?: ValueProperty;
    is?: ValueProperty;
    or: ValueProperty;
    os: ValueProperty;
    p: MultiDimensionalProperty<Vector2>;
    pt: ValueProperty;
    r: ValueProperty;
    s?: ValueProperty;
    constructor(elem: any, data: any);
    convertPolygonToPath(): void;
    convertStarToPath(): void;
    convertToPath(): void;
    getValue(): void;
}
declare class EllShapeProperty extends ShapeBaseProperty {
    d?: number;
    p: MultiDimensionalProperty<Vector2>;
    s: MultiDimensionalProperty<Vector2>;
    private _cPoint;
    constructor(elem: ElementInterfaceIntersect, data: Merge<Shape, Mask>);
    convertEllToPath(): void;
    getValue(): void;
}
export declare class ShapeProperty extends ShapeBaseProperty {
    constructor(elem: ShapeElement, data: Partial<Shape & Mask>, type: number);
}
declare class KeyframedShapeProperty extends ShapeBaseProperty {
    lastFrame: number;
    constructor(elem: ShapeElement, data: Partial<Shape & Mask>, type: number);
}
export {};
