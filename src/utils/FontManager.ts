import type { Characacter, FontList } from '@/types'

import { RendererType } from '@/enums'
import { createNS, createTag, isServer } from '@/utils'

export default class FontManager {
  private static readonly A_TAG_CODE_POINT = 917601
  private static readonly BLACK_FLAG_CODE_POINT = 127988
  private static readonly CANCEL_TAG_CODE_POINT = 917631
  private static readonly combinedCharacters: number[] = [
    // Hindi characters
    2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369,
    2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381,
    2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403,
  ]
  private static readonly emptyChar: Characacter = {
    // @ts-expect-error: incomplete Layer type
    data: {
      shapes: [],
    },
    shapes: [],
    size: 0,
    w: 0,
  }
  private static readonly maxWaitingTime = 5000
  private static readonly REGIONAL_CHARACTER_A_CODE_POINT = 127462
  private static readonly REGIONAL_CHARACTER_Z_CODE_POINT = 127487
  private static readonly surrogateModifiers = [
    'd83cdffb',
    'd83cdffc',
    'd83cdffd',
    'd83cdffe',
    'd83cdfff',
  ]
  private static readonly VARIATION_SELECTOR_16_CODE_POINT = 65039
  private static readonly Z_TAG_CODE_POINT = 917626
  private static readonly ZERO_WIDTH_JOINER_CODE_POINT = 8205

  public chars: Characacter[] | null = null
  public fonts: FontList[] = []
  public isLoaded = false
  public typekitLoaded = 0
  private _warned = false
  private checkLoadedFontsBinded: () => void
  private initTime = Date.now()
  private setIsLoadedBinded: () => void

