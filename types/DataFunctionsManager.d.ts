import type { AnimationData, LottieAsset, LottieLayer, Shape, Vector3 } from './types';
export default class DataFunctionManager {
    static completeData(animationData: AnimationData): void;
    static completeLayers(layers: LottieLayer[], comps: (LottieLayer | LottieAsset)[]): void;
    static completeShapes(arr: Shape[]): void;
    private static completeChars;
    private static completeText;
    private static convertPathsToAbsoluteValues;
    private static findComp;
    private static findCompLayers;
    checkVersion(minimum: Vector3, animVersionString: string): boolean | null;
}
