import type { CompInterface, GlobalData, LottieLayer } from '@/types'

import ImageElement from '@/elements/ImageElement'
import { createNS } from '@/utils'

class ISolidElement extends ImageElement {
  data!: LottieLayer
  initElement!: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompInterface
  ) => void
  layerElement?: SVGGElement
  constructor(data: LottieLayer, globalData: GlobalData, comp: CompInterface) {
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

export default ISolidElement
