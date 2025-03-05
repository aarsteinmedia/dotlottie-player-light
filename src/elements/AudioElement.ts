import type { GlobalData } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import { extendPrototype } from '@/utils/functionExtensions'
import PropertyFactory from '@/utils/PropertyFactory'

/**
 *
 */
export default function AudioElement(
  this: any,
  data: any,
  globalData: GlobalData,
  comp: any
) {
  this.initFrame()
  this.initRenderable()
  if (globalData.getAssetData) {
    this.assetData = globalData.getAssetData(data.refId)
  }
  this.initBaseData(data, globalData, comp)
  this._isPlaying = false
  this._canPlay = false
  const assetPath = this.globalData.getAssetsPath(this.assetData)
  this.audio = this.globalData.audioController.createAudio(assetPath)
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

AudioElement.prototype.prepareFrame = function (num: number) {
  this.prepareRenderableFrame(num, true)
  this.prepareProperties(num, true)
  if (this.tm._placeholder) {
    this._currentTime = num / this.data.sr
  } else {
    this._currentTime = this.tm.v
  }
  this._volume = this.lv.v[0]
  const totalVolume = this._volume * this._volumeMultiplier
  if (this._previousVolume !== totalVolume) {
    this._previousVolume = totalVolume
    this.audio.volume(totalVolume)
  }
}

extendPrototype([RenderableElement, BaseElement, FrameElement], AudioElement)

AudioElement.prototype.renderFrame = function () {
  if (this.isInRange && this._canPlay) {
    if (!this._isPlaying) {
      this.audio.play()
      this.audio.seek(this._currentTime / this.globalData.frameRate)
      this._isPlaying = true
    } else if (
      !this.audio.playing() ||
      Math.abs(
        this._currentTime / this.globalData.frameRate - this.audio.seek()
      ) > 0.1
    ) {
      this.audio.seek(this._currentTime / this.globalData.frameRate)
    }
  }
}

AudioElement.prototype.show = function () {
  // this.audio.play()
}

AudioElement.prototype.hide = function () {
  this.audio.pause()
  this._isPlaying = false
}

AudioElement.prototype.pause = function () {
  this.audio.pause()
  this._isPlaying = false
  this._canPlay = false
}

AudioElement.prototype.resume = function () {
  this._canPlay = true
}

AudioElement.prototype.setRate = function (rateValue: number) {
  this.audio.rate(rateValue)
}

AudioElement.prototype.volume = function (volumeValue: number) {
  this._volumeMultiplier = volumeValue
  this._previousVolume = volumeValue * this._volume
  this.audio.volume(this._previousVolume)
}

AudioElement.prototype.getBaseElement = function () {
  return null
}

AudioElement.prototype.destroy = function () {}

AudioElement.prototype.sourceRectAtTime = function () {}

AudioElement.prototype.initExpressions = function () {}
