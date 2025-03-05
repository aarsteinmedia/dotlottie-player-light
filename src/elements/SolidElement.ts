import type { GlobalData } from '@/types'

import IImageElement from '@/elements/ImageElement'
import { createNS } from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'

/**
 *
 */
export default function ISolidElement(
  this: {
    initElement: (data: any, globalData: GlobalData, comp: any) => void
  },
  data: any,
  globalData: GlobalData,
  comp: any
) {
  this.initElement(data, globalData, comp)
}
extendPrototype([IImageElement as any], ISolidElement)

ISolidElement.prototype.createContent = function () {
  const rect = createNS('rect')
  // / /rect.style.width = this.data.sw;
  // / /rect.style.height = this.data.sh;
  // / /rect.style.fill = this.data.sc;
  rect.setAttribute('width', this.data.sw)
  rect.setAttribute('height', this.data.sh)
  rect.setAttribute('fill', this.data.sc)
  this.layerElement.appendChild(rect)
}
