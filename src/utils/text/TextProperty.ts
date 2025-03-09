import type {
  DocumentData,
  ElementInterface,
  Letter,
  LetterProperties,
  TextData,
  Vector2,
} from '@/types'

import FontManager, { getFontProperties } from '@/utils/FontManager'
import { initialDefaultFrame } from '@/utils/getterSetter'

export default class TextProperty {
  _frameId: number
  _isFirstFrame: boolean
  _mdf: boolean
  canResize: boolean
  comp: ElementInterface['comp']
  currentData: DocumentData
  data: TextData
  defaultBoxWidth: Vector2 = [0, 0]
  effectsSequence: any[]
  elem: ElementInterface
  frameId?: number
  keysIndex: number
  kf: boolean
  lock?: boolean
  minimumFontSize: number
  pv: DocumentData | string
  v: DocumentData | string

  constructor(elem: ElementInterface, data: TextData) {
    this._frameId = initialDefaultFrame
    this.pv = ''
    this.v = ''
    this.kf = false
    this._isFirstFrame = true
    this._mdf = false
    if (data.d && data.d.sid) {
      data.d = elem.globalData.slotManager?.getProp(data.d)
    }
    this.data = data
    this.elem = elem
    this.comp = this.elem.comp
    this.keysIndex = 0
    this.canResize = false
    this.minimumFontSize = 1
    this.effectsSequence = []
    this.currentData = {
      __complete: false,
      ascent: 0,
      boxWidth: this.defaultBoxWidth,
      f: '',
      fc: '',
      fillColorAnim: false,
      finalLineHeight: 0,
      finalSize: 0,
      finalText: [],
      fStyle: '',
      fWeight: '',
      // j: '',
      justifyOffset: 0,
      l: [],
      lh: 0,
      lineWidths: [],
      ls: 0,
      of: '',
      ps: null,
      s: 0,
      sc: '',
      strokeColorAnim: false,
      strokeWidthAnim: false,
      sw: 0,
      // sz: 0,
      t: 0,
      tr: 0,
      yOffset: 0,
    } as any
    this.copyData(this.currentData, this.data.d?.k[0].s)

    // console.log(this.data)
    if (!this.searchProperty()) {
      this.completeTextData(this.currentData)
    }
  }

  addEffect(effectFunction: unknown) {
    this.effectsSequence.push(effectFunction)
    this.elem.addDynamicProperty(this)
  }

  buildFinalText(text: string) {
    const charactersArray = []
    let i = 0
    const len = text.length
    let charCode
    let secondCharCode
    let shouldCombine = false
    let shouldCombineNext = false
    let currentChars = ''
    while (i < len) {
      shouldCombine = shouldCombineNext
      shouldCombineNext = false
      charCode = text.charCodeAt(i)
      currentChars = text.charAt(i)
      if (FontManager.isCombinedCharacter(charCode)) {
        shouldCombine = true
        // It's a potential surrogate pair (this is the High surrogate)
      } else if (charCode >= 0xd800 && charCode <= 0xdbff) {
        if (FontManager.isRegionalFlag(text, i)) {
          currentChars = text.substring(i, 14)
        } else {
          secondCharCode = text.charCodeAt(i + 1)
          // It's a surrogate pair (this is the Low surrogate)
          if (secondCharCode >= 0xdc00 && secondCharCode <= 0xdfff) {
            // eslint-disable-next-line max-depth
            if (FontManager.isModifier(charCode, secondCharCode)) {
              currentChars = text.substring(i, 2)
              shouldCombine = true
            } else if (FontManager.isFlagEmoji(text.substring(i, 4))) {
              currentChars = text.substring(i, 4)
            } else {
              currentChars = text.substring(i, 2)
            }
          }
        }
      } else if (charCode > 0xdbff) {
        secondCharCode = text.charCodeAt(i + 1)
        if (FontManager.isVariationSelector(charCode)) {
          shouldCombine = true
        }
      } else if (FontManager.isZeroWidthJoiner(charCode)) {
        shouldCombine = true
        shouldCombineNext = true
      }
      if (shouldCombine) {
        charactersArray[charactersArray.length - 1] += currentChars
        shouldCombine = false
      } else {
        charactersArray.push(currentChars)
      }
      i += currentChars.length
    }
    return charactersArray
  }

