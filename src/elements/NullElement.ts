import type { GlobalData, LottieLayer, SourceRect } from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
import TransformElement from '@/elements/helpers/TransformElement'
import { extendPrototype } from '@/utils/functionExtensions'
export default class NullElement extends FrameElement {
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    super()
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.initTransform()
    this.initHierarchy()
  }

  destroy() {
    // TODO: check if this is a fallback too
    // throw new Error('NullElement: Method destroy not yet implemented')
  }

  getBaseElement() {
    return null
  }

  hide() {
    // TODO: check if this is a fallback too
    // throw new Error('NullElement: Method hide not yet implemented')
  }

  initTransform() {
    throw new Error('NullElement: Method initTransform not yet implemented')
  }

  prepareFrame(num: number) {
    this.prepareProperties(num, true)
  }

  /** Fallback */
  renderFrame(_frame?: number | null) {
    // throw new Error('NullElement: Method renderFrame not yet implemented')
  }

  sourceRectAtTime(): SourceRect | null {
    throw new Error('NullElement: Method sourceRectAtTime not yet implemented')
  }
}

extendPrototype([TransformElement], NullElement)
