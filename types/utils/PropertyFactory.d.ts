import type { CompInterface, VectorProperty } from '@/types';
import { KeyframedMultidimensionalProperty, KeyframedValueProperty, MultiDimensionalProperty, NoProperty, ValueProperty } from '@/utils/Properties';
export default class PropertyFactory {
    static getProp: (elem: CompInterface, dataFromProps?: VectorProperty<number | number[]>, type?: number, mult?: null | number, container?: any) => ValueProperty | KeyframedValueProperty | KeyframedMultidimensionalProperty | NoProperty | MultiDimensionalProperty<number[]>;
}
