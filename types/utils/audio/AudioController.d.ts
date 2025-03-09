import type { Audio, AudioFactory } from '@/types';
export default class AudioController {
    audioFactory?: AudioFactory;
    audios: Audio[];
    private _isMuted;
    private _volume;
    constructor(audioFactory?: AudioFactory);
    addAudio(audio: Audio): void;
    createAudio(assetPath: string): any;
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
