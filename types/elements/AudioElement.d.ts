import type { AnimatedProperty, Audio, GlobalData, LottieAsset } from '@/types';
import BaseElement from '@/elements/BaseElement';
import FrameElement from '@/elements/helpers/FrameElement';
import RenderableElement from '@/elements/helpers/RenderableElement';
declare class AudioElement {
    _canPlay: boolean;
    _currentTime: number;
    _isPlaying: boolean;
    _previousVolume: number | null;
    _volume: number;
    _volumeMultiplier?: number;
    assetData: null | LottieAsset;
    audio: Audio;
    lv: AnimatedProperty;
    tm: AnimatedProperty;
    constructor(data: any, globalData: GlobalData, comp: any);
    getBaseElement(): null;
    hide(): void;
    pause(): void;
    prepareFrame(num: number): void;
    renderFrame(_isFirstFrame?: boolean): void;
    resume(): void;
    setRate(rateValue: number): void;
    volume(volumeValue: number): void;
}
interface AudioElement extends RenderableElement, BaseElement, FrameElement {
}
export default AudioElement;
