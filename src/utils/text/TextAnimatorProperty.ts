/* eslint-disable max-depth */
import type {
  DocumentData,
  TextData,
  TextRangeValue,
  Vector2,
  Vector3,
} from '@/types'

import { RendererType } from '@/enums'
import {
  addBrightnessToRGB,
  addHueToRGB,
  addSaturationToRGB,
  degToRads,
} from '@/utils'
import bezFunction from '@/utils/bez'
import BezierFactory from '@/utils/BezierFactory'
import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import Matrix from '@/utils/Matrix'
import PropertyFactory from '@/utils/PropertyFactory'
import LetterProps from '@/utils/text/LetterProps'

const bez = bezFunction()
/**
 *
 */
export default function TextAnimatorProperty(
  this: any,
  textData: TextData,
  renderType: RendererType,
  elem: any
) {
  this._isFirstFrame = true
  this._hasMaskedPath = false
  this._frameId = -1
  this._textData = textData
  this._renderType = renderType
  this._elem = elem
  this._animatorsData = createSizedArray(this._textData.a.length)
  this._pathData = {}
  this._moreOptions = {
    alignment: {},
  }
  this.renderedLetters = []
  this.lettersChangedFlag = false
  this.initDynamicPropertyContainer(elem)
}

TextAnimatorProperty.prototype.searchProperties = function () {
  const len = this._textData.a.length
  const getProp = PropertyFactory.getProp
  for (let i = 0; i < len; i++) {
    this._animatorsData[i] = new (TextAnimatorDataProperty as any)(
      this._elem,
      this._textData.a[i],
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
    this._textData.m.a,
    1,
    0,
    this
  )
}

TextAnimatorProperty.prototype.getMeasures = function (
  documentData: DocumentData,
  lettersChangedFlag?: boolean
) {
  this.lettersChangedFlag = lettersChangedFlag
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
    segments: {
      points: {
        partialLength: number
        point: Vector2
      }[]
    }[]
    tLength: number
  }
  let currentLength = 0
  let currentPoint
  let segmentLength = 0
  let flag
  let pointInd = 0
  let segmentInd = 0
  let prevPoint
  let points:
    | null
    | {
        partialLength: number
        point: Vector2
      }[] = null
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
        bezierData = bez.buildBezierData(
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
        bezierData = bez.buildBezierData(
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

  //
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
          textData.a[j].s.totalChars
        )
        if (mult.length) {
          animatorJustifyOffset +=
            animatorProps.t.v * mult[0] * justifyOffsetMult
        } else {
          animatorJustifyOffset += animatorProps.t.v * mult * justifyOffsetMult
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
              textData.a[j].s.totalChars
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
              textData.a[j].s.totalChars
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
            textData.a[j].s.totalChars
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
            textData.a[j].s.totalChars
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
            textData.a[j].s.totalChars
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
          textData.a[j].s.totalChars
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
            elemOpacity += (animatorProps.o.v * mult[0] - elemOpacity) * mult[0]
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
            textData.a[j].s.totalChars
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
        matrixHelper.translate(xPathPos, yPathPos, 0)
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
                  Number(documentData.lineWidths?.[Number(letters?.[i].line)])),
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
      letterValue = new (LetterProps as any)(
        letterO,
        letterSw,
        letterSc,
        letterFc,
        letterM,
        letterP
      )
      this.renderedLetters.push(letterValue)
      renderedLettersCount += 1
      this.lettersChangedFlag = true
    } else {
      letterValue = this.renderedLetters[i]
      this.lettersChangedFlag =
        letterValue.update(
          letterO,
          letterSw,
          letterSc,
          letterFc,
          letterM,
          letterP
        ) || this.lettersChangedFlag
    }
  }
}

TextAnimatorProperty.prototype.getValue = function () {
  if (this._elem.globalData.frameId === this._frameId) {
    return
  }
  this._frameId = this._elem.globalData.frameId
  this.iterateDynamicProperties()
}

TextAnimatorProperty.prototype.mHelper = new Matrix()
TextAnimatorProperty.prototype.defaultPropsArray = []
extendPrototype([DynamicPropertyContainer], TextAnimatorProperty)

/**
 *
 */
