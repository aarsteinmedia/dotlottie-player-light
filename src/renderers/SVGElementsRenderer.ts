import type {
  SVGFillStyleData,
  SVGStyleData,
  SVGTransformData,
} from '@/elements/helpers/shapes'
import type ShapeElement from '@/elements/ShapeElement'
import type { ItemData, Shape, ShapeDataInterface } from '@/types'

import { ShapeType } from '@/enums'
import { buildShapeString } from '@/utils'
import Matrix from '@/utils/Matrix'
import ShapePath from '@/utils/shapes/ShapePath'

const _identityMatrix = new Matrix(),
  _matrixHelper = new Matrix()
export default class SVGElementsRenderer {
  public static createRenderFunction(data: Shape) {
    switch (data.ty) {
      case ShapeType.Fill:
        return this.renderFill
      case ShapeType.GradientFill:
        return this.renderGradient
      case ShapeType.GradientStroke:
        return this.renderGradientStroke
      case ShapeType.Stroke:
        return this.renderStroke
      case ShapeType.Path:
      case ShapeType.Ellipse:
      case ShapeType.Rectangle:
      case ShapeType.PolygonStar:
        return this.renderPath
      case ShapeType.Transform:
        return this.renderContentTransform
      case ShapeType.NoStyle:
        return this.renderNoop
      default:
        return null
    }
  }

  private static renderContentTransform(
    _: SVGStyleData,
    itemData: SVGTransformData,
    isFirstFrame: boolean
  ) {
    if (isFirstFrame || itemData.transform.op._mdf) {
      itemData.transform.container?.setAttribute(
        'opacity',
        `${itemData.transform.op.v ?? 1}`
      )
    }
    if (isFirstFrame || itemData.transform.mProps._mdf) {
      itemData.transform.container.setAttribute(
        'transform',
        itemData.transform.mProps.v.to2dCSS()
      )
    }
  }

  private static renderFill(
    _: SVGStyleData,
    itemData: SVGFillStyleData,
    isFirstFrame: boolean
  ) {
    const styleElem = itemData.style

    if (itemData.c?.v && (itemData.c._mdf || isFirstFrame)) {
      styleElem.pElem.setAttribute(
        'fill',
        `rgb(${Math.floor(itemData.c.v[0])},${Math.floor(
          itemData.c.v[1]
        )},${itemData.c.v[2]})`
      )
    }
    if (itemData.o?._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute('fill-opacity', `${itemData.o?.v}`)
    }
  }

