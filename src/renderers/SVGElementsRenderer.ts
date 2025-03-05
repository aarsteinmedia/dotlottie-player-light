import type {
  ItemData,
  Shape,
  ShapeData,
  ShapeDataProperty,
  ShapeHandler,
  StyleData,
} from '@/types'
import { ShapeType } from '@/enums'
import { buildShapeString } from '@/utils'
import Matrix from '@/utils/Matrix'

const SVGElementsRenderer = (() => {
  const _identityMatrix = new Matrix(),
    _matrixHelper = new Matrix()

  /**
   *
   */
  function createRenderFunction(data: Shape) {
    switch (data.ty) {
      case ShapeType.Fill:
        return renderFill
      case ShapeType.GradientFill:
        return renderGradient
      case ShapeType.GradientStroke:
        return renderGradientStroke
      case ShapeType.Stroke:
        return renderStroke
      case ShapeType.Path:
      case ShapeType.Ellipse:
      case ShapeType.Rectangle:
      case ShapeType.PolygonStar:
        return renderPath
      case ShapeType.Transform:
        return renderContentTransform
      case ShapeType.NoStyle:
        return renderNoop
      default:
        return null
    }
  }

  /**
   *
   */
  function renderContentTransform(
    _: any,
    itemData: any,
    isFirstFrame: boolean
  ) {
    if (isFirstFrame || itemData.transform.op._mdf) {
      itemData.transform.container.setAttribute(
        'opacity',
        itemData.transform.op.v
      )
    }
    if (isFirstFrame || itemData.transform.mProps._mdf) {
      itemData.transform.container.setAttribute(
        'transform',
        itemData.transform.mProps.v.to2dCSS()
      )
    }
  }

  function renderNoop() {}

  /**
   *
   */
  function renderPath(
    styleData: StyleData,
    itemData: ShapeHandler,
    isFirstFrame: boolean
  ) {
    let j: number
    let jLen: number
    let pathStringTransformed
    let redraw
    let pathNodes
    let l: number
    const lLen = itemData.styles.length
    const lvl = itemData.lvl
    let paths: ShapeDataProperty['paths']
    let mat
    let iterations
    let k
    for (l = 0; l < lLen; l += 1) {
      redraw = itemData.sh?._mdf || isFirstFrame
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
      jLen = paths._length
      if (redraw) {
        pathStringTransformed = ''
        for (j = 0; j < jLen; j += 1) {
          pathNodes = paths.shapes[j]
          if (pathNodes && pathNodes._length) {
            pathStringTransformed += buildShapeString(
              pathNodes as unknown as ShapeData,
              pathNodes._length,
              pathNodes.c,
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

  /**
   *
   */
  function renderFill(_: StyleData, itemData: ItemData, isFirstFrame: boolean) {
    const styleElem = itemData.style

    if (itemData.c._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute(
        'fill',
        `rgb(${Math.floor(itemData.c.v[0] as number)},${Math.floor(
          itemData.c.v[1] as number
        )},${itemData.c.v[2]})`
      )
    }
    if (itemData.o._mdf || isFirstFrame) {
      styleElem.pElem.setAttribute('fill-opacity', itemData.o.v as string)
    }
  }

  /**
   *
   */
  function renderGradientStroke(
    styleData: StyleData,
    itemData: ItemData,
    isFirstFrame: boolean
  ) {
    renderGradient(styleData, itemData, isFirstFrame)
    renderStroke(styleData, itemData, isFirstFrame)
  }

  /**
   *
   */
  function renderGradient(
    styleData: StyleData,
    itemData: any,
    isFirstFrame: boolean
  ) {
    const gfill = itemData.gf
    const hasOpacity = itemData.g._hasOpacity
    const pt1 = itemData.s.v
    const pt2 = itemData.e.v

    if (itemData.o._mdf || isFirstFrame) {
      const attr = styleData.ty === 'gf' ? 'fill-opacity' : 'stroke-opacity'
      itemData.style.pElem.setAttribute(attr, itemData.o.v)
    }
    if (itemData.s._mdf || isFirstFrame) {
      const attr1 = styleData.t === 1 ? 'x1' : 'cx'
      const attr2 = attr1 === 'x1' ? 'y1' : 'cy'
      gfill.setAttribute(attr1, pt1[0])
      gfill.setAttribute(attr2, pt1[1])
      if (hasOpacity && !itemData.g._collapsable) {
        itemData.of.setAttribute(attr1, pt1[0])
        itemData.of.setAttribute(attr2, pt1[1])
      }
    }
    let stops
    let i
    let len
    let stop
    if (itemData.g._cmdf || isFirstFrame) {
      stops = itemData.cst
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
        stops = itemData.cst
      } else {
        stops = itemData.ost
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
          itemData.of.setAttribute('x2', pt2[0])
          itemData.of.setAttribute('y2', pt2[1])
        }
      }
    } else {
      let rad
      if (itemData.s._mdf || itemData.e._mdf || isFirstFrame) {
        rad = Math.sqrt(
          Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2)
        )
        gfill.setAttribute('r', rad)
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of.setAttribute('r', rad)
        }
      }
      if (
        itemData.e._mdf ||
        itemData.h._mdf ||
        itemData.a._mdf ||
        isFirstFrame
      ) {
        if (!rad) {
          rad = Math.sqrt(
            Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2)
          )
        }
        const ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0])

        let percent = itemData.h.v
        if (percent >= 1) {
          percent = 0.99
        } else if (percent <= -1) {
          percent = -0.99
        }
        const dist = rad * percent
        const x = Math.cos(ang + itemData.a.v) * dist + pt1[0]
        const y = Math.sin(ang + itemData.a.v) * dist + pt1[1]
        gfill.setAttribute('fx', x)
        gfill.setAttribute('fy', y)
        if (hasOpacity && !itemData.g._collapsable) {
          itemData.of.setAttribute('fx', x)
          itemData.of.setAttribute('fy', y)
        }
      }
      // gfill.setAttribute('fy','200');
    }
  }

  /**
   *
   */
  function renderStroke(_: any, itemData: ItemData, isFirstFrame: boolean) {
    const styleElem = itemData.style
    const d = itemData.d
    if (d && (d._mdf || isFirstFrame) && d.dashStr) {
      styleElem.pElem.setAttribute('stroke-dasharray', d.dashStr)
      styleElem.pElem.setAttribute('stroke-dashoffset', `${d.dashoffset[0]}`)
    }
    if (itemData.c && (itemData.c._mdf || isFirstFrame)) {
      styleElem.pElem.setAttribute(
        'stroke',
        `rgb(${Math.floor(itemData.c.v[0] as number)},${Math.floor(itemData.c.v[1] as number)},${itemData.c.v[2]})`
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

  return {
    createRenderFunction,
  }
})()

export default SVGElementsRenderer
