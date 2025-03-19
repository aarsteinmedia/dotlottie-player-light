import type { ElementInterfaceIntersect } from '@/types'

export default abstract class DynamicPropertyContainer {
  _isAnimated?: boolean
  _mdf?: boolean
  container?: ElementInterfaceIntersect | null
  dynamicProperties?: DynamicPropertyContainer[]
  propType?: string | false
  addDynamicProperty(prop: DynamicPropertyContainer) {
    if (this.dynamicProperties?.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop)
      this.container?.addDynamicProperty(this)
      this._isAnimated = true
    }
  }
  getValue(_flag?: boolean) {
    throw new Error(
      'DynamicPropertyContainer: Method getValue is not implemented'
    )
  }
  initDynamicPropertyContainer(container: ElementInterfaceIntersect) {
    this.container = container
    this.dynamicProperties = []
    this._mdf = false
    this._isAnimated = false
  }
  iterateDynamicProperties() {
    this._mdf = false
    const { length } = this.dynamicProperties || []
    for (let i = 0; i < length; i++) {
      this.dynamicProperties?.[i].getValue()
      if (this.dynamicProperties?.[i]._mdf) {
        this._mdf = true
      }
    }
  }
}
