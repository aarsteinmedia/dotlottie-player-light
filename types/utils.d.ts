import { type Unzipped } from 'fflate';
import type { LottieAsset, LottieJSON, LottieManifest } from './types';
export declare class CustomError extends Error {
    status?: number;
}
export declare const aspectRatio: (objectFit: string) => "none" | "xMidYMid meet" | "xMidYMid slice" | "xMinYMin slice", download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, frameOutput: (frame?: number) => string, getAnimationData: (input: unknown) => Promise<{
    animations: LottieJSON[] | null;
    manifest: LottieManifest | null;
    isDotLottie: boolean;
}>, getExt: (str?: string) => string | undefined, getFilename: (src: string, keepExt?: boolean) => string, getLottieJSON: (resp: Response) => Promise<{
    data: LottieJSON[];
    manifest: LottieManifest;
}>, getManifest: (unzipped: Unzipped) => LottieManifest, getMimeFromExt: (ext?: string) => string, handleErrors: (err: unknown) => {
    message: string;
    status: number;
}, hasExt: (path: string) => boolean, isAudio: (asset: LottieAsset) => boolean, isBase64: (str?: string) => boolean, isImage: (asset: LottieAsset) => boolean, isServer: () => boolean, parseBase64: (str: string) => string, prepareString: (str: string) => string, resolveAssets: (unzipped: Unzipped, assets?: LottieAsset[]) => Promise<void>, unzip: (resp: Response) => Promise<Unzipped>, useId: (prefix?: string) => string;
