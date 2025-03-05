import type { ElementInterface, GlobalData, LottieLayer } from '@/types'

import ICompElement from '@/elements/CompElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'
/**
 *
 */
export default function SVGCompElement(
  this: ElementInterface,
  data: LottieLayer,
  globalData: GlobalData,
  comp: ElementInterface
) {
  this.layers = data.layers as LottieLayer[]
  this.supports3d = true
  this.completeLayers = false
  this.pendingElements = []
  this.elements = this.layers ? createSizedArray(this.layers.length) : []
  this.initElement(data, globalData, comp)
  this.tm = data.tm
    ? PropertyFactory.getProp(this, data.tm, 0, globalData.frameRate, this)
    : { _placeholder: true }
}

extendPrototype([SVGRendererBase, ICompElement, SVGBaseElement], SVGCompElement)

SVGCompElement.prototype.createComp = function (data: LottieLayer) {
  return new (SVGCompElement as any)(data, this.globalData, this)
}
