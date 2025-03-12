import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
// import { extendPrototype } from '@/utils/functionExtensions'

export default class RenderableDOMElement extends RenderableElement {
  innerElem?: SVGImageElement

  createContainerElements() {
    throw new Error(
      'RenderableDOMElement: Method createContainerElements is not yet implemented'
    )
  }
  createContent() {
    throw new Error(
      'RenderableDOMElement: Method createContent is not yet implemented'
    )
  }
  createRenderableComponents() {
    throw new Error(
      'RenderableDOMElement: Method createRenderableComponents is not yet implemented'
    )
  }
  destroy() {
    this.innerElem = null as any
    this.destroyBaseElement()
  }
  destroyBaseElement() {
    throw new Error(
      'RenderableDOMElement: Method destroyBaseElement is not yet implemented'
    )
  }
  override hide() {
    // console.log('HIDE', this);
    if (!this.hidden && (!this.isInRange || this.isTransparent)) {
      const elem = this.baseElement || this.layerElement
      if (elem) {
        elem.style.display = 'none'
      }

      this.hidden = true
    }
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
  initRendererElement() {
    throw new Error(
      'RenderableDOMElement: Method initRendererElement is not yet implemented'
    )
  }
  prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
    this.checkTransparency()
  }
  renderElement() {
    throw new Error(
      'RenderableDOMElement: Method renderElement is not yet implemented'
    )
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
  renderInnerContent() {
    throw new Error(
      'RenderableDOMElement: Method renderInnerContent is not yet implemented'
    )
  }
  override show() {
    // console.log('SHOW', this);
    if (this.isInRange && !this.isTransparent) {
      if (!this.data?.hd) {
        const elem = this.baseElement || this.layerElement
        if (elem) {
          elem.style.display = 'block'
        }
      }
      this.hidden = false
      this._isFirstFrame = true
    }
  }
}

// extendPrototype([RenderableElement], RenderableDOMElement)
