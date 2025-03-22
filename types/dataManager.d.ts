import type { AnimationData } from './types';
export declare function completeAnimation(animation: AnimationData, onComplete: (data: AnimationData) => void, onError?: (error?: unknown) => void): void;
export declare function loadAnimation(path: string, onComplete: (data: AnimationData) => void, onError?: (error?: unknown) => void): void;
export declare function loadData(path: string, onComplete: (data: AnimationData) => void, onError?: (error?: unknown) => void): void;
