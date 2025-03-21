import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Mask,
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import { createNS } from '@/utils'
import { createElementID, getLocationHref } from '@/utils/getterSetter'
import { createSizedArray } from '@/utils/helpers/arrays'
import { ValueProperty } from '@/utils/Properties'
import PropertyFactory from '@/utils/PropertyFactory'
import { getShapeProp } from '@/utils/shapes/ShapeProperty'

export default class MaskElement {
  data: LottieLayer
  element: ElementInterfaceIntersect
  globalData: GlobalData
  maskElement: SVGElement | null
  masksProperties: null | Mask[]
  solidPath: string
  storedData: {
    elem: SVGPathElement
    expan: SVGFEMorphologyElement | null
    filterId?: string
    lastOperator: string
    lastPath: string
    lastRadius: number
    x: ValueProperty | null
  }[]
  viewData: any[]
  constructor(
    data: LottieLayer,
    element: ElementInterfaceIntersect,
    globalData: GlobalData
  ) {
    this.data = data
    this.element = element
    this.globalData = globalData
    this.storedData = []
    this.masksProperties = this.data.masksProperties || []
    this.maskElement = null
    const defs = this.globalData.defs
    let i
    let len = this.masksProperties ? this.masksProperties.length : 0
    this.viewData = createSizedArray(len)
    this.solidPath = ''

    let path
    const properties = this.masksProperties
    let count = 0
    const currentMasks = []
    let j
    let jLen
    const layerId = createElementID()
    let rect
    let expansor
    let feMorph
    let x
    let maskType = 'clipPath'
    let maskRef = 'clip-path'
    for (i = 0; i < len; i++) {
      if (
        (properties[i].mode !== 'a' && properties[i].mode !== 'n') ||
        properties[i].inv ||
        properties[i].o.k !== 100 ||
        properties[i].o.x
      ) {
        maskType = 'mask'
        maskRef = 'mask'
      }

      if (
        (properties[i].mode === 's' || properties[i].mode === 'i') &&
        count === 0
      ) {
        rect = createNS<SVGRectElement>('rect')
        rect.setAttribute('fill', '#ffffff')
        rect.setAttribute('width', `${Number(this.element.comp?.data?.w)}`)
        rect.setAttribute('height', `${Number(this.element.comp?.data?.h)}`)
        currentMasks.push(rect)
      } else {
        rect = null
      }

      path = createNS<SVGPathElement>('path')
      if (properties[i].mode === 'n') {
        // TODO: move this to a factory or to a constructor
        this.viewData[i] = {
          elem: path,
          lastPath: '',
          op: PropertyFactory(
            this.element,
            properties[i].o,
            0,
            0.01,
            this.element
          ),
          prop: getShapeProp(this.element, properties[i] as any, 3),
        }
        defs?.appendChild(path)
      } else {
        count += 1

        path.setAttribute(
          'fill',
          properties[i].mode === 's' ? '#000000' : '#ffffff'
        )
        path.setAttribute('clip-rule', 'nonzero')
        let filterID

        if (properties[i].x.k === 0) {
          feMorph = null
          x = null
        } else {
          maskType = 'mask'
          maskRef = 'mask'
          x = PropertyFactory(
            this.element,
            properties[i].x,
            0,
            null,
            this.element
          )
          filterID = createElementID()
          expansor = createNS('filter')
          expansor.setAttribute('id', filterID)
          feMorph = createNS<SVGFEMorphologyElement>('feMorphology')
          feMorph.setAttribute('operator', 'erode')
          feMorph.setAttribute('in', 'SourceGraphic')
          feMorph.setAttribute('radius', '0')
          expansor.appendChild(feMorph)
          defs?.appendChild(expansor)
          path.setAttribute(
            'stroke',
            properties[i].mode === 's' ? '#000000' : '#ffffff'
          )
        }

        // TODO: move this to a factory or to a constructor
        this.storedData[i] = {
          elem: path,
          expan: feMorph,
          filterId: filterID,
          lastOperator: '',
          lastPath: '',
          lastRadius: 0,
          x: x as any,
        }
        if (properties[i].mode === 'i') {
          jLen = currentMasks.length
          const g = createNS<SVGGElement>('g')
          for (j = 0; j < jLen; j++) {
            g.appendChild(currentMasks[j])
          }
          const mask = createNS<SVGMaskElement>('mask')
          mask.setAttribute('mask-type', 'alpha')
          mask.id = `${layerId}_${count}`
          mask.appendChild(path)
          defs?.appendChild(mask)
          g.setAttribute(
            'mask',
            `url(${getLocationHref()}#${layerId}_${count})`
          )

          currentMasks.length = 0
          currentMasks.push(g)
        } else {
          currentMasks.push(path)
        }
        if (properties[i].inv && !this.solidPath) {
          this.solidPath = this.createLayerSolidPath()
        }
        // TODO move this to a factory or to a constructor
        this.viewData[i] = {
          elem: path,
          invRect: rect,
          lastPath: '',
          op: PropertyFactory(
            this.element,
            properties[i].o,
            0,
            0.01,
            this.element
          ),
          prop: getShapeProp(this.element, properties[i] as any, 3),
        }
        if (!this.viewData[i].prop.k) {
          this.drawPath(
            properties[i],
            this.viewData[i].prop.v,
            this.viewData[i]
          )
        }
      }
    }

    this.maskElement = createNS(maskType)

    len = currentMasks.length
    for (i = 0; i < len; i++) {
      this.maskElement.appendChild(currentMasks[i])
    }

    if (count > 0) {
      this.maskElement.setAttribute('id', layerId)
      this.element.maskedElement?.setAttribute(
        maskRef,
        `url(${getLocationHref()}#${layerId})`
      )
      defs?.appendChild(this.maskElement)
    }
    if (this.viewData.length) {
      this.element.addRenderableComponent(this as any)
    }
  }

