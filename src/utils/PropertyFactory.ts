import type { CompInterface, Keyframe, VectorProperty } from '@/types'

import {
  KeyframedMultidimensionalProperty,
  KeyframedValueProperty,
  MultiDimensionalProperty,
  NoProperty,
  ValueProperty,
} from '@/utils/Properties'

export default class PropertyFactory {
  static getProp = (
    elem: CompInterface,
    dataFromProps?: VectorProperty<number | number[]>,
    type?: number,
    mult?: null | number,
    container?: any
  ) => {
    let data = dataFromProps
    if (data && 'sid' in data && data.sid) {
      data = elem.globalData?.slotManager?.getProp(data as VectorProperty)
    }
    let p
    if (!(data?.k as number[]).length) {
      p = new ValueProperty(elem, data as VectorProperty, mult, container)
    } else if (typeof (data?.k as number[])[0] === 'number') {
      p = new MultiDimensionalProperty(
        elem,
        data as VectorProperty<number[]>,
        mult,
        container
      )
    } else {
      switch (type) {
        case 0:
          p = new KeyframedValueProperty(
            elem,
            data as unknown as VectorProperty<Keyframe[]>,
            mult,
            container
          )
          break
        case 1:
          p = new KeyframedMultidimensionalProperty(
            elem,
            data as VectorProperty<number[]>,
            mult,
            container
          )
          break
        default:
          break
      }
    }
    if (!p) {
      p = new NoProperty()
    }
    if (p?.effectsSequence.length) {
      container.addDynamicProperty(p)
    }
    return p
  }
}
