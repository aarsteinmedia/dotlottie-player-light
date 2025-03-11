import type { Effect, ElementInterfaceIntersect, LottieLayer } from '@/types'

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
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

export default class EffectsManager {
  effectElements: EffectInterface[]
  constructor(data: LottieLayer, element: ElementInterfaceIntersect) {
    const effects = data.ef || []
    this.effectElements = []
    const { length } = effects
    for (let i = 0; i < length; i++) {
      const effectItem = new GroupEffect(effects[i], element, data)
      this.effectElements.push(effectItem)
    }
  }
}

export class GroupEffect extends DynamicPropertyContainer {
  data?: Effect
  effectElements?: EffectInterface[]
  override getValue = this.iterateDynamicProperties
  constructor(
    data: Effect,
    element: ElementInterfaceIntersect,
    layer: LottieLayer
  ) {
    super()
    this.init(data, element, layer)
  }
  init(data: Effect, element: ElementInterfaceIntersect, layer: LottieLayer) {
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
          eff = new SliderEffect(effects[i], element as any, this)
          break
        case 1:
          eff = new AngleEffect(effects[i], element as any, this)
          break
        case 2:
          eff = new ColorEffect(effects[i], element as any, this)
          break
        case 3:
          eff = new PointEffect(effects[i], element as any, this)
          break
        case 4:
        case 7:
          eff = new CheckboxEffect(effects[i], element, this)
          break
        case 10:
          eff = new LayerIndexEffect(effects[i], element, this)
          break
        case 11:
          eff = new MaskIndexEffect(effects[i], element, this)
          break
        case 5:
          eff = new EffectsManager(layer, element)
          break
        // case 6:
        default:
          eff = new NoValueEffect()
          break
      }
      if (eff) {
        this.effectElements.push(eff)
      }
    }
  }
}

export type EffectInterface =
  | GroupEffect
  | EffectsManager
  | SliderEffect
  | AngleEffect
  | ColorEffect
  | PointEffect
  | CheckboxEffect
  | LayerIndexEffect
  | MaskIndexEffect
  | NoValueEffect
