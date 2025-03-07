/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { GlobalData, LottieAsset, LottieLayer } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import { applyMixins } from '@/utils/functionExtensions'
import { getExpressionInterfaces } from '@/utils/getterSetter'

class FootageElement {
  assetData: null | LottieAsset = null
  footageData: SVGElement
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    this.initFrame()
    this.initRenderable()
    if (data.refId && globalData.getAssetData) {
      this.assetData = globalData.getAssetData(data.refId)
    }
    this.footageData = globalData.imageLoader.getAsset(this.assetData)
    this.initBaseData(data, globalData, comp)
  }

  getBaseElement() {
    return null
  }

  getFootageData() {
    return this.footageData
  }

  initExpressions() {
    const expressionsInterfaces = getExpressionInterfaces()
    if (!expressionsInterfaces) {
      return
    }
    const FootageInterface = expressionsInterfaces('footage')
    this.layerInterface = FootageInterface(this)
  }
}

applyMixins(FootageElement, [RenderableElement, BaseElement, FrameElement])

interface FootageElement extends RenderableElement, BaseElement, FrameElement {}

export default FootageElement