  createLayerSolidPath() {
    let path = 'M0,0 '
    path += ` h${this.globalData?.compSize?.w || 0}`
    path += ` v${this.globalData?.compSize?.h || 0}`
    path += ` h-${this.globalData?.compSize?.w || 0}`
    path += ` v-${this.globalData?.compSize?.h || 0} `
    return path
  }

  destroy() {
    this.element = null as any
    this.globalData = null as any
    this.maskElement = null
    this.data = null as any
    this.masksProperties = null
  }

  drawPath(pathData: null | Mask, pathNodes: ShapePath, viewData: any) {
    let i
    let pathString = ` M${pathNodes.v[0]?.[0]},${pathNodes.v[0]?.[1]}`
    const len = pathNodes._length || 0
    for (i = 1; i < len; i++) {
      // pathString += " C"+pathNodes.o[i-1][0]+','+pathNodes.o[i-1][1] + " "+pathNodes.i[i][0]+','+pathNodes.i[i][1] + " "+pathNodes.v[i][0]+','+pathNodes.v[i][1];
      pathString += ` C${pathNodes.o[i - 1]?.[0]},${pathNodes.o[i - 1]?.[1]} ${
        pathNodes.i[i]?.[0]
      },${pathNodes.i[i]?.[1]} ${pathNodes.v[i]?.[0]},${pathNodes.v[i]?.[1]}`
    }
    // pathString += " C"+pathNodes.o[i-1][0]+','+pathNodes.o[i-1][1] + " "+pathNodes.i[0][0]+','+pathNodes.i[0][1] + " "+pathNodes.v[0][0]+','+pathNodes.v[0][1];
    if (pathNodes.c && len > 1) {
      pathString += ` C${pathNodes.o[i - 1]?.[0]},${pathNodes.o[i - 1]?.[1]} ${
        pathNodes.i[0]?.[0]
      },${pathNodes.i[0]?.[1]} ${pathNodes.v[0]?.[0]},${pathNodes.v[0]?.[1]}`
    }
    // pathNodes.__renderedString = pathString;

    if (viewData.lastPath !== pathString) {
      let pathShapeValue = ''
      if (viewData.elem) {
        if (pathNodes.c) {
          pathShapeValue = pathData?.inv
            ? this.solidPath + pathString
            : pathString
        }
        viewData.elem.setAttribute('d', pathShapeValue)
      }
      viewData.lastPath = pathString
    }
  }

  getMaskelement() {
    return this.maskElement
  }

  getMaskProperty(pos: number) {
    return this.viewData[pos].prop
  }

  renderFrame(frame?: number | null) {
    const finalMat = this.element.finalTransform?.mat,
      { length } = this.masksProperties || []
    for (let i = 0; i < length; i++) {
      if (this.viewData[i].prop._mdf || frame) {
        this.drawPath(
          this.masksProperties?.[i] || null,
          this.viewData[i].prop.v,
          this.viewData[i]
        )
      }
      if (this.viewData[i].op._mdf || frame) {
        this.viewData[i].elem.setAttribute(
          'fill-opacity',
          this.viewData[i].op.v
        )
      }
      if (this.masksProperties?.[i].mode === 'n') {
        continue
      }
      if (
        this.viewData[i].invRect &&
        (this.element.finalTransform?.mProp._mdf || frame)
      ) {
        this.viewData[i].invRect.setAttribute(
          'transform',
          finalMat?.getInverseMatrix().to2dCSS()
        )
      }
      if (
        this.storedData[i] &&
        this.storedData[i].x &&
        (this.storedData[i].x?._mdf || frame)
      ) {
        const feMorph = this.storedData[i].expan
        if (Number(this.storedData[i].x?.v) < 0) {
          if (this.storedData[i].lastOperator !== 'erode') {
            this.storedData[i].lastOperator = 'erode'
            this.storedData[i].elem.setAttribute(
              'filter',
              `url(${getLocationHref()}#${this.storedData[i].filterId})`
            )
          }
          feMorph?.setAttribute('radius', `${-Number(this.storedData[i].x?.v)}`)
        } else {
          if (this.storedData[i].lastOperator !== 'dilate') {
            this.storedData[i].lastOperator = 'dilate'
            this.storedData[i].elem.removeAttribute('filter')
          }
          this.storedData[i].elem.setAttribute(
            'stroke-width',
            `${Number(this.storedData[i].x?.v) * 2}`
          )
        }
      }
    }
  }
}
