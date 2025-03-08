/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { GlobalData, LottieAsset, LottieLayer } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import { extendPrototype } from '@/utils/functionExtensions'
import { getExpressionInterfaces } from '@/utils/getterSetter'

class FootageElement extends FrameElement {
  assetData: null | LottieAsset = null
  footageData: SVGElement
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    super()
    this.initFrame()
    this.initRenderable()
    if (data.refId && globalData?.getAssetData) {
      this.assetData = globalData.getAssetData(data.refId)
    }
    this.footageData = globalData?.imageLoader.getAsset(this.assetData)
    this.initBaseData(data, globalData, comp)
  }

  getBaseElement() {
    return null
  }

  getFootageData() {
    return this.footageData
  }

  override initExpressions() {
    const expressionsInterfaces = getExpressionInterfaces()
    if (!expressionsInterfaces) {
      return
    }
    const FootageInterface = expressionsInterfaces('footage')
    this.layerInterface = FootageInterface(this)
  }
}

extendPrototype([RenderableElement, BaseElement], FootageElement)

interface FootageElement extends RenderableElement, BaseElement {}

export default FootageElement
