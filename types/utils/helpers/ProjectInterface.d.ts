import type { CompInterface } from '../../types';
export default class ProjectInterface {
    static compositions: CompInterface[];
    static currentFrame: number;
    content?: ProjectInterface;
    createEffectsInterface?: (val: any, _interface?: ProjectInterface) => any;
    registerEffectsInterface?: (val: any, _interface?: ProjectInterface) => any;
    registerMaskInterface?: (val: any, _interface?: ProjectInterface) => any;
    shapeInterface?: ProjectInterface;
    text?: ProjectInterface;
    textInterface?: ProjectInterface;
    constructor(name?: string);
    static registerComposition(comp: CompInterface): void;
}
