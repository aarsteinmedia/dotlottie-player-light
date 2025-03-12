import type { GlobalData, LottieLayer } from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
// import TransformElement from '@/elements/helpers/TransformElement'
// import { extendPrototype } from '@/utils/functionExtensions'
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

  // initTransform() {
  //   throw new Error('NullElement: Method initTransform not yet implemented')
  // }

  prepareFrame(num: number) {
    this.prepareProperties(num, true)
  }

  /** Fallback */
  renderFrame(_frame?: number | null) {
    // throw new Error('NullElement: Method renderFrame not yet implemented')
  }
}

// extendPrototype([TransformElement], NullElement)
