import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import TransformElement from '@/elements/helpers/TransformElement'
import { extendPrototype } from '@/utils/functionExtensions'
import { ValueProperty } from '@/utils/Properties'

export default class CompElement {
  _mdf?: boolean
  checkLayers!: (val?: number) => void
  completeLayers?: boolean
  data?: LottieLayer
  elements?: ElementInterfaceIntersect[]
  isInRange?: boolean
  layers?: LottieLayer[]
  renderedFrame!: number
  tm?: ValueProperty
  buildAllItems() {
    throw new Error('Method not implemented')
  }
  // checkLayers(_val?: number) {
  //   console.error('hello')
  //   throw new Error('Method not implemented')
  // }
  destroyBaseElement() {
    throw new Error('Method not implemented')
  }
  destroyElements() {
    throw new Error('Method not implemented')
  }
  getElements(): ElementInterfaceIntersect[] {
    throw new Error('Method not implemented')
  }

  initElement(
    _data: LottieLayer,
    _globalData: GlobalData,
    _comp: ElementInterfaceIntersect
  ) {
    throw new Error('Method not implemented')
  }
  prepareFrame(_val: number) {
    throw new Error('Method not implemented')
  }
  renderInnerContent() {
    throw new Error('Method not implemented')
  }
  setElements(_elems: ElementInterfaceIntersect[]) {
    throw new Error('Method not implemented')
  }
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
  comp: ElementInterfaceIntersect
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

  if (this.tm?._placeholder) {
    this.renderedFrame = num / Number(this.data?.sr)
  } else {
    let timeRemapped = this.tm?.v
    if (timeRemapped === this.data.op) {
      timeRemapped = this.data.op - 1
    }
    this.renderedFrame = Number(timeRemapped)
  }
  const { length } = this.elements || []
  if (!this.completeLayers) {
    this.checkLayers(this.renderedFrame)
  }
  // This iteration needs to be backwards because of how expressions connect between each other
  for (let i = length - 1; i >= 0; i--) {
    if (this.completeLayers || this.elements?.[i]) {
      this.elements?.[i].prepareFrame?.(this.renderedFrame - this.layers[i].st)
      if (this.elements?.[i]._mdf) {
        this._mdf = true
      }
    }
  }
}

CompElement.prototype.renderInnerContent = function () {
  const { length } = this.layers || []
  for (let i = 0; i < length; i++) {
    if (this.completeLayers || this.elements?.[i]) {
      this.elements?.[i].renderFrame()
    }
  }
}

CompElement.prototype.setElements = function (
  elems: ElementInterfaceIntersect[]
) {
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
