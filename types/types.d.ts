import type { AnimationDirection } from 'lottie-web';
import type { CSSProperties, RefObject } from 'react';
import type { Plugin } from '@custom-elements-manifest/analyzer';
import type { PlayMode } from './enums';
import type DotLottiePlayer from './elements/DotLottiePlayer';
type BoolInt = 0 | 1;
interface Shape {
    a: ShapeData;
    o: ShapeData;
    p: ShapeData;
    r: ShapeData;
    s: ShapeData;
}
interface ShapeData {
    a: 0 | 1;
    k: number | number[];
    ix: number;
}
interface Layer {
    ao: BoolInt;
    bm: number;
    completed: boolean;
    ddd: BoolInt;
    ip: number;
    ks: object;
    nm: string;
    op: number;
    shapes: Shape[];
    sr: number;
    st: number;
    td: number;
    ty: number;
}
export interface LottieAsset {
    e?: BoolInt;
    layers?: Layer[];
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
type JSXLottiePlayer = Omit<Partial<DotLottiePlayer>, 'style'> & {
    class?: string;
    ref?: RefObject<unknown>;
    style?: CSSProperties;
    src: string;
};
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
declare global {
    interface HTMLElementTagNameMap {
        'dotlottie-player': DotLottiePlayer;
    }
    function dotLottiePlayer(): DotLottiePlayer;
    namespace JSX {
        interface IntrinsicElements {
            'dotlottie-player': JSXLottiePlayer;
        }
    }
}
export {};
