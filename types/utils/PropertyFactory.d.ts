import type { GlobalData } from '@/types';
declare const PropertyFactory: {
    getProp: <T = unknown>(elem: T & {
        globalData?: GlobalData;
    }, dataFromProps?: any, type?: number, mult?: null | number, container?: any) => any;
};
export default PropertyFactory;
