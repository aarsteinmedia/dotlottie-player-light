import type { AnimationConfiguration, ExpressionsPlugin } from '@/types';
declare function setLocation(href: string): void;
declare function searchAnimations(): void;
declare function setSubframeRendering(flag: boolean): void;
declare function loadAnimation(params: AnimationConfiguration): import("./animation/AnimationItem").default;
declare function installPlugin(type: string, plugin: ExpressionsPlugin): void;
declare const Lottie: {
    __getFactory: (name: string) => {
        getProp: <T = unknown>(elem: T & {
            globalData?: import("@/types").GlobalData;
        }, dataFromProps?: any, type?: number, mult?: null | number, container?: any) => any;
    } | typeof import("./utils/Matrix").default | {
        getConstructorFunction: () => {
            new (elem: any, data: any, type: number): {
                propType: string;
                comp: import("@/types").LottieComp;
                container: unknown;
                elem: unknown;
                data: import("@/types").ShapeData;
                k: boolean;
                kf: boolean;
                _mdf: boolean;
                v: import("@/types").ShapeData;
                pv: import("@/types").ShapeData;
                localShapeCollection: import("./utils/shapes/ShapeCollection").default;
                paths: import("./utils/shapes/ShapeCollection").default;
                reset: (this: {
                    paths: import("./utils/shapes/ShapeCollection").default;
                    localShapeCollection: import("./utils/shapes/ShapeCollection").default;
                }) => void;
                effectsSequence: unknown[];
                getValue: () => void;
                interpolateShape: (frame: number, previousValue: any, caching: any) => void;
                setVValue: (shape: import("@/types").ShapeData) => void;
                addEffect: (func: any) => void;
            };
        };
        getKeyframedConstructorFunction: () => {
            new (elem: any, data: any, type: number): {
                propType: string;
                comp: any;
                elem: any;
                container: any;
                offsetTime: any;
                keyframes: any;
                keyframesMetadata: unknown[];
                k: boolean;
                kf: boolean;
                v: import("@/types").ShapeData;
                pv: import("@/types").ShapeData;
                localShapeCollection: import("./utils/shapes/ShapeCollection").default;
                paths: import("./utils/shapes/ShapeCollection").default;
                lastFrame: number;
                reset: (this: {
                    paths: import("./utils/shapes/ShapeCollection").default;
                    localShapeCollection: import("./utils/shapes/ShapeCollection").default;
                }) => void;
                _caching: {
                    lastFrame: number;
                    lastIndex: number;
                };
                effectsSequence: ((this: any) => any)[];
                getValue: () => void;
                interpolateShape: (frame: number, previousValue: any, caching: any) => void;
                setVValue: (shape: import("@/types").ShapeData) => void;
                addEffect: (func: any) => void;
            };
        };
        getShapeProp: (elem: any, data: any, type: number, _?: unknown) => any;
    } | null;
    destroy: (animation?: string) => void;
    freeze: () => void;
    getRegisteredAnimations: () => import("./animation/AnimationItem").default[];
    goToAndStop: (value: number, isFrame?: boolean, animation?: string) => void;
    inBrowser: () => boolean;
    installPlugin: typeof installPlugin;
    loadAnimation: typeof loadAnimation;
    mute: (animation?: string) => void;
    pause: (animation?: string) => void;
    play: (animation?: string) => void;
    registerAnimation: (element: HTMLElement | null, animationData?: import("@/types").AnimationData) => import("./animation/AnimationItem").default | null;
    resize: () => void;
    searchAnimations: typeof searchAnimations;
    setDirection: (val: import("@/types").AnimationDirection, animation?: string) => void;
    setIDPrefix: (value: string) => void;
    setLocationHref: typeof setLocation;
    setQuality: (value: string | number) => void;
    setSpeed: (val: number, animation?: string) => void;
    setSubframeRendering: typeof setSubframeRendering;
    setVolume: (val: number, animation?: string) => void;
    stop: (animation?: string) => void;
    togglePause: (animation?: string) => void;
    unfreeze: () => void;
    unmute: (animation?: string) => void;
    useWebWorker: (flag: boolean) => void;
    version: string;
};
export default Lottie;
