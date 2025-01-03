import * as Lottie from 'lottie-web/build/player/lottie_light.js';
import type { AnimationDirection, AnimationSegment } from 'lottie-web';
import renderPlayer from '../templates/player';
import renderControls from '../templates/controls';
import { PlayMode, PlayerState, PreserveAspectRatio } from '../enums';
import { AnimationSettings, AnimateOnScroll, Autoplay, Controls, Loop, LottieManifest, Subframe } from '../types';
import EnhancedElement from '../elements/EnhancedElement';
export default class DotLottiePlayer extends EnhancedElement {
    constructor();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    shadow: ShadowRoot;
    template: HTMLTemplateElement;
    protected _render: typeof renderPlayer;
    protected _renderControls: typeof renderControls;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, _oldValue: unknown, value: string): Promise<void>;
    static get observedProperties(): string[];
    propertyChangedCallback(name: string, _oldValue: unknown, value: unknown): void;
    set animateOnScroll(value: AnimateOnScroll);
    get animateOnScroll(): AnimateOnScroll;
    set autoplay(value: Autoplay);
    get autoplay(): Autoplay;
    set background(value: string);
    get background(): string;
    set controls(value: Controls);
    get controls(): Controls;
    set count(value: number);
    get count(): number;
    set description(value: string | null);
    get description(): string | null;
    set direction(value: AnimationDirection);
    get direction(): AnimationDirection;
    set hover(value: boolean);
    get hover(): boolean;
    set intermission(value: number);
    get intermission(): number;
    set loop(value: Loop);
    get loop(): Loop;
    set mode(value: PlayMode);
    get mode(): PlayMode;
    set objectfit(value: string);
    get objectfit(): string;
    set preserveAspectRatio(value: PreserveAspectRatio | null);
    get preserveAspectRatio(): PreserveAspectRatio | null;
    set simple(value: boolean);
    get simple(): boolean;
    set speed(value: number);
    get speed(): number;
    set src(value: string | null);
    get src(): string | null;
    set subframe(value: Subframe);
    get subframe(): Subframe;
    private _multiAnimationSettings;
    getMultiAnimationSettings(): AnimationSettings[];
    setMultiAnimationSettings(settings: AnimationSettings[]): void;
    private _segment?;
    setSegment(segment: AnimationSegment): void;
    getSegment(): Lottie.AnimationSegment | undefined;
    protected _container: Element | null;
    playerState?: PlayerState;
    protected _isSettingsOpen: boolean;
    protected _seeker: number;
    private _currentAnimation;
    private _animations;
    private _intersectionObserver?;
    private _lottieInstance;
    protected _identifier: string;
    protected _errorMessage: string;
    private _isBounce;
    private _manifest;
    protected _playerState: {
        prev: PlayerState;
        count: number;
        loaded: boolean;
        visible: boolean;
        scrollY: number;
        scrollTimeout: NodeJS.Timeout | null;
    };
    private _getOptions;
    private _addIntersectionObserver;
    load(src: string | null): Promise<void>;
    getManifest(): LottieManifest;
    private _toggleEventListeners;
    private _addEventListeners;
    private _removeEventListeners;
    private _loopComplete;
    private _enterFrame;
    private _complete;
    private _DOMLoaded;
    private _dataReady;
    private _dataFailed;
    private _handleWindowBlur;
    private _mouseEnter;
    private _mouseLeave;
    private _onVisibilityChange;
    private _handleScroll;
    protected _handleSeekChange({ target }: Event): void;
    private _isLottie;
    getLottie(): Lottie.AnimationItem | null;
    play(): Promise<void>;
    pause(): void;
    stop(): void;
    destroy(): void;
    seek(value: number | string): void;
    snapshot(shouldDownload?: boolean, name?: string): string | null;
    setSubframe(value: boolean): void;
    setCount(value: number): void;
    protected _freeze(): void;
    reload(): Promise<void>;
    setSpeed(value?: number): void;
    setDirection(value: AnimationDirection): void;
    setLoop(value: boolean): void;
    togglePlay(): void | Promise<void>;
    toggleLoop(): void;
    toggleBoomerang(): void;
    private _toggleSettings;
    protected _handleSettingsClick: ({ target }: Event) => void;
    protected _handleBlur(): void;
    private _switchInstance;
    next(): void;
    prev(): void;
    static get styles(): CSSStyleSheet;
}
