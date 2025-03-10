import type { EffectInterface, GroupEffect } from '@/effects/EffectsManager'
import type { EffectValue, ElementInterface } from '@/types'
import type { ValueProperty } from '@/utils/Properties'

import PropertyFactory from '@/utils/PropertyFactory'

export class SliderEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: EffectInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem as any, data.v, 0, 0, container)
  }
}

export class AngleEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: EffectInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem as any, data.v, 0, 0, container)
  }
}

export class ColorEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: EffectInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem as any, data.v, 1, 0, container)
  }
}

export class PointEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: EffectInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem as any, data.v, 1, 0, container)
  }
}

export class LayerIndexEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class MaskIndexEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: ElementInterface,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
  }
}

export class CheckboxEffect {
  p?: ValueProperty
  type?: string

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
  type?: string

  constructor() {
    this.p = {}
  }
}
