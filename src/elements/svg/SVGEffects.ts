import type {
  AngleEffect,
  CheckboxEffect,
  ColorEffect,
  LayerIndexEffect,
  MaskIndexEffect,
  NoValueEffect,
  PointEffect,
  SliderEffect,
} from '@/effects'

import { ElementInterfaceIntersect } from '@/types'
import { createFilter } from '@/utils/FiltersFactory'
import {
  createElementID,
  getLocationHref,
  registeredEffects,
} from '@/utils/getterSetter'

type Filter =
  | AngleEffect
  | CheckboxEffect
  | ColorEffect
  | LayerIndexEffect
  | MaskIndexEffect
  | NoValueEffect
  | PointEffect
  | SliderEffect

export default class SVGEffects {
  // static idPrefix = 'filter_result_'
  filters: Filter[]
  constructor(elem: ElementInterfaceIntersect) {
    // let source = 'SourceGraphic' TODO: Perhaps for main version
    const len = elem.data.ef ? elem.data.ef.length : 0
    const filId = createElementID()
    const fil = createFilter(filId, true)
    let count = 0
    this.filters = []
    let filterManager
    for (let i = 0; i < len; i++) {
      filterManager = null
      if (elem.data.ef?.[i].ty && registeredEffects[elem.data.ef?.[i].ty]) {
        const Effect = registeredEffects[elem.data.ef[i].ty].effect
        // TODO: This looks very wrong and should be tested
        filterManager = new Effect(
          fil as any,
          elem.effectsManager?.effectElements[i] as any,
          elem as any
          // SVGEffects.idPrefix + count, TODO: Perhaps for main version
          // source TODO: Perhaps for main version
        )
        // source = SVGEffects.idPrefix + count TODO: Perhaps for main version
        if (registeredEffects[elem.data.ef[i].ty].countsAsEffect) {
          count += 1
        }
      }
      if (filterManager) {
        this.filters.push(filterManager)
      }
    }
    if (count) {
      elem.globalData.defs.appendChild(fil)
      elem.layerElement?.setAttribute(
        'filter',
        `url(${getLocationHref()}#${filId})`
      )
    }
    if (this.filters.length) {
      elem.addRenderableComponent(this as any)
    }
  }

  getEffects(type: string) {
    const { length } = this.filters,
      effects = []
    for (let i = 0; i < length; i++) {
      if (this.filters[i].type === type) {
        effects.push(this.filters[i])
      }
    }
    return effects
  }

  renderFrame(frame?: number | null) {
    const { length } = this.filters
    for (let i = 0; i < length; i++) {
      // TODO: This needs testing
      ;(this.filters[i] as any).renderFrame(frame)
    }
  }
}
