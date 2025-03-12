import type {
  ElementInterfaceIntersect,
  SourceRect,
  SVGRendererConfig,
} from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
export default class RenderableElement extends FrameElement {
  hidden?: boolean
  isInRange?: boolean
  isTransparent?: boolean
  private renderableComponents: ElementInterfaceIntersect[] = []
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
  hide() {
    // console.log('HIDE', this);
    if (!this.hidden && (!this.isInRange || this.isTransparent)) {
      const elem = this.baseElement || this.layerElement
      if (elem) {
        elem.style.display = 'none'
      }

      this.hidden = true
    }
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

  show() {
    // console.log('SHOW', this);
    if (this.isInRange && !this.isTransparent) {
      if (!this.data?.hd) {
        const elem = this.baseElement || this.layerElement
        if (elem) {
          elem.style.display = 'block'
        }
      }
      this.hidden = false
      this._isFirstFrame = true
    }
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
