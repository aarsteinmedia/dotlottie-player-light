/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type BaseElement from '@/elements/BaseElement'
import type HierarchyElement from '@/elements/helpers/HierarchyElement'

class FrameElement {
  _isFirstFrame!: boolean
  _mdf?: boolean
  dynamicProperties!: any[]

  addDynamicProperty(prop: unknown) {
    if (this.dynamicProperties.indexOf(prop) === -1) {
      this.dynamicProperties.push(prop)
    }
  }
  /**
   * @function
   * Initializes frame related properties.
   *
   */
  initFrame() {
    // set to true when inpoint is rendered
    this._isFirstFrame = false
    // list of animated properties
    this.dynamicProperties = []
    // If layer has been modified in current tick this will be true
    this._mdf = false
  }
  /**
   * @function
   * Calculates all dynamic values
   *
   * @param {number} num
   * current frame number in Layer's time
   * @param {boolean} isVisible
   * if layers is currently in range
   *
   */
  prepareProperties(_: number, isVisible: boolean) {
    let i
    const len = this.dynamicProperties.length
    for (i = 0; i < len; i++) {
      if (
        isVisible ||
        (this._isParent && this.dynamicProperties[i].propType === 'transform')
      ) {
        this.dynamicProperties[i].getValue()
        if (this.globalData && this.dynamicProperties[i]._mdf) {
          this.globalData._mdf = true
          this._mdf = true
        }
      }
    }
  }
}

interface FrameElement extends BaseElement, HierarchyElement {}

export default FrameElement
