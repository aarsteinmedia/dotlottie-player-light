import type { GlobalData, LottieComp } from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import TransformElement from '@/elements/helpers/TransformElement'
import { applyMixins } from '@/utils/functionExtensions'

class ICompElement {
  destroy() {
    this.destroyElements()
    this.destroyBaseElement()
  }

  /* hide = function(){
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

  destroyElements() {
    const { length } = this.layers
    for (let i = 0; i < length; i++) {
      if (this.elements[i]) {
        this.elements[i].destroy()
      }
    }
  }

  getElements() {
    return this.elements
  }

  initElement(data: any, globalData: GlobalData, comp: LottieComp) {
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.initTransform(data, globalData, comp)
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

  prepareFrame(num: number) {
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

  renderInnerContent() {
    let i
    const len = this.layers.length
    for (i = 0; i < len; i++) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].renderFrame()
      }
    }
  }

  setElements(elems: any) {
    this.elements = elems
  }
}

applyMixins(ICompElement, [
  BaseElement,
  TransformElement,
  HierarchyElement,
  FrameElement,
  RenderableDOMElement,
])

interface ICompElement
  extends BaseElement, TransformElement,
  HierarchyElement,
  FrameElement,
  RenderableDOMElement { }

export default ICompElement

// export default function ICompElement() {}

// extendPrototype(
//   [
//     BaseElement,
//     TransformElement,
//     HierarchyElement,
//     FrameElement,
//     RenderableDOMElement,
//   ],
//   ICompElement
// )
