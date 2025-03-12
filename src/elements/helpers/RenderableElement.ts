import type {
  ElementInterfaceIntersect,
  SourceRect,
  SVGRendererConfig,
  Transformer,
} from '@/types'

import BaseElement from '@/elements/BaseElement'
export default class RenderableElement extends BaseElement {
  _isFirstFrame?: boolean
  _mdf?: boolean
  finalTransform?: Transformer
  hidden!: boolean
  hide: any // TODO: is inherited
  isInRange!: boolean
  isTransparent!: boolean
  renderableComponents!: ElementInterfaceIntersect[]
  /**
   * @function
   * Initializes frame related properties.
   *
   * @param {number} num
   * current frame number in Layer's time
   *
   */
  show: any // TODO: is inherited
  addRenderableComponent(component: ElementInterfaceIntersect) {
    if (this.renderableComponents.indexOf(component) === -1) {
      this.renderableComponents.push(component)
    }
  }
  checkLayerLimits(num: number) {
    if (!this.data || !this.globalData) {
      return
    }
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
  }
  checkTransparency() {
    if (Number(this.finalTransform?.mProp.o?.v) <= 0) {
      if (
        !this.isTransparent &&
        (this.globalData?.renderConfig as SVGRendererConfig)?.hideOnTransparent
      ) {
        this.isTransparent = true
        this.hide()
      }
    } else if (this.isTransparent) {
      this.isTransparent = false
      this.show()
    }
  }
  getLayerSize() {
    if (this.data?.ty === 5) {
      return {
        h: Number(this.data.textData?.height),
        w: Number(this.data.textData?.width),
      }
    }
    return { h: Number(this.data?.height), w: Number(this.data?.width) }
  }
  // hide() {
  //   throw new Error('RenderableElement: Method hide not implemented yet')
  // }
  initRenderable() {
    // layer's visibility related to inpoint and outpoint. Rename isVisible to isInRange
    this.isInRange = false
    // layer's display state
    this.hidden = false
    // If layer's transparency equals 0, it can be hidden
    this.isTransparent = false
    // list of animated components
    this.renderableComponents = []
  }
  prepareRenderableFrame(num: number, _?: boolean) {
    this.checkLayerLimits(num)
  }
  removeRenderableComponent(component: ElementInterfaceIntersect) {
    if (this.renderableComponents.indexOf(component) !== -1) {
      this.renderableComponents.splice(
        this.renderableComponents.indexOf(component),
        1
      )
    }
  }
  renderRenderable() {
    const len = this.renderableComponents.length
    for (let i = 0; i < len; i++) {
      this.renderableComponents[i].renderFrame(Number(this._isFirstFrame))
    }
    /* this.maskManager.renderFrame(this.finalTransform.mat);
      this.renderableEffectsManager.renderFrame(this._isFirstFrame); */
  }
  // show() {
  //   throw new Error('RenderableElement: Method show not implemented yet')
  // }
  sourceRectAtTime(): SourceRect | null {
    return {
      height: 100,
      left: 0,
      top: 0,
      width: 100,
    }
  }
}
