import type { CompInterface } from '../../types';
export declare const compositions: CompInterface[], currentFrame = 0;
export declare function registerComposition(comp: CompInterface): void;
export default class ProjectInterface {
    content?: ProjectInterface;
    createEffectsInterface?: (val: any, _interface?: ProjectInterface) => any;
    registerEffectsInterface?: (val: any, _interface?: ProjectInterface) => any;
    registerMaskInterface?: (val: any, _interface?: ProjectInterface) => any;
    shapeInterface?: ProjectInterface;
    text?: ProjectInterface;
    textInterface?: ProjectInterface;
    constructor(name?: string);
}
