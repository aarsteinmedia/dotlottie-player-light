import type { CompInterface } from '@/types';
export default class ProjectInterface {
    compInterface: CompInterface | null;
    compositions: CompInterface[];
    currentFrame: number;
    constructor(name?: string);
    registerComposition(comp: CompInterface): void;
}
