import { type Unzipped } from 'fflate';
import type { AnimationData, AnimationDirection, IntersectData, LottieAsset, LottieManifest, Marker, MarkerData, ShapeData, Vector2, Vector3, Vector4 } from '@/types';
import Matrix from '@/utils/Matrix';
export declare class CustomError extends Error {
    status?: number;
}
export declare const addBrightnessToRGB: (color: Vector3, offset: number) => Vector3, addHueToRGB: (color: Vector3, offset: number) => Vector3, addSaturationToRGB: (color: Vector3, offset: number) => Vector3, aspectRatio: (objectFit: string) => "none" | "xMidYMid meet" | "xMidYMid slice" | "xMinYMin slice", boxIntersect: (b1: any, b2: any) => boolean, buildShapeString: (pathNodes: ShapeData, length: number, closed: boolean, mat: any) => string, createNS: <T extends SVGElement>(type: string) => T, createTag: <T extends HTMLElement>(type: string) => T, createQuaternion: (values: Vector3) => Vector4, crossProduct: (a: number[], b: number[]) => number[], download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, degToRads: number, floatEqual: (a: number, b: number) => boolean, floatZero: (f: number) => boolean, frameOutput: (frame?: number) => string, getAnimationData: (input: unknown) => Promise<{
    animations: AnimationData[] | null;
    manifest: LottieManifest | null;
    isDotLottie: boolean;
}>, getBlendMode: (mode?: number) => string, getExt: (str?: string) => string | undefined, getFactory: (name: string) => {
    getProp: <T = unknown>(elem: T & {
        globalData?: import("@/types").GlobalData;
    }, dataFromProps?: any, type?: number, mult?: null | number, container?: any) => any;
} | typeof Matrix | {
    getConstructorFunction: () => {
        new (elem: any, data: any, type: number): {
            propType: string;
            comp: import("@/types").LottieComp;
            container: unknown;
            elem: unknown;
            data: ShapeData;
            k: boolean;
            kf: boolean;
            _mdf: boolean;
            v: ShapeData;
            pv: ShapeData;
            localShapeCollection: import("./shapes/ShapeCollection").default;
            paths: import("./shapes/ShapeCollection").default;
            reset: (this: {
                paths: import("./shapes/ShapeCollection").default;
                localShapeCollection: import("./shapes/ShapeCollection").default;
            }) => void;
            effectsSequence: unknown[];
            getValue: () => void;
            interpolateShape: (frame: number, previousValue: any, caching: any) => void;
            setVValue: (shape: ShapeData) => void;
            addEffect: (func: any) => void;
        };
    };
    getKeyframedConstructorFunction: () => {
        new (elem: any, data: any, type: number): {
            propType: string;
            comp: any;
            elem: any;
            container: any;
            offsetTime: any;
            keyframes: any;
            keyframesMetadata: unknown[];
            k: boolean;
            kf: boolean;
            v: ShapeData;
            pv: ShapeData;
            localShapeCollection: import("./shapes/ShapeCollection").default;
            paths: import("./shapes/ShapeCollection").default;
            lastFrame: number;
            reset: (this: {
                paths: import("./shapes/ShapeCollection").default;
                localShapeCollection: import("./shapes/ShapeCollection").default;
            }) => void;
            _caching: {
                lastFrame: number;
                lastIndex: number;
            };
            effectsSequence: ((this: any) => any)[];
            getValue: () => void;
            interpolateShape: (frame: number, previousValue: any, caching: any) => void;
            setVValue: (shape: ShapeData) => void;
            addEffect: (func: any) => void;
        };
    };
    getShapeProp: (elem: any, data: any, type: number, _?: unknown) => any;
} | null, getFilename: (src: string, keepExt?: boolean) => string, getIntersection: (a: any, b: any) => any, getLottieJSON: (resp: Response) => Promise<{
    data: AnimationData[];
    manifest: LottieManifest;
}>, getManifest: (unzipped: Unzipped) => LottieManifest, getMimeFromExt: (ext?: string) => string, getPerpendicularVector: (pt1: Vector2, pt2: Vector2) => number[], getProjectingAngle: (path: ShapeData, cur: number) => number, handleErrors: (err: unknown) => {
    message: string;
    status: number;
}, hasExt: (path: string) => boolean, HSVtoRGB: (h: number, s: number, v: number) => Vector3, inBrowser: () => boolean, intersectData: (bez: any, t1: number, t2: number) => IntersectData, intersectsImpl: (d1: any, d2: any, depth: number, tolerance: number, intersections: unknown[], maxRecursion: number) => void, isAudio: (asset: LottieAsset) => boolean, isBase64: (str?: string) => boolean, isImage: (asset: LottieAsset) => boolean, isSafari: () => boolean, isServer: () => boolean, joinLines: (outputBezier: ShapeData, seg1: any, seg2: any, lineJoin: number, miterLimit: number) => Vector2, lerp: (p0: number, p1: number, amount: number) => number, lerpPoint: (p0: Vector2, p1: Vector2, amount: number) => Vector2, linearOffset: (p1: Vector2, p2: Vector2, amount: number) => number[][], lineIntersection: (start1: Vector2, end1: Vector2, start2: Vector2, end2: Vector2) => Vector2 | null, markerParser: (_markers: (MarkerData | Marker)[]) => (MarkerData | Marker)[], offsetSegment: (segment: any, amount: number) => any, offsetSegmentSplit: (segment: any, amount: number) => any[], parseBase64: (str: string) => string, polynomialCoefficients: (p0: number, p1: number, p2: number, p3: number) => number[], pointDistance: (p1: Vector2, p2: Vector2) => number, pointEqual: (p1: Vector2, p2: Vector2) => boolean, polarOffset: (p: Vector2, angle: number, length: number) => number[], prepareString: (str: string) => string, pruneIntersections: (segments: any[]) => any[], pruneSegmentIntersection: (a: any[], b: any[]) => any[][], quadRoots: (a: number, b: number, c: number) => number[], quaternionToEuler: (out: Vector3, quat: Vector4) => void, resolveAssets: (unzipped: Unzipped, assets?: LottieAsset[]) => Promise<void>, rgbToHex: (rVal: number, gVal: number, bVal: number) => string, RGBtoHSV: (r: number, g: number, b: number) => Vector3, setPoint: (outputBezier: ShapeData, point: Vector2, angle: number, direction: AnimationDirection, amplitude: number, outAmplitude: number, inAmplitude: number) => void, singlePoint: (p: number[]) => any, slerp: (a: Vector4, b: Vector4, t: number) => Vector4, splitData: (data: any) => IntersectData[], styleDiv: (element: HTMLElement) => void, unzip: (resp: Response) => Promise<Unzipped>, useId: (prefix?: string) => string;