function TextAnimatorDataProperty(
  this: any,
  elem: any,
  animatorProps: any,
  container: any
) {
  const defaultData = { propType: false }
  const getProp = PropertyFactory.getProp
  const textAnimatorAnimatables = animatorProps.a
  this.a = {
    a: textAnimatorAnimatables.a
      ? getProp(elem, textAnimatorAnimatables.a, 1, 0, container)
      : defaultData,
    fb: textAnimatorAnimatables.fb
      ? getProp(elem, textAnimatorAnimatables.fb, 0, 0.01, container)
      : defaultData,
    fc: textAnimatorAnimatables.fc
      ? getProp(elem, textAnimatorAnimatables.fc, 1, 0, container)
      : defaultData,
    fh: textAnimatorAnimatables.fh
      ? getProp(elem, textAnimatorAnimatables.fh, 0, 0, container)
      : defaultData,
    fs: textAnimatorAnimatables.fs
      ? getProp(elem, textAnimatorAnimatables.fs, 0, 0.01, container)
      : defaultData,
    o: textAnimatorAnimatables.o
      ? getProp(elem, textAnimatorAnimatables.o, 0, 0.01, container)
      : defaultData,
    p: textAnimatorAnimatables.p
      ? getProp(elem, textAnimatorAnimatables.p, 1, 0, container)
      : defaultData,
    r: textAnimatorAnimatables.r
      ? getProp(elem, textAnimatorAnimatables.r, 0, degToRads, container)
      : defaultData,
    rx: textAnimatorAnimatables.rx
      ? getProp(elem, textAnimatorAnimatables.rx, 0, degToRads, container)
      : defaultData,
    ry: textAnimatorAnimatables.ry
      ? getProp(elem, textAnimatorAnimatables.ry, 0, degToRads, container)
      : defaultData,
    s: textAnimatorAnimatables.s
      ? getProp(elem, textAnimatorAnimatables.s, 1, 0.01, container)
      : defaultData,
    sa: textAnimatorAnimatables.sa
      ? getProp(elem, textAnimatorAnimatables.sa, 0, degToRads, container)
      : defaultData,
    sc: textAnimatorAnimatables.sc
      ? getProp(elem, textAnimatorAnimatables.sc, 1, 0, container)
      : defaultData,
    sk: textAnimatorAnimatables.sk
      ? getProp(elem, textAnimatorAnimatables.sk, 0, degToRads, container)
      : defaultData,
    sw: textAnimatorAnimatables.sw
      ? getProp(elem, textAnimatorAnimatables.sw, 0, 0, container)
      : defaultData,
    t: textAnimatorAnimatables.t
      ? getProp(elem, textAnimatorAnimatables.t, 0, 0, container)
      : defaultData,
  }

  this.s = TextSelectorProp.getTextSelectorProp(
    elem,
    animatorProps.s,
    container
  )
  this.s.t = animatorProps.s.t
}

