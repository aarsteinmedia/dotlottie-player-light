import type { ElementInterfaceIntersect } from '@/types';
import TransformElement from '@/elements/helpers/TransformElement';
export default abstract class HierarchyElement extends TransformElement {
    _isParent?: boolean;
    checkParenting(): void;
    initHierarchy(): void;
    setAsParent(): void;
    setHierarchy(hierarchy: ElementInterfaceIntersect[]): void;
}
