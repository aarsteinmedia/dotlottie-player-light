import type {
  KeyframedValueProperty,
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

import { lineCapEnum, lineJoinEnum, RendererType, ShapeType } from '@/enums'
import {
  AnimatedProperty,
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  Shape,
  Transformer,
  Vector3,
} from '@/types'
import { createNS, degToRads } from '@/utils'
import { createElementID, getLocationHref } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import PropertyFactory from '@/utils/PropertyFactory'
import DashProperty from '@/utils/shapes/DashProperty'
import GradientProperty from '@/utils/shapes/GradientProperty'
import TransformProperty from '@/utils/TransformProperty'

export class ShapeGroupData {
  _render?: boolean
  gr: SVGGElement
  it: Shape[]
  prevViewData: unknown[]
  constructor() {
    this.it = []
    this.prevViewData = []
    this.gr = createNS('g')
  }
}

export class SVGShapeData {
  _isAnimated: boolean
  _length?: number
  caches: unknown[]
  hd?: boolean
  lStr: string
  lvl: number
  sh: ShapeProperty
  styles: any[]
  transformers: Transformer[]
  ty?: ShapeType
  constructor(
    transformers: Transformer[],
    level: number,
    shape: ShapeProperty
  ) {
    this.caches = []
    this.styles = []
    this.transformers = transformers
    this.lStr = ''
    this.sh = shape
    this.lvl = level
    // TODO find if there are some cases where _isAnimated can be false.
    // For now, since shapes add up with other shapes. They have to be calculated every time.
    // One way of finding out is checking if all styles associated to this shape depend only of this shape
    this._isAnimated = !!shape?.k
    // TODO: commenting this for now since all shapes are animated
    let i = 0
    const len = transformers.length
    while (i < len) {
      if (transformers[i].mProps.dynamicProperties?.length) {
        this._isAnimated = true
        break
      }
      i++
    }
  }
  setAsAnimated() {
    this._isAnimated = true
  }
}

export class SVGTransformData {
  _isAnimated: boolean
  elements: ElementInterfaceIntersect[]
  transform: Transformer
  constructor(
    mProps: TransformProperty,
    op: ValueProperty,
    container: SVGGElement
  ) {
    this.transform = {
      container,
      mProps,
      op,
    } as Transformer
    this.elements = []
    this._isAnimated = !!(
      this.transform.mProps.dynamicProperties?.length ||
      this.transform.op.effectsSequence.length
    )
  }
}

export class SVGStyleData {
  _mdf: boolean
  closed: boolean
  d: string
  data: Shape
  hd?: boolean
  lvl: number
  msElem: null | SVGMaskElement | SVGPathElement
  pElem: SVGPathElement
  pt?: AnimatedProperty
  t?: number
  ty?: ShapeType
  type?: ShapeType
  constructor(data: Shape, level: number) {
    this.data = data
    this.type = data.ty
    this.d = ''
    this.lvl = level
    this._mdf = false
    this.closed = data.hd === true
    this.pElem = createNS<SVGPathElement>('path')
    this.msElem = null
  }
  reset() {
    this.d = ''
    this._mdf = false
  }
}
export class ProcessedElement {
  elem: ElementInterfaceUnion
  pos: number
  constructor(element: ElementInterfaceUnion, position: number) {
    this.elem = element
    this.pos = position
  }
}

export class SVGGradientFillStyleData extends DynamicPropertyContainer {
  a?: MultiDimensionalProperty
  cst?: SVGElement[]

  e?: MultiDimensionalProperty

  g?: GradientProperty

  gf?: SVGGradientElement
  h?: KeyframedValueProperty
  maskId?: string
  ms?: SVGMaskElement
  o?: ValueProperty
  of?: SVGElement

  ost?: SVGStopElement[]
  s?: MultiDimensionalProperty
  stops?: SVGStopElement[]
  style?: SVGStyleData
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleData: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.initGradientData(elem, data, styleData)
  }
  initGradientData(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleData: SVGStyleData
  ) {
    this.o = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.o,
      0,
      0.01,
      this
    ) as ValueProperty
    this.s = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.s,
      1,
      null,
      this
    ) as MultiDimensionalProperty
    this.e = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.e,
      1,
      null,
      this
    ) as MultiDimensionalProperty
    this.h = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.h || ({ k: 0 } as any),
      0,
      0.01,
      this
    ) as KeyframedValueProperty
    this.a = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.a || ({ k: 0 } as any),
      0,
      degToRads,
      this
    ) as MultiDimensionalProperty
    this.g = new GradientProperty(
      elem as ElementInterfaceIntersect,
      data.g!,
      this
    )
    this.style = styleData
    this.stops = []
    this.setGradientData(styleData.pElem, data)
    this.setGradientOpacity(data, styleData)
    this._isAnimated = !!this._isAnimated
  }
  setGradientData(pathElement: SVGElement, data: Shape) {
    const gradientId = createElementID()
    const gfill = createNS<SVGGradientElement>(
      data.t === 1 ? 'linearGradient' : 'radialGradient'
    )
    gfill.setAttribute('id', gradientId)
    gfill.setAttribute('spreadMethod', 'pad')
    gfill.setAttribute('gradientUnits', 'userSpaceOnUse')
    const stops: SVGStopElement[] = []
    let stop
    const jLen = (data.g?.p || 1) * 4
    for (let j = 0; j < jLen; j += 4) {
      stop = createNS<SVGStopElement>('stop')
      gfill.appendChild(stop)
      stops.push(stop)
    }
    pathElement.setAttribute(
      data.ty === 'gf' ? 'fill' : 'stroke',
      `url(${getLocationHref()}#${gradientId})`
    )
    this.gf = gfill
    this.cst = stops
  }
  setGradientOpacity(data: Shape, styleData: SVGStyleData) {
    if (this.g?._hasOpacity && !this.g._collapsable) {
      let stop
      const mask = createNS<SVGMaskElement>('mask'),
        maskElement = createNS<SVGPathElement>('path')
      if (!maskElement || !mask) {
        throw new Error('Could not create svg element')
      }
      mask.appendChild(maskElement)
      const opacityId = createElementID(),
        maskId = createElementID()
      mask.setAttribute('id', maskId)
      const opFill = createNS(
        data.t === 1 ? 'linearGradient' : 'radialGradient'
      )
      opFill.setAttribute('id', opacityId)
      opFill.setAttribute('spreadMethod', 'pad')
      opFill.setAttribute('gradientUnits', 'userSpaceOnUse')
      const jLen =
          (data.g?.k.k[0].s ? data.g.k.k[0].s.length : data.g?.k.k.length) || 0,
        stops = this.stops || []
      for (let j = (data.g?.p || 1) * 4; j < jLen; j += 2) {
        stop = createNS<SVGStopElement>('stop')
        if (!stop) {
          continue
        }
        stop.setAttribute('stop-color', 'rgb(255,255,255)')
        opFill.appendChild(stop)
        stops.push(stop)
      }
      maskElement.setAttribute(
        data.ty === 'gf' ? 'fill' : 'stroke',
        `url(${getLocationHref()}#${opacityId})`
      )
      if (data.ty === 'gs') {
        maskElement.setAttribute('stroke-linecap', lineCapEnum[data.lc || 2])
        maskElement.setAttribute('stroke-linejoin', lineJoinEnum[data.lj || 2])
        if (data.lj === 1) {
          maskElement.setAttribute('stroke-miterlimit', `${Number(data.ml)}`)
        }
      }
      this.of = opFill
      this.ms = mask
      this.ost = stops
      this.maskId = maskId
      styleData.msElem = maskElement
    }
  }
}

