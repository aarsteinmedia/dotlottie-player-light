import type { AnimationData } from '@/types';
import ISolidElement from '@/elements/SolidElement';
export default class SVGRendererBase {
    appendElementInPos(element: any, pos: number): void;
    buildItem(pos: number): void;
    checkPendingElements(): void;
    configAnimation(animData: AnimationData): void;
    createImage(data: any): any;
    createNull(data: any): any;
    createShape(data: any): any;
    createSolid(data: any): ISolidElement;
    createText(data: any): any;
    destroy(): void;
    findIndexByInd(ind: number): number;
    hide(): void;
    renderFrame(numFromProps: number): void;
    show(): void;
    updateContainerSize(_width?: number, _height?: number): void;
}
