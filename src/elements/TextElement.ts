/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type FrameElement from '@/elements/helpers/FrameElement'
import type RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import type RenderableElement from '@/elements/helpers/RenderableElement'
// import type TransformElement from '@/elements/helpers/TransformElement'
import type SolidElement from '@/elements/SolidElement'
import type { RendererType } from '@/enums'
import type {
  DocumentData,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  Vector3,
} from '@/types'
import type Matrix from '@/utils/Matrix'
import type ShapePath from '@/utils/shapes/ShapePath'

import { buildShapeString } from '@/utils'
import LetterProps from '@/utils/text/LetterProps'
import TextAnimatorProperty from '@/utils/text/TextAnimatorProperty'
import TextProperty from '@/utils/text/TextProperty'

class TextElement {
  buildNewText!: () => void
  emptyProp = new LetterProps()
  lettersChangedFlag!: boolean

  renderType!: RendererType

  textAnimator!: TextAnimatorProperty

  textProperty!: any

  applyTextPropertiesToMatrix(
    documentData: DocumentData,
    matrixHelper: Matrix,
    lineNumber: number,
    xPos: number,
    yPos: number
  ) {
    if (documentData.ps) {
      matrixHelper.translate(
        documentData.ps[0],
        documentData.ps[1] + Number(documentData.ascent),
        0
      )
    }
    matrixHelper.translate(0, -Number(documentData.ls), 0)
    switch (documentData.j) {
      case 1:
        matrixHelper.translate(
          Number(documentData.justifyOffset) +
            (Number(documentData.boxWidth) -
              Number(documentData.lineWidths?.[lineNumber])),
          0,
          0
        )
        break
      case 2:
        matrixHelper.translate(
          Number(documentData.justifyOffset) +
            (Number(documentData.boxWidth) -
              Number(documentData.lineWidths?.[lineNumber])) /
              2,
          0,
          0
        )
        break
      default:
        break
    }
    matrixHelper.translate(xPos, yPos, 0)
  }

  // buildNewText() {}

  buildColor(colorData: Vector3) {
    return `rgb(${Math.round(colorData[0] * 255)},${Math.round(
      colorData[1] * 255
    )},${Math.round(colorData[2] * 255)})`
  }

  canResizeFont(_canResize: boolean) {
    this.textProperty.canResizeFont(_canResize)
  }

  createPathShape(matrixHelper: Matrix, shapes: Shape[]) {
    const jLen = shapes.length
    let pathNodes: ShapePath
    let shapeStr = ''
    for (let j = 0; j < jLen; j++) {
      if (shapes[j].ty !== 'sh' || !shapes[j].ks?.k) {
        continue
      }
      pathNodes = shapes[j].ks!.k as ShapePath
      shapeStr += buildShapeString(
        pathNodes,
        pathNodes.i.length,
        true,
        matrixHelper
      )
    }
    return shapeStr
  }

  initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    this.lettersChangedFlag = true
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.textProperty = new TextProperty(this as any, data.t) // this.dynamicProperties
    this.textAnimator = new TextAnimatorProperty(data.t!, this.renderType, this)
    this.initTransform()
    this.initHierarchy()
    this.initRenderable()
    this.initRendererElement()
    this.createContainerElements()
    this.createRenderableComponents()
    this.createContent()
    this.hide()
    this.textAnimator.searchProperties(this.dynamicProperties)
  }

  prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
  }

  setMinimumFontSize(_fontSize: number) {
    this.textProperty.setMinimumFontSize(_fontSize)
  }

  updateDocumentData(newData: DocumentData, index: number) {
    this.textProperty.updateDocumentData(newData, index)
  }

  validateText() {
    if (this.textProperty._mdf || this.textProperty._isFirstFrame) {
      this.buildNewText()
      this.textProperty._isFirstFrame = false
      this.textProperty._mdf = false
    }
  }
}

interface TextElement
  extends FrameElement,
    // TransformElement,
    RenderableElement,
    RenderableDOMElement,
    SolidElement,
    SVGTextElement {}

export default TextElement
