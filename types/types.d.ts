import 'react/jsx-runtime';
import 'react/jsx-dev-runtime';
import type { Plugin } from '@custom-elements-manifest/analyzer';
import type { PlayMode, ShapeType } from './enums';
import type DotLottiePlayer from './elements/DotLottiePlayer';
export type AnimationDirection = 1 | -1;
export type AnimationEventName = 'drawnFrame' | 'enterFrame' | 'loopComplete' | 'complete' | 'segmentStart' | 'destroy' | 'config_ready' | 'data_ready' | 'DOMLoaded' | 'error' | 'data_failed' | 'loaded_images';
export type AnimationEventCallback<T = unknown> = (args: T) => void;
export interface AnimationEvents {
    DOMLoaded: undefined;
    complete: BMCompleteEvent;
    config_ready: undefined;
    data_failed: undefined;
    data_ready: undefined;
    destroy: BMDestroyEvent;
    drawnFrame: BMEnterFrameEvent;
    enterFrame: BMEnterFrameEvent;
    error: undefined;
    loaded_images: undefined;
    loopComplete: BMCompleteLoopEvent;
    segmentStart: BMSegmentStartEvent;
}
export interface BMCompleteLoopEvent {
    currentLoop: number;
    direction: number;
    totalLoops: number;
    type: 'loopComplete';
}
export interface BMSegmentStartEvent {
    firstFrame: number;
    totalFrames: number;
    type: 'segmentStart';
}
export interface BMCompleteEvent {
    direction: number;
    type: 'complete';
}
export interface BMDestroyEvent {
    type: 'destroy';
}
export interface BMEnterFrameEvent {
    currentTime: number;
    direction: number;
    totalTime: number;
    type: 'enterFrame';
}
export type AnimationItem = {
    name: string;
    isLoaded: boolean;
    currentFrame: number;
    currentRawFrame: number;
    firstFrame: number;
    totalFrames: number;
    frameRate: number;
    frameMult: number;
    playSpeed: number;
    playDirection: number;
    playCount: number;
    isPaused: boolean;
    autoplay: boolean;
    loop: boolean | number;
    renderer: RendererType;
    animationID: string;
    assetsPath: string;
    timeCompleted: number;
    segmentPos: number;
    isSubframeEnabled: boolean;
    segments: Vector2 | Vector2[];
    play(name?: string): void;
    stop(name?: string): void;
    togglePause(name?: string): void;
    destroy(name?: string): void;
    pause(name?: string): void;
    goToAndStop(value: number | string, isFrame?: boolean, name?: string): void;
    goToAndPlay(value: number | string, isFrame?: boolean, name?: string): void;
    includeLayers(data: unknown): void;
    setSegment(init: number, end: number): void;
    resetSegments(forceFlag: boolean): void;
    hide(): void;
    show(): void;
    resize(): void;
    setSpeed(speed: number): void;
    setDirection(direction: AnimationDirection): void;
    setLoop(isLooping: boolean): void;
    playSegments(segments: Vector2 | Vector2[], forceFlag?: boolean): void;
    setSubframe(useSubFrames: boolean): void;
    getDuration(inFrames?: boolean): number;
    triggerEvent<T extends AnimationEventName>(name: T, args: AnimationEvents[T]): void;
    addEventListener<T extends AnimationEventName>(name: T, callback: AnimationEventCallback<AnimationEvents[T]>): () => void;
    removeEventListener<T extends AnimationEventName>(name: T, callback?: AnimationEventCallback<AnimationEvents[T]>): void;
};
export type RendererType = 'svg' | 'canvas' | 'html';
export type BaseRendererConfig = {
    imagePreserveAspectRatio?: string;
    className?: string;
};
export type FilterSizeConfig = {
    width: string;
    height: string;
    x: string;
    y: string;
};
export type SVGRendererConfig = BaseRendererConfig & {
    title?: string;
    description?: string;
    preserveAspectRatio?: string;
    progressiveLoad?: boolean;
    hideOnTransparent?: boolean;
    viewBoxOnly?: boolean;
    viewBoxSize?: string;
    focusable?: boolean;
    filterSize?: FilterSizeConfig;
};
export type CanvasRendererConfig = BaseRendererConfig & {
    clearCanvas?: boolean;
    context?: CanvasRenderingContext2D;
    progressiveLoad?: boolean;
    preserveAspectRatio?: string;
};
export type HTMLRendererConfig = BaseRendererConfig & {
    hideOnTransparent?: boolean;
};
export type AnimationConfiguration<T extends RendererType = 'svg'> = {
    container: Element;
    renderer?: T;
    loop?: boolean | number;
    autoplay?: boolean;
    initialSegment?: Vector2;
    name?: string;
    assetsPath?: string;
    rendererSettings?: {
        svg: SVGRendererConfig;
        canvas: CanvasRendererConfig;
        html: HTMLRendererConfig;
    }[T];
    audioFactory?(assetPath: string): {
        play(): void;
        seek(): void;
        playing(): void;
        rate(): void;
        setVolume(): void;
    };
};
export type ArrayType = 'float32' | 'int16' | 'int32' | 'uint8' | 'uint8c';
export interface GenericClass {
    prototype: Record<string, unknown>;
}
type BoolInt = 0 | 1;
export interface Shape {
    ind?: number;
    ix?: number;
    ty: ShapeType;
    it?: Omit<Shape, 'np'>[];
    a?: VectorProperty<Vector1 | Vector2 | Vector3>;
    h?: {
        a: 1 | 0;
        k: Vector2 | number;
        ix?: number;
    };
    p?: VectorProperty<Vector2 | Vector3>;
    s?: VectorProperty<Vector2 | Vector3>;
    e?: VectorProperty<Vector2>;
    t?: number;
    g?: {
        p: number;
        k: {
            a: 1 | 0;
            k: number[];
        };
    };
    sk?: VectorProperty;
    sa?: VectorProperty;
    c?: {
        a: 1 | 0;
        k: number | number[];
        ix?: number;
    };
    o?: VectorProperty;
    m?: 1 | 2;
    r?: number | VectorProperty;
    lc?: 1 | 2 | 3;
    lj?: 1 | 2 | 3;
    w?: VectorProperty;
    ml?: number;
    d?: {
        n: 'o' | 'd' | 'g';
        nm: 'offset' | 'dash' | 'gap';
        v: VectorProperty;
    }[];
    bm?: number;
    ks?: {
        a: 1 | 0;
        k: {
            i: Vector2[];
            o: Vector2[];
            v: Vector2[];
            c: 0 | 1 | boolean;
        };
        ix?: number;
    };
    np?: number;
    tr?: LottieTransform;
    nm?: string;
    mn?: string;
    hd?: boolean;
}
interface LottieTransform {
    a: VectorProperty<Vector2>;
    p: VectorProperty<Vector2>;
    s: VectorProperty<Vector2>;
    r: VectorProperty;
    so?: VectorProperty;
    eo?: VectorProperty;
}
export interface LottieAsset {
    e?: BoolInt;
    layers?: LottieLayer[];
    h?: number;
    id?: string;
    nm?: string;
    p?: string;
    u?: string;
    xt?: number;
    w?: number;
}
export interface LottieJSON {
    assets?: LottieAsset[];
    ddd: number;
    fr: number;
    h: number;
    ip: number;
    layers: unknown[];
    markers: unknown[];
    meta: {
        a: string;
        d: string;
        g: string;
        k: string;
        tc: string;
    };
    nm: string;
    op: number;
    v: string;
    w: number;
}
export interface AnimationSettings {
    autoplay?: Autoplay;
    loop?: Loop;
    direction?: AnimationDirection;
    mode?: PlayMode;
    speed?: number;
}
export interface Animation extends AnimationSettings {
    id: string;
}
export interface AnimationConfig extends Animation {
    url: string;
}
export interface LottieManifest {
    animations: Animation[];
    author?: string;
    description?: string;
    generator?: string;
    keywords?: string;
    version?: string;
}
export type AnimateOnScroll = boolean | '' | null;
export type Autoplay = boolean | '' | 'autoplay' | null;
export type Controls = boolean | '' | 'controls' | null;
export type Loop = boolean | '' | 'loop' | null;
export type Subframe = boolean | '' | null;
export interface CEMConfig {
    catalyst: boolean;
    dependencies: boolean;
    dev: boolean;
    exclude: string[];
    fast: boolean;
    globs: ['src/**/*.ts'];
    litelement: boolean;
    outdir: string;
    packagejson: boolean;
    stencil: boolean;
    watch: boolean;
    plugins: Array<() => Plugin>;
    overrideModuleCreation({ globs, ts, }: {
        ts: unknown;
        globs: string[];
    }): unknown[];
}
type Vector1 = number;
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];
type VectorProperty<T = Vector1> = {
    a: 1 | 0;
    k: T;
    ix?: number;
};
interface Mask {
    inv: boolean;
    mode: string;
    pt: {
        a: 0 | 1;
        k: {
            i: Vector2[];
            o: Vector2[];
            v: Vector2[];
            c: boolean;
        };
        ix?: number;
    };
    o: {
        a: 0 | 1;
        k: number;
        ix?: number;
    };
    x: {
        a: 0 | 1;
        k: number;
        ix?: number;
    };
    nm: string;
    cl?: boolean;
}
interface LayerStyle {
    nm: string;
    mn: string;
    ty: number;
    c: {
        a: 0 | 1;
        k: Vector3 | Vector4;
    };
    o?: {
        a: 0 | 1;
        k: number;
    };
    s: {
        a: 0 | 1;
        k: number;
    };
    a?: {
        a: 0 | 1;
        k: number;
    };
    d?: {
        a: 0 | 1;
        k: number;
    };
    ch?: {
        a: 0 | 1;
        k: number;
    };
    bm?: {
        a: 0 | 1;
        k: number;
    };
    no?: {
        a: 0 | 1;
        k: number;
    };
}
interface DocumentData {
    k: {
        s: {
            s: number;
            f: string;
            t: string;
            ls: number;
            j: number;
            fc: Vector3 | Vector4;
            sc?: Vector3 | Vector4;
            sw?: number;
            of: boolean;
        } | DocumentData;
        t: number;
    }[];
}
interface TextData {
    d: DocumentData;
    p: {
        a: unknown;
        p: unknown;
        r: unknown;
    };
    m: {
        g: number;
        a: {
            a: 0 | 1;
            k: Vector2;
            ix?: number;
        };
    };
    a: {
        nm: string;
        s: {
            t: 0 | 1;
            o: {
                a: 0 | 1;
                k: number;
            };
            s: {
                a: 0 | 1;
                k: number;
            };
            e: {
                a: 0 | 1;
                k: number;
            };
            a: {
                a: 0 | 1;
                k: number;
            };
            b: number;
            rn: 0 | 1;
            sh: number;
            xe: {
                a: 0 | 1;
                k: number;
            };
            ne: {
                a: 0 | 1;
                k: number;
            };
            sm: {
                a: 0 | 1;
                k: number;
            };
            r: number;
        };
        a: {
            p: {
                a: 0 | 1;
                k: Vector2 | Vector3;
            };
            r: {
                a: 0 | 1;
                k: number;
            };
            o: {
                a: 0 | 1;
                k: number;
            };
            fc: {
                a: 0 | 1;
                k: Vector3 | Vector4;
            };
            fh: {
                a: 0 | 1;
                k: number;
            };
            fs: {
                a: 0 | 1;
                k: number;
            };
            fb: {
                a: 0 | 1;
                k: number;
            };
            sc?: {
                a: 0 | 1;
                k: Vector3 | Vector4;
            };
            sw?: {
                a: 0 | 1;
                k: number;
            };
            t: {
                a: 0 | 1;
                k: number;
            };
        };
    }[];
}
interface Effect {
    nm?: string;
    np: number;
    ty: number;
    ix?: number;
    en: 1 | 0;
    ef: {
        ty: number;
        v: {
            a: 1 | 0;
            k: number | Vector3 | Vector4;
        };
    }[];
}
interface Asset {
    id: string;
    nm?: string;
    u: string;
    p: string;
    e: 0 | 1;
    w: number;
    h: number;
    t?: 'seq';
    sid?: string;
    layers?: LottieLayer[];
}
interface FontList {
    origin: number;
    fPath: string;
    fClass: string;
    fFamily: string;
    fWeight: string;
    fStyle: string;
    fName: string;
}
export interface AnimationData {
    $schema?: string;
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    mn?: string;
    nm: string;
    ao?: 0 | 1;
    ddd: 0 | 1;
    chars?: {
        data: LottieLayer;
        t: number;
    }[];
    assets: Asset[];
    fonts: {
        list: FontList[];
    };
    layers: LottieLayer[];
    markers?: [];
    meta?: {
        a: string;
        d: string;
        k: string;
        tc: string;
        g: string;
    };
}
export interface LottieLayer {
    ddd?: 0 | 1;
    ind?: number;
    ty: number;
    refId?: string;
    nm: string;
    sr?: number;
    ks: {
        o: VectorProperty;
        r: VectorProperty;
        p: {
            a: 0 | 1;
            k: number[];
            ix?: number;
            l?: number;
        };
        a: {
            a: 0 | 1;
            k: number[];
            ix?: number;
            l?: number;
        };
        s: {
            a: 0 | 1;
            k: number[];
            ix?: number;
            l?: number;
        };
        sk: {
            a: 0 | 1;
            k: number;
            ix?: number;
        };
        sa: {
            a: 0 | 1;
            k: number;
            ix?: number;
        };
    };
    ef?: Readonly<Effect[]>;
    sy?: LayerStyle[];
    ao?: number;
    hasMask?: boolean;
    masksProperties?: Readonly<Mask[]>;
    sw?: number;
    sh?: number;
    sc?: string;
    ip: number;
    op: number;
    st: number;
    bm?: number;
    parent?: number;
    shapes?: Shape[];
    t?: TextData;
    td?: 0 | 1;
    tt?: number;
    tp?: number;
    ct?: 0 | 1;
    layers?: LottieLayer[] & {
        __used?: boolean;
    };
    completed?: boolean;
}
export interface PrecompositionLayer extends LottieLayer {
    id: string;
}
declare global {
    interface HTMLElementTagNameMap {
        'dotlottie-player': DotLottiePlayer;
    }
    function dotLottiePlayer(): DotLottiePlayer;
}
type JSXLottiePlayer = Omit<Partial<DotLottiePlayer>, 'style'> & {
    class?: string;
    ref?: React.RefObject<unknown>;
    style?: React.CSSProperties;
    src: string;
};
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'dotlottie-player': JSXLottiePlayer;
        }
    }
}
declare module 'react/jsx-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            'dotlottie-player': JSXLottiePlayer;
        }
    }
}
declare module 'react/jsx-dev-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            'dotlottie-player': JSXLottiePlayer;
        }
    }
}
export {};
