import type { CompInterface, Shape } from '@/types'
import type { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers'

import { ProcessedElement, type SVGShapeData } from '@/elements/helpers/shapes'

class ShapeElement {
  _isFirstFrame?: boolean
  isInRange?: boolean
  prepareProperties!: (val: number, isInRange?: boolean) => void
  prepareRenderableFrame!: (val: number) => void

  processedElements!: ProcessedElement[]

  shapeModifiers?: ShapeModifierInterface[]

  shapes?: SVGShapeData[]

  addProcessedElement(elem: CompInterface, pos: number) {
    const elements = this.processedElements
    let i = elements.length
    while (i) {
      i--
      if (elements[i].elem === elem) {
        elements[i].pos = pos
        return
      }
    }
    elements.push(new ProcessedElement(elem, pos))
  }

  addShapeToModifiers(data: SVGShapeData) {
    const { length } = this.shapeModifiers
    for (let i = 0; i < length; i++) {
      this.shapeModifiers[i].addShape(data)
    }
  }

  isShapeInAnimatedModifiers(data: Shape) {
    let i = 0
    const len: number = this.shapeModifiers.length
    while (i < len) {
      if (this.shapeModifiers[i].isAnimatedWithShape(data)) {
        return true
      }
      i++
    }
    return false
  }

  prepareFrame(num: number) {
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
  }
  renderModifiers() {
    if (!this.shapeModifiers?.length) {
      return
    }
    const { length } = this.shapes || []
    for (let i = 0; i < length; i++) {
      this.shapes?.[i].sh.reset()
    }

    const { length: len } = this.shapeModifiers || []
    let shouldBreakProcess
    for (let i = len - 1; i >= 0; i--) {
      shouldBreakProcess = this.shapeModifiers?.[i].processShapes(
        this._isFirstFrame
      )
      // workaround to fix cases where a repeater resets the shape so the following processes get called twice
      // TODO: find a better solution for this
      if (shouldBreakProcess) {
        break
      }
    }
  }
  searchProcessedElement(elem: any) {
    const elements = this.processedElements
    let i = 0
    const len = elements.length
    while (i < len) {
      if (elements[i].elem === elem) {
        return elements[i].pos
      }
      i++
    }
    return 0
  }
}

export default ShapeElement
