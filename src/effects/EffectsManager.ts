import type { Effect } from '@/types'

import {
  AngleEffect,
  CheckboxEffect,
  ColorEffect,
  LayerIndexEffect,
  MaskIndexEffect,
  NoValueEffect,
  PointEffect,
  SliderEffect,
} from '@/effects'
import { extendPrototype } from '@/utils/functionExtensions'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

/**
 *
 */
export default function EffectsManager(
  this: {
    effectElements: Effect['ef']
  },
  data: Effect,
  element: unknown
) {
  const effects = data.ef || []
  this.effectElements = []
  const { length } = effects
  for (let i = 0; i < length; i++) {
    const effectItem = new (GroupEffect as any)(effects[i], element)
    this.effectElements.push(effectItem)
  }
}

/**
 *
 */
function GroupEffect(
  this: { init: (data: Effect, element: unknown) => void },
  data: Effect,
  element: unknown
) {
  this.init(data, element)
}

extendPrototype([DynamicPropertyContainer], GroupEffect)

GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties

GroupEffect.prototype.init = function (data: Effect, element: unknown) {
  this.data = data
  this.effectElements = []
  this.initDynamicPropertyContainer(element)
  let i
  const len = this.data.ef.length
  let eff
  const effects = this.data.ef
  for (i = 0; i < len; i++) {
    eff = null
    switch (effects[i].ty) {
      case 0:
        eff = new (SliderEffect as any)(effects[i], element, this)
        break
      case 1:
        eff = new (AngleEffect as any)(effects[i], element, this)
        break
      case 2:
        eff = new (ColorEffect as any)(effects[i], element, this)
        break
      case 3:
        eff = new (PointEffect as any)(effects[i], element, this)
        break
      case 4:
      case 7:
        eff = new (CheckboxEffect as any)(effects[i], element, this)
        break
      case 10:
        eff = new (LayerIndexEffect as any)(effects[i], element, this)
        break
      case 11:
        eff = new (MaskIndexEffect as any)(effects[i], element, this)
        break
      case 5:
        eff = new (EffectsManager as any)(effects[i], element, this)
        break
      // case 6:
      default:
        eff = new (NoValueEffect as any)(effects[i], element, this)
        break
    }
    if (eff) {
      this.effectElements.push(eff)
    }
  }
}
