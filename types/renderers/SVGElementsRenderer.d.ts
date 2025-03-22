import type { SVGFillStyleData, SVGStyleData } from '../elements/helpers/shapes';
import type { ItemData, Shape, ShapeDataInterface } from '../types';
export declare function createRenderFunction(data: Shape): typeof renderFill | typeof renderGradient | typeof renderPath | null;
declare function renderFill(_: SVGStyleData, itemData?: SVGFillStyleData, isFirstFrame?: boolean): void;
declare function renderGradient(styleData: SVGStyleData, itemData?: ItemData, isFirstFrame?: boolean): void;
declare function renderPath(styleData: SVGStyleData, itemData?: ShapeDataInterface, isFirstFrame?: boolean): void;
export type CreateRenderFunction = typeof createRenderFunction;
export {};
