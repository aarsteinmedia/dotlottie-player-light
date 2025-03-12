import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

// import RenderableElement from '@/elements/helpers/RenderableElement'
// import { extendPrototype } from '@/utils/functionExtensions'
import FrameElement from '@/elements/helpers/FrameElement'

export default abstract class RenderableDOMElement extends FrameElement {
  hidden?: boolean
  innerElem?: SVGElement | null
  isInRange?: boolean
  isTransparent?: boolean

  // initTransform() {
  //   throw new Error('RenderableDOMElement: Method initTransform not implemented')
  // }

  destroy() {
    this.innerElem = null
    this.destroyBaseElement()
  }

  hide() {
    // console.log('HIDE', this);
    if (!this.hidden && (!this.isInRange || this.isTransparent)) {
      const elem = this.baseElement || this.layerElement
      if (elem) {
        elem.style.display = 'none'
      }

      this.hidden = true
    }
  }

  // destroyBaseElement() {
  //   throw new Error(
  //     'RenderableDOMElement: Method destroyBaseElement in not implemented'
  //   )
  // }
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
  show() {
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
