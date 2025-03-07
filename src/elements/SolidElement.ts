import type { GlobalData } from '@/types'

import IImageElement from '@/elements/ImageElement'
import { createNS } from '@/utils'

class ISolidElement extends IImageElement {
  constructor(data: any, globalData: GlobalData, comp: any) {
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
