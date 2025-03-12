import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import { ValueProperty } from '@/utils/Properties'

export default class CompElement extends RenderableDOMElement {
  elements?: ElementInterfaceIntersect[]
  // _mdf?: boolean
  // isInRange?: boolean
  tm?: ValueProperty
  buildAllItems() {
    throw new Error('CompElement: Method buildAllItems not implemented')
  }

  // checkLayers(_val: number) {
  //   throw new Error('CompElement: Method checkLayers not implemented')
  // }
  override destroy() {
    this.destroyElements()
    this.destroyBaseElement()
  }

  destroyElements() {
    const { length } = this.layers || []
    for (let i = 0; i < length; i++) {
      if (this.elements?.[i]) {
        this.elements[i].destroy()
      }
    }
  }

  // initFrame() {
  //   throw new Error('CompElement: Method initFrame not implemented')
  // }

  // initRenderable() {
  //   throw new Error('CompElement: Method initRenderable not implemented')
  // }

  // initHierarchy() {
  //   throw new Error('CompElement: Method initHierarchy not implemented')
  // }

  // prepareFrame(_val: number) {
  //   throw new Error('CompElement: Method prepareFrame not implemented')
  // }

  getElements(): ElementInterfaceIntersect[] | undefined {
    return this.elements
  }

  override initElement(
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
    if (this.data?.xt || !globalData.progressiveLoad) {
      this.buildAllItems()
    }
    this.hide()
  }

  // prepareProperties(_val: number, _isInRange?: boolean) {
  //   throw new Error('CompElement: Method prepareProperties not implemented')
  // }

  override prepareFrame(val: number) {
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

  // prepareRenderableFrame(_val: number, _?: boolean) {
  //   throw new Error(
  //     'CompElement: Method prepareRenderableFrame not implemented'
  //   )
  // }
  // renderInnerContent() {
  //   throw new Error('CompElement: Method renderInnerContent not implemented')
  // }

  override renderInnerContent() {
    const { length } = this.layers || []
    for (let i = 0; i < length; i++) {
      if (this.completeLayers || this.elements?.[i]) {
        this.elements?.[i].renderFrame()
      }
    }
  }

  setElements(elems: ElementInterfaceIntersect[]) {
    this.elements = elems
  }
}

// extendPrototype(
//   [
//     // BaseElement,
//     TransformElement,
//     HierarchyElement,
//     FrameElement,
//     RenderableDOMElement,
//   ],
//   CompElement
// )
