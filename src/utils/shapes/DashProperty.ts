import { ArrayType, RendererType } from '@/enums'
import { extendPrototype } from '@/utils/functionExtensions'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

/**
 *
 */
export default function DashProperty(
  this: any,
  elem: any,
  data: any,
  renderer: any,
  container: any
) {
  this.elem = elem
  this.frameId = -1
  this.dataProps = createSizedArray(data.length)
  this.renderer = renderer
  this.k = false
  this.dashStr = ''
  this.dashArray = createTypedArray(
    ArrayType.Float32,
    data.length ? data.length - 1 : 0
  )
  this.dashoffset = createTypedArray(ArrayType.Float32, 1)
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

DashProperty.prototype.getValue = function (forceRender?: boolean) {
  if (this.elem.globalData.frameId === this.frameId && !forceRender) {
    return
  }
  this.frameId = this.elem.globalData.frameId
  this.iterateDynamicProperties()
  this._mdf = this._mdf || forceRender
  if (this._mdf) {
    let i = 0
    const len = this.dataProps.length
    if (this.renderer === RendererType.SVG) {
      this.dashStr = ''
    }
    for (i = 0; i < len; i++) {
      if (this.dataProps[i].n === 'o') {
        this.dashoffset[0] = this.dataProps[i].p.v
        continue
      }
      if (this.renderer === RendererType.SVG) {
        this.dashStr += ` ${this.dataProps[i].p.v}`
      } else {
        this.dashArray[i] = this.dataProps[i].p.v
      }
    }
  }
}
extendPrototype([DynamicPropertyContainer], DashProperty)
