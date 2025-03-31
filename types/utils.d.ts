import type { AnimationData, LottieAsset, LottieManifest } from '@aarsteinmedia/lottie-web/light';
import { type Unzipped } from 'fflate';
export declare class CustomError extends Error {
    status?: number;
}
export declare const aspectRatio: (objectFit: string) => "none" | "xMidYMid meet" | "xMidYMid slice" | "xMinYMin slice", download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, degToRads: number, floatEqual: (a: number, b: number) => boolean, floatZero: (f: number) => boolean, frameOutput: (frame?: number) => string, getAnimationData: (input: unknown) => Promise<{
    animations: AnimationData[] | null;
    manifest: LottieManifest | null;
    isDotLottie: boolean;
}>, getExt: (str?: string) => string | undefined, getFilename: (src: string, keepExt?: boolean) => string, getLottieJSON: (resp: Response) => Promise<{
    data: AnimationData[];
    manifest: LottieManifest;
}>, getManifest: (unzipped: Unzipped) => LottieManifest, getMimeFromExt: (ext?: string) => string, handleErrors: (err: unknown) => {
    message: string;
    status: number;
}, hasExt: (path: string) => boolean, inBrowser: () => boolean, isAudio: (asset: LottieAsset) => boolean, isBase64: (str?: string) => boolean, isImage: (asset: LottieAsset) => boolean, isSafari: () => boolean, isServer: () => boolean, parseBase64: (str: string) => string, prepareString: (str: string) => string, resolveAssets: (unzipped: Unzipped, assets?: LottieAsset[]) => Promise<void>, unzip: (resp: Response) => Promise<Unzipped>;