  canResizeFont(_canResize: boolean) {
    this.canResize = _canResize
    this.recalculate(this.keysIndex)
    this.elem.addDynamicProperty(this)
  }

  completeTextData(documentData: DocumentData) {
    documentData.__complete = true
    const { fontManager } = this.elem.globalData
    if (!fontManager) {
      throw new Error('FontManager not loaded')
    }
    const data = this.data
    const letters: Letter[] = []
    let i
    let len: number
    let newLineFlag
    let index = 0
    let val
    const anchorGrouping = data.m?.g
    let currentSize = 0
    let currentPos = 0
    let currentLine = 0
    const lineWidths = []
    let lineWidth = 0
    let maxLineWidth = 0
    let j
    const fontData = fontManager?.getFontByName(documentData.f)
    let charData
    let cLength = 0

    const fontProps = getFontProperties(fontData)
    documentData.fWeight = fontProps.weight
    documentData.fStyle = fontProps.style
    documentData.finalSize = documentData.s
    documentData.finalText = this.buildFinalText(`${documentData.t}`)
    len = documentData.finalText?.length || 0
    documentData.finalLineHeight = documentData.lh
    let trackingOffset = (documentData.tr / 1000) * documentData.finalSize
    let charCode
    if (documentData.sz) {
      let flag = true
      const boxWidth = documentData.sz[0]
      const boxHeight = documentData.sz[1]
      let currentHeight
      let finalText
      while (flag) {
        finalText = this.buildFinalText(`${documentData.t}`)
        currentHeight = 0
        lineWidth = 0
        len = finalText.length
        trackingOffset = (documentData.tr / 1000) * documentData.finalSize
        let lastSpaceIndex = -1
        for (i = 0; i < len; i++) {
          charCode = finalText[i].charCodeAt(0)
          newLineFlag = false
          if (finalText[i] === ' ') {
            lastSpaceIndex = i
          } else if (charCode === 13 || charCode === 3) {
            lineWidth = 0
            newLineFlag = true
            currentHeight +=
              documentData.finalLineHeight || documentData.finalSize * 1.2
          }
          if (fontManager?.chars) {
            charData = fontManager.getCharData(
              finalText[i],
              fontData.fStyle,
              fontData.fFamily
            )
            cLength = newLineFlag
              ? 0
              : (charData.w * documentData.finalSize) / 100
          } else {
            // tCanvasHelper.font = documentData.s + 'px '+ fontData.fFamily;
            cLength =
              fontManager?.measureText(
                finalText[i],
                documentData.f,
                documentData.finalSize
              ) || 0
          }
          if (lineWidth + cLength > Number(boxWidth) && finalText[i] !== ' ') {
            if (lastSpaceIndex === -1) {
              len += 1
            } else {
              i = lastSpaceIndex
            }
            currentHeight +=
              documentData.finalLineHeight || documentData.finalSize * 1.2
            finalText.splice(i, lastSpaceIndex === i ? 1 : 0, '\r')
            // finalText = finalText.substr(0,i) + "\r" + finalText.substr(i === lastSpaceIndex ? i + 1 : i);
            lastSpaceIndex = -1
            lineWidth = 0
          } else {
            lineWidth += cLength
            lineWidth += trackingOffset
          }
        }
        currentHeight +=
          (Number(fontData.ascent) * documentData.finalSize) / 100
        if (
          this.canResize &&
          documentData.finalSize > this.minimumFontSize &&
          Number(boxHeight) < currentHeight
        ) {
          documentData.finalSize -= 1
          documentData.finalLineHeight =
            (documentData.finalSize * documentData.lh) / documentData.s
        } else {
          documentData.finalText = finalText
          len = documentData.finalText.length
          flag = false
        }
      }
    }
    lineWidth = -trackingOffset
    cLength = 0
    let uncollapsedSpaces = 0
    let currentChar
    for (i = 0; i < len; i++) {
      newLineFlag = false
      currentChar = documentData.finalText[i]
      charCode = currentChar.charCodeAt(0)
      if (charCode === 13 || charCode === 3) {
        uncollapsedSpaces = 0
        lineWidths.push(lineWidth)
        maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth
        lineWidth = -2 * trackingOffset
        val = ''
        newLineFlag = true
        currentLine += 1
      } else {
        val = currentChar
      }
      if (fontManager.chars) {
        charData = fontManager.getCharData(
          currentChar,
          fontData.fStyle,
          fontManager.getFontByName(documentData.f).fFamily
        )
        cLength = newLineFlag ? 0 : (charData.w * documentData.finalSize) / 100
      } else {
        // var charWidth = fontManager.measureText(val, documentData.f, documentData.finalSize);
        // tCanvasHelper.font = documentData.finalSize + 'px '+ fontManager.getFontByName(documentData.f).fFamily;
        cLength = fontManager.measureText(
          val,
          documentData.f,
          documentData.finalSize
        )
      }

      //
      if (currentChar === ' ') {
        uncollapsedSpaces += cLength + trackingOffset
      } else {
        lineWidth += cLength + trackingOffset + uncollapsedSpaces
        uncollapsedSpaces = 0
      }
      letters.push({
        add: currentSize,
        an: cLength,
        animatorJustifyOffset: 0,
        anIndexes: [],
        l: cLength,
        line: currentLine,
        n: newLineFlag,
        val: val,
      })
      if (Number(anchorGrouping) === 2) {
        currentSize += cLength
        if (val === '' || val === ' ' || i === len - 1) {
          if (val === '' || val === ' ') {
            currentSize -= cLength
          }
          while (currentPos <= i) {
            letters[currentPos].an = currentSize
            letters[currentPos].ind = index
            letters[currentPos].extra = cLength
            currentPos += 1
          }
          index += 1
          currentSize = 0
        }
      } else if (Number(anchorGrouping) === 3) {
        currentSize += cLength
        if (val === '' || i === len - 1) {
          if (val === '') {
            currentSize -= cLength
          }
          while (currentPos <= i) {
            letters[currentPos].an = currentSize
            letters[currentPos].ind = index
            letters[currentPos].extra = cLength
            currentPos += 1
          }
          currentSize = 0
          index += 1
        }
      } else {
        letters[index].ind = index
        letters[index].extra = 0
        index += 1
      }
    }
    documentData.l = letters
    maxLineWidth = lineWidth > maxLineWidth ? lineWidth : maxLineWidth
    lineWidths.push(lineWidth)
    if (documentData.sz) {
      documentData.boxWidth = documentData.sz[0]
      documentData.justifyOffset = 0
    } else {
      documentData.boxWidth = maxLineWidth
      switch (documentData.j) {
        case 1:
          documentData.justifyOffset = -documentData.boxWidth
          break
        case 2:
          documentData.justifyOffset = -documentData.boxWidth / 2
          break
        default:
          documentData.justifyOffset = 0
      }
    }
    documentData.lineWidths = lineWidths

    const animators = data.a
    let animatorData
    let letterData
    const jLen = animators?.length || 0
    let based
    let ind
    const indexes = []
    for (j = 0; j < jLen; j++) {
      animatorData = animators?.[j]
      if (!animatorData) {
        continue
      }
      if (animatorData.a.sc) {
        documentData.strokeColorAnim = true
      }
      if (animatorData.a.sw) {
        documentData.strokeWidthAnim = true
      }
      if (
        animatorData.a.fc ||
        animatorData.a.fh ||
        animatorData.a.fs ||
        animatorData.a.fb
      ) {
        documentData.fillColorAnim = true
      }
      ind = 0
      based = Number(animatorData.s.b)
      for (i = 0; i < len; i++) {
        letterData = letters[i]
        letterData.anIndexes[j] = ind
        if (
          (based === 1 && letterData.val !== '') ||
          (based === 2 && letterData.val !== '' && letterData.val !== ' ') ||
          (based === 3 &&
            (letterData.n || letterData.val === ' ' || i === len - 1)) ||
          (based === 4 && (letterData.n || i === len - 1))
        ) {
          if (animatorData.s.rn === 1) {
            indexes.push(ind)
          }
          ind += 1
        }
      }
      if (data.a) {
        data.a[j].s.totalChars = ind
      }
      let currentInd = -1
      let newInd
      if (animatorData.s.rn === 1) {
        for (i = 0; i < len; i++) {
          letterData = letters[i]
          if (currentInd !== Number(letterData.anIndexes[j])) {
            currentInd = letterData.anIndexes[j]
            newInd = indexes.splice(
              Math.floor(Math.random() * indexes.length),
              1
            )[0]
          }
          if (newInd) {
            letterData.anIndexes[j] = newInd
          }
        }
      }
    }
    documentData.yOffset =
      documentData.finalLineHeight || documentData.finalSize * 1.2
    documentData.ls = documentData.ls || 0
    documentData.ascent =
      (Number(fontData.ascent) * documentData.finalSize) / 100
  }

