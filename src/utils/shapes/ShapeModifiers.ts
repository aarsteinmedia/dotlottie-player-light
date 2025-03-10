import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier'

import { CompInterface } from '@/types'

export type ShapeModifierInterface =
  | TrimModifier
  | PuckerAndBloatModifier
  | RepeaterModifier
  | ZigZagModifier
  | OffsetPathModifier

export default class ShapeModifiers {
  static getModifier(nm: string, elem?: CompInterface, data?: unknown) {
    return new modifiers[nm](elem, data)
  }

  static registerModifier(nm: string, factory: ShapeModifierInterface) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory
    }
  }
}

const modifiers: { [key: string]: ShapeModifierInterface } = {}
