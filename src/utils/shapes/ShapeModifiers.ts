import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier'

import { ElementInterface } from '@/types'

export type ShapeModifierInterface =
  | typeof TrimModifier
  | typeof PuckerAndBloatModifier
  | typeof RepeaterModifier
  | typeof ZigZagModifier
  | typeof OffsetPathModifier

export default class ShapeModifiers {
  static getModifier(nm: string, elem?: ElementInterface, data?: unknown) {
    return new modifiers[nm](elem, data)
  }

  static registerModifier(nm: string, factory: ShapeModifierInterface) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory
    }
  }
}

const modifiers: { [key: string]: ShapeModifierInterface } = {}
