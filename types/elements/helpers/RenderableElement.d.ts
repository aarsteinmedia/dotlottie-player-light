import type { ElementInterfaceIntersect, SourceRect } from '@/types';
import FrameElement from '@/elements/helpers/FrameElement';
export default class RenderableElement extends FrameElement {
    hidden?: boolean;
    isInRange?: boolean;
    isTransparent?: boolean;
    private renderableComponents;
    addRenderableComponent(component: ElementInterfaceIntersect): void;
    checkLayerLimits(num: number): void;
    checkTransparency(): void;
    getLayerSize(): {
        h: number;
        w: number;
    };
    hide(): void;
    initRenderable(): void;
    prepareRenderableFrame(num: number, _?: boolean): void;
    removeRenderableComponent(component: ElementInterfaceIntersect): void;
    renderRenderable(): void;
    show(): void;
    sourceRectAtTime(): SourceRect | null;
}
