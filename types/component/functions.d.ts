import type { Unzipped } from 'fflate';
import type { LottieAsset, LottieJSON, LottieManifest, ObjectFit } from './types';
export declare const aspectRatio: (objectFit: ObjectFit) => "none" | "xMidYMid meet" | "xMidYMid slice" | "xMinYMin slice", download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, handleErrors: (err: unknown) => {
    message: string;
    status: number;
}, frameOutput: (frame?: number) => string, getAnimationData: (input: unknown) => Promise<{
    animations: LottieJSON[] | null;
    manifest: LottieManifest | null;
    isDotLottie?: boolean;
}>, getExt: (str: string) => string, getFilename: (src: string, keepExt?: boolean) => string, getLottieJSON: (resp: Response) => Promise<{
    data: LottieJSON[];
    manifest: LottieManifest;
}>, getManifest: (unzipped: Unzipped) => LottieManifest, getMimeFromExt: (ext?: string) => string, isAudio: (asset: LottieAsset) => boolean, isImage: (asset: LottieAsset) => boolean, isServer: () => boolean, resolveAssets: (unzipped: Unzipped, assets?: LottieAsset[]) => Promise<void>, unzip: (resp: Response) => Promise<Unzipped>, useId: (prefix?: string) => string;
