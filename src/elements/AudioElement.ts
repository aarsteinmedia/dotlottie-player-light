import type {
  Audio,
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
  Vector2,
} from '@/types'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import PropertyFactory from '@/utils/PropertyFactory'

import RenderableElement from './helpers/RenderableElement'

export default class AudioElement extends RenderableElement {
  _canPlay: boolean
  _currentTime: number
  _isPlaying: boolean
  _previousVolume: number | null
  _volume: number
  _volumeMultiplier?: number
  assetData: null | LottieAsset
  audio: Audio
  lv: MultiDimensionalProperty<Vector2>

  tm: ValueProperty

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.initFrame()
    this.initRenderable()
    this.assetData = globalData.getAssetData?.(data.refId) || null
    this.initBaseData(data, globalData, comp)
    this._isPlaying = false
    this._canPlay = false
    const assetPath = this.globalData?.getAssetsPath?.(this.assetData)
    this.audio = this.globalData?.audioController?.createAudio(assetPath)
    this._currentTime = 0
    this.globalData?.audioController?.addAudio(this)
    this._volumeMultiplier = 1
    this._volume = 1
    this._previousVolume = null
    this.tm = (
      data.tm
        ? PropertyFactory.getProp(
            this as any,
            data.tm as any,
            0,
            globalData.frameRate,
            this
          )
        : { _placeholder: true }
    ) as ValueProperty
    this.lv = PropertyFactory.getProp(
      this as any,
      (data.au && data.au.lv ? data.au.lv : { k: [100] }) as any,
      1,
      0.01,
      this
    ) as MultiDimensionalProperty<Vector2>
  }

  getBaseElement() {
    return null
  }

  override hide() {
    this.audio.pause()
    this._isPlaying = false
  }

  pause() {
    this.audio.pause()
    this._isPlaying = false
    this._canPlay = false
  }

  prepareFrame(num: number) {
    this.prepareRenderableFrame(num, true)
    this.prepareProperties(num, true)
    if (this.tm._placeholder) {
      this._currentTime = num / Number(this.data?.sr)
    } else {
      this._currentTime = Number(this.tm.v)
    }
    this._volume = Number(this.lv?.v[0])
    const totalVolume = this._volume * Number(this._volumeMultiplier)
    if (this._previousVolume !== totalVolume) {
      this._previousVolume = totalVolume
      this.audio.volume(totalVolume)
    }
  }

  renderFrame(_frame?: number | null) {
    if (this.isInRange && this._canPlay) {
      if (!this._isPlaying) {
        this.audio.play()
        this.audio.seek(this._currentTime / Number(this.globalData?.frameRate))
        this._isPlaying = true
      } else if (
        !this.audio.playing() ||
        Math.abs(
          this._currentTime / Number(this.globalData?.frameRate) -
            this.audio.seek()
        ) > 0.1
      ) {
        this.audio.seek(this._currentTime / Number(this.globalData?.frameRate))
      }
    }
  }

  resume() {
    this._canPlay = true
  }

  setMatte(_id: string) {
    throw new Error('AudioElement: Method setMatte is not implemented')
  }
  setRate(rateValue: number) {
    this.audio.rate(rateValue)
  }
  volume(volumeValue: number) {
    this._volumeMultiplier = volumeValue
    this._previousVolume = volumeValue * this._volume
    this.audio.volume(this._previousVolume)
  }
}
