import { PreserveAspectRatio } from '@aarsteinmedia/lottie-web/utils';
import { ObjectFit } from '../utils/enums';
export declare const aspectRatio: (objectFit: ObjectFit) => PreserveAspectRatio, frameOutput: (frame?: number) => string, handleErrors: (err: unknown) => {
    message: string;
    status: number;
};
