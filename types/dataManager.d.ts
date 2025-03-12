import type { AnimationData } from './types';
export default class DataManager {
    private static _counterId;
    private static workerFn;
    private static workerProxy;
    private static _workerSelf;
    private static processes;
    private static workerInstance;
    static completeAnimation(animation: AnimationData, onComplete: (data: AnimationData) => void, onError?: (error?: unknown) => void): void;
    static loadAnimation(path: string, onComplete: (data: AnimationData) => void, onError?: (error?: unknown) => void): void;
    static loadData(path: string, onComplete: (data: AnimationData) => void, onError?: (error?: unknown) => void): void;
    private static createProcess;
    private static createWorker;
    private static setupWorker;
}
