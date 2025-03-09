// import type { SVGStrokeStyleData } from '@/elements/helpers/shapes'
import type { CompInterface, ItemData } from '@/types'

export default class DynamicPropertyContainer {
  _isAnimated: boolean
  _mdf: boolean
  container: CompInterface | null
  dynamicProperties: ItemData[]

  constructor() {
    this.container = null
    this.dynamicProperties = []
    this._mdf = false
    this._isAnimated = false
  }

  addDynamicProperty(prop: ItemData): void {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop)
      this.container?.addDynamicProperty(this) // TODO:
      this._isAnimated = true
    }
  }

  initDynamicPropertyContainer(container: CompInterface): void {
    this.container = container
    this.dynamicProperties = []
    this._mdf = false
    this._isAnimated = false
  }

  iterateDynamicProperties(): void {
    this._mdf = false
    const { length } = this.dynamicProperties
    for (let i = 0; i < length; i++) {
      this.dynamicProperties[i].getValue()
      if (this.dynamicProperties[i]._mdf) {
        this._mdf = true
      }
    }
  }
}
