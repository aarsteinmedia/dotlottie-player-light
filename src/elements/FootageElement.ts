import { extendPrototype } from '@/utils/functionExtensions'
import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import { getExpressionInterfaces } from '@/utils/getterSetter'
import { GlobalData, LottieLayer } from '@/types'

/**
 *
 */
export default function FootageElement(
  this: any,
  data: LottieLayer,
  globalData: GlobalData,
  comp: any
) {
  this.initFrame()
  this.initRenderable()
  if (data.refId && globalData.getAssetData) {
    this.assetData = globalData.getAssetData(data.refId)
  }
  this.footageData = globalData.imageLoader.getAsset(this.assetData)
  this.initBaseData(data, globalData, comp)
}

FootageElement.prototype.prepareFrame = function () {}

extendPrototype([RenderableElement, BaseElement, FrameElement], FootageElement)

FootageElement.prototype.getBaseElement = function () {
  return null
}

FootageElement.prototype.renderFrame = function () {}

FootageElement.prototype.destroy = function () {}

FootageElement.prototype.initExpressions = function () {
  const expressionsInterfaces = getExpressionInterfaces()
  if (!expressionsInterfaces) {
    return
  }
  const FootageInterface = expressionsInterfaces('footage')
  this.layerInterface = FootageInterface(this)
}

FootageElement.prototype.getFootageData = function () {
  return this.footageData
}
