import type { GlobalData, LottieLayer } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import TransformElement from '@/elements/helpers/TransformElement'
import { applyMixins } from '@/utils/functionExtensions'

class NullElement {
  constructor(
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

  prepareFrame (num: number) {
    this.prepareProperties(num, true)
  }

  getBaseElement () {
    return null
  }
}

applyMixins(NullElement, [BaseElement, TransformElement, HierarchyElement, FrameElement])

interface NullElement extends BaseElement, TransformElement, HierarchyElement, FrameElement {}

export default NullElement