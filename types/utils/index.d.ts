import { PreserveAspectRatio } from '@aarsteinmedia/lottie-web/utils';
import { ObjectFit } from '../utils/enums';
export declare const aspectRatio: (objectFit: ObjectFit) => PreserveAspectRatio, download: (data: string | ArrayBuffer, options?: {
    name: string;
    mimeType: string;
}) => void, frameOutput: (frame?: number) => string, getExt: (str?: string) => string | undefined, handleErrors: (err: unknown) => {
    message: string;
    status: number;
}, getFilename: (src: string, keepExt?: boolean) => string;
