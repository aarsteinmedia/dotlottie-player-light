import type {
  ElementInterface,
  GlobalData,
  LottieAsset,
  LottieLayer,
} from '@/types'
import { createNS } from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'
import BaseElement from '@/elements/BaseElement'
import TransformElement from '@/elements/helpers/TransformElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import FrameElement from '@/elements/helpers/FrameElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'

interface ImageElement {
  assetData: LottieAsset | null
  sourceRect: {
    height: number
    left: number
    top: number
    width: number
  }
  initElement: (data: LottieLayer, globalData: GlobalData, comp: any) => void
  innerElem: SVGImageElement
  globalData: GlobalData
  layerElement: SVGElement
}

/**
 *
 */
export default function IImageElement(
  this: ImageElement,
  data: LottieLayer,
  globalData: GlobalData,
  comp: ElementInterface
) {
  if (data.refId && globalData.getAssetData) {
    this.assetData = globalData.getAssetData(data.refId)
  }
  if (this.assetData && this.assetData.sid) {
    this.assetData = globalData.slotManager?.getProp(this.assetData) || null
  }
  this.initElement(data, globalData, comp)
  this.sourceRect = {
    height: Number(this.assetData?.h),
    left: 0,
    top: 0,
    width: Number(this.assetData?.w),
  }
}

extendPrototype(
  [
    BaseElement,
    TransformElement,
    SVGBaseElement,
    HierarchyElement,
    FrameElement,
    RenderableDOMElement,
  ],
  IImageElement
)

IImageElement.prototype.createContent = function (this: ImageElement) {
  let assetPath = ''
  if (this.assetData && this.globalData.getAssetsPath) {
    assetPath = this.globalData.getAssetsPath(this.assetData)
  }

  if (this.assetData) {
    this.innerElem = createNS<SVGImageElement>('image')
    this.innerElem.setAttribute('width', `${this.assetData.w}px`)
    this.innerElem.setAttribute('height', `${this.assetData.h}px`)
    this.innerElem.setAttribute(
      'preserveAspectRatio',
      this.assetData?.pr ||
        this.globalData.renderConfig?.imagePreserveAspectRatio ||
        ''
    )
    this.innerElem.setAttributeNS(
      'http://www.w3.org/1999/xlink',
      'href',
      assetPath
    )

    this.layerElement.appendChild(this.innerElem)
  }
}

IImageElement.prototype.sourceRectAtTime = function () {
  return this.sourceRect
}
