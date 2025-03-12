import type { ElementInterfaceIntersect, Shape } from '@/types'
import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import type { ShapeModifierInterface } from '@/utils/shapes/ShapeModifiers'
import type ShapePath from '@/utils/shapes/ShapePath'

import RenderableElement from '@/elements/helpers/RenderableElement'
// import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import { ProcessedElement, type SVGShapeData } from '@/elements/helpers/shapes'

export default class ShapeElement extends RenderableElement {
  _length?: number

  processedElements?: ProcessedElement[]

  shapeModifiers?: ShapeModifierInterface[]

  shapes?: SVGShapeData[] | ShapePath[]

  override addDynamicProperty(_prop: DynamicPropertyContainer) {
    throw new Error(
      'ShapeElement: Method addDynamicProperty is not yet implemented'
    )
  }

  addProcessedElement(elem: ElementInterfaceIntersect, pos: number) {
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

  override prepareFrame(num: number) {
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
  }

  prepareProperties(_val: number, _flag?: boolean) {
    throw new Error(
      'ShapeElement: Method prepareProperties not yet implemented'
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
