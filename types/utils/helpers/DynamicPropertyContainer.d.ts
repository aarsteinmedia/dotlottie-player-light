import type { CompInterface, ItemData } from '@/types';
export default class DynamicPropertyContainer {
    _isAnimated: boolean;
    _mdf: boolean;
    container: CompInterface | null;
    dynamicProperties: ItemData[];
    constructor();
    addDynamicProperty(prop: ItemData): void;
    initDynamicPropertyContainer(container: CompInterface): void;
    iterateDynamicProperties(): void;
}
