import type { ExpressionsPlugin } from '@/types';
import AnimationManager from '@/animation/AnimationManager';
export default class Lottie extends AnimationManager {
    static __getFactory: (name: string) => typeof import("./utils/Matrix").default | typeof import("./utils/PropertyFactory").default | typeof import("./utils/shapes/ShapeProperty").default | null;
    static inBrowser: () => boolean;
    static setIDPrefix: (value: string) => void;
    static setLocationHref: (value: string) => void;
    static setQuality: (value: string | number) => void;
    static useWebWorker: (flag: boolean) => void;
    static version: string;
    static installPlugin(type: string, plugin: ExpressionsPlugin): void;
    static setSubframeRendering(flag: boolean): void;
}
