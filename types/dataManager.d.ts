import type { AnimationData } from '@/types';
declare const dataManager: {
    completeAnimation: (animation: AnimationData, onComplete: (data: AnimationData) => void, onError?: (x?: unknown) => void) => void;
    loadAnimation: (path: string, onComplete: (data: AnimationData) => void, onError?: (x?: unknown) => void) => void;
    loadData: <T = unknown>(path: string, onComplete: (data: T) => void, onError?: (x?: unknown) => void) => void;
};
export default dataManager;
