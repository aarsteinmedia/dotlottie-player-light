import type AnimationItem from '@/animation/AnimationItem';
import { AnimationDirection, AnimationEventName } from '@/types';
export declare class BMEnterFrameEvent {
    currentTime: number;
    direction: AnimationDirection;
    target?: AnimationItem;
    totalTime: number;
    type: AnimationEventName;
    constructor(type: AnimationEventName, currentTime: number, totalTime: number, frameMultiplier: number);
}
export declare class BMCompleteEvent {
    direction: AnimationDirection;
    target?: AnimationItem;
    type: AnimationEventName;
    constructor(type: AnimationEventName, frameMultiplier: number);
}
export declare class BMDrawnFrameEvent {
    currentTime: number;
    direction: AnimationDirection;
    target?: AnimationItem;
    totalTime: number;
    type: AnimationEventName;
    constructor(type: AnimationEventName, currentTime: number, direction: AnimationDirection, totalTime: number);
}
export declare class BMCompleteLoopEvent {
    currentLoop: number;
    direction: AnimationDirection;
    target?: AnimationItem;
    totalLoops: number | boolean;
    type: AnimationEventName;
    constructor(type: AnimationEventName, totalLoops: number | boolean, currentLoop: number, frameMultiplier: number);
}
export declare class BMSegmentStartEvent {
    firstFrame: number;
    target?: AnimationItem;
    totalFrames: number;
    type: AnimationEventName;
    constructor(type: AnimationEventName, firstFrame: number, totalFrames: number);
}
export declare class BMDestroyEvent {
    target: AnimationItem;
    type: AnimationEventName;
    constructor(type: AnimationEventName, target: AnimationItem);
}
export declare class BMRenderFrameErrorEvent {
    currentTime: number;
    nativeError: unknown;
    target?: AnimationItem;
    type: AnimationEventName;
    constructor(nativeError: unknown, currentTime: number);
}
export declare class BMConfigErrorEvent {
    nativeError: unknown;
    target?: AnimationItem;
    type: AnimationEventName;
    constructor(nativeError: unknown, _: number);
}
export declare class BMAnimationConfigErrorEvent {
    nativeError: unknown;
    target?: AnimationItem;
    type: AnimationEventName;
    constructor(type: AnimationEventName, nativeError: unknown);
}
export declare class BaseEvent {
    _cbs: Partial<Record<AnimationEventName, ((ev?: LottieEvent) => unknown)[] | null>>;
    addEventListener(eventName: AnimationEventName, callback: (ev?: LottieEvent) => unknown): () => void;
    removeEventListener(eventName: AnimationEventName, callback?: (ev: LottieEvent) => unknown): void;
    triggerEvent(eventName: AnimationEventName, ev?: LottieEvent): void;
}
export type LottieEvent = BMAnimationConfigErrorEvent | BMEnterFrameEvent | BMCompleteEvent | BMCompleteLoopEvent | BMSegmentStartEvent | BMAnimationConfigErrorEvent | BMConfigErrorEvent | BMDestroyEvent | BMDrawnFrameEvent;
