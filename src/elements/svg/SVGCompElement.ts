/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { CompInterface, GlobalData, LottieLayer } from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

import CompElement from '@/elements/CompElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'
/**
 *
 */
class SVGCompElement extends SVGBaseElement {
  completeLayers: boolean
  elements: any[]
  initElement!: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompInterface
  ) => void
  layers: LottieLayer[]
  pendingElements: any[]
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
        ? PropertyFactory.getProp(
            this,
            data.tm as any,
            0,
            globalData.frameRate,
            this
          )
        : { _placeholder: true }
    ) as any
  }

  createComp(data: LottieLayer) {
    return new SVGCompElement(data, this.globalData, this)
  }
}

extendPrototype([SVGRendererBase, CompElement], SVGCompElement)

interface SVGCompElement extends SVGRendererBase, CompElement {}

export default SVGCompElement
