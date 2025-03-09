/* eslint-disable max-depth */
import type {
  DocumentData,
  TextAnimatorAnimatables,
  TextData,
  Vector2,
  Vector3,
} from '@/types'

import { RendererType } from '@/enums'
import { addBrightnessToRGB, addHueToRGB, addSaturationToRGB } from '@/utils'
import Bezier, { type BezierData } from '@/utils/Bezier'
import { createSizedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import Matrix from '@/utils/Matrix'
import PropertyFactory from '@/utils/PropertyFactory'
import LetterProps from '@/utils/text/LetterProps'
import TextAnimatorDataProperty from '@/utils/text/TextAnimatorDataProperty'

/**
 *
 */
export default class TextAnimatorProperty extends DynamicPropertyContainer {
  _frameId: number
  _isFirstFrame: boolean
  defaultPropsArray: number[] = []
  lettersChangedFlag: boolean
  mHelper = new Matrix()
  renderedLetters: LetterProps[]
  private _animatorsData: any[]
  private _elem: any
  private _hasMaskedPath: boolean
  private _moreOptions: {
    alignment: any
  }
  private _pathData: any

  private _renderType: RendererType

  private _textData: TextData

  constructor(textData: TextData, renderType: RendererType, elem: any) {
    super()
    this._isFirstFrame = true
    this._hasMaskedPath = false
    this._frameId = -1
    this._textData = textData
    this._renderType = renderType
    this._elem = elem
    this._animatorsData = createSizedArray(Number(this._textData.a?.length))
    this._pathData = {}
    this._moreOptions = {
      alignment: {},
    }
    this.renderedLetters = []
    this.lettersChangedFlag = false
    this.initDynamicPropertyContainer(elem)
  }

  getMeasures(documentData: DocumentData, lettersChangedFlag?: boolean) {
    this.lettersChangedFlag = !!lettersChangedFlag
    if (
      !this._mdf &&
      !this._isFirstFrame &&
      !lettersChangedFlag &&
      (!this._hasMaskedPath || !this._pathData.m._mdf)
    ) {
      return
    }
    this._isFirstFrame = false
    const alignment = this._moreOptions.alignment.v
    const animators = this._animatorsData
    const textData = this._textData
    const matrixHelper = this.mHelper
    const renderType = this._renderType
    let renderedLettersCount = this.renderedLetters.length
    let xPos
    let yPos
    let i
    let len
    const letters = documentData.l
    let pathInfo: {
      segments: BezierData[]
      tLength: number
    }
    let currentLength = 0
    let currentPoint
    let segmentLength = 0
    let flag
    let pointInd = 0
    let segmentInd = 0
    let prevPoint
    let points: null | BezierData['points'] = null
    let segments
    let partialLength = 0
    let totalLength = 0
    let perc = 0
    let tanAngle
    let mask
    if (this._hasMaskedPath) {
      mask = this._pathData.m
      if (!this._pathData.n || this._pathData._mdf) {
        let paths = mask.v
        if (this._pathData.r.v) {
          paths = paths.reverse()
        }
        pathInfo = {
          segments: [],
          tLength: 0,
        }
        len = paths._length - 1
        let bezierData
        totalLength = 0
        for (i = 0; i < len; i += 1) {
          bezierData = Bezier.buildBezierData(
            paths.v[i],
            paths.v[i + 1],
            [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
            [
              paths.i[i + 1][0] - paths.v[i + 1][0],
              paths.i[i + 1][1] - paths.v[i + 1][1],
            ]
          )
          pathInfo.tLength += bezierData.segmentLength
          pathInfo.segments.push(bezierData)
          totalLength += bezierData.segmentLength
        }
        i = len
        if (mask.v.c) {
          bezierData = Bezier.buildBezierData(
            paths.v[i],
            paths.v[0],
            [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
            [paths.i[0][0] - paths.v[0][0], paths.i[0][1] - paths.v[0][1]]
          )
          pathInfo.tLength += bezierData.segmentLength
          pathInfo.segments.push(bezierData)
          totalLength += bezierData.segmentLength
        }
        this._pathData.pi = pathInfo
      }
      pathInfo = this._pathData.pi

      currentLength = this._pathData.f.v
      segmentInd = 0
      pointInd = 1
      segmentLength = 0
      flag = true
      segments = pathInfo.segments
      if (currentLength < 0 && mask.v.c) {
        if (pathInfo.tLength < Math.abs(currentLength)) {
          currentLength = -Math.abs(currentLength) % pathInfo.tLength
        }
        segmentInd = segments.length - 1
        points = segments[segmentInd].points
        pointInd = points.length - 1
        while (currentLength < 0) {
          currentLength += points?.[pointInd]?.partialLength
          pointInd -= 1
          if (pointInd < 0) {
            segmentInd -= 1
            points = segments[segmentInd].points
            pointInd = points.length - 1
          }
        }
      }
      points = segments[segmentInd].points
      prevPoint = points[pointInd - 1]
      currentPoint = points[pointInd]
      partialLength = currentPoint.partialLength
    }

    len = letters?.length || 0
    xPos = 0
    yPos = 0
    const yOff = (documentData.finalSize || 0) * 1.2 * 0.714
    let firstLine = true
    let animatorProps
    let animatorSelector
    let j
    let letterValue

    const jLen = animators.length

    let mult
    let ind = -1
    let offf
    let xPathPos
    let yPathPos
    const initPathPos = currentLength
    const initSegmentInd = segmentInd
    const initPointInd = pointInd
    let currentLine = -1
    let elemOpacity
    let sc: Vector3 = [0, 0, 0]
    let sw = 0
    let fc: Vector3 = [0, 0, 0]
    let k
    let letterSw
    let letterSc
    let letterFc
    let letterM = ''
    let letterP = this.defaultPropsArray
    let letterO

    if (documentData.j === 2 || documentData.j === 1) {
      let animatorJustifyOffset = 0
      let animatorFirstCharOffset = 0
      const justifyOffsetMult = documentData.j === 2 ? -0.5 : -1
      let lastIndex = 0
      let isNewLine = true

      for (i = 0; i < len; i++) {
        if (letters?.[i].n) {
          if (animatorJustifyOffset) {
            animatorJustifyOffset += animatorFirstCharOffset
          }
          while (lastIndex < i) {
            letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset
            lastIndex++
          }
          animatorJustifyOffset = 0
          isNewLine = true
          continue
        }
        for (j = 0; j < jLen; j++) {
          animatorProps = animators[j].a
          if (!animatorProps.t.propType) {
            continue
          }
          if (isNewLine && documentData.j === 2) {
            animatorFirstCharOffset += animatorProps.t.v * justifyOffsetMult
          }
          animatorSelector = animators[j].s
          mult = animatorSelector.getMult(
            letters?.[i].anIndexes[j],
            textData.a?.[j].s.totalChars
          )
          if (mult.length) {
            animatorJustifyOffset +=
              animatorProps.t.v * mult[0] * justifyOffsetMult
          } else {
            animatorJustifyOffset +=
              animatorProps.t.v * mult * justifyOffsetMult
          }
        }
        isNewLine = false
      }
      if (animatorJustifyOffset) {
        animatorJustifyOffset += animatorFirstCharOffset
      }
      while (lastIndex < i) {
        if (letters) {
          letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset
          lastIndex += 1
        }
      }
    }

    for (i = 0; i < len; i++) {
      matrixHelper.reset()
      elemOpacity = 1
      if (letters?.[i].n) {
        xPos = 0
        yPos += documentData.yOffset || 0
        yPos += firstLine ? 1 : 0
        currentLength = initPathPos
        firstLine = false
        if (this._hasMaskedPath) {
          segmentInd = initSegmentInd || 0
          pointInd = initPointInd || 0
          points = segments?.[segmentInd]?.points || []
          prevPoint = points[pointInd - 1]
          currentPoint = points[pointInd]
          partialLength = currentPoint.partialLength
          segmentLength = 0
        }
        letterM = ''
        letterFc = ''
        letterSw = ''
        letterO = ''
        letterP = this.defaultPropsArray
      } else {
        if (this._hasMaskedPath) {
          if (currentLine !== letters?.[i].line) {
            switch (documentData.j) {
              case 1:
                currentLength +=
                  totalLength -
                  Number(documentData.lineWidths?.[Number(letters?.[i].line)])
                break
              case 2:
                currentLength +=
                  (totalLength -
                    Number(
                      documentData.lineWidths?.[Number(letters?.[i].line)]
                    )) /
                  2
                break
              default:
                break
            }
            currentLine = letters?.[i].line || 0
          }
          if (ind !== letters?.[i].ind) {
            if (letters?.[ind]) {
              currentLength += Number(letters[ind].extra)
            }
            currentLength += (letters?.[i].an || 0) / 2
            ind = letters?.[i].ind || 0
          }
          currentLength += alignment[0] * (letters?.[i].an || 0) * 0.005
          let animatorOffset = 0
          for (j = 0; j < jLen; j++) {
            animatorProps = animators[j].a
            if (animatorProps.p.propType) {
              animatorSelector = animators[j].s
              mult = animatorSelector.getMult(
                letters?.[i].anIndexes[j],
                textData.a?.[j].s.totalChars
              )
              if (mult.length) {
                animatorOffset += animatorProps.p.v[0] * mult[0]
              } else {
                animatorOffset += animatorProps.p.v[0] * mult
              }
            }
            if (animatorProps.a.propType) {
              animatorSelector = animators[j].s
              mult = animatorSelector.getMult(
                letters?.[i].anIndexes[j],
                textData.a?.[j].s.totalChars
              )
              if (mult.length) {
                animatorOffset += animatorProps.a.v[0] * mult[0]
              } else {
                animatorOffset += animatorProps.a.v[0] * mult
              }
            }
          }
          flag = true
          // Force alignment only works with a single line for now
          if (this._pathData.a.v) {
            currentLength =
              (letters?.[0].an || 0) * 0.5 +
              ((totalLength -
                this._pathData.f.v -
                (letters?.[0].an || 0) * 0.5 -
                Number(letters?.[Number(letters?.length) - 1].an) * 0.5) *
                ind) /
                (len - 1)
            currentLength += this._pathData.f.v
          }
          while (flag) {
            if (
              segmentLength + partialLength >= currentLength + animatorOffset ||
              !points
            ) {
              perc =
                (currentLength + animatorOffset - segmentLength) /
                (currentPoint?.partialLength || 0)
              xPathPos =
                Number(prevPoint?.point[0]) +
                (Number(currentPoint?.point[0]) - Number(prevPoint?.point[0])) *
                  perc
              yPathPos =
                Number(prevPoint?.point[1]) +
                (Number(currentPoint?.point[1]) - Number(prevPoint?.point[1])) *
                  perc
              matrixHelper.translate(
                -alignment[0] * Number(letters?.[i].an) * 0.005,
                -(alignment[1] * yOff) * 0.01
              )
              flag = false
            } else if (points) {
              segmentLength += Number(currentPoint?.partialLength)
              pointInd += 1
              if (pointInd >= points.length) {
                pointInd = 0
                segmentInd += 1
                if (segments?.[segmentInd]) {
                  points = segments[segmentInd].points
                } else if (mask.v.c) {
                  pointInd = 0
                  segmentInd = 0
                  points = segments?.[segmentInd].points || []
                } else {
                  segmentLength -= Number(currentPoint?.partialLength)
                  points = null
                }
              }
              if (points) {
                prevPoint = currentPoint
                currentPoint = points[pointInd]
                partialLength = currentPoint.partialLength
              }
            }
          }
          offf = Number(letters?.[i].an) / 2 - Number(letters?.[i].add)
          matrixHelper.translate(-offf, 0, 0)
        } else {
          offf = Number(letters?.[i].an) / 2 - Number(letters?.[i].add)
          matrixHelper.translate(-offf, 0, 0)

          // Grouping alignment
          matrixHelper.translate(
            -alignment[0] * Number(letters?.[i].an) * 0.005,
            -alignment[1] * yOff * 0.01,
            0
          )
        }

        for (j = 0; j < jLen; j++) {
          animatorProps = animators[j].a
          if (animatorProps.t.propType) {
            animatorSelector = animators[j].s
            mult = animatorSelector.getMult(
              letters?.[i].anIndexes[j],
              textData.a?.[j].s.totalChars
            )
            // This condition is to prevent applying tracking to first character in each line. Might be better to use a boolean "isNewLine"
            if (xPos !== 0 || documentData.j !== 0) {
              if (this._hasMaskedPath) {
                if (mult.length) {
                  currentLength += animatorProps.t.v * mult[0]
                } else {
                  currentLength += animatorProps.t.v * mult
                }
              } else if (mult.length) {
                xPos += animatorProps.t.v * mult[0]
              } else {
                xPos += animatorProps.t.v * mult
              }
            }
          }
        }
        if (documentData.strokeWidthAnim) {
          sw = documentData.sw || 0
        }
        if (documentData.strokeColorAnim) {
          if (documentData.sc) {
            sc = [
              Number(documentData.sc[0]),
              Number(documentData.sc[1]),
              Number(documentData.sc[2]),
            ]
          } else {
            sc = [0, 0, 0]
          }
        }
        if (documentData.fillColorAnim && documentData.fc) {
          fc = [
            Number(documentData.fc[0]),
            Number(documentData.fc[1]),
            Number(documentData.fc[2]),
          ]
        }
        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a
          if (animatorProps.a.propType) {
            animatorSelector = animators[j].s
            mult = animatorSelector.getMult(
              letters?.[i].anIndexes[j],
              textData.a?.[j].s.totalChars
            )

            if (mult.length) {
              matrixHelper.translate(
                -animatorProps.a.v[0] * mult[0],
                -animatorProps.a.v[1] * mult[1],
                animatorProps.a.v[2] * mult[2]
              )
            } else {
              matrixHelper.translate(
                -animatorProps.a.v[0] * mult,
                -animatorProps.a.v[1] * mult,
                animatorProps.a.v[2] * mult
              )
            }
          }
        }
        for (j = 0; j < jLen; j++) {
          animatorProps = animators[j].a
          if (animatorProps.s.propType) {
            animatorSelector = animators[j].s
            mult = animatorSelector.getMult(
              letters?.[i].anIndexes[j],
              textData.a?.[j].s.totalChars
            )
            if (mult.length) {
              matrixHelper.scale(
                1 + (animatorProps.s.v[0] - 1) * mult[0],
                1 + (animatorProps.s.v[1] - 1) * mult[1],
                1
              )
            } else {
              matrixHelper.scale(
                1 + (animatorProps.s.v[0] - 1) * mult,
                1 + (animatorProps.s.v[1] - 1) * mult,
                1
              )
            }
          }
        }
        for (j = 0; j < jLen; j += 1) {
          animatorProps = animators[j].a
          animatorSelector = animators[j].s
          mult = animatorSelector.getMult(
            letters?.[i].anIndexes[j],
            textData.a?.[j].s.totalChars
          )
          if (animatorProps.sk.propType) {
            if (mult.length) {
              matrixHelper.skewFromAxis(
                -animatorProps.sk.v * mult[0],
                animatorProps.sa.v * mult[1]
              )
            } else {
              matrixHelper.skewFromAxis(
                -animatorProps.sk.v * mult,
                animatorProps.sa.v * mult
              )
            }
          }
          if (animatorProps.r.propType) {
            if (mult.length) {
              matrixHelper.rotateZ(-animatorProps.r.v * mult[2])
            } else {
              matrixHelper.rotateZ(-animatorProps.r.v * mult)
            }
          }
          if (animatorProps.ry.propType) {
            if (mult.length) {
              matrixHelper.rotateY(animatorProps.ry.v * mult[1])
            } else {
              matrixHelper.rotateY(animatorProps.ry.v * mult)
            }
          }
          if (animatorProps.rx.propType) {
            if (mult.length) {
              matrixHelper.rotateX(animatorProps.rx.v * mult[0])
            } else {
              matrixHelper.rotateX(animatorProps.rx.v * mult)
            }
          }
          if (animatorProps.o.propType) {
            if (mult.length) {
              elemOpacity +=
                (animatorProps.o.v * mult[0] - elemOpacity) * mult[0]
            } else {
              elemOpacity += (animatorProps.o.v * mult - elemOpacity) * mult
            }
          }
          if (documentData.strokeWidthAnim && animatorProps.sw.propType) {
            if (mult.length) {
              sw += animatorProps.sw.v * mult[0]
            } else {
              sw += animatorProps.sw.v * mult
            }
          }
          if (documentData.strokeColorAnim && animatorProps.sc.propType) {
            for (k = 0; k < 3; k += 1) {
              if (mult.length) {
                sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult[0]
              } else {
                sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult
              }
            }
          }
          if (documentData.fillColorAnim && documentData.fc) {
            if (animatorProps.fc.propType) {
              for (k = 0; k < 3; k += 1) {
                if (mult.length) {
                  fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult[0]
                } else {
                  fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult
                }
              }
            }
            if (animatorProps.fh.propType) {
              if (mult.length) {
                fc = addHueToRGB(fc, animatorProps.fh.v * mult[0])
              } else {
                fc = addHueToRGB(fc, animatorProps.fh.v * mult)
              }
            }
            if (animatorProps.fs.propType) {
              if (mult.length) {
                fc = addSaturationToRGB(fc, animatorProps.fs.v * mult[0])
              } else {
                fc = addSaturationToRGB(fc, animatorProps.fs.v * mult)
              }
            }
            if (animatorProps.fb.propType) {
              if (mult.length) {
                fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult[0])
              } else {
                fc = addBrightnessToRGB(fc, animatorProps.fb.v * mult)
              }
            }
          }
        }

        for (j = 0; j < jLen; j++) {
          animatorProps = animators[j].a

          if (animatorProps.p.propType) {
            animatorSelector = animators[j].s
            mult = animatorSelector.getMult(
              letters?.[i].anIndexes[j],
              textData.a?.[j].s.totalChars
            )
            if (this._hasMaskedPath) {
              if (mult.length) {
                matrixHelper.translate(
                  0,
                  animatorProps.p.v[1] * mult[0],
                  -animatorProps.p.v[2] * mult[1]
                )
              } else {
                matrixHelper.translate(
                  0,
                  animatorProps.p.v[1] * mult,
                  -animatorProps.p.v[2] * mult
                )
              }
            } else if (mult.length) {
              matrixHelper.translate(
                animatorProps.p.v[0] * mult[0],
                animatorProps.p.v[1] * mult[1],
                -animatorProps.p.v[2] * mult[2]
              )
            } else {
              matrixHelper.translate(
                animatorProps.p.v[0] * mult,
                animatorProps.p.v[1] * mult,
                -animatorProps.p.v[2] * mult
              )
            }
          }
        }
        if (documentData.strokeWidthAnim) {
          letterSw = sw < 0 ? 0 : sw
        }
        if (documentData.strokeColorAnim) {
          letterSc = `rgb(${Math.round(sc[0] * 255)},${Math.round(
            sc[1] * 255
          )},${Math.round(sc[2] * 255)})`
        }
        if (documentData.fillColorAnim && documentData.fc) {
          letterFc = `rgb(${Math.round(fc[0] * 255)},${Math.round(
            fc[1] * 255
          )},${Math.round(fc[2] * 255)})`
        }

        if (this._hasMaskedPath) {
          matrixHelper.translate(0, -Number(documentData.ls))

          matrixHelper.translate(0, alignment[1] * yOff * 0.01 + yPos, 0)
          if (this._pathData.p.v) {
            tanAngle =
              (Number(currentPoint?.point[1]) - Number(prevPoint?.point[1])) /
              (Number(currentPoint?.point[0]) - Number(prevPoint?.point[0]))
            let rot = (Math.atan(tanAngle) * 180) / Math.PI
            if (Number(currentPoint?.point[0]) < Number(prevPoint?.point[0])) {
              rot += 180
            }
            matrixHelper.rotate((-rot * Math.PI) / 180)
          }
          matrixHelper.translate(Number(xPathPos), Number(yPathPos), 0)
          currentLength -= alignment[0] * Number(letters?.[i].an) * 0.005
          if (letters?.[i + 1] && ind !== letters?.[i + 1].ind) {
            currentLength += letters[i].an / 2
            currentLength +=
              documentData.tr * 0.001 * Number(documentData.finalSize)
          }
        } else {
          matrixHelper.translate(xPos, yPos, 0)

          if (documentData.ps) {
            // matrixHelper.translate(documentData.ps[0],documentData.ps[1],0);
            matrixHelper.translate(
              documentData.ps[0],
              documentData.ps[1] + Number(documentData.ascent),
              0
            )
          }
          switch (documentData.j) {
            case 1:
              matrixHelper.translate(
                Number(letters?.[i].animatorJustifyOffset) +
                  Number(documentData.justifyOffset) +
                  (Number(documentData.boxWidth) -
                    Number(
                      documentData.lineWidths?.[Number(letters?.[i].line)]
                    )),
                0,
                0
              )
              break
            case 2:
              matrixHelper.translate(
                Number(letters?.[i].animatorJustifyOffset) +
                  Number(documentData.justifyOffset) +
                  (Number(documentData.boxWidth) -
                    Number(
                      documentData.lineWidths?.[Number(letters?.[i].line)]
                    )) /
                    2,
                0,
                0
              )
              break
            default:
              break
          }
          matrixHelper.translate(0, -Number(documentData.ls))
          matrixHelper.translate(offf, 0, 0)
          matrixHelper.translate(
            alignment[0] * Number(letters?.[i].an) * 0.005,
            alignment[1] * yOff * 0.01,
            0
          )
          xPos +=
            Number(letters?.[i].l) +
            documentData.tr * 0.001 * Number(documentData.finalSize)
        }
        if (renderType === 'html') {
          letterM = matrixHelper.toCSS()
        } else if (renderType === 'svg') {
          letterM = matrixHelper.to2dCSS()
        } else {
          letterP = [
            matrixHelper.props[0],
            matrixHelper.props[1],
            matrixHelper.props[2],
            matrixHelper.props[3],
            matrixHelper.props[4],
            matrixHelper.props[5],
            matrixHelper.props[6],
            matrixHelper.props[7],
            matrixHelper.props[8],
            matrixHelper.props[9],
            matrixHelper.props[10],
            matrixHelper.props[11],
            matrixHelper.props[12],
            matrixHelper.props[13],
            matrixHelper.props[14],
            matrixHelper.props[15],
          ]
        }
        letterO = elemOpacity
      }

      if (renderedLettersCount <= i) {
        letterValue = new LetterProps(
          Number(letterO),
          Number(letterSw),
          letterSc,
          letterFc,
          letterM,
          letterP as any
        )
        this.renderedLetters.push(letterValue)
        renderedLettersCount += 1
        this.lettersChangedFlag = true
      } else {
        letterValue = this.renderedLetters[i]
        this.lettersChangedFlag =
          letterValue.update(
            Number(letterO),
            Number(letterSw),
            letterSc as any,
            letterFc as any,
            letterM as any,
            letterP
          ) || this.lettersChangedFlag
      }
    }
  }

  getValue() {
    if (this._elem.globalData.frameId === this._frameId) {
      return
    }
    this._frameId = this._elem.globalData.frameId
    this.iterateDynamicProperties()
  }
  searchProperties() {
    const len = this._textData.a?.length || 0
    const getProp = PropertyFactory.getProp
    for (let i = 0; i < len; i++) {
      this._animatorsData[i] = new TextAnimatorDataProperty(
        this._elem,
        this._textData.a?.[i],
        this
      )
    }
    if (this._textData.p && 'm' in this._textData.p) {
      this._pathData = {
        a: getProp(this._elem, this._textData.p.a, 0, 0, this),
        f: getProp(this._elem, this._textData.p.f, 0, 0, this),
        l: getProp(this._elem, this._textData.p.l, 0, 0, this),
        m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
        p: getProp(this._elem, this._textData.p.p, 0, 0, this),
        r: getProp(this._elem, this._textData.p.r, 0, 0, this),
      }
      this._hasMaskedPath = true
    } else {
      this._hasMaskedPath = false
    }
    this._moreOptions.alignment = getProp(
      this._elem,
      this._textData.m?.a,
      1,
      0,
      this
    )
  }
}
