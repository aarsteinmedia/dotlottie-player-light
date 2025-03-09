import type { AnimationData } from '@/types';
export default class SlotManager {
    animationData: AnimationData;
    constructor(animationData: AnimationData);
    getProp(data: any): any;
}
