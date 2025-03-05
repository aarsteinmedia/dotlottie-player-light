export default function DynamicPropertyContainer() {}
DynamicPropertyContainer.prototype = {
  addDynamicProperty: function (prop: unknown) {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop)
      this.container.addDynamicProperty(this)
      this._isAnimated = true
    }
  },
  initDynamicPropertyContainer: function (container: unknown) {
    this.container = container
    this.dynamicProperties = []
    this._mdf = false
    this._isAnimated = false
  },
  iterateDynamicProperties: function () {
    this._mdf = false
    let i
    const len = this.dynamicProperties.length
    for (i = 0; i < len; i++) {
      this.dynamicProperties[i].getValue()
      if (this.dynamicProperties[i]._mdf) {
        this._mdf = true
      }
    }
  },
}
