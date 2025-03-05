export default function RenderableElement() {}

RenderableElement.prototype = {
  addRenderableComponent: function (component: any) {
    if (this.renderableComponents.indexOf(component) === -1) {
      this.renderableComponents.push(component)
    }
  },
  /**
   * @function
   * Initializes frame related properties.
   *
   * @param {number} num
   * current frame number in Layer's time
   *
   */
  checkLayerLimits: function (num: number) {
    if (
      this.data.ip - this.data.st <= num &&
      this.data.op - this.data.st > num
    ) {
      if (this.isInRange !== true) {
        this.globalData._mdf = true
        this._mdf = true
        this.isInRange = true
        this.show()
      }
    } else if (this.isInRange !== false) {
      this.globalData._mdf = true
      this.isInRange = false
      this.hide()
    }
  },
  checkTransparency: function () {
    if (this.finalTransform.mProp.o.v <= 0) {
      if (
        !this.isTransparent &&
        this.globalData.renderConfig.hideOnTransparent
      ) {
        this.isTransparent = true
        this.hide()
      }
    } else if (this.isTransparent) {
      this.isTransparent = false
      this.show()
    }
  },
  getLayerSize: function () {
    if (this.data.ty === 5) {
      return { h: this.data.textData.height, w: this.data.textData.width }
    }
    return { h: this.data.height, w: this.data.width }
  },
  initRenderable: function () {
    // layer's visibility related to inpoint and outpoint. Rename isVisible to isInRange
    this.isInRange = false
    // layer's display state
    this.hidden = false
    // If layer's transparency equals 0, it can be hidden
    this.isTransparent = false
    // list of animated components
    this.renderableComponents = []
  },
  prepareRenderableFrame: function (num: number) {
    this.checkLayerLimits(num)
  },
  removeRenderableComponent: function (component: any) {
    if (this.renderableComponents.indexOf(component) !== -1) {
      this.renderableComponents.splice(
        this.renderableComponents.indexOf(component),
        1
      )
    }
  },
  renderRenderable: function () {
    const len = this.renderableComponents.length
    for (let i = 0; i < len; i++) {
      this.renderableComponents[i].renderFrame(this._isFirstFrame)
    }
    /* this.maskManager.renderFrame(this.finalTransform.mat);
        this.renderableEffectsManager.renderFrame(this._isFirstFrame); */
  },
  sourceRectAtTime: function () {
    return {
      height: 100,
      left: 0,
      top: 0,
      width: 100,
    }
  },
}
