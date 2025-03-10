import type {
  KeyframedValueProperty,
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import { lineCapEnum, lineJoinEnum, RendererType, ShapeType } from '@/enums'
import {
  CompInterface,
  LottieLayerData,
  Shape,
  ShapeDataProperty,
  Transformer,
} from '@/types'
import { createNS, degToRads } from '@/utils'
import { createElementID, getLocationHref } from '@/utils/getterSetter'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import PropertyFactory from '@/utils/PropertyFactory'
import DashProperty from '@/utils/shapes/DashProperty'
import GradientProperty from '@/utils/shapes/GradientProperty'

export class ShapeGroupData {
  gr: SVGGElement
  it: unknown[]
  prevViewData: unknown[]
  constructor() {
    this.it = []
    this.prevViewData = []
    this.gr = createNS('g')
  }
}

export class SVGShapeData {
  _isAnimated: boolean
  caches: unknown[]
  hd?: boolean
  lStr: string
  lvl: number
  sh: ShapeDataProperty
  styles: any[]
  transformers: Transformer[]
  ty?: ShapeType
  constructor(
    transformers: Transformer[],
    level: number,
    shape: ShapeDataProperty
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
      if (transformers[i].mProps.dynamicProperties.length) {
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
  elements: CompInterface[]
  transform: Transformer
  constructor(
    mProps: Transformer['mProps'],
    op: Transformer['op'],
    container: unknown
  ) {
    this.transform = {
      container,
      mProps,
      op,
    }
    this.elements = []
    this._isAnimated = !!(
      this.transform.mProps.dynamicProperties.length ||
      this.transform.op.effectsSequence.length
    )
  }
}

export class SVGStyleData {
  _mdf: boolean
  closed: boolean
  d: string
  data: SVGShapeData
  lvl: number
  msElem: null | SVGMaskElement | SVGPathElement
  pElem: SVGPathElement
  type?: ShapeType
  constructor(data: SVGShapeData, level: number) {
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
  elem: LottieLayerData
  pos: number
  constructor(element: LottieLayerData, position: number) {
    this.elem = element
    this.pos = position
  }
}

export class SVGGradientFillStyleData extends DynamicPropertyContainer {
  a?: MultiDimensionalProperty
  cst?: SVGElement[]

  e?: MultiDimensionalProperty

  g?: GradientProperty

  getValue: () => void
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
  constructor(elem: any, data: Shape, styleData: SVGStyleData) {
    super()
    this.initDynamicPropertyContainer(elem)
    this.getValue = this.iterateDynamicProperties
    this.initGradientData(elem, data, styleData)
  }
  initGradientData(elem: any, data: Shape, styleData: SVGStyleData) {
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, this)
    this.s = PropertyFactory.getProp(elem, data.s, 1, null, this)
    this.e = PropertyFactory.getProp(elem, data.e, 1, null, this)
    this.h = PropertyFactory.getProp(
      elem,
      data.h || ({ k: 0 } as any),
      0,
      0.01,
      this
    )
    this.a = PropertyFactory.getProp(
      elem,
      data.a || ({ k: 0 } as any),
      0,
      degToRads,
      this
    )
    this.g = new GradientProperty(elem, data.g!, this)
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
  constructor(elem: CompInterface, data: Shape, styleData: SVGStyleData) {
    super(elem, data, styleData)
    this.initDynamicPropertyContainer(elem as any)
    this.getValue = this.iterateDynamicProperties
    this.w = PropertyFactory.getProp(elem, data.w, 0, null, this)
    this.d = new DashProperty(elem, data.d || [], RendererType.SVG, this as any) // TODO
    this.initGradientData(elem, data, styleData)
    this._isAnimated = !!this._isAnimated
  }
}

export class SVGStrokeStyleData extends DynamicPropertyContainer {
  c?: MultiDimensionalProperty
  d: DashProperty
  getValue: () => void
  o?: ValueProperty
  style: SVGStyleData
  w?: ValueProperty
  constructor(elem: CompInterface, data: Shape, styleObj: SVGStyleData) {
    super()
    this.initDynamicPropertyContainer(elem as any)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, this)
    this.w = PropertyFactory.getProp(elem, data.w, 0, null, this)
    this.d = new DashProperty(elem, data.d || [], RendererType.SVG, this)
    this.c = PropertyFactory.getProp(elem, data.c as any, 1, 255, this)
    this.style = styleObj
    this._isAnimated = !!this._isAnimated
  }
}

export class SVGFillStyleData extends DynamicPropertyContainer {
  c?: MultiDimensionalProperty
  getValue: () => void
  o?: ValueProperty
  style: SVGStyleData
  constructor(elem: CompInterface, data: Shape, styleObj: SVGStyleData) {
    super()
    this.initDynamicPropertyContainer(elem as any)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, this)
    this.c = PropertyFactory.getProp(elem, data.c as any, 1, 255, this)
    this.style = styleObj
  }
}

export class SVGNoStyleData extends DynamicPropertyContainer {
  getValue: () => void
  style: SVGStyleData
  constructor(
    elem: CompInterface,
    _data: SVGShapeData,
    styleObj: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem as any)
    this.getValue = this.iterateDynamicProperties
    this.style = styleObj
  }
}
