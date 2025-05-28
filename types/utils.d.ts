import type { AnimationData, LottieManifest } from '@aarsteinmedia/lottie-web';
import { PreserveAspectRatio } from '@aarsteinmedia/lottie-web/utils';
import { ObjectFit } from './enums';
export declare const getExt: (str?: string) => string | undefined;
export declare const aspectRatio: (objectFit: ObjectFit) => PreserveAspectRatio, download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, frameOutput: (frame?: number) => string, handleErrors: (err: unknown) => {
    message: string;
    status: number;
}, getAnimationData: (input: unknown) => Promise<{
    animations: AnimationData[] | null;
    manifest: LottieManifest | null;
    isDotLottie: boolean;
}>, getFilename: (src: string, keepExt?: boolean) => string;
