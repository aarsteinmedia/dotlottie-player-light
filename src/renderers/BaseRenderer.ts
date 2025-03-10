/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type AnimationItem from '@/animation/AnimationItem'
import type BaseElement from '@/elements/BaseElement'
import type { CompInterface, ElementInterface, LottieLayer } from '@/types'
import type ProjectInterface from '@/utils/helpers/ProjectInterface'

import AudioElement from '@/elements/AudioElement'
import FootageElement from '@/elements/FootageElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import FontManager from '@/utils/FontManager'
import SlotManager from '@/utils/SlotManager'

class BaseRenderer {
  animationItem!: AnimationItem
  buildItem!: (val: number) => void
  checkPendingElements!: () => void

  completeLayers?: boolean
  createComp!: (data: LottieLayer) => CompInterface

  createImage!: (data: LottieLayer) => void

  createNull!: (data: LottieLayer) => void

  createShape!: (data: LottieLayer) => void

  createSolid!: (data: LottieLayer) => void

  createText!: (data: LottieLayer) => void

  elements!: ElementInterface[]

  layers!: LottieLayer[]
  pendingElements!: ElementInterface[]

  addPendingElement(element: ElementInterface) {
    this.pendingElements.push(element)
  }

  buildAllItems() {
    const len = this.layers?.length || 0
    for (let i = 0; i < len; i++) {
      this.buildItem(i)
    }
    this.checkPendingElements()
  }
  buildElementParenting(
    element: ElementInterface,
    parentName?: number,
    hierarchy: ElementInterface[] = []
  ) {
    const elements = this.elements
    const layers = this.layers
    let i = 0
    const len = layers?.length || 0
    while (i < len) {
      if (layers?.[i].ind === Number(parentName)) {
        if (!elements[i] || (elements as any)[i] === true) {
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
  checkLayers(num: number) {
    this.completeLayers = true
    const { length } = this.layers || []
    for (let i = length - 1; i >= 0; i--) {
      if (!this.elements[i]) {
        if (
          this.layers![i].ip - this.layers![i].st <= num - this.layers![i].st &&
          this.layers![i].op - this.layers![i].st > num - this.layers![i].st
        ) {
          this.buildItem(i)
        }
      }
      this.completeLayers = this.elements[i] ? this.completeLayers : false
    }
    this.checkPendingElements()
  }
  createAudio(data: LottieLayer) {
    return new AudioElement(data, this.globalData!, this)
  }
  createCamera(_data: LottieLayer) {
    throw new Error("You're using a 3d camera. Try the html renderer.")
  }

  createFootage(data: LottieLayer) {
    return new FootageElement(data, this.globalData, this)
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
  getElementById(ind: number) {
    let i
    const len = this.elements.length
    for (i = 0; i < len; i++) {
      if (this.elements[i].data.ind === ind) {
        return this.elements[i]
      }
    }
    return null
  }

  getElementByPath(path: unknown[]): ElementInterface | undefined {
    const pathValue = path.shift()
    let element
    if (typeof pathValue === 'number') {
      element = this.elements[pathValue]
    } else {
      const { length } = this.elements
      for (let i = 0; i < length; i++) {
        if (this.elements[i].data.nm === pathValue) {
          element = this.elements[i]
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

  initItems() {
    if (!this.globalData?.progressiveLoad) {
      this.buildAllItems()
    }
  }

  searchExtraCompositions(assets: LottieLayer[]) {
    let i
    const len = assets.length
    for (i = 0; i < len; i++) {
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

  setupGlobalData(animData: LottieLayer, fontsContainer: SVGDefsElement) {
    if (!this.globalData) {
      return
    }
    this.globalData.fontManager = new FontManager()
    this.globalData.slotManager = new SlotManager(animData)
    this.globalData.fontManager.addChars(animData.chars)
    this.globalData.fontManager.addFonts(animData.fonts, fontsContainer)
    this.globalData.getAssetData = this.animationItem.getAssetData.bind(
      this.animationItem
    )
    this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(
      this.animationItem
    )
    this.globalData.imageLoader = this.animationItem.imagePreloader
    this.globalData.audioController = this.animationItem.audioController
    this.globalData.frameId = 0
    this.globalData.frameRate = animData.fr || 60
    this.globalData.nm = animData.nm
    this.globalData.compSize = {
      h: Number(animData.h),
      w: Number(animData.w),
    }
  }
}

interface BaseRenderer extends BaseElement {}

export default BaseRenderer
