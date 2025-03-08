import type { ElementInterface, GlobalData, LottieLayer } from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import { extendPrototype } from '@/utils/functionExtensions'

class RenderableDOMElement {
  _isFirstFrame?: boolean
  _mdf?: boolean
  baseElement?: SVGGElement
  data!: LottieLayer
  hidden?: boolean
  isInRange?: boolean
  isTransparent?: boolean
  layerElement!: SVGGElement
  prepareRenderableFrame!: (num: number) => void
  destroy() {
    this.innerElem = null
    this.destroyBaseElement()
  }
  hide() {
    // console.log('HIDE', this);
    if (!this.hidden && (!this.isInRange || this.isTransparent)) {
      const elem = this.baseElement || this.layerElement
      elem.style.display = 'none'
      this.hidden = true
    }
  }
  initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterface
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
  prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
    this.checkTransparency()
  }
  renderFrame() {
    // If it is exported as hidden (data.hd === true) no need to render
    // If it is not visible no need to render
    if (this.data.hd || this.hidden) {
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
  show() {
    // console.log('SHOW', this);
    if (this.isInRange && !this.isTransparent) {
      if (!this.data.hd) {
        const elem = this.baseElement || this.layerElement
        elem.style.display = 'block'
      }
      this.hidden = false
      this._isFirstFrame = true
    }
  }
}

extendPrototype([RenderableElement], RenderableDOMElement)

// interface RenderableDOMElement extends RenderableElement {}

export default RenderableDOMElement
