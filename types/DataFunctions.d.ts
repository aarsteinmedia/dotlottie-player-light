import type { AnimationData, LottieAsset, LottieLayer, Shape, Vector3 } from './types';
export declare function completeData(animationData: AnimationData): void;
export declare function completeLayers(layers: LottieLayer[], comps: (LottieLayer | LottieAsset)[]): void;
export declare function completeShapes(arr: Shape[]): void;
export declare function checkVersion(minimum: Vector3, animVersionString: string): boolean | null;
