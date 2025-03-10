/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/**
 * @file
 * Handles AE's layer parenting property.
 *
 */

import BaseElement from '@/elements/BaseElement'

class HierarchyElement {
  _isParent!: boolean
  hierarchy!: unknown[]
  /**
   * Searches layer's parenting chain
   */
  checkParenting() {
    if (this.data?.parent !== undefined) {
      this.comp.buildElementParenting(this, this.data.parent, [])
    }
  }
  /**
   * Initializes hierarchy properties
   */
  initHierarchy() {
    // element's parent list
    this.hierarchy = []
    // if element is parent of another layer _isParent will be true
    this._isParent = false
    this.checkParenting()
  }
  /**
   * Sets layer as parent.
   */
  setAsParent() {
    this._isParent = true
  }
  /**
   * Sets layer's hierarchy.
   * @param {array} hierarchy
   * layer's parent list
   */
  setHierarchy(hierarchy: unknown[]) {
    this.hierarchy = hierarchy
  }
}

interface HierarchyElement extends BaseElement {}

export default HierarchyElement
