/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type {
  AnimatedContent,
  GlobalData,
  ItemsData,
  LottieLayer,
  Shape,
  ShapeDataInterface,
} from '@/types'

import BaseElement from '@/elements/BaseElement'
import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import {
  ProcessedElement,
  ShapeGroupData,
  SVGFillStyleData,
  SVGGradientFillStyleData,
  SVGGradientStrokeStyleData,
  SVGNoStyleData,
  SVGShapeData,
  SVGStrokeStyleData,
  SVGStyleData,
  SVGTransformData,
} from '@/elements/helpers/shapes'
import TransformElement from '@/elements/helpers/TransformElement'
import ShapeElement from '@/elements/ShapeElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import { lineCapEnum, lineJoinEnum } from '@/enums'
import SVGElementsRenderer from '@/renderers/SVGElementsRenderer'
import { getBlendMode } from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'
import { getLocationHref } from '@/utils/getterSetter'
// import Matrix from '@/utils/Matrix'
import ShapeModifiers from '@/utils/shapes/ShapeModifiers'
import ShapePropertyFactory from '@/utils/shapes/ShapeProperty'
import TransformProperty from '@/utils/TransformProperty'
class SVGShapeElement {
  // identityMatrix = new Matrix()

  animatedContents: AnimatedContent[]
  itemsData: ItemsData[]
  prevViewData: ItemsData['prevViewData']
  processedElements: ProcessedElement[]
  shapeModifiers: any[]
  shapes: SVGShapeData[]
  shapesData: Shape[]
  stylesList: SVGStyleData[]
  constructor(data: LottieLayer, globalData: GlobalData, comp: any) {
    // List of drawable elements
    this.shapes = []
    // Full shape data
    this.shapesData = data.shapes!
    // List of styles that will be applied to shapes
    this.stylesList = []
    // List of modifiers that will be applied to shapes
    this.shapeModifiers = []
    // List of items in shape tree
    this.itemsData = []
    // List of items in previous shape tree
    this.processedElements = []
    // List of animated components
    this.animatedContents = []
    this.initElement(data, globalData, comp)
    // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
    // List of elements that have been created
    this.prevViewData = []
    // Moving any property that doesn't get too much access after initialization because of v8 way of handling more than 10 properties.
  }
  addToAnimatedContents(data: any, element: any) {
    let i = 0
    const len = this.animatedContents.length
    while (i < len) {
      if (this.animatedContents[i].element === element) {
        return
      }
      i++
    }
    this.animatedContents.push({
      data,
      element,
      fn: SVGElementsRenderer.createRenderFunction(data),
    })
  }
  buildExpressionInterface() {}
  createContent() {
    this.searchShapes(
      this.shapesData,
      this.itemsData,
      this.prevViewData,
      this.layerElement,
      0,
      [],
      true
    )
    this.filterUniqueShapes()
  }
  createGroupElement(data: Shape) {
    const elementData = new (ShapeGroupData as any)()
    if (data.ln) {
      elementData.gr.setAttribute('id', data.ln)
    }
    if (data.cl) {
      elementData.gr.setAttribute('class', data.cl)
    }
    if (data.bm) {
      elementData.gr.style['mix-blend-mode'] = getBlendMode(data.bm)
    }
    return elementData
  }
  createShapeElement(data: Shape, ownTransformers: any, level: number) {
    let ty = 4
    if (data.ty === 'rc') {
      ty = 5
    } else if (data.ty === 'el') {
      ty = 6
    } else if (data.ty === 'sr') {
      ty = 7
    }
    const shapeProperty = ShapePropertyFactory.getShapeProp(
      this,
      data,
      ty,
      this
    )
    const elementData = new SVGShapeData(ownTransformers, level, shapeProperty)
    this.shapes.push(elementData)
    this.addShapeToModifiers(elementData)
    this.addToAnimatedContents(data, elementData)
    return elementData
  }
  createStyleElement(data: SVGShapeData, level: number) {
    // TODO: prevent drawing of hidden styles
    let elementData
    const styleOb = new SVGStyleData(data, level)

    const pathElement = styleOb.pElem
    if (data.ty === 'st') {
      elementData = new SVGStrokeStyleData(this, data, styleOb)
    } else if (data.ty === 'fl') {
      elementData = new SVGFillStyleData(this, data, styleOb)
    } else if (data.ty === 'gf' || data.ty === 'gs') {
      const GradientConstructor =
        data.ty === 'gf' ? SVGGradientFillStyleData : SVGGradientStrokeStyleData
      elementData = new GradientConstructor(this, data, styleOb)
      this.globalData.defs.appendChild(elementData.gf)
      if (elementData.maskId) {
        this.globalData.defs.appendChild(elementData.ms)
        this.globalData.defs.appendChild(elementData.of)
        pathElement.setAttribute(
          'mask',
          `url(${getLocationHref()}#${elementData.maskId})`
        )
      }
    } else if (data.ty === 'no') {
      elementData = new SVGNoStyleData(this, data, styleOb)
    }

    if (data.ty === 'st' || data.ty === 'gs') {
      pathElement.setAttribute('stroke-linecap', lineCapEnum[data.lc || 2])
      pathElement.setAttribute('stroke-linejoin', lineJoinEnum[data.lj || 2])
      pathElement.setAttribute('fill-opacity', '0')
      if (data.lj === 1) {
        pathElement.setAttribute('stroke-miterlimit', data.ml)
      }
    }

    if (data.r === 2) {
      pathElement.setAttribute('fill-rule', 'evenodd')
    }

    if (data.ln) {
      pathElement.setAttribute('id', data.ln)
    }
    if (data.cl) {
      pathElement.setAttribute('class', data.cl)
    }
    if (data.bm) {
      pathElement.style.mixBlendMode = getBlendMode(data.bm)
    }
    this.stylesList.push(styleOb)
    this.addToAnimatedContents(data, elementData)
    return elementData
  }
  createTransformElement(data: Shape, container: SVGGElement) {
    const transformProperty = new TransformProperty(this, data, this)
    const elementData = new SVGTransformData(
      transformProperty,
      transformProperty.o,
      container
    )
    this.addToAnimatedContents(data, elementData)
    return elementData
  }
  destroy() {
    this.destroyBaseElement()
    this.shapesData = null as any
    this.itemsData = null as any
  }
  filterUniqueShapes() {
    const len = this.shapes.length
    const jLen = this.stylesList.length
    let style
    const tempShapes = []
    let areAnimated = false
    for (let j = 0; j < jLen; j++) {
      style = this.stylesList[j]
      areAnimated = false
      tempShapes.length = 0
      for (let i = 0; i < len; i++) {
        if (this.shapes[i].styles.indexOf(style) !== -1) {
          tempShapes.push(this.shapes[i])
          areAnimated = this.shapes[i]._isAnimated || areAnimated
        }
      }
      if (tempShapes.length > 1 && areAnimated) {
        this.setShapesAsAnimated(tempShapes)
      }
    }
  }
  initSecondaryElement() {}
  reloadShapes() {
    this._isFirstFrame = true
    const { length } = this.itemsData
    for (let i = 0; i < length; i++) {
      this.prevViewData[i] = this.itemsData[i]
    }
    this.searchShapes(
      this.shapesData,
      this.itemsData,
      this.prevViewData,
      this.layerElement,
      0,
      [],
      true
    )
    this.filterUniqueShapes()
    const { length: dLength } = this.dynamicProperties
    for (let i = 0; i < dLength; i++) {
      this.dynamicProperties[i].getValue()
    }
    this.renderModifiers()
  }
  renderInnerContent = function () {
    this.renderModifiers()
    const { length } = this.stylesList
    for (let i = 0; i < length; i++) {
      this.stylesList[i].reset()
    }
    this.renderShape()
    for (let i = 0; i < length; i++) {
      if (!this.stylesList[i]._mdf && !this._isFirstFrame) {
        continue
      }
      if (this.stylesList[i].msElem) {
        this.stylesList[i].msElem.setAttribute('d', this.stylesList[i].d)
        // Adding M0 0 fixes same mask bug on all browsers
        this.stylesList[i].d = `M0 0${this.stylesList[i].d}`
      }
      this.stylesList[i].pElem.setAttribute('d', this.stylesList[i].d || 'M0 0')
    }
  }
  renderShape() {
    const { length } = this.animatedContents
    for (let i = 0; i < length; i++) {
      if (
        (this._isFirstFrame || this.animatedContents[i].element._isAnimated) &&
        this.animatedContents[i].data !== true
      ) {
        this.animatedContents[i].fn(
          this.animatedContents[i].data,
          this.animatedContents[i].element,
          this._isFirstFrame
        )
      }
    }
  }
  searchShapes(
    arr: Shape[],
    itemsData: any,
    prevViewData: any,
    container: SVGGElement,
    level: number,
    transformers: any,
    renderFromProps: boolean
  ) {
    let render = renderFromProps
    const ownTransformers: any[] = [].concat(transformers)
    const ownStyles = []
    const ownModifiers = []
    let currentTransform
    let modifier
    let processedPos
    for (let i = arr.length - 1; i >= 0; i--) {
      processedPos = this.searchProcessedElement(arr[i])
      if (processedPos) {
        itemsData[i] = prevViewData[processedPos - 1]
      } else {
        arr[i]._render = render
      }
      if (
        arr[i].ty === 'fl' ||
        arr[i].ty === 'st' ||
        arr[i].ty === 'gf' ||
        arr[i].ty === 'gs' ||
        arr[i].ty === 'no'
      ) {
        if (processedPos) {
          itemsData[i].style.closed = false
        } else {
          itemsData[i] = this.createStyleElement(arr[i], level)
        }
        if (arr[i]._render) {
          if (itemsData[i].style.pElem.parentNode !== container) {
            container.appendChild(itemsData[i].style.pElem)
          }
        }
        ownStyles.push(itemsData[i].style)
      } else if (arr[i].ty === 'gr') {
        if (processedPos) {
          const { length } = itemsData[i].it
          for (let j = 0; j < length; j++) {
            itemsData[i].prevViewData[j] = itemsData[i].it[j]
          }
        } else {
          itemsData[i] = this.createGroupElement(arr[i])
        }
        this.searchShapes(
          arr[i].it,
          itemsData[i].it,
          itemsData[i].prevViewData,
          itemsData[i].gr,
          level + 1,
          ownTransformers,
          render
        )
        if (arr[i]._render) {
          if (itemsData[i].gr.parentNode !== container) {
            container.appendChild(itemsData[i].gr)
          }
        }
      } else if (arr[i].ty === 'tr') {
        if (!processedPos) {
          itemsData[i] = this.createTransformElement(arr[i], container)
        }
        currentTransform = itemsData[i].transform
        ownTransformers.push(currentTransform)
      } else if (
        arr[i].ty === 'sh' ||
        arr[i].ty === 'rc' ||
        arr[i].ty === 'el' ||
        arr[i].ty === 'sr'
      ) {
        if (!processedPos) {
          itemsData[i] = this.createShapeElement(arr[i], ownTransformers, level)
        }
        this.setElementStyles(itemsData[i])
      } else if (
        arr[i].ty === 'tm' ||
        arr[i].ty === 'rd' ||
        arr[i].ty === 'ms' ||
        arr[i].ty === 'pb' ||
        arr[i].ty === 'zz' ||
        arr[i].ty === 'op'
      ) {
        if (processedPos) {
          modifier = itemsData[i]
          modifier.closed = false
        } else {
          modifier = ShapeModifiers.getModifier(arr[i].ty)
          modifier.init(this, arr[i])
          itemsData[i] = modifier
          this.shapeModifiers.push(modifier)
        }
        ownModifiers.push(modifier)
      } else if (arr[i].ty === 'rp') {
        if (processedPos) {
          modifier = itemsData[i]
          modifier.closed = true
        } else {
          modifier = ShapeModifiers.getModifier(arr[i].ty)
          itemsData[i] = modifier
          modifier.init(this, arr, i, itemsData)
          this.shapeModifiers.push(modifier)
          render = false
        }
        ownModifiers.push(modifier)
      }
      this.addProcessedElement(arr[i], i + 1)
    }
    const { length: sLen } = ownStyles
    for (let i = 0; i < sLen; i++) {
      ownStyles[i].closed = true
    }
    const { length: mLen } = ownModifiers
    for (let i = 0; i < mLen; i++) {
      ownModifiers[i].closed = true
    }
  }
  setElementStyles(elementData: any) {
    const { length } = this.stylesList
    for (let i = 0; i < length; i++) {
      if (!this.stylesList[i].closed) {
        elementData.styles.push(this.stylesList[i])
      }
    }
  }
  setShapesAsAnimated(shapes: ShapeDataInterface[]) {
    const len = shapes.length
    for (let i = 0; i < len; i++) {
      shapes[i].setAsAnimated()
    }
  }
}

extendPrototype(
  [
    BaseElement,
    TransformElement,
    SVGBaseElement,
    ShapeElement,
    HierarchyElement,
    FrameElement,
    RenderableDOMElement,
  ],
  SVGShapeElement
)

interface SVGShapeElement
  extends BaseElement,
    SVGBaseElement,
    ShapeElement,
    HierarchyElement,
    FrameElement,
    RenderableDOMElement {}

export default SVGShapeElement
