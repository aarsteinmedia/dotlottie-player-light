import BaseElement from '@/elements/BaseElement';
declare class HierarchyElement {
    _isParent: boolean;
    hierarchy: unknown[];
    checkParenting(): void;
    initHierarchy(): void;
    setAsParent(): void;
    setHierarchy(hierarchy: unknown[]): void;
}
interface HierarchyElement extends BaseElement {
}
export default HierarchyElement;
