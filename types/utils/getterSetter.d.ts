import type SVGRenderer from '@/renderers/SVGRenderer';
import type { EffectElement, ExpressionsPlugin } from '@/types';
import type ProjectInterface from '@/utils/helpers/ProjectInterface';
import { RendererType } from '@/enums';
export declare const initialDefaultFrame = -999999, roundCorner = 0.5519;
export declare const setExpressionsPlugin: (value: ExpressionsPlugin) => void, getExpressionsPlugin: () => ExpressionsPlugin | null, setExpressionInterfaces: (value: typeof ProjectInterface) => void, getExpressionInterfaces: () => typeof ProjectInterface | null;
export declare const setDefaultCurveSegments: (value: number) => void, getDefaultCurveSegments: () => number;
export declare const setWebWorker: (flag: boolean) => void, getWebWorker: () => boolean;
export declare const setSubframeEnabled: (flag: boolean) => void, getSubframeEnabled: () => boolean;
export declare const registerRenderer: (key: RendererType, value: typeof SVGRenderer) => void, getRenderer: (key: RendererType) => typeof SVGRenderer, getRegisteredRenderer: () => RendererType;
export declare const setLocationHref: (value: string) => void, getLocationHref: () => string;
export declare const registeredEffects: {
    [id: string]: {
        countsAsEffect: boolean;
        effect: EffectElement;
    };
}, registerEffect: (id: string, effect: EffectElement, countsAsEffect: boolean) => void;
export declare const createElementID: () => string, setIDPrefix: (value: string) => void, getIDPrefix: () => string;
export declare const getShouldRoundValues: () => boolean, setShouldRoundValues: (value: boolean) => void, setQuality: (value: string | number) => void;
