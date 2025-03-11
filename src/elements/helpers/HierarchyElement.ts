/**
 * @file
 * Handles AE's layer parenting property.
 *
 */

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'

export default class HierarchyElement extends RenderableDOMElement {
  _isParent!: boolean

  hierarchy!: unknown[]
  /**
   * Searches layer's parenting chain
   */
  checkParenting() {
    if ('parent' in (this.data || {})) {
      this.comp?.buildElementParenting(this as any, this.data?.parent, [])
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