const TextSelectorProp = (function () {
  const max = Math.max
  const min = Math.min
  const floor = Math.floor

  /**
   *
   */
  function TextSelectorPropFactory(this: any, elem: any, data: TextRangeValue) {
    this._currentTextLength = -1
    this.k = false
    this.data = data
    this.elem = elem
    this.comp = elem.comp
    this.finalS = 0
    this.finalE = 0
    this.initDynamicPropertyContainer(elem)
    this.s = PropertyFactory.getProp(elem, data.s || { k: 0 }, 0, 0, this)
    if ('e' in data) {
      this.e = PropertyFactory.getProp(elem, data.e, 0, 0, this)
    } else {
      this.e = { v: 100 }
    }
    this.o = PropertyFactory.getProp(elem, data.o || { k: 0 }, 0, 0, this)
    this.xe = PropertyFactory.getProp(elem, data.xe || { k: 0 }, 0, 0, this)
    this.ne = PropertyFactory.getProp(elem, data.ne || { k: 0 }, 0, 0, this)
    this.sm = PropertyFactory.getProp(elem, data.sm || { k: 100 }, 0, 0, this)
    this.a = PropertyFactory.getProp(elem, data.a, 0, 0.01, this)
    if (!this.dynamicProperties.length) {
      this.getValue()
    }
  }

  TextSelectorPropFactory.prototype = {
    getMult: function (indFromProps: number) {
      let ind = indFromProps
      if (
        this._currentTextLength !== this.elem.textProperty.currentData.l.length
      ) {
        this.getValue()
      }
      let x1 = 0
      let y1 = 0
      let x2 = 1
      let y2 = 1
      if (this.ne.v > 0) {
        x1 = this.ne.v / 100.0
      } else {
        y1 = -this.ne.v / 100.0
      }
      if (this.xe.v > 0) {
        x2 = 1.0 - this.xe.v / 100.0
      } else {
        y2 = 1.0 + this.xe.v / 100.0
      }
      const easer = BezierFactory.getBezierEasing(x1, y1, x2, y2).get

      let mult = 0
      const s = this.finalS
      const e = this.finalE
      const type = this.data.sh
      if (type === 2) {
        if (e === s) {
          mult = ind >= e ? 1 : 0
        } else {
          mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1))
        }
        mult = easer(mult)
      } else if (type === 3) {
        if (e === s) {
          mult = ind >= e ? 0 : 1
        } else {
          mult = 1 - max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1))
        }

        mult = easer(mult)
      } else if (type === 4) {
        if (e === s) {
          mult = 0
        } else {
          mult = max(0, min(0.5 / (e - s) + (ind - s) / (e - s), 1))
          if (mult < 0.5) {
            mult *= 2
          } else {
            mult = 1 - 2 * (mult - 0.5)
          }
        }
        mult = easer(mult)
      } else if (type === 5) {
        if (e === s) {
          mult = 0
        } else {
          const tot = e - s
          /* ind += 0.5;
                    mult = -4/(tot*tot)*(ind*ind)+(4/tot)*ind; */
          ind = min(max(0, ind + 0.5 - s), e - s)
          const x = -tot / 2 + ind
          const a = tot / 2
          mult = Math.sqrt(1 - (x * x) / (a * a))
        }
        mult = easer(mult)
      } else if (type === 6) {
        if (e === s) {
          mult = 0
        } else {
          ind = min(max(0, ind + 0.5 - s), e - s)
          mult = (1 + Math.cos(Math.PI + (Math.PI * 2 * ind) / (e - s))) / 2
        }
        mult = easer(mult)
      } else {
        if (ind >= floor(s)) {
          if (ind - s < 0) {
            mult = max(0, min(min(e, 1) - (s - ind), 1))
          } else {
            mult = max(0, min(e - ind, 1))
          }
        }
        mult = easer(mult)
      }
      // Smoothness implementation.
      // The smoothness represents a reduced range of the original [0; 1] range.
      // if smoothness is 25%, the new range will be [0.375; 0.625]
      // Steps are:
      // - find the lower value of the new range (threshold)
      // - if multiplier is smaller than that value, floor it to 0
      // - if it is larger,
      //     - subtract the threshold
      //     - divide it by the smoothness (this will return the range to [0; 1])
      // Note: If it doesn't work on some scenarios, consider applying it before the easer.
      if (this.sm.v !== 100) {
        let smoothness = this.sm.v * 0.01
        if (smoothness === 0) {
          smoothness = 0.00000001
        }
        const threshold = 0.5 - smoothness * 0.5
        if (mult < threshold) {
          mult = 0
        } else {
          mult = (mult - threshold) / smoothness
          if (mult > 1) {
            mult = 1
          }
        }
      }
      return mult * this.a.v
    },
    getValue: function (newCharsFlag?: boolean) {
      this.iterateDynamicProperties()
      this._mdf = newCharsFlag || this._mdf
      this._currentTextLength = this.elem.textProperty.currentData.l.length || 0
      if (newCharsFlag && this.data.r === 2) {
        this.e.v = this._currentTextLength
      }
      const divisor = this.data.r === 2 ? 1 : 100 / this.data.totalChars
      const o = this.o.v / divisor
      let s = this.s.v / divisor + o
      let e = this.e.v / divisor + o
      if (s > e) {
        const _s = s
        s = e
        e = _s
      }
      this.finalS = s
      this.finalE = e
    },
  }
  extendPrototype([DynamicPropertyContainer], TextSelectorPropFactory)

  /**
   *
   */
  function getTextSelectorProp(elem: any, data: TextData, arr: unknown[]) {
    return new (TextSelectorPropFactory as any)(elem, data, arr)
  }

  return {
    getTextSelectorProp: getTextSelectorProp,
  }
})()
