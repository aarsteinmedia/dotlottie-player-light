import type { ElementInterface, ItemData, ShapeData } from '@/types'
import PropertyFactory from '@/utils/PropertyFactory'

/**
 *
 */
export function SliderEffect(
  this: {
    p: ItemData
  },
  data: ShapeData,
  elem: ElementInterface,
  container?: ElementInterface
) {
  this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
}

/**
 *
 */
export function AngleEffect(
  this: {
    p: ItemData
  },
  data: ShapeData,
  elem: ElementInterface,
  container?: ElementInterface
) {
  this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
}
/**
 *
 */
export function ColorEffect(
  this: {
    p: ItemData
  },
  data: ShapeData,
  elem: ElementInterface,
  container?: ElementInterface
) {
  this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container)
}
/**
 *
 */
export function PointEffect(
  this: {
    p: ItemData
  },
  data: ShapeData,
  elem: ElementInterface,
  container?: ElementInterface
) {
  this.p = PropertyFactory.getProp(elem, data.v, 1, 0, container)
}
/**
 *
 */
export function LayerIndexEffect(
  this: {
    p: ItemData
  },
  data: ShapeData,
  elem: ElementInterface,
  container?: ElementInterface
) {
  this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
}
/**
 *
 */
export function MaskIndexEffect(
  this: {
    p: ItemData
  },
  data: ShapeData,
  elem: ElementInterface,
  container?: ElementInterface
) {
  this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
}
/**
 *
 */
export function CheckboxEffect(
  this: {
    p: ItemData
  },
  data: ShapeData,
  elem: ElementInterface,
  container?: ElementInterface
) {
  this.p = PropertyFactory.getProp(elem, data.v, 0, 0, container)
}
/**
 *
 */
export function NoValueEffect(this: { p: object }) {
  this.p = {}
}
