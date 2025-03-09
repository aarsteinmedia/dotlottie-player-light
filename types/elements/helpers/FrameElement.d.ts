import type BaseElement from '@/elements/BaseElement';
import type HierarchyElement from '@/elements/helpers/HierarchyElement';
declare class FrameElement {
    _isFirstFrame: boolean;
    _mdf?: boolean;
    dynamicProperties: any[];
    addDynamicProperty(prop: unknown): void;
    initFrame(): void;
    prepareProperties(_: number, isVisible: boolean): void;
}
interface FrameElement extends BaseElement, HierarchyElement {
}
export default FrameElement;
