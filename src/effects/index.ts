import type { ElementInterface, PropertyHandler, ShapeData } from '@/types'
import PropertyFactory from '@/utils/PropertyFactory'

/**
 *
 */
export function SliderEffect(
  this: {
    p: PropertyHandler
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
    p: PropertyHandler
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
    p: PropertyHandler
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
    p: PropertyHandler
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
    p: PropertyHandler
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
    p: PropertyHandler
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
    p: PropertyHandler
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
