import type { GlobalData, LayerInterFace, LottieLayer } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import TransformElement from '@/elements/helpers/TransformElement'
import { extendPrototype } from '@/utils/functionExtensions'

export default class CompElement {
  createContainerElements!: () => void
  createRenderableComponents!: () => void
  data!: LottieLayer
  initBaseData!: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: LayerInterFace
  ) => void
  initElement!: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: LayerInterFace
  ) => void
  initFrame!: () => void
  initHierarchy!: () => void
  initRenderable!: () => void
  initRendererElement!: () => void
  initTransform!: () => void
}

extendPrototype(
  [
    BaseElement,
    TransformElement,
    HierarchyElement,
    FrameElement,
    RenderableDOMElement,
  ],
  CompElement
)

CompElement.prototype.initElement = function (
  data: LottieLayer,
  globalData: GlobalData,
  comp: LayerInterFace
) {
  this.initFrame()
  this.initBaseData(data, globalData, comp)
  this.initTransform()
  this.initRenderable()
  this.initHierarchy()
  this.initRendererElement()
  this.createContainerElements()
  this.createRenderableComponents()
  if (this.data.xt || !globalData.progressiveLoad) {
    this.buildAllItems()
  }
  this.hide()
}

/* CompElement.prototype.hide = function(){
    if(!this.hidden){
        this.hideElement();
        var i,len = this.elements.length;
        for( i = 0; i < len; i+=1 ){
            if(this.elements[i]){
                this.elements[i].hide();
            }
        }
    }
}; */

CompElement.prototype.prepareFrame = function (num: number) {
  this._mdf = false
  this.prepareRenderableFrame(num)
  this.prepareProperties(num, this.isInRange)
  if (!this.isInRange && !this.data.xt) {
    return
  }

  if (this.tm._placeholder) {
    this.renderedFrame = num / this.data.sr
  } else {
    let timeRemapped = this.tm.v
    if (timeRemapped === this.data.op) {
      timeRemapped = this.data.op - 1
    }
    this.renderedFrame = timeRemapped
  }
  const len = this.elements.length
  if (!this.completeLayers) {
    this.checkLayers(this.renderedFrame)
  }
  // This iteration needs to be backwards because of how expressions connect between each other
  for (let i = len - 1; i >= 0; i--) {
    if (this.completeLayers || this.elements[i]) {
      this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st)
      if (this.elements[i]._mdf) {
        this._mdf = true
      }
    }
  }
}

CompElement.prototype.renderInnerContent = function () {
  let i
  const len = this.layers.length
  for (i = 0; i < len; i++) {
    if (this.completeLayers || this.elements[i]) {
      this.elements[i].renderFrame()
    }
  }
}

CompElement.prototype.setElements = function (elems: any) {
  this.elements = elems
}

CompElement.prototype.getElements = function () {
  return this.elements
}

CompElement.prototype.destroyElements = function () {
  const { length } = this.layers
  for (let i = 0; i < length; i++) {
    if (this.elements[i]) {
      this.elements[i].destroy()
    }
  }
}

CompElement.prototype.destroy = function () {
  this.destroyElements()
  this.destroyBaseElement()
}
