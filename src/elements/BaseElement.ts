import type { GlobalData, LottieLayer } from '@/types'

import EffectsManager from '@/effects/EffectsManager'
import { getBlendMode } from '@/utils'
import { createElementID, getExpressionInterfaces } from '@/utils/getterSetter'

export default class BaseElement {
  comp!: any // ElementInterface
  data!: null | LottieLayer
  effectsManager!: EffectsManager
  globalData!: null | GlobalData
  layerId!: string

  checkMasks() {
    if (!this.data?.hasMask) {
      return false
    }
    let i = 0
    const len = this.data?.masksProperties?.length || 0
    while (i < len) {
      if (
        this.data?.masksProperties?.[i].mode !== 'n' &&
        this.data?.masksProperties?.[i].cl !== false
      ) {
        return true
      }
      i++
    }
    return false
  }
  getType() {
    return this.type
  }
  initBaseData(
    data: LottieLayer,
    globalData: null | GlobalData,
    comp: any // CompElement TODO:
  ) {
    this.globalData = globalData
    this.comp = comp
    this.data = data
    this.layerId = createElementID()

    // Stretch factor for old animations missing this property.
    if (!this.data.sr) {
      this.data.sr = 1
    }
    this.effectsManager = new EffectsManager(
      this.data,
      this
      // this.dynamicProperties
    )
  }
  initExpressions() {
    const expressionsInterfaces = getExpressionInterfaces()
    if (!expressionsInterfaces) {
      return
    }
    const LayerExpressionInterface = expressionsInterfaces('layer')
    const EffectsExpressionInterface = expressionsInterfaces('effects')
    const ShapeExpressionInterface = expressionsInterfaces('shape')
    const TextExpressionInterface = expressionsInterfaces('text')
    const CompExpressionInterface = expressionsInterfaces('comp')
    this.layerInterface = LayerExpressionInterface(this)
    if (this.data.hasMask && this.maskManager) {
      this.layerInterface.registerMaskInterface(this.maskManager)
    }
    const effectsInterface = EffectsExpressionInterface.createEffectsInterface(
      this,
      this.layerInterface
    )
    this.layerInterface.registerEffectsInterface(effectsInterface)

    if (this.data.ty === 0 || this.data.xt) {
      this.compInterface = CompExpressionInterface(this)
    } else if (this.data.ty === 4) {
      this.layerInterface.shapeInterface = ShapeExpressionInterface(
        this.shapesData,
        this.itemsData,
        this.layerInterface
      )
      this.layerInterface.content = this.layerInterface.shapeInterface
    } else if (this.data.ty === 5) {
      this.layerInterface.textInterface = TextExpressionInterface(this)
      this.layerInterface.text = this.layerInterface.textInterface
    }
  }
  setBlendMode() {
    const blendModeValue = getBlendMode(this.data.bm)
    const elem = this.baseElement || this.layerElement

    if (elem) {
      elem.style.mixBlendMode = blendModeValue
    }
  }
  // sourceRectAtTime() {}
}
