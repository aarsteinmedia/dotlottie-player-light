import type { ElementInterfaceIntersect } from '../types';
import { KeyframedMultidimensionalProperty, KeyframedValueProperty, MultiDimensionalProperty, NoProperty, ValueProperty } from '../utils/Properties';
export default function PropertyFactory(elem: ElementInterfaceIntersect, dataFromProps?: any, type?: number, mult?: null | number, container?: any): ValueProperty | KeyframedValueProperty | NoProperty | MultiDimensionalProperty<number[]> | KeyframedMultidimensionalProperty<import("../types").Vector2>;