export class SVGGradientStrokeStyleData extends SVGGradientFillStyleData {
  d: DashProperty
  w?: ValueProperty
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleData: SVGStyleData
  ) {
    super(elem, data, styleData)
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.w = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.w,
      0,
      null,
      this
    ) as ValueProperty
    this.d = new DashProperty(
      elem as ElementInterfaceIntersect,
      (data.d || []) as any,
      RendererType.SVG,
      this as any
    ) // TODO
    this.initGradientData(elem, data, styleData)
    this._isAnimated = !!this._isAnimated
  }
}

export class SVGFillStyleData extends DynamicPropertyContainer {
  c?: MultiDimensionalProperty<Vector3>
  o?: ValueProperty
  style: SVGStyleData
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleObj: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.o,
      0,
      0.01,
      this
    ) as ValueProperty
    this.c = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.c,
      1,
      255,
      this
    ) as MultiDimensionalProperty<Vector3>
    this.style = styleObj
  }
}

export class SVGStrokeStyleData extends SVGFillStyleData {
  d: DashProperty
  w?: ValueProperty
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleObj: SVGStyleData
  ) {
    super(elem, data, styleObj)
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.o,
      0,
      0.01,
      this
    ) as ValueProperty
    this.w = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.w,
      0,
      null,
      this
    ) as ValueProperty
    this.d = new DashProperty(
      elem as ElementInterfaceIntersect,
      (data.d || []) as any,
      RendererType.SVG,
      this as any
    )
    this.c = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.c as any,
      1,
      255,
      this
    ) as MultiDimensionalProperty<Vector3>
    this.style = styleObj
    this._isAnimated = !!this._isAnimated
  }
}

export class SVGNoStyleData extends DynamicPropertyContainer {
  style: SVGStyleData
  constructor(
    elem: ElementInterfaceUnion,
    _data: SVGShapeData,
    styleObj: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.style = styleObj
  }
}
