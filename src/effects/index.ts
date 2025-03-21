import type { EffectInterface, GroupEffect } from '@/effects/EffectsManager'
import type { EffectValue, ElementInterfaceIntersect } from '@/types'
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
    this.p = PropertyFactory(
      elem as any,
      data.v,
      0,
      0,
      container
    ) as ValueProperty
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
    this.p = PropertyFactory(
      elem as any,
      data.v,
      0,
      0,
      container
    ) as ValueProperty
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
    this.p = PropertyFactory(
      elem as any,
      data.v,
      1,
      0,
      container
    ) as ValueProperty
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
    this.p = PropertyFactory(
      elem as any,
      data.v,
      1,
      0,
      container
    ) as ValueProperty
  }
}

export class LayerIndexEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: ElementInterfaceIntersect,
    container: GroupEffect
  ) {
    this.p = PropertyFactory(elem, data.v, 0, 0, container) as ValueProperty
  }
}

export class MaskIndexEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: ElementInterfaceIntersect,
    container: GroupEffect
  ) {
    this.p = PropertyFactory(elem, data.v, 0, 0, container) as ValueProperty
  }
}

export class CheckboxEffect {
  p?: ValueProperty
  type?: string

  constructor(
    data: EffectValue,
    elem: ElementInterfaceIntersect,
    container: GroupEffect
  ) {
    this.p = PropertyFactory(elem, data.v, 0, 0, container) as ValueProperty
  }
}

export class NoValueEffect {
  p: object
  type?: string

  constructor() {
    this.p = {}
  }
}
