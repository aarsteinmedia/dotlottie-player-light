import {
  createElementID,
  getLocationHref,
  registeredEffects,
} from '@/utils/getterSetter'
import { filtersFactory } from '@/utils/filters'

const idPrefix = 'filter_result_'

/**
 *
 */
export default function SVGEffects(
  this: {
    filters: SVGFilterElement[]
  },
  elem: any
) {
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
      filterManager = new (Effect as any)(
        fil,
        elem.effectsManager.effectElements[i],
        elem,
        idPrefix + count,
        source
      )
      source = idPrefix + count
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

SVGEffects.prototype.renderFrame = function (_isFirstFrame?: boolean) {
  const len = this.filters.length
  for (let i = 0; i < len; i++) {
    this.filters[i].renderFrame(_isFirstFrame)
  }
}

SVGEffects.prototype.getEffects = function (type: string) {
  const len = this.filters.length
  const effects = []
  for (let i = 0; i < len; i++) {
    if (this.filters[i].type === type) {
      effects.push(this.filters[i])
    }
  }
  return effects
}
