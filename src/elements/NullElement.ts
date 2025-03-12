import type { GlobalData, LottieLayer } from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
export default class NullElement extends FrameElement {
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    super()
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.initTransform()
    this.initHierarchy()
  }

  getBaseElement() {
    return null
  }

  prepareFrame(num: number) {
    this.prepareProperties(num, true)
  }

  renderFrame(_frame?: number | null) {
    /** Fallback */
  }
}
