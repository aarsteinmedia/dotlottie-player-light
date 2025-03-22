import { GroupEffect } from '../effects/EffectsManager';
import TransformEffect from '../effects/TransformEffect';
import { ElementInterfaceIntersect } from '../types';
declare abstract class SVGComposableEffect {
    createMergeNode(resultId: string, ins: string[]): SVGFEMergeElement;
}
export declare class SVGTintFilter extends SVGComposableEffect {
    filterManager: GroupEffect;
    linearFilter: SVGFEColorMatrixElement;
    matrixFilter: SVGFEColorMatrixElement;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string, source: string);
    renderFrame(forceRender?: boolean): void;
}
export declare class SVGFillFilter {
    filterManager: GroupEffect;
    matrixFilter: SVGFEColorMatrixElement;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    renderFrame(forceRender?: boolean): void;
}
export declare class SVGStrokeEffect {
    elem: ElementInterfaceIntersect;
    filterManager: GroupEffect;
    initialized: boolean;
    masker?: SVGMaskElement;
    pathMasker?: SVGGElement;
    paths: {
        m: number;
        p: SVGPathElement;
    }[];
    constructor(_fil: SVGFilterElement, filterManager: GroupEffect, elem: ElementInterfaceIntersect);
    initialize(): void;
    renderFrame(forceRender?: boolean): void;
}
export declare class SVGTritoneFilter {
    feFuncB: SVGFEFuncBElement;
    feFuncG: SVGFEFuncGElement;
    feFuncR: SVGFEFuncRElement;
    filterManager: GroupEffect;
    matrixFilter: SVGFEComponentTransferElement;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    renderFrame(forceRender?: boolean): void;
}
export declare class SVGProLevelsFilter {
    feFuncA?: SVGFEFuncAElement;
    feFuncB?: SVGFEFuncBElement;
    feFuncBComposed?: SVGFEFuncBElement;
    feFuncG?: SVGFEFuncGElement;
    feFuncGComposed?: SVGFEFuncGElement;
    feFuncR?: SVGFEFuncRElement;
    feFuncRComposed?: SVGFEFuncRElement;
    filterManager: GroupEffect;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    createFeFunc<T extends SVGElement>(type: string, feComponentTransfer: SVGFEComponentTransferElement): T;
    getTableValue(inputBlack: number, inputWhite: number, gamma: number, outputBlack: number, outputWhite: number): string;
    renderFrame(forceRender?: boolean): void;
}
export declare class SVGDropShadowEffect extends SVGComposableEffect {
    feFlood: SVGFEFloodElement;
    feGaussianBlur: SVGFEGaussianBlurElement;
    feOffset: SVGFEOffsetElement;
    filterManager: GroupEffect;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string, source: string);
    renderFrame(forceRender?: boolean): void;
}
export declare class SVGMatte3Effect {
    elem: ElementInterfaceIntersect;
    filterElem: SVGFilterElement;
    filterManager: GroupEffect;
    initialized?: boolean;
    constructor(filterElem: SVGFilterElement, filterManager: GroupEffect, elem: ElementInterfaceIntersect);
    findSymbol(mask: ElementInterfaceIntersect): ElementInterfaceIntersect | null;
    initialize(): void;
    renderFrame(): void;
    replaceInParent(mask: ElementInterfaceIntersect, symbolId: string): void;
    setElementAsMask(elem: ElementInterfaceIntersect, mask: ElementInterfaceIntersect): void;
}
export declare class SVGGaussianBlurEffect {
    feGaussianBlur: SVGFEGaussianBlurElement;
    filterManager: GroupEffect;
    constructor(filter: SVGFilterElement, filterManager: GroupEffect, _elem: ElementInterfaceIntersect, id: string);
    renderFrame(forceRender?: boolean): void;
}
export declare class SVGTransformEffect extends TransformEffect {
    constructor(_: any, filterManager: GroupEffect);
}
export {};
