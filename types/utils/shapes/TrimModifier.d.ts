import type { ValueProperty } from '@/utils/Properties';
import type ShapeCollection from '@/utils/shapes/ShapeCollection';
import { SVGShapeData } from '@/elements/helpers/shapes';
import { ElementInterfaceIntersect, Shape, Vector2 } from '@/types';
import ShapeModifier from '@/utils/shapes/ShapeModifier';
import ShapePath from '@/utils/shapes/ShapePath';
export default class TrimModifier extends ShapeModifier {
    e?: ValueProperty;
    eValue?: number;
    m?: Shape['m'];
    o?: ValueProperty;
    s?: ValueProperty;
    sValue?: number;
    addPaths(newPaths: ShapePath[], localShapeCollection: ShapeCollection): void;
    addSegment(pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2, shapePath: ShapePath, pos: number, newShape?: boolean): void;
    addSegmentFromArray(points: number[], shapePath: ShapePath, pos: number, newShape?: boolean): void;
    addShapes(shapeData: any, shapeSegment: any, shapePathFromProps?: ShapePath): ShapePath[];
    addShapeToModifier(shapeData: SVGShapeData): void;
    calculateShapeEdges(s: any, e: any, shapeLength: number, addedLength: number, totalModifierLength: number): number[][];
    initModifierProperties(elem: ElementInterfaceIntersect, data: Shape): void;
    processShapes(_isFirstFrame: boolean): void;
    releasePathsData(pathsData: any): any;
}
