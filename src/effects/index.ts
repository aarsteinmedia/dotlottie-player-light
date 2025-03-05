import type { GroupEffect } from '@/effects/EffectsManager'
import type { EffectValue, ElementInterface, ItemData } from '@/types'

import PropertyFactory from '@/utils/PropertyFactory'

export class SliderEffect {
  p: ItemData

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class AngleEffect {
  p: ItemData

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class ColorEffect {
  p: ItemData

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container)
  }
}

export class PointEffect {
  p: ItemData

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container)
  }
}

export class LayerIndexEffect {
  p: ItemData

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class MaskIndexEffect {
  p: ItemData

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class CheckboxEffect {
  p: ItemData

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class NoValueEffect {
  p: object

  constructor() {
    this.p = {}
  }
}
