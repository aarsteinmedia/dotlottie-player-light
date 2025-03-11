/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type BaseElement from '@/elements/BaseElement'
import type RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import type { ElementInterface, SVGRendererConfig, Transformer } from '@/types'

class RenderableElement {
  finalTransform?: Transformer
  hidden?: boolean
  isInRange?: boolean
  isTransparent?: boolean
  renderableComponents!: ElementInterface[]
  addRenderableComponent(component: ElementInterface) {
    if (this.renderableComponents.indexOf(component) === -1) {
      this.renderableComponents.push(component)
    }
  }
  /**
   * @function
   * Initializes frame related properties.
   *
   * @param {number} num
   * current frame number in Layer's time
   *
   */
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
  removeRenderableComponent(component: any) {
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
  sourceRectAtTime() {
    return {
      height: 100,
      left: 0,
      top: 0,
      width: 100,
    }
  }
}

interface RenderableElement extends BaseElement, RenderableDOMElement {}

export default RenderableElement
