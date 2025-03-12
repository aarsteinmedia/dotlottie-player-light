import type AudioElement from '../../elements/AudioElement';
import type { AudioFactory } from '../../types';
export default class AudioController {
    audioFactory?: AudioFactory;
    audios: AudioElement[];
    private _isMuted;
    private _volume;
    constructor(audioFactory?: AudioFactory);
    addAudio(audio: AudioElement): void;
    createAudio(assetPath?: string): any;
    getVolume(): number;
    mute(): void;
    pause(): void;
    resume(): void;
    setAudioFactory(audioFactory: AudioFactory): void;
    setRate(rateValue: number): void;
    setVolume(value: number): void;
    unmute(): void;
    private _updateVolume;
}
