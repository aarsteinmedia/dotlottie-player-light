import type { Audio, ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer, Vector2 } from '@/types';
import type { MultiDimensionalProperty, ValueProperty } from '@/utils/Properties';
import RenderableElement from './helpers/RenderableElement';
export default class AudioElement extends RenderableElement {
    _canPlay: boolean;
    _currentTime: number;
    _isPlaying: boolean;
    _previousVolume: number | null;
    _volume: number;
    _volumeMultiplier?: number;
    assetData: null | LottieAsset;
    audio: Audio;
    lv: MultiDimensionalProperty<Vector2>;
    tm: ValueProperty;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    getBaseElement(): null;
    hide(): void;
    pause(): void;
    prepareFrame(num: number): void;
    renderFrame(_frame?: number | null): void;
    resume(): void;
    setMatte(_id: string): void;
    setRate(rateValue: number): void;
    volume(volumeValue: number): void;
}
