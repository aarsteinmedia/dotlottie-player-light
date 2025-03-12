import type { AnimationData } from '../types';
export default class AssetLoader {
    static load(path: string, fullPath: string, callback: (asset: AnimationData) => void, errorCallback: (err: unknown) => void): void;
    private static formatResponse;
}
