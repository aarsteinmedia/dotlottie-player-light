/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable max-depth */
import type { CompInterface, GlobalData, LottieLayer } from '@/types'
import type Matrix from '@/utils/Matrix'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import TransformElement from '@/elements/helpers/TransformElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGCompElement from '@/elements/svg/SVGCompElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'
import TextElement from '@/elements/TextElement'
import { RendererType } from '@/enums'
import { createNS } from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'

/**
 *
 */
class SVGTextLottieElement {
  bbox?: {
    height: number
    left: number
    top: number
    width: number
  }
  data!: LottieLayer
  layerElement!: SVGGElement
  mHelper!: Matrix
  renderedFrame?: number
  renderedLetters?: string[]
  renderType: RendererType
  textContainer?: SVGTextElement
  textSpans: {
    childSpan?: null | SVGTextElement | SVGGElement
    glyph: null | CompInterface
    span: null | SVGTextElement | SVGGElement
  }[]
  validateText!: () => void
  private emptyShapeData = {
    shapes: [],
  } as unknown as LottieLayer
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    this.textSpans = []
    this.renderType = RendererType.SVG
    this.initElement(data, globalData, comp)
  }
  buildNewText() {
    this.addDynamicProperty(this)
    let i
    let len

    const documentData = this.textProperty.currentData
    this.renderedLetters = createSizedArray(
      documentData ? documentData.l.length : 0
    )
    if (documentData.fc) {
      this.layerElement.setAttribute('fill', this.buildColor(documentData.fc))
    } else {
      this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)')
    }
    if (documentData.sc) {
      this.layerElement.setAttribute('stroke', this.buildColor(documentData.sc))
      this.layerElement.setAttribute('stroke-width', documentData.sw)
    }
    this.layerElement.setAttribute('font-size', documentData.finalSize)
    const fontData = this.globalData.fontManager?.getFontByName(documentData.f)
    if (fontData?.fClass) {
      this.layerElement.setAttribute('class', fontData.fClass)
    } else {
      if (fontData?.fFamily) {
        this.layerElement.setAttribute('font-family', fontData.fFamily)
      }
      const fWeight = documentData.fWeight
      const fStyle = documentData.fStyle
      this.layerElement.setAttribute('font-style', fStyle)
      this.layerElement.setAttribute('font-weight', fWeight)
    }
    this.layerElement.setAttribute('aria-label', documentData.t)

    const letters = documentData.l || []
    const usesGlyphs = !!this.globalData.fontManager?.chars
    len = letters.length

    let tSpan: SVGTextElement | SVGGElement | null = null
    const matrixHelper = this.mHelper
    const shapeStr = ''
    const singleShape = this.data.singleShape
    let xPos = 0
    let yPos = 0
    let firstLine = true
    const trackingOffset = documentData.tr * 0.001 * documentData.finalSize
    if (singleShape && !usesGlyphs && !documentData.sz) {
      const tElement = this.textContainer
      let justify = 'start'
      switch (documentData.j) {
        case 1:
          justify = 'end'
          break
        case 2:
          justify = 'middle'
          break
        default:
          justify = 'start'
          break
      }
      tElement?.setAttribute('text-anchor', justify)
      tElement?.setAttribute('letter-spacing', `${trackingOffset}`)
      const textContent = this.buildTextContents(documentData.finalText)
      len = textContent.length
      yPos = documentData.ps ? documentData.ps[1] + documentData.ascent : 0
      for (i = 0; i < len; i++) {
        tSpan = this.textSpans[i].span || createNS<SVGTSpanElement>('tspan')
        tSpan.textContent = textContent[i]
        tSpan.setAttribute('x', '0')
        tSpan.setAttribute('y', `${yPos}`)
        tSpan.style.display = 'inherit'
        tElement?.appendChild(tSpan)
        if (!this.textSpans[i]) {
          this.textSpans[i] = {
            glyph: null,
            span: null,
          }
        }
        this.textSpans[i].span = tSpan
        yPos += documentData.finalLineHeight
      }

      if (tElement) {
        this.layerElement.appendChild(tElement)
      }
    } else {
      const cachedSpansLength = this.textSpans.length
      let charData
      for (i = 0; i < len; i++) {
        if (!this.textSpans[i]) {
          this.textSpans[i] = {
            childSpan: null,
            glyph: null,
            span: null,
          }
        }
        if (!usesGlyphs || !singleShape || i === 0) {
          tSpan =
            cachedSpansLength > i
              ? this.textSpans[i].span
              : (createNS(usesGlyphs ? 'g' : 'text') as SVGTextElement)
          if (cachedSpansLength <= i) {
            tSpan?.setAttribute('stroke-linecap', 'butt')
            tSpan?.setAttribute('stroke-linejoin', 'round')
            tSpan?.setAttribute('stroke-miterlimit', '4')
            this.textSpans[i].span = tSpan
            if (usesGlyphs) {
              const childSpan = createNS<SVGGElement>('g')
              tSpan?.appendChild(childSpan)
              this.textSpans[i].childSpan = childSpan
            }
            this.textSpans[i].span = tSpan
            if (tSpan) {
              this.layerElement.appendChild(tSpan)
            }
          }
          if (tSpan) {
            tSpan.style.display = 'inherit'
          }
        }

        matrixHelper.reset()
        if (singleShape) {
          if (letters[i].n) {
            xPos = -trackingOffset
            yPos += documentData.yOffset
            yPos += firstLine ? 1 : 0
            firstLine = false
          }
          this.applyTextPropertiesToMatrix(
            documentData,
            matrixHelper,
            letters[i].line,
            xPos,
            yPos
          )
          xPos += letters[i].l || 0
          // xPos += letters[i].val === ' ' ? 0 : trackingOffset;
          xPos += trackingOffset
        }
        if (usesGlyphs) {
          charData = this.globalData.fontManager?.getCharData(
            documentData.finalText[i],
            fontData?.fStyle,
            this.globalData.fontManager.getFontByName(documentData.f).fFamily
          )
          let glyphElement
          // t === 1 means the character has been replaced with an animated shaped
          if (charData?.t === 1) {
            glyphElement = new SVGCompElement(
              charData.data,
              this.globalData,
              this
            )
          } else {
            let data = this.emptyShapeData
            if (charData?.data && charData.data.shapes) {
              data = this.buildShapeData(charData.data, documentData.finalSize)
            }
            glyphElement = new (SVGShapeElement as any)(
              data,
              this.globalData,
              this
            )
          }
          if (this.textSpans[i].glyph) {
            const glyph = this.textSpans[i].glyph
            if (glyph) {
              this.textSpans[i].childSpan?.removeChild(glyph.layerElement)
              glyph.destroy()
            }
          }
          this.textSpans[i].glyph = glyphElement
          glyphElement._debug = true
          glyphElement.prepareFrame(0)
          glyphElement.renderFrame()
          this.textSpans[i].childSpan?.appendChild(glyphElement.layerElement)
          // when using animated shapes, the layer will be scaled instead of replacing the internal scale
          // this might have issues with strokes and might need a different solution
          if (charData?.t === 1) {
            this.textSpans[i].childSpan?.setAttribute(
              'transform',
              `scale(${documentData.finalSize / 100},${
                documentData.finalSize / 100
              })`
            )
          }
        } else {
          if (singleShape) {
            tSpan?.setAttribute(
              'transform',
              `translate(${matrixHelper.props[12]},${matrixHelper.props[13]})`
            )
          }
          if (tSpan) {
            tSpan.textContent = letters[i].val
          }

          tSpan?.setAttributeNS(
            'http://www.w3.org/XML/1998/namespace',
            'xml:space',
            'preserve'
          )
        }
      }
      if (singleShape && tSpan) {
        tSpan.setAttribute('d', shapeStr)
      }
    }
    while (i < this.textSpans.length && this.textSpans[i].span) {
      this.textSpans[i].span!.style.display = 'none'
      i++
    }

    this._sizeChanged = true
  }

  buildShapeData(data: LottieLayer, scale: number) {
    // data should probably be cloned to apply scale separately to each instance of a text on different layers
    // but since text internal content gets only rendered once and then it's never rerendered,
    // it's probably safe not to clone data and reuse always the same instance even if the object is mutated.
    // Avoiding cloning is preferred since cloning each character shape data is expensive
    if (data.shapes && data.shapes.length) {
      const shape = data.shapes[0]
      if (shape.it) {
        const shapeItem = shape.it[shape.it.length - 1]
        if (shapeItem.s) {
          shapeItem.s.k[0] = scale
          shapeItem.s.k[1] = scale
        }
      }
    }
    return data
  }
  buildTextContents(textArray: string[]) {
    let i = 0
    const len = textArray.length
    const textContents = []
    let currentTextContent = ''
    while (i < len) {
      if (
        textArray[i] === String.fromCharCode(13) ||
        textArray[i] === String.fromCharCode(3)
      ) {
        textContents.push(currentTextContent)
        currentTextContent = ''
      } else {
        currentTextContent += textArray[i]
      }
      i++
    }
    textContents.push(currentTextContent)
    return textContents
  }
  createContent() {
    if (this.data.singleShape && !this.globalData.fontManager?.chars) {
      this.textContainer = createNS<SVGTextElement>('text')
    }
  }
  getValue() {
    let i
    const len = this.textSpans.length
    let glyphElement
    this.renderedFrame = this.comp.renderedFrame
    for (i = 0; i < len; i++) {
      glyphElement = this.textSpans[i].glyph
      if (glyphElement) {
        glyphElement.prepareFrame?.(this.comp.renderedFrame - this.data.st)
        if (glyphElement._mdf) {
          this._mdf = true
        }
      }
    }
  }

  // TODO: Find out why this doesn't work as a normal prototype
  renderInnerContent = function (this: SVGTextLottieElement) {
    this.validateText()
    if (!this.data.singleShape || this._mdf) {
      this.textAnimator.getMeasures(
        this.textProperty.currentData,
        this.lettersChangedFlag
      )
      if (this.lettersChangedFlag || this.textAnimator.lettersChangedFlag) {
        this._sizeChanged = true
        let i
        const renderedLetters = this.textAnimator.renderedLetters

        const letters = this.textProperty.currentData.l

        const len = letters.length
        let renderedLetter
        let textSpan
        let glyphElement
        for (i = 0; i < len; i++) {
          if (letters[i].n) {
            continue
          }
          renderedLetter = renderedLetters[i]
          textSpan = this.textSpans[i].span
          glyphElement = this.textSpans[i].glyph
          if (glyphElement) {
            glyphElement.renderFrame()
          }
          if (renderedLetter._mdf.m) {
            textSpan?.setAttribute('transform', renderedLetter.m as string)
          }
          if (renderedLetter._mdf.o) {
            textSpan?.setAttribute('opacity', `${renderedLetter.o ?? 1}`)
          }
          if (renderedLetter._mdf.sw) {
            textSpan?.setAttribute('stroke-width', `${renderedLetter.sw || 0}`)
          }
          if (renderedLetter._mdf.sc) {
            textSpan?.setAttribute('stroke', renderedLetter.sc as string)
          }
          if (renderedLetter._mdf.fc) {
            textSpan?.setAttribute('fill', renderedLetter.fc as string)
          }
        }
      }
    }
  }

  sourceRectAtTime() {
    this.prepareFrame(this.comp.renderedFrame - this.data.st)
    this.renderInnerContent()
    if (this._sizeChanged) {
      this._sizeChanged = false
      const textBox = this.layerElement.getBBox()
      this.bbox = {
        height: textBox.height,
        left: textBox.x,
        top: textBox.y,
        width: textBox.width,
      }
    }
    return this.bbox
  }
}

extendPrototype(
  [
    BaseElement,
    TransformElement,
    SVGBaseElement,
    HierarchyElement,
    FrameElement,
    RenderableDOMElement,
    TextElement,
  ],
  SVGTextLottieElement
)

interface SVGTextLottieElement
  extends BaseElement,
    SVGBaseElement,
    HierarchyElement,
    FrameElement,
    RenderableDOMElement,
    TextElement {}

export default SVGTextLottieElement
