/**
 * @file
 * Handles AE's layer parenting property.
 *
 */

export default function HierarchyElement() {}

HierarchyElement.prototype = {
  /**
   * @function
   * Searches layer's parenting chain
   *
   */
  checkParenting: function () {
    if (this.data.parent !== undefined) {
      this.comp.buildElementParenting(this, this.data.parent, [])
    }
  },
  /**
   * @function
   * Initializes hierarchy properties
   *
   */
  initHierarchy: function () {
    // element's parent list
    this.hierarchy = []
    // if element is parent of another layer _isParent will be true
    this._isParent = false
    this.checkParenting()
  },
  /**
   * @function
   * Sets layer as parent.
   *
   */
  setAsParent: function () {
    this._isParent = true
  },
  /**
   * @function
   * Sets layer's hierarchy.
   * @param {array} hierarchy
   * layer's parent list
   *
   */
  setHierarchy: function (hierarchy: unknown[]) {
    this.hierarchy = hierarchy
  },
}
