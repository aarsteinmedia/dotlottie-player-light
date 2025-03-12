import type { Characacter, DocumentData, FontList } from '@/types';
export default class FontManager {
    private static readonly A_TAG_CODE_POINT;
    private static readonly BLACK_FLAG_CODE_POINT;
    private static readonly CANCEL_TAG_CODE_POINT;
    private static readonly combinedCharacters;
    private static readonly emptyChar;
    private static readonly maxWaitingTime;
    private static readonly REGIONAL_CHARACTER_A_CODE_POINT;
    private static readonly REGIONAL_CHARACTER_Z_CODE_POINT;
    private static readonly surrogateModifiers;
    private static readonly VARIATION_SELECTOR_16_CODE_POINT;
    private static readonly Z_TAG_CODE_POINT;
    private static readonly ZERO_WIDTH_JOINER_CODE_POINT;
    chars: Characacter[] | null;
    fonts: DocumentData[];
    isLoaded: boolean;
    typekitLoaded: number;
    private _warned;
    private checkLoadedFontsBinded;
    private initTime;
    private setIsLoadedBinded;
    constructor();
    static isCombinedCharacter(char: number): boolean;
    static isFlagEmoji(string: string): boolean;
    static isModifier(firstCharCode: number, secondCharCode: number): boolean;
    static isRegionalCode(string: string): boolean;
    static isRegionalFlag(text: string, indexFromProps: number): boolean;
    static isVariationSelector(charCode: number): boolean;
    static isZeroWidthJoiner(charCode: number): boolean;
    private static getCodePoint;
    private static setUpNode;
    private static trimFontOptions;
    addChars(chars?: Characacter[]): void;
    addFonts(fontData?: {
        list: DocumentData[];
    }, defs?: SVGDefsElement): void;
    getCharData(char: Characacter | string, style?: string, font?: string): Characacter;
    getFontByName(name?: string): DocumentData;
    measureText(char: string, fontName?: string, size?: number): number;
    private checkLoadedFonts;
    private createHelper;
    private setIsLoaded;
}
export declare function getFontProperties(fontData: FontList): {
    style: string;
    weight: string;
};
