import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

// import BaseElement from '@/elements/BaseElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'

export default abstract class FrameElement extends HierarchyElement {
  /**
   * @function
   * Initializes frame related properties.
   *
   */
  _mdf?: boolean
  dynamicProperties?: DynamicPropertyContainer[]
  addDynamicProperty(prop: DynamicPropertyContainer) {
    if (this.dynamicProperties?.indexOf(prop) === -1) {
      this.dynamicProperties?.push(prop)
    }
  }
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
  prepareProperties(_: number, isVisible?: boolean) {
    const { length } = this.dynamicProperties || []
    for (let i = 0; i < length; i++) {
      if (
        isVisible ||
        (this._isParent && this.dynamicProperties?.[i].propType === 'transform')
      ) {
        this.dynamicProperties?.[i].getValue()
        if (this.globalData && this.dynamicProperties?.[i]._mdf) {
          this.globalData._mdf = true
          this._mdf = true
        }
      }
    }
  }
}
