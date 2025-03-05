import type { Characacter, FontHandler, FontList } from '@/types'

import { RendererType } from '@/enums'
import { createNS, createTag, isServer } from '@/utils'

const FontManager = (() => {
  const maxWaitingTime = 5000
  const emptyChar: Characacter = {
    // @ts-expect-error: incomplete Layer type
    data: {
      shapes: [],
    },
    shapes: [],
    size: 0,
    w: 0,
  }
  let combinedCharacters: number[] = []
  // Hindi characters
  combinedCharacters = combinedCharacters.concat([
    2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369,
    2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381,
    2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403,
  ])

  const BLACK_FLAG_CODE_POINT = 127988
  const CANCEL_TAG_CODE_POINT = 917631
  const A_TAG_CODE_POINT = 917601
  const Z_TAG_CODE_POINT = 917626
  const VARIATION_SELECTOR_16_CODE_POINT = 65039
  const ZERO_WIDTH_JOINER_CODE_POINT = 8205
  const REGIONAL_CHARACTER_A_CODE_POINT = 127462
  const REGIONAL_CHARACTER_Z_CODE_POINT = 127487

  const surrogateModifiers = [
    'd83cdffb',
    'd83cdffc',
    'd83cdffd',
    'd83cdffe',
    'd83cdfff',
  ]

  /**
   *
   */
  function trimFontOptions(font: string) {
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

  /**
   *
   */
  function setUpNode(font: string, family: string) {
    if (isServer()) {
      return
    }
    const parentNode = createTag('span')
    // Node is invisible to screen readers.
    parentNode.setAttribute('aria-hidden', 'true')
    parentNode.style.fontFamily = family
    const node = createTag('span')
    // Characters that vary significantly among different fonts
    node.innerText = 'giItT1WQy@!-/#'
    // Visible - so we can measure it - but not on the screen
    parentNode.style.position = 'absolute'
    parentNode.style.left = '-10000px'
    parentNode.style.top = '-10000px'
    // Large font size makes even subtle changes obvious
    parentNode.style.fontSize = '300px'
    // Reset any font properties
    parentNode.style.fontVariant = 'normal'
    parentNode.style.fontStyle = 'normal'
    parentNode.style.fontWeight = 'normal'
    parentNode.style.letterSpacing = '0'
    parentNode.appendChild(node)
    document.body.appendChild(parentNode)

    // Remember width with no applied web font
    const width = node.offsetWidth
    node.style.fontFamily = `${trimFontOptions(font)}, ${family}`
    return { node: node, parent: parentNode, w: width }
  }

  /**
   *
   */
  function checkLoadedFonts(this: FontHandler) {
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

    if (loadedCount !== 0 && Date.now() - this.initTime < maxWaitingTime) {
      setTimeout(this.checkLoadedFontsBinded, 20)
      return
    }

    setTimeout(this.setIsLoadedBinded, 10)
  }

  /**
   *
   */
  function createHelper(fontData: FontList, def?: SVGDefsElement) {
    if (isServer()) {
      return
    }
    const engine = document.body && def ? RendererType.SVG : RendererType.Canvas
    let helper: any
    const fontProps = getFontProperties(fontData)
    if (engine === RendererType.SVG) {
      const tHelper = createNS('text')
      tHelper.style.fontSize = '100px'
      // tHelper.style.fontFamily = fontData.fFamily;
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
    /**
     *
     */
    function measure(text: string) {
      if (engine === RendererType.SVG) {
        helper.textContent = text
        return helper.getComputedTextLength()
      }
      return helper.measureText(text).width
    }
    return {
      measureText: measure,
    }
  }

  /**
   *
   */
  function addFonts(
    this: FontHandler,
    fontData: { list: FontList[] },
    defs?: SVGDefsElement
  ) {
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
        fontData.list[i].helper = createHelper(fontData.list[i])
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
      fontData.list[i].monoCase = setUpNode(
        fontData.list[i].fFamily,
        'monospace'
      )
      fontData.list[i].sansCase = setUpNode(
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
          `style[f-forigin="p"][f-family="${
            fontData.list[i].fFamily
          }"], style[f-origin="3"][f-family="${fontData.list[i].fFamily}"]`
        )

        if (loadedSelector.length > 0) {
          shouldLoadFont = false
        }

        if (shouldLoadFont) {
          const s: HTMLStyleElement = createTag('style')
          s.setAttribute('f-forigin', fontData.list[i].fOrigin)
          s.setAttribute('f-origin', `${fontData.list[i].origin}`)
          s.setAttribute('f-family', fontData.list[i].fFamily)
          // s.type = 'text/css'
          s.innerText = `@font-face {font-family: ${
            fontData.list[i].fFamily
          }; font-style: normal; src: url('${fontData.list[i].fPath}');}`
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
            // Font is already loaded
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
            // Font is already loaded
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
      fontData.list[i].helper = createHelper(fontData.list[i], defs)
      fontData.list[i].cache = {}
      this.fonts.push(fontData.list[i])
    }
    if (_pendingFonts === 0) {
      this.isLoaded = true
    } else {
      // On some cases even if the font is loaded, it won't load correctly when measuring text on canvas.
      // Adding this timeout seems to fix it
      setTimeout(this.checkLoadedFonts.bind(this), 100)
    }
  }

  /**
   *
   */
  function addChars(this: FontHandler, chars?: Characacter[]) {
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

  /**
   *
   */
  function getCharData(
    this: FontHandler,
    char: Characacter | string,
    style: string,
    font: string
  ) {
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
    return emptyChar
  }

  /**
   *
   */
  function measureText(
    this: FontHandler,
    char: string,
    fontName?: string,
    size?: number
  ) {
    const fontData = this.getFontByName(fontName)
    // Using the char instead of char.charCodeAt(0)
    // to avoid collisions between equal chars
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

  /**
   *
   */
  function getFontByName(this: FontHandler, name?: string) {
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

  /**
   *
   */
  function getCodePoint(string: string) {
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

  // Skin tone modifiers
  /**
   *
   */
  function isModifier(firstCharCode: number, secondCharCode: number) {
    const sum = firstCharCode.toString(16) + secondCharCode.toString(16)
    return surrogateModifiers.indexOf(sum) !== -1
  }

  /**
   *
   */
  function isZeroWidthJoiner(charCode: number) {
    return charCode === ZERO_WIDTH_JOINER_CODE_POINT
  }

  // This codepoint may change the appearance of the preceding character.
  // If that is a symbol, dingbat or emoji, U+FE0F forces it to be rendered
  // as a colorful image as compared to a monochrome text variant.
  /**
   *
   */
  function isVariationSelector(charCode: number) {
    return charCode === VARIATION_SELECTOR_16_CODE_POINT
  }

  // The regional indicator symbols are a set of 26 alphabetic Unicode
  // / characters (A–Z) intended to be used to encode ISO 3166-1 alpha-2
  // two-letter country codes in a way that allows optional special treatment.
  /**
   *
   */
  function isRegionalCode(string: string) {
    const codePoint = getCodePoint(string)
    if (
      codePoint >= REGIONAL_CHARACTER_A_CODE_POINT &&
      codePoint <= REGIONAL_CHARACTER_Z_CODE_POINT
    ) {
      return true
    }
    return false
  }

  // Some Emoji implementations represent combinations of
  // two “regional indicator” letters as a single flag symbol.
  /**
   *
   */
  function isFlagEmoji(string: string) {
    return (
      isRegionalCode(string.substring(0, 2)) &&
      isRegionalCode(string.substring(2, 2))
    )
  }

  /**
   *
   */
  function isCombinedCharacter(char: number) {
    return combinedCharacters.indexOf(char) !== -1
  }

  // Regional flags start with a BLACK_FLAG_CODE_POINT
  // folowed by 5 chars in the TAG range
  // and end with a CANCEL_TAG_CODE_POINT
  /**
   *
   */
  function isRegionalFlag(text: string, indexFromProps: number) {
    let index = indexFromProps
    let codePoint = getCodePoint(text.substring(index, 2))
    if (codePoint !== BLACK_FLAG_CODE_POINT) {
      return false
    }
    let count = 0
    index += 2
    while (count < 5) {
      codePoint = getCodePoint(text.substring(index, 2))
      if (codePoint < A_TAG_CODE_POINT || codePoint > Z_TAG_CODE_POINT) {
        return false
      }
      count += 1
      index += 2
    }
    return getCodePoint(text.substr(index, 2)) === CANCEL_TAG_CODE_POINT
  }

  /**
   *
   */
  function setIsLoaded(this: { isLoaded: boolean }) {
    this.isLoaded = true
  }

  // eslint-disable-next-line func-style
  const Font = function (this: FontHandler) {
    this.fonts = []
    this.chars = null
    this.typekitLoaded = 0
    this.isLoaded = false
    this._warned = false
    this.initTime = Date.now()
    this.setIsLoadedBinded = this.setIsLoaded.bind(this)
    this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this)
  }
  Font.isModifier = isModifier
  Font.isZeroWidthJoiner = isZeroWidthJoiner
  Font.isFlagEmoji = isFlagEmoji
  Font.isRegionalCode = isRegionalCode
  Font.isCombinedCharacter = isCombinedCharacter
  Font.isRegionalFlag = isRegionalFlag
  Font.isVariationSelector = isVariationSelector
  Font.BLACK_FLAG_CODE_POINT = BLACK_FLAG_CODE_POINT

  const fontPrototype = {
    addChars,
    addFonts,
    checkLoadedFonts,
    getCharData,
    getFontByName,
    measureText,
    setIsLoaded,
  }

  Font.prototype = fontPrototype

  return Font
})()

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

export default FontManager
