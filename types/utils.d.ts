import { type Unzipped } from 'fflate';
import type { LottieAsset, LottieJSON, LottieManifest } from './types';
export declare enum ObjectFit {
    Contain = "contain",
    Cover = "cover",
    Fill = "fill",
    ScaleDown = "scale-down",
    None = "none"
}
export declare enum PlayerState {
    Completed = "completed",
    Destroyed = "destroyed",
    Error = "error",
    Frozen = "frozen",
    Loading = "loading",
    Paused = "paused",
    Playing = "playing",
    Stopped = "stopped"
}
export declare enum PlayMode {
    Bounce = "bounce",
    Normal = "normal"
}
export declare enum PlayerEvents {
    Complete = "complete",
    Destroyed = "destroyed",
    Error = "error",
    Frame = "frame",
    Freeze = "freeze",
    Load = "load",
    Loop = "loop",
    Next = "next",
    Pause = "pause",
    Play = "play",
    Previous = "previous",
    Ready = "ready",
    Rendered = "rendered",
    Stop = "stop"
}
export declare enum PreserveAspectRatio {
    Contain = "xMidYMid meet",
    Cover = "xMidYMid slice",
    None = "xMinYMin slice",
    Initial = "none"
}
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
