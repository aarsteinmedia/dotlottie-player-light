import type { GlobalData, LottieLayer, SourceRect } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import TransformElement from '@/elements/helpers/TransformElement'
import { extendPrototype } from '@/utils/functionExtensions'
export default class NullElement extends FrameElement {
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    super()
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    // this.initFrame()
    this.initTransform()
    this.initHierarchy()
  }

  destroy() {
    throw new Error('Method not yet implemented')
  }

  getBaseElement() {
    return null
  }

  hide() {
    throw new Error('Method not yet implemented')
  }

  prepareFrame(num: number) {
    this.prepareProperties(num, true)
  }

  renderFrame(_frame?: number | null) {}

  sourceRectAtTime(): SourceRect | null {
    throw new Error('Method not yet implemented')
  }
}

extendPrototype([BaseElement, TransformElement, HierarchyElement], NullElement)