  copyData(obj: DocumentData, data?: DocumentData | LetterProperties) {
    for (const s in data) {
      if (Object.prototype.hasOwnProperty.call(data, s)) {
        // @ts-expect-error: ignore
        obj[s] = data[s]
      }
    }
    return obj
  }
  getKeyframeValue() {
    const textKeys = this.data.d?.k
    const frameNum = this.elem.comp.renderedFrame
    let i = 0
    const len = textKeys?.length || 0
    while (i <= len - 1) {
      if (i === len - 1 || Number(textKeys?.[i + 1].t) > frameNum) {
        break
      }
      i++
    }
    if (this.keysIndex !== i) {
      this.keysIndex = i
    }
    return this.data.d?.k[this.keysIndex].s
  }
  getValue(_finalValue: unknown) {
    if (
      (this.elem.globalData.frameId === this.frameId ||
        !this.effectsSequence.length) &&
      !_finalValue
    ) {
      return
    }
    this.currentData.t = this.data.d?.k[this.keysIndex].s.t as any
    const currentValue = this.currentData
    const currentIndex = this.keysIndex
    if (this.lock) {
      this.setCurrentData(this.currentData)
      return
    }
    this.lock = true
    this._mdf = false
    let i
    const len = this.effectsSequence.length
    let finalValue =
      (_finalValue as DocumentData) || this.data.d?.k[this.keysIndex].s
    for (i = 0; i < len; i++) {
      // Checking if index changed to prevent creating a new object every time the expression updates.
      if (currentIndex === this.keysIndex) {
        finalValue = this.effectsSequence[i](this.currentData, finalValue?.t)
      } else {
        finalValue = this.effectsSequence[i](finalValue, finalValue?.t)
      }
    }
    if (currentValue !== finalValue) {
      this.setCurrentData(finalValue)
    }
    this.v = this.currentData
    this.pv = this.v
    this.lock = false
    this.frameId = this.elem.globalData.frameId
  }

