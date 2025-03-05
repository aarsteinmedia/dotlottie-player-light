import {
  createProxyFunction,
  extendPrototype,
} from '@/utils/functionExtensions'
import RenderableElement from '@/elements/helpers/RenderableElement'
import type { ElementInterface, GlobalData, LottieLayer } from '@/types'

export default function RenderableDOMElement() {}

;(() => {
  const _prototype = {
    destroy: function (this: any) {
      this.innerElem = null
      this.destroyBaseElement()
    },
    hide: function (this: any) {
      // console.log('HIDE', this);
      if (!this.hidden && (!this.isInRange || this.isTransparent)) {
        const elem = this.baseElement || this.layerElement
        elem.style.display = 'none'
        this.hidden = true
      }
    },
    initElement: function (
      this: any,
      data: LottieLayer,
      globalData: GlobalData,
      comp: ElementInterface
    ) {
      this.initFrame()
      this.initBaseData(data, globalData, comp)
      this.initTransform(data, globalData, comp)
      this.initHierarchy()
      this.initRenderable()
      this.initRendererElement()
      this.createContainerElements()
      this.createRenderableComponents()
      this.createContent()
      this.hide()
    },
    prepareFrame: function (this: any, num: number) {
      this._mdf = false
      this.prepareRenderableFrame(num)
      this.prepareProperties(num, this.isInRange)
      this.checkTransparency()
    },
    renderFrame: function (this: any) {
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
    },
    renderInnerContent: function () {},
    show: function (this: any) {
      // console.log('SHOW', this);
      if (this.isInRange && !this.isTransparent) {
        if (!this.data.hd) {
          const elem = this.baseElement || this.layerElement
          elem.style.display = 'block'
        }
        this.hidden = false
        this._isFirstFrame = true
      }
    },
  }
  extendPrototype(
    [RenderableElement, createProxyFunction(_prototype)],
    RenderableDOMElement
  )
})()
