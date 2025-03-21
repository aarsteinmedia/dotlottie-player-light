import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

import CompElement from '@/elements/CompElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

export default class SVGCompElement extends SVGBaseElement {
  _debug?: boolean
  _mdf?: boolean
  supports3d: boolean
  tm?: KeyframedValueProperty
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    super()
    this.layers = data.layers!
    this.supports3d = true
    this.completeLayers = false
    this.pendingElements = []
    this.elements = this.layers ? createSizedArray(this.layers.length) : []
    this.initElement(data, globalData, comp)
    this.tm = (
      data.tm
        ? PropertyFactory(
            this as any,
            data.tm as any,
            0,
            globalData.frameRate,
            this as any
          )
        : { _placeholder: true }
    ) as any
  }

  override createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error('SVGCompElement: Cannot access global data')
    }
    return new SVGCompElement(data, this.globalData, this)
  }

  destroy() {
    throw new Error('SVGCompElement: Method destroy is not implemented')
  }

  initElement(
    _data: LottieLayer,
    _globalData: GlobalData,
    _comp: ElementInterfaceIntersect
  ) {}

  prepareFrame(_val: number) {
    throw new Error('SVGCompElement: Method prepareFrame is not implemented')
  }

  renderFrame() {
    throw new Error('SVGCompElement: Method renderFrame is not implemented')
  }
}

extendPrototype([SVGRendererBase, CompElement], SVGCompElement)