  recalculate(index: number) {
    const dData = this.data.d!.k[index].s
    dData.__complete = false
    this.keysIndex = 0
    this._isFirstFrame = true
    this.getValue(dData)
  }

  searchKeyframes() {
    this.kf = this.data.d!.k.length > 1
    if (this.kf) {
      this.addEffect(this.getKeyframeValue.bind(this))
    }
    return this.kf
  }

  searchProperty() {
    return this.searchKeyframes()
  }

  setCurrentData(data: DocumentData) {
    if (!data.__complete) {
      this.completeTextData(data)
    }
    this.currentData = data
    this.currentData.boxWidth =
      this.currentData.boxWidth || this.defaultBoxWidth
    this._mdf = true
  }

  setMinimumFontSize(_fontValue: number) {
    this.minimumFontSize = Math.floor(_fontValue) || 1
    this.recalculate(this.keysIndex)
    this.elem.addDynamicProperty(this)
  }

  updateDocumentData(newData: DocumentData, indexFromProps: number) {
    let index = indexFromProps
    index = index === undefined ? this.keysIndex : index
    let dData = this.copyData({} as DocumentData, this.data.d?.k[index].s)
    dData = this.copyData(dData, newData)
    this.data.d!.k[index].s = dData
    this.recalculate(index)
    this.setCurrentData(dData)
    this.elem.addDynamicProperty(this)
  }
}
