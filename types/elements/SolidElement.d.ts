import type { GlobalData } from '@/types';
export default function ISolidElement(this: {
    initElement: (data: any, globalData: GlobalData, comp: any) => void;
}, data: any, globalData: GlobalData, comp: any): void;
