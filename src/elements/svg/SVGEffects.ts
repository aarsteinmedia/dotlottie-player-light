import { filtersFactory } from '@/utils/filters'
import {
  createElementID,
  getLocationHref,
  registeredEffects,
} from '@/utils/getterSetter'

class SVGEffects {
  static idPrefix = 'filter_result_'
  filters: any[]
  constructor(elem: any) {
    let source = 'SourceGraphic'
    const len = elem.data.ef ? elem.data.ef.length : 0
    const filId = createElementID()
    const fil = filtersFactory.createFilter(filId, true)
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
          elem,
          SVGEffects.idPrefix + count,
          source
        )
        source = SVGEffects.idPrefix + count
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
    const len = this.filters.length
    const effects = []
    for (let i = 0; i < len; i++) {
      if (this.filters[i].type === type) {
        effects.push(this.filters[i])
      }
    }
    return effects
  }

  renderFrame(_isFirstFrame?: boolean) {
    const len = this.filters.length
    for (let i = 0; i < len; i++) {
      this.filters[i].renderFrame(_isFirstFrame)
    }
  }
}

export default SVGEffects
