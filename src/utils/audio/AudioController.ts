import type { Audio, AudioFactory } from '@/types'

/**
 *
 */
export default class AudioController {
  constructor(audioFactory?: AudioFactory) {
    this.audios = []
    this.audioFactory = audioFactory
    this._volume = 1
    this._isMuted = false
  }

  public audios: Audio[]
  public audioFactory?: AudioFactory
  private _volume: number
  private _isMuted: boolean

  private _updateVolume() {
    const { length } = this.audios
    for (let i = 0; i < length; i++) {
      this.audios[i].volume(this._volume * (this._isMuted ? 0 : 1))
    }
  }
  public addAudio(audio: Audio) {
    this.audios.push(audio)
  }
  public createAudio(assetPath: string) {
    if (this.audioFactory) {
      return this.audioFactory(assetPath)
    }
    // @ts-expect-error - Howl does not exist in window
    if (!isServer() && window.Howl) {
      // @ts-expect-error - Howl does not exist in window
      return new window.Howl({
        src: [assetPath],
      })
    }
    return {
      isPlaying: false,
      play: function () {
        this.isPlaying = true
      },
      playing: () => {},
      rate: () => {},
      seek: function () {
        this.isPlaying = false
      },
      setVolume: () => {},
    }
  }
  public getVolume() {
    return this._volume
  }
  public mute() {
    this._isMuted = true
    this._updateVolume()
  }
  public pause() {
    for (const audio of this.audios) {
      audio.pause()
    }
  }
  public resume() {
    for (const audio of this.audios) {
      audio.resume()
    }
  }
  public setAudioFactory(audioFactory: AudioFactory) {
    this.audioFactory = audioFactory
  }
  public setRate(rateValue: number) {
    for (const audio of this.audios) {
      audio.setRate(rateValue)
    }
  }
  public setVolume(value: number) {
    this._volume = value
    this._updateVolume()
  }
  public unmute() {
    this._isMuted = false
    this._updateVolume()
  }
}
