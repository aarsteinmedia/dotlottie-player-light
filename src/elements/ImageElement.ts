import type {
  ElementInterface,
  GlobalData,
  LottieAsset,
  LottieLayer,
} from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import TransformElement from '@/elements/helpers/TransformElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import { createNS } from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'
export default class ImageElement {
  assetData?: LottieAsset | null

  globalData!: GlobalData

  initElement!: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterface
  ) => void

  innerElem?: SVGImageElement

  layerElement!: SVGGElement

  sourceRect: {
    height: number
    left: number
    top: number
    width: number
  }

  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
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

  createContent() {
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

  sourceRectAtTime() {
    return this.sourceRect
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
  ImageElement
)
