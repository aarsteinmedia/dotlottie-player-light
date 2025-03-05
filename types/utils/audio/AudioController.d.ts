import type { Audio, AudioFactory } from '@/types';
export default class AudioController {
    constructor(audioFactory?: AudioFactory);
    audios: Audio[];
    audioFactory?: AudioFactory;
    private _volume;
    private _isMuted;
    private _updateVolume;
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
}
