import type { ElementInterface, GlobalData, LottieLayer } from '@/types'
import { extendPrototype } from '@/utils/functionExtensions'
import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import TransformElement from '@/elements/helpers/TransformElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'

/**
 *
 */
export default function NullElement(
  this: ElementInterface,
  data: LottieLayer,
  globalData: GlobalData,
  comp: any
) {
  this.initFrame()
  this.initBaseData(data, globalData, comp)
  this.initFrame()
  this.initTransform(data, globalData, comp)
  this.initHierarchy()
}

NullElement.prototype.prepareFrame = function (num: number) {
  this.prepareProperties(num, true)
}

NullElement.prototype.renderFrame = function () {}

NullElement.prototype.getBaseElement = function () {
  return null
}

NullElement.prototype.destroy = function () {}

NullElement.prototype.sourceRectAtTime = function () {}

NullElement.prototype.hide = function () {}

extendPrototype(
  [BaseElement, TransformElement, HierarchyElement, FrameElement],
  NullElement
)
