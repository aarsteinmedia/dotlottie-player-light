import type { AnimationData, AnimationDirection, IntersectData, LottieAsset, LottieManifest, Marker, MarkerData, SVGGeometry, Vector2, Vector3, Vector4 } from '../types';
import type ShapePath from '../utils/shapes/ShapePath';
import PolynomialBezier from '../elements/PolynomialBezier';
import Matrix from '../utils/Matrix';
import { type Unzipped } from 'fflate';
export declare class CustomError extends Error {
    status?: number;
}
export declare const addBrightnessToRGB: (color: Vector3, offset: number) => Vector3, addHueToRGB: (color: Vector3, offset: number) => Vector3, addSaturationToRGB: (color: Vector3, offset: number) => Vector3, aspectRatio: (objectFit: string) => "none" | "xMidYMid meet" | "xMidYMid slice" | "xMinYMin slice", boxIntersect: (b1: SVGGeometry, b2: SVGGeometry) => boolean, buildShapeString: (pathNodes: ShapePath, length: number, closed: boolean, mat: Matrix) => string, createNS: <T extends SVGElement>(type: string) => T, createTag: <T extends HTMLElement>(type: string) => T, createQuaternion: (values: Vector3) => Vector4, crossProduct: (a: number[], b: number[]) => number[], download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, degToRads: number, floatEqual: (a: number, b: number) => boolean, floatZero: (f: number) => boolean, frameOutput: (frame?: number) => string, getAnimationData: (input: unknown) => Promise<{
    animations: AnimationData[] | null;
    manifest: LottieManifest | null;
    isDotLottie: boolean;
}>, getBlendMode: (mode?: number) => string, getExt: (str?: string) => string | undefined, getFilename: (src: string, keepExt?: boolean) => string, getIntersection: (a: any, b: any) => any, getLottieJSON: (resp: Response) => Promise<{
    data: AnimationData[];
    manifest: LottieManifest;
}>, getManifest: (unzipped: Unzipped) => LottieManifest, getMimeFromExt: (ext?: string) => string, getPerpendicularVector: (pt1: Vector2, pt2: Vector2) => number[], getProjectingAngle: (path: ShapePath, cur: number) => number, handleErrors: (err: unknown) => {
    message: string;
    status: number;
}, hasExt: (path: string) => boolean, HSVtoRGB: (h: number, s: number, v: number) => Vector3, inBrowser: () => boolean, intersectData: (bez: any, t1: number, t2: number) => IntersectData, intersectsImpl: (d1: any, d2: any, depth: number, tolerance: number, intersections: unknown[], maxRecursion: number) => void, isAudio: (asset: LottieAsset) => boolean, isBase64: (str?: string) => boolean, isImage: (asset: LottieAsset) => boolean, isSafari: () => boolean, isServer: () => boolean, joinLines: (outputBezier: ShapePath, seg1: any, seg2: any, lineJoin: number, miterLimit: number) => Vector2, lerp: (p0: number, p1: number, amount: number) => number, lerpPoint: (p0: Vector2, p1: Vector2, amount: number) => Vector2, linearOffset: (p1: Vector2, p2: Vector2, amount: number) => Vector2[], lineIntersection: (start1: Vector2, end1: Vector2, start2: Vector2, end2: Vector2) => Vector2 | null, markerParser: (_markers: (MarkerData | Marker)[]) => (MarkerData | Marker)[], offsetSegment: (segment: {
    points: Vector2[];
}, amount: number) => PolynomialBezier, offsetSegmentSplit: (segment: any, amount: number) => PolynomialBezier[], parseBase64: (str: string) => string, polynomialCoefficients: (p0: number, p1: number, p2: number, p3: number) => number[], pointDistance: (p1: Vector2, p2: Vector2) => number, pointEqual: (p1: Vector2, p2: Vector2) => boolean, polarOffset: (p: Vector2, angle: number, length: number) => Vector2, prepareString: (str: string) => string, pruneIntersections: (segments: any[]) => any[], pruneSegmentIntersection: (a: any[], b: any[]) => any[][], quadRoots: (a: number, b: number, c: number) => number[], quaternionToEuler: (out: Vector3, quat: Vector4) => void, resolveAssets: (unzipped: Unzipped, assets?: LottieAsset[]) => Promise<void>, rgbToHex: (rVal: number, gVal: number, bVal: number) => string, RGBtoHSV: (r: number, g: number, b: number) => Vector3, setPoint: (outputBezier: ShapePath, point: Vector2, angle: number, direction: AnimationDirection, amplitude: number, outAmplitude: number, inAmplitude: number) => void, singlePoint: (p: Vector2) => PolynomialBezier, slerp: (a: Vector4, b: Vector4, t: number) => Vector4, splitData: (data: IntersectData) => IntersectData[], unzip: (resp: Response) => Promise<Unzipped>;
