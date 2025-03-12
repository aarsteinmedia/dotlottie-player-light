import type AnimationItem from '@/animation/AnimationItem'
import type SVGCompElement from '@/elements/svg/SVGCompElement'
import type {
  AnimationData,
  ElementInterfaceIntersect,
  LottieLayer,
} from '@/types'
import type ProjectInterface from '@/utils/helpers/ProjectInterface'

import AudioElement from '@/elements/AudioElement'
import BaseElement from '@/elements/BaseElement'
import FootageElement from '@/elements/FootageElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import FontManager from '@/utils/FontManager'
import SlotManager from '@/utils/SlotManager'

export default abstract class BaseRenderer extends BaseElement {
  animationItem?: AnimationItem
  completeLayers?: boolean
  elements?: ElementInterfaceIntersect[]

  layers?: LottieLayer[]

  pendingElements?: ElementInterfaceIntersect[]

  addPendingElement(element: ElementInterfaceIntersect) {
    this.pendingElements?.push(element)
  }

  buildAllItems() {
    const len = this.layers?.length || 0
    for (let i = 0; i < len; i++) {
      this.buildItem(i)
    }
    this.checkPendingElements()
  }
  buildElementParenting(
    element: ElementInterfaceIntersect,
    parentName?: number,
    hierarchy: ElementInterfaceIntersect[] = []
  ) {
    const elements = this.elements
    const layers = this.layers
    let i = 0
    const len = layers?.length || 0
    while (i < len) {
      if (layers?.[i].ind === Number(parentName)) {
        if (!elements?.[i] || (elements as any)[i] === true) {
          this.buildItem(i)
          this.addPendingElement(element)
        } else {
          hierarchy.push(elements[i])
          ;(elements[i] as HierarchyElement).setAsParent?.()
          if (layers[i].parent === undefined) {
            element.setHierarchy(hierarchy)
          } else {
            this.buildElementParenting(element, layers[i].parent, hierarchy)
          }
        }
      }
      i++
    }
  }

  buildItem(_val: number) {
    throw new Error('BaseRenderer: Method buildItem not yet implemented') // TODO:
  }

  checkLayers(val?: number) {
    this.completeLayers = true
    const { length } = this.layers || []
    for (let i = length - 1; i >= 0; i--) {
      if (!this.elements?.[i]) {
        if (
          this.layers![i].ip - this.layers![i].st <=
            Number(val) - this.layers![i].st &&
          this.layers![i].op - this.layers![i].st >
            Number(val) - this.layers![i].st
        ) {
          this.buildItem(i)
        }
      }
      this.completeLayers = this.elements?.[i] ? this.completeLayers : false
    }
    this.checkPendingElements()
  }
  checkPendingElements() {
    throw new Error(
      'BaseRenderer: Method checkPendingElements not yet implemented'
    )
  }
  createAudio(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error("Can't access Global Data")
    }
    return new AudioElement(data, this.globalData, this as any)
  }
  createCamera(_data: LottieLayer) {
    throw new Error("You're using a 3d camera. Try the html renderer.")
  }

  createComp(_data: LottieLayer): SVGCompElement {
    throw new Error('BaseRenderer: Method createComp not yet implemented')
  }

  createFootage(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error("Can't access Global Data")
    }
    return new FootageElement(data, this.globalData, this as any)
  }
  createImage(_layer: LottieLayer) {
    throw new Error('BaseRenderer: Method createImage not yet implemented')
  }
  createItem(layer: LottieLayer) {
    switch (layer.ty) {
      case 2:
        return this.createImage(layer)
      case 0:
        return this.createComp(layer)
      case 1:
        return this.createSolid(layer)
      case 3:
        return this.createNull(layer)
      case 4:
        return this.createShape(layer)
      case 5:
        return this.createText(layer)
      case 6:
        return this.createAudio(layer)
      case 13:
        return this.createCamera(layer)
      case 15:
        return this.createFootage(layer)
      default:
        return this.createNull(layer)
    }
  }
  createNull(_layer: LottieLayer) {
    throw new Error('BaseRenderer: Method createNull not yet implemented')
  }
  createShape(_layer: LottieLayer) {
    throw new Error('BaseRenderer: Method createShape not yet implemented')
  }
  createSolid(_layer: LottieLayer) {
    throw new Error('BaseRenderer: Method createSolid not yet implemented')
  }
  createText(_layer: LottieLayer) {
    throw new Error('BaseRenderer: Method createText not yet implemented')
  }
  getElementById(ind: number) {
    const { length } = this.elements || []
    for (let i = 0; i < length; i++) {
      if (this.elements?.[i].data?.ind === ind) {
        return this.elements[i]
      }
    }
    return null
  }

  getElementByPath(path: unknown[]): ElementInterfaceIntersect | undefined {
    const pathValue = path.shift()
    let element
    if (typeof pathValue === 'number') {
      element = this.elements?.[pathValue]
    } else {
      const { length } = this.elements || []
      for (let i = 0; i < length; i++) {
        if (this.elements?.[i].data?.nm === pathValue) {
          element = this.elements?.[i]
          break
        }
      }
    }
    if (path.length === 0) {
      return element
    }
    return (element as BaseRenderer)?.getElementByPath?.(path)
  }

  includeLayers(newLayers: LottieLayer[]) {
    this.completeLayers = false
    const len = newLayers.length
    let j
    const jLen = this.layers?.length || 0
    for (let i = 0; i < len; i++) {
      j = 0
      while (j < jLen) {
        if (this.layers![j].id === newLayers[i].id) {
          this.layers![j] = newLayers[i]
          break
        }
        j++
      }
    }
  }

  // initExpressions() {
  //   throw new Error('Method not yet implemented')
  // }

  initItems() {
    if (!this.globalData?.progressiveLoad) {
      this.buildAllItems()
    }
  }

  searchExtraCompositions(assets: LottieLayer[]) {
    const { length } = assets
    for (let i = 0; i < length; i++) {
      if (assets[i].xt) {
        const comp = this.createComp(assets[i])
        comp.initExpressions()
        this.globalData?.projectInterface?.registerComposition(comp)
      }
    }
  }

  setProjectInterface(pInterface: typeof ProjectInterface | null) {
    if (!this.globalData) {
      return
    }
    this.globalData.projectInterface = pInterface
  }

  setupGlobalData(animData: AnimationData, fontsContainer: SVGDefsElement) {
    if (!this.globalData) {
      return
    }
    this.globalData.fontManager = new FontManager()
    this.globalData.slotManager = new SlotManager(animData as any)
    this.globalData.fontManager.addChars(animData.chars)
    this.globalData.fontManager.addFonts(animData.fonts, fontsContainer)
    this.globalData.getAssetData = this.animationItem?.getAssetData.bind(
      this.animationItem
    )
    this.globalData.getAssetsPath = this.animationItem?.getAssetsPath.bind(
      this.animationItem
    )
    this.globalData.imageLoader = this.animationItem?.imagePreloader
    this.globalData.audioController = this.animationItem?.audioController
    this.globalData.frameId = 0
    this.globalData.frameRate = animData.fr || 60
    this.globalData.nm = animData.nm
    this.globalData.compSize = {
      h: Number(animData.h),
      w: Number(animData.w),
    }
  }
}
