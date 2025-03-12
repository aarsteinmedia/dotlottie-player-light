import type DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import HierarchyElement from '../../elements/helpers/HierarchyElement';
export default abstract class FrameElement extends HierarchyElement {
    _mdf?: boolean;
    dynamicProperties?: DynamicPropertyContainer[];
    addDynamicProperty(prop: DynamicPropertyContainer): void;
    initFrame(): void;
    prepareProperties(_: number, isVisible?: boolean): void;
}
