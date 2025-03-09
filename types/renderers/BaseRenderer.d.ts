import type BaseElement from '@/elements/BaseElement';
import type { AnimationData, LottieLayer } from '@/types';
import type ProjectInterface from '@/utils/helpers/ProjectInterface';
import AudioElement from '@/elements/AudioElement';
import FootageElement from '@/elements/FootageElement';
declare class BaseRenderer {
    completeLayers?: boolean;
    addPendingElement(element: unknown): void;
    buildAllItems(): void;
    buildElementParenting(element: any, parentName?: number, hierarchy?: unknown[]): void;
    checkLayers(num: number): void;
    createAudio(data: LottieLayer): AudioElement;
    createCamera(_data: LottieLayer): void;
    createFootage(data: any): FootageElement;
    createItem(layer: LottieLayer): any;
    getElementById(ind: number): any;
    getElementByPath(path: unknown[]): any;
    includeLayers(newLayers: LottieLayer[]): void;
    initItems(): void;
    searchExtraCompositions(assets: LottieLayer[]): void;
    setProjectInterface(pInterface: typeof ProjectInterface): void;
    setupGlobalData(animData: AnimationData, fontsContainer: SVGDefsElement): void;
}
interface BaseRenderer extends BaseElement {
}
export default BaseRenderer;
