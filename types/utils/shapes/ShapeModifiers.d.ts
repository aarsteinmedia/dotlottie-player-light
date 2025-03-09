import type OffsetPathModifier from '@/utils/shapes/OffsetPathModifier';
import type PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier';
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier';
import type TrimModifier from '@/utils/shapes/TrimModifier';
import type ZigZagModifier from '@/utils/shapes/ZigZagModifier';
import { CompInterface } from '@/types';
type Factory = typeof TrimModifier | typeof PuckerAndBloatModifier | typeof RepeaterModifier | typeof ZigZagModifier | typeof OffsetPathModifier;
export default class ShapeModifiers {
    static getModifier(nm: string, elem?: CompInterface, data?: unknown): OffsetPathModifier | PuckerAndBloatModifier | RepeaterModifier | TrimModifier | ZigZagModifier;
    static registerModifier(nm: string, factory: Factory): void;
}
export {};
