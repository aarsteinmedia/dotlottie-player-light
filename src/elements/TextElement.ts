import { buildShapeString } from '@/utils'
import TextAnimatorProperty from '@/utils/text/TextAnimatorProperty'
import LetterProps from '@/utils/text/LetterProps'
import TextProperty from '@/utils/text/TextProperty'
import type {
  DocumentData,
  GlobalData,
  LottieLayer,
  Shape,
  ShapeData,
  Vector3,
} from '@/types'
import type Matrix from '@/utils/Matrix'

export default function ITextElement() {}

ITextElement.prototype.initElement = function (
  data: LottieLayer,
  globalData: GlobalData,
  comp: any
) {
  this.lettersChangedFlag = true
  this.initFrame()
  this.initBaseData(data, globalData, comp)
  this.textProperty = new (TextProperty as any)(
    this,
    data.t,
    this.dynamicProperties
  )
  this.textAnimator = new (TextAnimatorProperty as any)(
    data.t,
    this.renderType,
    this
  )
  this.initTransform(data, globalData, comp)
  this.initHierarchy()
  this.initRenderable()
  this.initRendererElement()
  this.createContainerElements()
  this.createRenderableComponents()
  this.createContent()
  this.hide()
  this.textAnimator.searchProperties(this.dynamicProperties)
}

ITextElement.prototype.prepareFrame = function (num: number) {
  this._mdf = false
  this.prepareRenderableFrame(num)
  this.prepareProperties(num, this.isInRange)
}

ITextElement.prototype.createPathShape = function (
  matrixHelper: Matrix,
  shapes: Shape[]
) {
  const jLen = shapes.length
  let pathNodes: ShapeData
  let shapeStr = ''
  for (let j = 0; j < jLen; j++) {
    if (shapes[j].ty !== 'sh' || !shapes[j].ks?.k) {
      continue
    }
    pathNodes = shapes[j].ks!.k
    shapeStr += buildShapeString(
      pathNodes,
      pathNodes.i.length,
      true,
      matrixHelper
    )
  }
  return shapeStr
}

ITextElement.prototype.updateDocumentData = function (
  newData: DocumentData,
  index: number
) {
  this.textProperty.updateDocumentData(newData, index)
}

ITextElement.prototype.canResizeFont = function (_canResize: boolean) {
  this.textProperty.canResizeFont(_canResize)
}

ITextElement.prototype.setMinimumFontSize = function (_fontSize: number) {
  this.textProperty.setMinimumFontSize(_fontSize)
}

ITextElement.prototype.applyTextPropertiesToMatrix = function (
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

ITextElement.prototype.buildColor = function (colorData: Vector3) {
  return `rgb(${Math.round(colorData[0] * 255)},${Math.round(
    colorData[1] * 255
  )},${Math.round(colorData[2] * 255)})`
}

ITextElement.prototype.emptyProp = new (LetterProps as any)()

ITextElement.prototype.destroy = function () {}

ITextElement.prototype.validateText = function () {
  if (this.textProperty._mdf || this.textProperty._isFirstFrame) {
    this.buildNewText()
    this.textProperty._isFirstFrame = false
    this.textProperty._mdf = false
  }
}
