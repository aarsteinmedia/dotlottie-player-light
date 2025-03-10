/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { GlobalData, LottieLayer } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import TransformElement from '@/elements/helpers/TransformElement'
import { extendPrototype } from '@/utils/functionExtensions'
class NullElement {
  initTransform!: () => void

  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    // this.initFrame()
    this.initTransform()
    this.initHierarchy()
  }

  destroy() {}

  getBaseElement() {
    return null
  }

  hide() {}

  prepareFrame(num: number) {
    this.prepareProperties(num, true)
  }

  renderFrame() {}

  sourceRectAtTime() {}
}

extendPrototype(
  [BaseElement, TransformElement, HierarchyElement, FrameElement],
  NullElement
)

interface NullElement extends BaseElement, HierarchyElement, FrameElement {}

export default NullElement
