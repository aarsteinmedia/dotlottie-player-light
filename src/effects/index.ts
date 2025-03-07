import type { GroupEffect } from '@/effects/EffectsManager'
import type { EffectValue, ElementInterface } from '@/types'

import PropertyFactory, { type PropertyType } from '@/utils/PropertyFactory'

export class SliderEffect {
  p?: PropertyType

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class AngleEffect {
  p?: PropertyType

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class ColorEffect {
  p?: PropertyType

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container)
  }
}

export class PointEffect {
  p?: PropertyType

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container)
  }
}

export class LayerIndexEffect {
  p?: PropertyType

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class MaskIndexEffect {
  p?: PropertyType

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class CheckboxEffect {
  p?: PropertyType

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
