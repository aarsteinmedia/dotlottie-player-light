declare class SVGEffects {
    static idPrefix: string;
    filters: any[];
    constructor(elem: any);
    getEffects(type: string): any[];
    renderFrame(_isFirstFrame?: boolean): void;
}
export default SVGEffects;
