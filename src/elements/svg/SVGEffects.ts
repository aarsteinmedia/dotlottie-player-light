// import type {
//   AngleEffect,
//   CheckboxEffect,
//   ColorEffect,
//   LayerIndexEffect,
//   MaskIndexEffect,
//   NoValueEffect,
//   PointEffect,
//   SliderEffect,
// } from '@/effects'

import { GroupEffect } from '@/effects/EffectsManager'
import { ElementInterfaceIntersect } from '@/types'
import { createFilter } from '@/utils/FiltersFactory'
import {
  createElementID,
  getLocationHref,
  registeredEffects,
} from '@/utils/getterSetter'

// type Filter =
//   | AngleEffect
//   | CheckboxEffect
//   | ColorEffect
//   | LayerIndexEffect
//   | MaskIndexEffect
//   | NoValueEffect
//   | PointEffect
//   | SliderEffect

export default class SVGEffects {
  static idPrefix = 'filter_result_'
  filters: GroupEffect[]
  constructor(elem: ElementInterfaceIntersect) {
    let source = 'SourceGraphic'

    const filId = createElementID(),
      fil = createFilter(filId, true)

    let count = 0
    this.filters = []
    let filterManager: null | GroupEffect
    const { length } = elem.data.ef || []
    for (let i = 0; i < length; i++) {
      filterManager = null
      if (elem.data.ef![i].ty && registeredEffects[elem.data.ef![i].ty]) {
        const Effect = registeredEffects[elem.data.ef![i].ty].effect

        filterManager = new Effect(
          fil,
          elem.effectsManager?.effectElements[i] as any,
          elem as any,
          SVGEffects.idPrefix + count,
          source
        ) as GroupEffect
        source = SVGEffects.idPrefix + count
        if (registeredEffects[elem.data.ef![i].ty].countsAsEffect) {
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
      elem.addRenderableComponent(this as unknown as ElementInterfaceIntersect)
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
      this.filters[i].renderFrame(frame)
    }
  }
}
