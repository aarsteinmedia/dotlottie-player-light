import type BaseElement from '@/elements/BaseElement';
import type RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
declare class RenderableElement {
    hidden: boolean;
    isInRange: boolean;
    isTransparent: boolean;
    renderableComponents: any[];
    addRenderableComponent(component: any): void;
    checkLayerLimits(num: number): void;
    checkTransparency(): void;
    getLayerSize(): {
        h: number;
        w: number;
    };
    initRenderable(): void;
    prepareRenderableFrame(num: number, _?: boolean): void;
    removeRenderableComponent(component: any): void;
    renderRenderable(): void;
    sourceRectAtTime(): {
        height: number;
        left: number;
        top: number;
        width: number;
    };
}
interface RenderableElement extends BaseElement, RenderableDOMElement {
}
export default RenderableElement;
