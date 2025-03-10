import type { SVGStrokeStyleData } from '@/elements/helpers/shapes'
import type { ElementInterface, StrokeData } from '@/types'

import { ArrayType, RendererType } from '@/enums'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import PropertyFactory from '@/utils/PropertyFactory'

export default class DashProperty extends DynamicPropertyContainer {
  dashArray: Float32Array
  dashoffset: Float32Array
  dashStr: string
  dataProps: StrokeData[]
  elem: ElementInterface
  frameId: number
  k: boolean
  renderer: RendererType
  constructor(
    elem: ElementInterface,
    data: StrokeData[],
    renderer: RendererType,
    container: SVGStrokeStyleData
  ) {
    super()
    this.elem = elem
    this.frameId = -1
    this.dataProps = createSizedArray(data.length)
    this.renderer = renderer
    this.k = false
    this.dashStr = ''
    this.dashArray = createTypedArray(
      ArrayType.Float32,
      data.length ? data.length - 1 : 0
    ) as Float32Array
    this.dashoffset = createTypedArray(ArrayType.Float32, 1) as Float32Array
    this.initDynamicPropertyContainer(container)
    let i
    const len = data.length || 0
    let prop
    for (i = 0; i < len; i++) {
      prop = PropertyFactory.getProp(elem, data[i].v, 0, 0, this)
      this.k = prop?.k || this.k
      this.dataProps[i] = { n: data[i].n, p: prop }
    }
    if (!this.k) {
      this.getValue(true)
    }
    this._isAnimated = this.k
  }
  override getValue(forceRender?: boolean) {
    if (
      'globalData' in this.elem &&
      this.elem.globalData.frameId === this.frameId &&
      !forceRender
    ) {
      return
    }
    if ('globalData' in this.elem && this.elem.globalData.frameId) {
      this.frameId = this.elem.globalData.frameId
    }

    this.iterateDynamicProperties()
    this._mdf = this._mdf || !!forceRender
    if (this._mdf) {
      const len = this.dataProps.length
      if (this.renderer === RendererType.SVG) {
        this.dashStr = ''
      }
      for (let i = 0; i < len; i++) {
        if (this.dataProps[i].n === 'o') {
          this.dashoffset[0] = this.dataProps[i].p.v as number
          continue
        }
        if (this.renderer === RendererType.SVG) {
          this.dashStr += ` ${this.dataProps[i].p.v}`
          continue
        }
        this.dashArray[i] = this.dataProps[i].p.v as number
      }
    }
  }
}
