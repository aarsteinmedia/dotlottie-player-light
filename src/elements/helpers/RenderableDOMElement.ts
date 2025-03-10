import type { ElementInterface, GlobalData, LottieLayer } from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import { extendPrototype } from '@/utils/functionExtensions'

class RenderableDOMElement {
  _isFirstFrame?: boolean
  _mdf?: boolean
  baseElement?: SVGGElement
  checkTransparency!: () => void
  createContainerElements!: () => void
  createContent!: () => void
  createRenderableComponents!: () => void
  data!: LottieLayer
  destroyBaseElement!: () => void
  hidden?: boolean
  initBaseData!: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterface
  ) => void
  initFrame!: () => void
  initHierarchy!: () => void
  initRenderable!: () => void
  initRendererElement!: () => void
  initTransform!: () => void
  innerElem!: SVGElement
  isInRange?: boolean
  isTransparent?: boolean
  layerElement!: SVGGElement
  prepareProperties!: (val: number, isInRange?: boolean) => void
  prepareRenderableFrame!: (num: number) => void
  renderElement!: () => void
  renderLocalTransform!: () => void
  renderRenderable!: () => void
  renderTransform!: () => void
  destroy() {
    this.innerElem = null as any
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
  renderFrame(_frame?: number | null) {
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
