import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier'

import { ElementInterfaceIntersect } from '@/types'

export type ShapeModifierInterface =
  | TrimModifier
  | PuckerAndBloatModifier
  | RepeaterModifier
  | ZigZagModifier
  | OffsetPathModifier

type Factory =
  | typeof TrimModifier
  | typeof PuckerAndBloatModifier
  | typeof RepeaterModifier
  | typeof ZigZagModifier
  | typeof OffsetPathModifier

export default class ShapeModifiers {
  static getModifier(
    nm: string,
    elem?: ElementInterfaceIntersect,
    data?: unknown
  ) {
    // @ts-expect-error: cant pass args - TODO: Find cases and test real behaviour
    return new modifiers[nm](elem, data)
  }

  static registerModifier(nm: string, factory: Factory) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory
    }
  }
}

const modifiers: { [key: string]: Factory } = {}
