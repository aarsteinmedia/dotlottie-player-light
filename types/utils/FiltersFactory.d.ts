export default class FilltersFactory {
    static createAlphaToLuminanceFilter(): SVGFEColorMatrixElement;
    static createFilter(filId: string, skipCoordinates?: boolean): SVGFilterElement;
}
export declare class FeatureSupport {
    maskType: boolean;
    offscreenCanvas: boolean;
    svgLumaHidden: boolean;
    constructor();
}