  constructor() {
    this.setIsLoadedBinded = this.setIsLoaded.bind(this)
    this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this)
  }

  public static isCombinedCharacter(char: number): boolean {
    return FontManager.combinedCharacters.indexOf(char) !== -1
  }

  public static isFlagEmoji(string: string): boolean {
    return (
      FontManager.isRegionalCode(string.substring(0, 2)) &&
      FontManager.isRegionalCode(string.substring(2, 2))
    )
  }

  public static isModifier(
    firstCharCode: number,
    secondCharCode: number
  ): boolean {
    const sum = firstCharCode.toString(16) + secondCharCode.toString(16)
    return FontManager.surrogateModifiers.indexOf(sum) !== -1
  }

  public static isRegionalCode(string: string): boolean {
    const codePoint = FontManager.getCodePoint(string)
    return (
      codePoint >= FontManager.REGIONAL_CHARACTER_A_CODE_POINT &&
      codePoint <= FontManager.REGIONAL_CHARACTER_Z_CODE_POINT
    )
  }

  public static isRegionalFlag(text: string, indexFromProps: number): boolean {
    let index = indexFromProps
    let codePoint = FontManager.getCodePoint(text.substring(index, 2))
    if (codePoint !== FontManager.BLACK_FLAG_CODE_POINT) {
      return false
    }
    let count = 0
    index += 2
    while (count < 5) {
      codePoint = FontManager.getCodePoint(text.substring(index, 2))
      if (
        codePoint < FontManager.A_TAG_CODE_POINT ||
        codePoint > FontManager.Z_TAG_CODE_POINT
      ) {
        return false
      }
      count += 1
      index += 2
    }
    return (
      FontManager.getCodePoint(text.substr(index, 2)) ===
      FontManager.CANCEL_TAG_CODE_POINT
    )
  }

  public static isVariationSelector(charCode: number): boolean {
    return charCode === FontManager.VARIATION_SELECTOR_16_CODE_POINT
  }

  public static isZeroWidthJoiner(charCode: number): boolean {
    return charCode === FontManager.ZERO_WIDTH_JOINER_CODE_POINT
  }

  private static getCodePoint(string: string): number {
    let codePoint = 0
    const first = string.charCodeAt(0)
    if (first >= 0xd800 && first <= 0xdbff) {
      const second = string.charCodeAt(1)
      if (second >= 0xdc00 && second <= 0xdfff) {
        codePoint = (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000
      }
    }
    return codePoint
  }

  private static setUpNode(
    font: string,
    family: string
  ): { node: HTMLElement; parent: HTMLElement; w: number } | undefined {
    if (isServer()) {
      return
    }
    const parentNode = createTag('span')
    parentNode.setAttribute('aria-hidden', 'true')
    parentNode.style.fontFamily = family
    const node = createTag('span')
    node.innerText = 'giItT1WQy@!-/#'
    parentNode.style.position = 'absolute'
    parentNode.style.left = '-10000px'
    parentNode.style.top = '-10000px'
    parentNode.style.fontSize = '300px'
    parentNode.style.fontVariant = 'normal'
    parentNode.style.fontStyle = 'normal'
    parentNode.style.fontWeight = 'normal'
    parentNode.style.letterSpacing = '0'
    parentNode.appendChild(node)
    document.body.appendChild(parentNode)

    const width = node.offsetWidth
    node.style.fontFamily = `${FontManager.trimFontOptions(font)}, ${family}`
    return { node, parent: parentNode, w: width }
  }

  private static trimFontOptions(font: string): string {
    const familyArray = font.split(',')
    const len = familyArray.length
    const enabledFamilies = []
    for (let i = 0; i < len; i++) {
      if (familyArray[i] !== 'sans-serif' && familyArray[i] !== 'monospace') {
        enabledFamilies.push(familyArray[i])
      }
    }
    return enabledFamilies.join(',')
  }

  public addChars(chars?: Characacter[]): void {
    if (!chars) {
      return
    }
    if (!this.chars) {
      this.chars = []
    }
    const len = chars.length
    let j
    let jLen = this.chars.length
    let found
    for (let i = 0; i < len; i++) {
      j = 0
      found = false
      while (j < jLen) {
        if (
          this.chars[j].style === chars[i].style &&
          this.chars[j].fFamily === chars[i].fFamily &&
          this.chars[j].ch === chars[i].ch
        ) {
          found = true
        }
        j++
      }
      if (!found) {
        this.chars.push(chars[i])
        jLen += 1
      }
    }
  }

  public addFonts(fontData: { list: FontList[] }, defs?: SVGDefsElement): void {
    if (!fontData) {
      this.isLoaded = true
      return
    }
    if (this.chars) {
      this.isLoaded = true
      this.fonts = fontData.list
      return
    }
    if (!isServer() && !document.body) {
      this.isLoaded = true
      const { length } = fontData.list
      for (let i = 0; i < length; i++) {
        fontData.list[i].helper = this.createHelper(fontData.list[i])
        fontData.list[i].cache = {}
      }
      this.fonts = fontData.list
      return
    }

    let _pendingFonts = fontData.list.length
    for (let i = 0; i < _pendingFonts; i++) {
      let shouldLoadFont = true
      let loadedSelector
      fontData.list[i].loaded = false
      fontData.list[i].monoCase = FontManager.setUpNode(
        fontData.list[i].fFamily,
        'monospace'
      )
      fontData.list[i].sansCase = FontManager.setUpNode(
        fontData.list[i].fFamily,
        'sans-serif'
      )
      if (!fontData.list[i].fPath) {
        fontData.list[i].loaded = true
        _pendingFonts -= 1
      } else if (
        !isServer() &&
        (fontData.list[i].fOrigin === 'p' || fontData.list[i].origin === 3)
      ) {
        loadedSelector = document.querySelectorAll(
          `style[f-forigin="p"][f-family="${fontData.list[i].fFamily}"], style[f-origin="3"][f-family="${fontData.list[i].fFamily}"]`
        )

        if (loadedSelector.length > 0) {
          shouldLoadFont = false
        }

        if (shouldLoadFont) {
          const s: HTMLStyleElement = createTag('style')
          s.setAttribute('f-forigin', fontData.list[i].fOrigin)
          s.setAttribute('f-origin', `${fontData.list[i].origin}`)
          s.setAttribute('f-family', fontData.list[i].fFamily)
          s.innerText = `@font-face {font-family: ${fontData.list[i].fFamily}; font-style: normal; src: url('${fontData.list[i].fPath}');}`
          defs?.appendChild(s)
        }
      } else if (
        !isServer() &&
        (fontData.list[i].fOrigin === 'g' || fontData.list[i].origin === 1)
      ) {
        loadedSelector = document.querySelectorAll<HTMLLinkElement>(
          'link[f-forigin="g"], link[f-origin="1"]'
        )

        const { length } = loadedSelector
        for (let i = 0; i < length; i++) {
          if (loadedSelector[i].href.indexOf(fontData.list[i].fPath) !== -1) {
            shouldLoadFont = false
          }
        }

        if (shouldLoadFont && !isServer()) {
          const link = createTag<HTMLLinkElement>('link')
          link.setAttribute('f-forigin', fontData.list[i].fOrigin)
          link.setAttribute('f-origin', `${fontData.list[i].origin}`)
          link.type = 'text/css'
          link.rel = 'stylesheet'
          link.href = fontData.list[i].fPath
          document.body.appendChild(link)
        }
      } else if (
        !isServer() &&
        (fontData.list[i].fOrigin === 't' || fontData.list[i].origin === 2)
      ) {
        loadedSelector = document.querySelectorAll(
          'script[f-forigin="t"], script[f-origin="2"]'
        ) as NodeListOf<HTMLScriptElement>

        const { length } = loadedSelector
        for (let i = 0; i < length; i++) {
          if (fontData.list[i].fPath === loadedSelector[i].src) {
            shouldLoadFont = false
          }
        }

        if (shouldLoadFont) {
          const sc = createTag('link')
          sc.setAttribute('f-forigin', fontData.list[i].fOrigin)
          sc.setAttribute('f-origin', `${fontData.list[i].origin}`)
          sc.setAttribute('rel', 'stylesheet')
          sc.setAttribute('href', fontData.list[i].fPath)
          defs?.appendChild(sc)
        }
      }
      fontData.list[i].helper = this.createHelper(fontData.list[i], defs)
      fontData.list[i].cache = {}
      this.fonts.push(fontData.list[i])
    }
    if (_pendingFonts === 0) {
      this.isLoaded = true
    } else {
      setTimeout(this.checkLoadedFonts.bind(this), 100)
    }
  }

  public getCharData(
    char: Characacter | string,
    style: string,
    font: string
  ): Characacter {
    let i = 0
    const len = this.chars?.length || 0
    while (i < len) {
      if (
        this.chars?.[i].ch === char &&
        this.chars?.[i].style === style &&
        this.chars?.[i].fFamily === font
      ) {
        return this.chars[i]
      }
      i++
    }
    if (
      ((typeof char === 'string' && char.charCodeAt(0) !== 13) || !char) &&
      console &&
      console.warn &&
      !this._warned
    ) {
      this._warned = true
      console.warn(
        'Missing character from exported characters list: ',
        char,
        style,
        font
      )
    }
    return FontManager.emptyChar
  }

  public getFontByName(name?: string): FontList {
    let i = 0
    const len = this.fonts.length
    while (i < len) {
      if (this.fonts[i].fName === name) {
        return this.fonts[i]
      }
      i++
    }
    return this.fonts[0]
  }

  public measureText(char: string, fontName?: string, size?: number): number {
    const fontData = this.getFontByName(fontName)
    const index = char
    if (!fontData.cache?.[index]) {
      const tHelper = fontData.helper
      if (char === ' ') {
        const doubleSize = Number(tHelper?.measureText(`|${char}|`))
        const singleSize = Number(tHelper?.measureText('||'))
        fontData.cache![index] = (doubleSize - singleSize) / 100
      } else {
        fontData.cache![index] = Number(tHelper?.measureText(char)) / 100
      }
    }
    return Number(fontData.cache?.[index]) * Number(size)
  }

  private checkLoadedFonts(): void {
    let node: HTMLElement | undefined
    let w: number
    let loadedCount = this.fonts.length
    for (let i = 0; i < loadedCount; i++) {
      if (this.fonts[i].loaded) {
        loadedCount -= 1
        continue
      }

      if (this.fonts[i].fOrigin === 'n' || this.fonts[i].origin === 0) {
        this.fonts[i].loaded = true
        continue
      }
      node = this.fonts[i].monoCase?.node
      w = this.fonts[i].monoCase?.w || 0
      if (node?.offsetWidth === w) {
        node = this.fonts[i].sansCase?.node
        w = this.fonts[i].sansCase?.w || 0
        if (node?.offsetWidth !== w) {
          loadedCount -= 1
          this.fonts[i].loaded = true
        }
      } else {
        loadedCount -= 1
        this.fonts[i].loaded = true
      }
      if (!this.fonts[i].loaded) {
        continue
      }
      this.fonts[i].sansCase?.parent.parentNode?.removeChild(
        this.fonts[i].sansCase!.parent
      )
      this.fonts[i].monoCase?.parent.parentNode?.removeChild(
        this.fonts[i].monoCase!.parent
      )
    }

    if (
      loadedCount !== 0 &&
      Date.now() - this.initTime < FontManager.maxWaitingTime
    ) {
      setTimeout(this.checkLoadedFontsBinded, 20)
      return
    }

    setTimeout(this.setIsLoadedBinded, 10)
  }

  private createHelper(
    fontData: FontList,
    def?: SVGDefsElement
  ): { measureText: (text: string) => number } | undefined {
    if (isServer()) {
      return
    }
    const engine = document.body && def ? RendererType.SVG : RendererType.Canvas
    let helper: any
    const fontProps = getFontProperties(fontData)
    if (engine === RendererType.SVG) {
      const tHelper = createNS('text')
      tHelper.style.fontSize = '100px'
      tHelper.setAttribute('font-family', fontData.fFamily)
      tHelper.setAttribute('font-style', fontProps.style)
      tHelper.setAttribute('font-weight', fontProps.weight)
      tHelper.textContent = '1'
      if (fontData.fClass) {
        tHelper.style.fontFamily = 'inherit'
        tHelper.setAttribute('class', fontData.fClass)
      } else {
        tHelper.style.fontFamily = fontData.fFamily
      }
      def?.appendChild(tHelper)
      helper = tHelper
    } else {
      const tCanvasHelper = new OffscreenCanvas(500, 500).getContext('2d')
      if (tCanvasHelper) {
        tCanvasHelper.font = `${fontProps.style} ${fontProps.weight} 100px ${fontData.fFamily}`
        helper = tCanvasHelper
      }
    }
    return {
      measureText: (text: string) => {
        if (engine === RendererType.SVG) {
          helper.textContent = text
          return helper.getComputedTextLength()
        }
        return helper.measureText(text).width
      },
    }
  }

  private setIsLoaded(): void {
    this.isLoaded = true
  }
}

/**
 *
 */
export function getFontProperties(fontData: FontList) {
  const styles = fontData.fStyle ? fontData.fStyle.split(' ') : []

  let fWeight = 'normal'
  let fStyle = 'normal'
  const { length } = styles
  for (let i = 0; i < length; i++) {
    switch (styles[i].toLowerCase()) {
      case 'italic':
        fStyle = 'italic'
        break
      case 'bold':
        fWeight = '700'
        break
      case 'black':
        fWeight = '900'
        break
      case 'medium':
        fWeight = '500'
        break
      case 'regular':
      case 'normal':
        fWeight = '400'
        break
      case 'light':
      case 'thin':
        fWeight = '200'
        break
      default:
        break
    }
  }

  return {
    style: fStyle,
    weight: fontData.fWeight || fWeight,
  }
}
