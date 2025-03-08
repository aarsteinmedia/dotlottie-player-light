import type { ElementInterface, VectorProperty } from '@/types'

import {
  KeyframedMultidimensionalProperty,
  KeyframedValueProperty,
  MultiDimensionalProperty,
  NoProperty,
  ValueProperty,
} from '@/utils/Properties'

export default class PropertyFactory {
  static getProp = (
    elem: ElementInterface,
    dataFromProps?: VectorProperty<number | any[]>,
    type?: number,
    mult?: null | number,
    container?: any
  ) => {
    let data = dataFromProps
    if (data && 'sid' in data && data.sid) {
      data = elem.globalData?.slotManager?.getProp(data)
    }
    let p
    if (!data?.k.length) {
      p = new ValueProperty(elem, data, mult, container)
    } else if (typeof data.k[0] === 'number') {
      p = new MultiDimensionalProperty(elem, data, mult, container)
    } else {
      switch (type) {
        case 0:
          p = new KeyframedValueProperty(elem, data, mult, container)
          break
        case 1:
          p = new KeyframedMultidimensionalProperty(elem, data, mult, container)
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
