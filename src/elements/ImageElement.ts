import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
  SourceRect,
} from '@/types'

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import { createNS } from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'
export default class ImageElement extends RenderableDOMElement {
  assetData?: LottieAsset | null

  sourceRect: SourceRect | null

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
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

  override createContent() {
    let assetPath = ''
    if (this.assetData && this.globalData?.getAssetsPath) {
      assetPath = this.globalData.getAssetsPath(this.assetData)
    }

    if (this.assetData) {
      this.innerElem = createNS<SVGImageElement>('image')
      this.innerElem.setAttribute('width', `${this.assetData.w}px`)
      this.innerElem.setAttribute('height', `${this.assetData.h}px`)
      this.innerElem.setAttribute(
        'preserveAspectRatio',
        this.assetData?.pr ||
          this.globalData?.renderConfig?.imagePreserveAspectRatio ||
          ''
      )
      this.innerElem.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'href',
        assetPath
      )

      this.layerElement?.appendChild(this.innerElem)
    }
  }

  override sourceRectAtTime() {
    return this.sourceRect
  }
}

extendPrototype([SVGBaseElement], ImageElement)
