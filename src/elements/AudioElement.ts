/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { AnimatedProperty, Audio, GlobalData, LottieAsset } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import { extendPrototype } from '@/utils/functionExtensions'
import PropertyFactory from '@/utils/PropertyFactory'

class AudioElement {
  _canPlay: boolean
  _currentTime: number
  _isPlaying: boolean
  _previousVolume: number | null
  _volume: number
  _volumeMultiplier?: number
  assetData: null | LottieAsset
  audio: Audio
  lv: AnimatedProperty
  tm: AnimatedProperty
  constructor(data: any, globalData: GlobalData, comp: any) {
    this.initFrame()
    this.initRenderable()
    this.assetData = globalData.getAssetData?.(data.refId) || null
    this.initBaseData(data, globalData, comp)
    this._isPlaying = false
    this._canPlay = false
    const assetPath = this.globalData?.getAssetsPath?.(this.assetData)
    this.audio = this.globalData?.audioController.createAudio(assetPath)
    this._currentTime = 0
    this.globalData.audioController.addAudio(this)
    this._volumeMultiplier = 1
    this._volume = 1
    this._previousVolume = null
    this.tm = data.tm
      ? PropertyFactory.getProp(this, data.tm, 0, globalData.frameRate, this)
      : { _placeholder: true }
    this.lv = PropertyFactory.getProp(
      this,
      data.au && data.au.lv ? data.au.lv : { k: [100] },
      1,
      0.01,
      this
    )
  }
  // destroy() {}

  getBaseElement() {
    return null
  }

  hide() {
    this.audio.pause()
    this._isPlaying = false
  }

  // initExpressions() {}

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
    this._volume = (this.lv?.v as number[])[0]
    const totalVolume = this._volume * Number(this._volumeMultiplier)
    if (this._previousVolume !== totalVolume) {
      this._previousVolume = totalVolume
      this.audio.volume(totalVolume)
    }
  }

  renderFrame(_isFirstFrame?: boolean) {
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

  setRate(rateValue: number) {
    this.audio.rate(rateValue)
  }
  // show() {
  //   // this.audio.play()
  // }
  volume(volumeValue: number) {
    this._volumeMultiplier = volumeValue
    this._previousVolume = volumeValue * this._volume
    this.audio.volume(this._previousVolume)
  }
}

extendPrototype([RenderableElement, BaseElement, FrameElement], AudioElement)

interface AudioElement extends RenderableElement, BaseElement, FrameElement {}

export default AudioElement
