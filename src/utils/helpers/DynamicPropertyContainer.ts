import type { ElementInterfaceUnion } from '@/types'

export default class DynamicPropertyContainer {
  _isAnimated: boolean
  _mdf: boolean
  container: ElementInterfaceUnion | null
  dynamicProperties: DynamicPropertyContainer[]
  propType?: false | string
  constructor() {
    this.container = null
    this.dynamicProperties = []
    this._mdf = false
    this._isAnimated = false
  }

  addDynamicProperty(prop: DynamicPropertyContainer): void {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop)
      if (this.container && 'addDynamicProperty' in this.container) {
        this.container.addDynamicProperty?.(this)
      }

      this._isAnimated = true
    }
  }

  getValue(_flag?: boolean) {}

  initDynamicPropertyContainer(container: ElementInterfaceUnion): void {
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
