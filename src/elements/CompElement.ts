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
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { extendPrototype } from '@/utils/functionExtensions'
import { ValueProperty } from '@/utils/Properties'

export default class CompElement extends SVGRendererBase {
  _mdf?: boolean
  isInRange?: boolean
  tm?: ValueProperty
  override destroy() {
    this.destroyElements()
    this.destroyBaseElement()
  }
  destroyBaseElement() {
    throw new Error('CompElement: Method not implemented')
  }
  destroyElements() {
    const { length } = this.layers || []
    for (let i = 0; i < length; i++) {
      if (this.elements?.[i]) {
        this.elements[i].destroy()
      }
    }
  }
  getElements(): ElementInterfaceIntersect[] | undefined {
    return this.elements
  }
  initElement(
    _data: LottieLayer,
    _globalData: GlobalData,
    _comp: ElementInterfaceIntersect
  ) {
    throw new Error('CompElement: Method not implemented')
  }

  initFrame() {
    throw new Error('CompElement: Method not implemented')
  }

  initHierarchy() {
    throw new Error('CompElement: Method not implemented')
  }

  initRenderable() {
    throw new Error('CompElement: Method not implemented')
  }

  initTransform() {
    throw new Error('CompElement: Method not implemented')
  }

  prepareFrame(_val: number) {
    throw new Error('CompElement: Method not implemented')
  }

  prepareProperties(_val: number, _isInRange?: boolean) {
    throw new Error('CompElement: Method not implemented')
  }

  prepareRenderableFrame(_val: number, _?: boolean) {
    throw new Error('CompElement: Method not implemented')
  }

  renderInnerContent() {
    throw new Error('CompElement: Method not implemented')
  }
  setElements(elems: ElementInterfaceIntersect[]) {
    this.elements = elems
  }

  // createRenderableComponents() {
  //   throw new Error('CompElement: Method not implemented') // TODO:
  // }

  // createContainerElements() {
  //   throw new Error('CompElement: Method not implemented') // TODO:
  // }

  // initRendererElement() {
  //   throw new Error('CompElement: Method not implemented') // TODO:
  // }
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
  this.initRendererElement() // TODO:
  this.createContainerElements() // TODO:
  this.createRenderableComponents() // TODO:
  if (this.data?.xt || !globalData.progressiveLoad) {
    this.buildAllItems()
  }
  this.hide()
}

CompElement.prototype.prepareFrame = function (val: number) {
  this._mdf = false
  this.prepareRenderableFrame(val)
  this.prepareProperties(val, this.isInRange)
  if (!this.isInRange && !this.data?.xt) {
    return
  }

  if (this.tm?._placeholder) {
    this.renderedFrame = val / Number(this.data?.sr)
  } else {
    let timeRemapped = this.tm?.v
    if (timeRemapped === this.data?.op) {
      timeRemapped = Number(this.data?.op) - 1
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
      this.elements?.[i].prepareFrame?.(
        this.renderedFrame - Number(this.layers?.[i].st)
      )
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