  private static renderGradient(
    styleData: SVGStyleData,
    itemData: ItemData,
    isFirstFrame: boolean
  ) {
    const gfill = itemData.gf,
      hasOpacity = itemData.g._hasOpacity,
      pt1 = itemData.s.v,
      pt2 = itemData.e.v

    if (itemData.o._mdf || isFirstFrame) {
      const attr = styleData.ty === 'gf' ? 'fill-opacity' : 'stroke-opacity'
      itemData.style.pElem.setAttribute(attr, `${itemData.o.v}`)
    }
    if (itemData.s._mdf || isFirstFrame) {
      const attr1 = styleData.t === 1 ? 'x1' : 'cx'
      const attr2 = attr1 === 'x1' ? 'y1' : 'cy'
      gfill.setAttribute(attr1, pt1[0])
      gfill.setAttribute(attr2, pt1[1])
      if (hasOpacity && !itemData.g._collapsable) {
        itemData.of?.setAttribute(attr1, pt1[0])
        itemData.of?.setAttribute(attr2, pt1[1])
      }
    }
    let stops: SVGStopElement[]
    let i: number
    let len: number
    let stop: SVGStopElement
    if (itemData.g._cmdf || isFirstFrame) {
      stops = itemData.cst || []
      const cValues = itemData.g.c
      len = stops.length
      for (i = 0; i < len; i += 1) {
        stop = stops[i]
        stop.setAttribute('offset', `${cValues[i * 4]}%`)
        stop.setAttribute(
          'stop-color',
          `rgb(${cValues[i * 4 + 1]},${cValues[i * 4 + 2]},${
            cValues[i * 4 + 3]
          })`
        )
      }
    }
    if (hasOpacity && (itemData.g._omdf || isFirstFrame)) {
      const oValues = itemData.g.o
      if (itemData.g._collapsable) {
        stops = itemData.cst || []
      } else {
        stops = itemData.ost || []
      }
      len = stops.length
      for (i = 0; i < len; i += 1) {
        stop = stops[i]
        if (!itemData.g._collapsable) {
          stop.setAttribute('offset', `${oValues[i * 2]}%`)
        }
        stop.setAttribute('stop-opacity', oValues[i * 2 + 1])
      }
    }
    if (styleData.t === 1) {
      if (itemData.e._mdf || isFirstFrame) {
        gfill.setAttribute('x2', pt2[0])
        gfill.setAttribute('y2', pt2[1])
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of?.setAttribute('x2', pt2[0])
          itemData.of?.setAttribute('y2', pt2[1])
        }
      }
    } else {
      let rad = 0
      if (itemData.s._mdf || itemData.e._mdf || isFirstFrame) {
        rad = Math.sqrt(
          Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2)
        )
        gfill.setAttribute('r', `${rad}`)
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of?.setAttribute('r', `${rad}`)
        }
      }
      if (
        itemData.e._mdf ||
        itemData.h._mdf ||
        itemData.a?._mdf ||
        isFirstFrame
      ) {
        if (!rad) {
          rad = Math.sqrt(
            Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2)
          )
        }
        const ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0])

        let percent = Number(itemData.h.v)
        if (percent >= 1) {
          percent = 0.99
        } else if (percent <= -1) {
          percent = -0.99
        }
        const dist = rad * percent
        const x = Math.cos(ang + Number(itemData.a?.v)) * dist + pt1[0]
        const y = Math.sin(ang + Number(itemData.a?.v)) * dist + pt1[1]
        gfill.setAttribute('fx', x)
        gfill.setAttribute('fy', y)
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of?.setAttribute('fx', x)
          itemData.of?.setAttribute('fy', y)
        }
      }
      // gfill.setAttribute('fy','200');
    }
  }

  private static renderGradientStroke(
    styleData: SVGStyleData,
    itemData: ItemData,
    isFirstFrame: boolean
  ) {
    this.renderGradient(styleData, itemData, isFirstFrame)
    this.renderStroke(styleData, itemData, isFirstFrame)
  }

  private static renderNoop() {}

  private static renderPath(
    styleData: SVGStyleData,
    itemData: ShapeDataInterface,
    isFirstFrame?: boolean
  ) {
    let j: number
    let jLen: number
    let pathStringTransformed
    let redraw: boolean
    let pathNodes: ShapePath | undefined
    let l: number
    const lLen = itemData.styles.length
    const lvl = itemData.lvl
    let paths: ShapeElement
    let mat: Matrix
    let iterations
    let k
    for (l = 0; l < lLen; l += 1) {
      redraw = itemData.sh?._mdf || !!isFirstFrame
      if (itemData.styles[l].lvl < lvl) {
        mat = _matrixHelper.reset()
        iterations = lvl - itemData.styles[l].lvl
        k = itemData.transformers.length - 1
        while (!redraw && iterations > 0) {
          redraw = itemData.transformers[k].mProps._mdf || redraw
          iterations -= 1
          k -= 1
        }
        if (redraw) {
          iterations = lvl - itemData.styles[l].lvl
          k = itemData.transformers.length - 1
          while (iterations > 0) {
            mat.multiply(itemData?.transformers[k].mProps.v)
            iterations -= 1
            k -= 1
          }
        }
      } else {
        mat = _identityMatrix
      }
      paths = itemData.sh.paths
      jLen = paths._length || 0
      if (redraw) {
        pathStringTransformed = ''
        for (j = 0; j < jLen; j += 1) {
          pathNodes = paths.shapes?.[j] as ShapePath
          if (pathNodes && pathNodes._length) {
            // console.log(pathNodes)
            pathStringTransformed += buildShapeString(
              pathNodes,
              pathNodes._length,
              !!pathNodes.c,
              mat
            )
          }
        }
        itemData.caches[l] = pathStringTransformed
      } else {
        pathStringTransformed = itemData.caches[l]
      }
      itemData.styles[l].d += styleData.hd === true ? '' : pathStringTransformed
      itemData.styles[l]._mdf = redraw || itemData.styles[l]._mdf
    }
  }

  private static renderStroke(
    _: SVGStyleData,
    itemData: ItemData,
    isFirstFrame: boolean
  ) {
    const styleElem = itemData.style
    const d = itemData.d
    if (d && (d._mdf || isFirstFrame) && d.dashStr) {
      styleElem.pElem.setAttribute('stroke-dasharray', d.dashStr)
      styleElem.pElem.setAttribute('stroke-dashoffset', `${d.dashoffset[0]}`)
    }
    if (itemData.c && (itemData.c._mdf || isFirstFrame)) {
      styleElem.pElem.setAttribute(
        'stroke',
        `rgb(${Math.floor((itemData.c.v as number[])[0])},${Math.floor((itemData.c.v as number[])[1])},${(itemData.c.v as number[])[2]})`
      )
    }
    if (itemData.o._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute('stroke-opacity', itemData.o.v as string)
    }
    if (itemData.w._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute('stroke-width', itemData.w.v as string)
      if (styleElem.msElem) {
        styleElem.msElem.setAttribute('stroke-width', itemData.w.v as string)
      }
    }
  }
}
