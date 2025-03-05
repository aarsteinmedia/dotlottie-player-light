export declare const filtersFactory: {
    createAlphaToLuminanceFilter: () => SVGFEColorMatrixElement;
    createFilter: (filId: string, skipCoordinates?: boolean) => SVGFilterElement;
}, featureSupport: {
    maskType: boolean;
    offscreenCanvas: boolean;
    svgLumaHidden: boolean;
};
