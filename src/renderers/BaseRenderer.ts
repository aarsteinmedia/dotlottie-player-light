import AudioElement from '@/elements/AudioElement'
import FootageElement from '@/elements/FootageElement'
import type { AnimationData, LottieAsset, LottieLayer } from '@/types'
import FontManager from '@/utils/FontManager'
import type ProjectInterface from '@/utils/helpers/ProjectInterface'
import slotFactory from '@/utils/SlotManager'

export default function BaseRenderer() {}
BaseRenderer.prototype.checkLayers = function (num: number) {
  this.completeLayers = true
  const { length } = this.layers
  for (let i = length - 1; i >= 0; i--) {
    if (!this.elements[i]) {
      if (
        this.layers[i].ip - this.layers[i].st <= num - this.layers[i].st &&
        this.layers[i].op - this.layers[i].st > num - this.layers[i].st
      ) {
        this.buildItem(i)
      }
    }
    this.completeLayers = this.elements[i] ? this.completeLayers : false
  }
  this.checkPendingElements()
}

BaseRenderer.prototype.createItem = function (layer: LottieLayer) {
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

BaseRenderer.prototype.createCamera = function () {
  throw new Error("You're using a 3d camera. Try the html renderer.")
}

BaseRenderer.prototype.createAudio = function (data: any) {
  return new (AudioElement as any)(data, this.globalData, this)
}

BaseRenderer.prototype.createFootage = function (data: any) {
  return new (FootageElement as any)(data, this.globalData, this)
}

BaseRenderer.prototype.buildAllItems = function () {
  const len = this.layers.length
  for (let i = 0; i < len; i++) {
    this.buildItem(i)
  }
  this.checkPendingElements()
}

BaseRenderer.prototype.includeLayers = function (newLayers: LottieLayer[]) {
  this.completeLayers = false
  const len = newLayers.length
  let j
  const jLen = this.layers.length
  for (let i = 0; i < len; i++) {
    j = 0
    while (j < jLen) {
      if (this.layers[j].id === newLayers[i].id) {
        this.layers[j] = newLayers[i]
        break
      }
      j++
    }
  }
}

BaseRenderer.prototype.setProjectInterface = function (
  pInterface: ReturnType<typeof ProjectInterface>
) {
  this.globalData.projectInterface = pInterface
}

BaseRenderer.prototype.initItems = function () {
  if (!this.globalData.progressiveLoad) {
    this.buildAllItems()
  }
}
BaseRenderer.prototype.buildElementParenting = function (
  element: any,
  parentName: string,
  hierarchy: unknown[]
) {
  const elements = this.elements
  const layers = this.layers
  let i = 0
  const len = layers.length
  while (i < len) {
    if (layers[i].ind == parentName) {
      if (!elements[i] || elements[i] === true) {
        this.buildItem(i)
        this.addPendingElement(element)
      } else {
        hierarchy.push(elements[i])
        elements[i].setAsParent()
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

BaseRenderer.prototype.addPendingElement = function (element: unknown) {
  this.pendingElements.push(element)
}

BaseRenderer.prototype.searchExtraCompositions = function (
  assets: LottieAsset[]
) {
  let i
  const len = assets.length
  for (i = 0; i < len; i++) {
    if (assets[i].xt) {
      const comp = this.createComp(assets[i])
      comp.initExpressions()
      this.globalData.projectInterface.registerComposition(comp)
    }
  }
}

BaseRenderer.prototype.getElementById = function (ind: number) {
  let i
  const len = this.elements.length
  for (i = 0; i < len; i++) {
    if (this.elements[i].data.ind === ind) {
      return this.elements[i]
    }
  }
  return null
}

BaseRenderer.prototype.getElementByPath = function (path: unknown[]) {
  const pathValue = path.shift()
  let element
  if (typeof pathValue === 'number') {
    element = this.elements[pathValue]
  } else {
    let i
    const len = this.elements.length
    for (i = 0; i < len; i++) {
      if (this.elements[i].data.nm === pathValue) {
        element = this.elements[i]
        break
      }
    }
  }
  if (path.length === 0) {
    return element
  }
  return element.getElementByPath(path)
}

BaseRenderer.prototype.setupGlobalData = function (
  animData: AnimationData,
  fontsContainer: any
) {
  this.globalData.fontManager = new (FontManager as any)()
  this.globalData.slotManager = slotFactory(animData)
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
  this.globalData.frameRate = animData.fr
  this.globalData.nm = animData.nm
  this.globalData.compSize = {
    h: animData.h,
    w: animData.w,
  }
}
