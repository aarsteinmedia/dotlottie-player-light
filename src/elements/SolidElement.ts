import type { GlobalData, LottieLayer } from '@/types'

import ImageElement from '@/elements/ImageElement'
import { createNS } from '@/utils'

export default class SolidElement extends ImageElement {
  data!: LottieLayer
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    super(data, globalData, comp)
    this.initElement(data, globalData, comp)
  }

  override createContent() {
    const rect = createNS<SVGRectElement>('rect')
    rect.width.baseVal.value = Number(this.data?.sw)
    rect.height.baseVal.value = Number(this.data?.sh)
    if (this.data?.sc) {
      rect.setAttribute('fill', `${this.data.sc}`)
    }
    this.layerElement?.appendChild(rect)
  }
}
