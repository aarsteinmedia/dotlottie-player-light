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

import FiltersFactory from '@/utils/FiltersFactory'
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

class SVGEffects {
  static idPrefix = 'filter_result_'
  filters: Filter[]
  constructor(elem: any) {
    // let source = 'SourceGraphic' TODO: Perhaps for main version
    const len = elem.data.ef ? elem.data.ef.length : 0
    const filId = createElementID()
    const fil = FiltersFactory.createFilter(filId, true)
    let count = 0
    this.filters = []
    let filterManager
    for (let i = 0; i < len; i++) {
      filterManager = null
      if (registeredEffects[elem.data.ef[i].ty]) {
        const Effect = registeredEffects[elem.data.ef[i].ty].effect
        filterManager = new Effect(
          fil,
          elem.effectsManager.effectElements[i],
          elem
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
      elem.layerElement.setAttribute(
        'filter',
        `url(${getLocationHref()}#${filId})`
      )
    }
    if (this.filters.length) {
      elem.addRenderableComponent(this)
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

  renderFrame(frame: number) {
    const len = this.filters.length
    for (let i = 0; i < len; i++) {
      this.filters[i].renderFrame(frame)
    }
  }
}

export default SVGEffects
