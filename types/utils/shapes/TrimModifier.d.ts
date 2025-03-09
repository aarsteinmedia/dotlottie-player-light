import type ShapeCollection from '@/utils/shapes/ShapeCollection';
import { CompInterface, Shape, Vector2 } from '@/types';
import ShapeModifier from '@/utils/shapes/ShapeModifier';
import ShapePath from '@/utils/shapes/ShapePath';
export default class TrimModifier extends ShapeModifier {
    addPaths(newPaths: ShapePath[], localShapeCollection: ShapeCollection): void;
    addSegment(pt1: Vector2, pt2: Vector2, pt3: Vector2, pt4: Vector2, shapePath: any, pos: number, newShape?: boolean): void;
    addSegmentFromArray(points: number[], shapePath: any, pos: number, newShape?: boolean): void;
    addShapes(shapeData: any, shapeSegment: any, shapePathFromProps: any): any[];
    addShapeToModifier(shapeData: any): void;
    calculateShapeEdges(s: any, e: any, shapeLength: number, addedLength: number, totalModifierLength: number): number[][];
    initModifierProperties(elem: CompInterface, data: Shape): void;
    processShapes(_isFirstFrame: boolean): void;
    releasePathsData(pathsData: any): any;
}
