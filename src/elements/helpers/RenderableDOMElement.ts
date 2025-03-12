import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import { extendPrototype } from '@/utils/functionExtensions'

export default class RenderableDOMElement extends RenderableElement {
  innerElem?: SVGElement | null

  destroy() {
    this.innerElem = null
    this.destroyBaseElement()
  }

  destroyBaseElement() {
    throw new Error(
      'RenderableDOMElement: Method destroyBaseElement in not implemented'
    )
  }
  initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.initTransform()
    this.initHierarchy()
    this.initRenderable()
    this.initRendererElement()
    this.createContainerElements()
    this.createRenderableComponents()
    this.createContent()
    this.hide()
  }
  // initFrame() {
  //   throw new Error('RenderableDOMElement: Method initFrame in not implemented')
  // }
  prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
    this.checkTransparency()
  }
  renderFrame(_frame?: number | null) {
    // If it is exported as hidden (data.hd === true) no need to render
    // If it is not visible no need to render
    if (this.data?.hd || this.hidden) {
      return
    }
    this.renderTransform()
    this.renderRenderable()
    this.renderLocalTransform()
    this.renderElement()
    this.renderInnerContent()
    if (this._isFirstFrame) {
      this._isFirstFrame = false
    }
  }
  renderInnerContent() {}
}

extendPrototype([RenderableElement], RenderableDOMElement)
