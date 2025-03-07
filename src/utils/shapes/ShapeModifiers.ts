import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier'

type Factory =
  | typeof TrimModifier
  | typeof PuckerAndBloatModifier
  | typeof RepeaterModifier
  | typeof ZigZagModifier
  | typeof OffsetPathModifier

export default class ShapeModifiers {
  static getModifier(nm: string, elem?: any, data?: unknown) {
    return new modifiers[nm](elem, data)
  }

  static registerModifier(nm: string, factory: Factory) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory
    }
  }
}

const modifiers: { [key: string]: Factory } = {}
