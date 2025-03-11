import type { ElementInterfaceIntersect, Shape } from '@/types'
import type { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers'

import { ProcessedElement, SVGShapeData } from '@/elements/helpers/shapes'
import ShapePath from '@/utils/shapes/ShapePath'

export default class ShapeElement {
  _isFirstFrame?: boolean
  _length?: number
  isInRange?: boolean

  processedElements?: ProcessedElement[]

  shapeModifiers?: ShapeModifierInterface[]

  shapes?: SVGShapeData[] | ShapePath[]

  addProcessedElement(elem: any, pos: number) {
    const elements = this.processedElements
    let i = elements?.length
    while (i) {
      i--
      if (elements?.[i].elem === elem) {
        elements![i].pos = pos
        return
      }
    }
    elements?.push(new ProcessedElement(elem, pos))
  }

  addShapeToModifiers(data: SVGShapeData) {
    const { length } = this.shapeModifiers || []
    for (let i = 0; i < length; i++) {
      this.shapeModifiers?.[i].addShape?.(data)
    }
  }

  isShapeInAnimatedModifiers(data: Shape) {
    let i = 0
    const { length } = this.shapeModifiers || []
    while (i < length) {
      if (this.shapeModifiers?.[i].isAnimatedWithShape(data)) {
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

  prepareProperties(_val: number, _flag?: boolean) {
    throw new Error(
      'ShapeElement: Method prepareProperties not yet implemented'
    )
  }

  prepareRenderableFrame(_val: number) {
    throw new Error(
      'ShapeElement: Method prepareRenderableFrame not yet implemented'
    )
  }
  renderModifiers() {
    if (!this.shapeModifiers?.length) {
      return
    }
    const { length } = this.shapes || []
    for (let i = 0; i < length; i++) {
      ;(this.shapes?.[i] as SVGShapeData).sh.reset()
    }

    const { length: len } = this.shapeModifiers || []
    let shouldBreakProcess
    for (let i = len - 1; i >= 0; i--) {
      shouldBreakProcess = this.shapeModifiers?.[i].processShapes(
        !!this._isFirstFrame
      )
      // workaround to fix cases where a repeater resets the shape so the following processes get called twice
      // TODO: find a better solution for this
      if (shouldBreakProcess) {
        break
      }
    }
  }
  searchProcessedElement(elem: ElementInterfaceIntersect) {
    const elements = this.processedElements
    let i = 0
    const { length } = elements || []
    while (i < length) {
      if (elements?.[i].elem === elem) {
        return elements[i].pos
      }
      i++
    }
    return 0
  }
}
