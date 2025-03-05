import { Characacter, FontHandler, FontList } from '@/types';
declare const FontManager: {
    (this: FontHandler): void;
    isModifier: (firstCharCode: number, secondCharCode: number) => boolean;
    isZeroWidthJoiner: (charCode: number) => charCode is 8205;
    isFlagEmoji: (string: string) => boolean;
    isRegionalCode: (string: string) => boolean;
    isCombinedCharacter: (char: number) => boolean;
    isRegionalFlag: (text: string, indexFromProps: number) => boolean;
    isVariationSelector: (charCode: number) => charCode is 65039;
    BLACK_FLAG_CODE_POINT: number;
    prototype: {
        addChars: (this: FontHandler, chars?: Characacter[]) => void;
        addFonts: (this: FontHandler, fontData: {
            list: FontList[];
        }, defs?: SVGDefsElement) => void;
        checkLoadedFonts: (this: FontHandler) => void;
        getCharData: (this: FontHandler, char: Characacter | string, style: string, font: string) => Characacter;
        getFontByName: (this: FontHandler, name?: string) => FontList;
        measureText: (this: FontHandler, char: string, fontName?: string, size?: number) => number;
        setIsLoaded: (this: {
            isLoaded: boolean;
        }) => void;
    };
};
export declare function getFontProperties(fontData: FontList): {
    style: string;
    weight: string;
};
export default FontManager;
