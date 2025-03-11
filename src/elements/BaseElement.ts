import type MaskElement from '@/elements/MaskElement'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  ItemsData,
  LottieLayer,
  Shape,
} from '@/types'

import EffectsManager from '@/effects/EffectsManager'
import { getBlendMode } from '@/utils'
import { createElementID, getExpressionInterfaces } from '@/utils/getterSetter'
import ProjectInterface from '@/utils/helpers/ProjectInterface'

export default class BaseElement {
  baseElement?: SVGGElement
  comp!: ElementInterfaceIntersect
  compInterface?: ProjectInterface
  data!: LottieLayer
  effectsManager!: EffectsManager

  globalData!: GlobalData
  itemsData?: ItemsData[]
  layerElement!: SVGGElement
  layerId!: string

  layerInterface?: ProjectInterface

  maskManager?: MaskElement
  shapesData?: Shape[]
  type?: unknown
  checkMasks() {
    if (!this.data?.hasMask) {
      return false
    }
    let i = 0
    const { length } = this.data?.masksProperties || []
    while (i < length) {
      if (
        this.data?.masksProperties?.[i].mode !== 'n' &&
        this.data?.masksProperties?.[i].cl !== (false as any)
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
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
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
      this as any
      // this.dynamicProperties
    )
  }
  initExpressions() {
    const expressionsInterfaces = getExpressionInterfaces()
    if (!expressionsInterfaces) {
      return
    }
    const LayerExpressionInterface = new expressionsInterfaces('layer')
    const EffectsExpressionInterface = new expressionsInterfaces('effects')
    const ShapeExpressionInterface = new expressionsInterfaces('shape')
    const TextExpressionInterface = new expressionsInterfaces('text')
    const CompExpressionInterface = new expressionsInterfaces('comp')
    this.layerInterface = (LayerExpressionInterface as any)(this) // TODO:
    if (this.data.hasMask && this.maskManager) {
      this.layerInterface?.registerMaskInterface?.(this.maskManager)
    }
    const effectsInterface =
      EffectsExpressionInterface.createEffectsInterface?.(
        this,
        this.layerInterface
      )
    this.layerInterface?.registerEffectsInterface?.(effectsInterface)

    if (this.data.ty === 0 || this.data.xt) {
      this.compInterface = (CompExpressionInterface as any)(this)
    } else if (this.data.ty === 4) {
      this.layerInterface!.shapeInterface = (ShapeExpressionInterface as any)(
        this.shapesData,
        this.itemsData,
        this.layerInterface
      )
      this.layerInterface!.content = this.layerInterface?.shapeInterface
    } else if (this.data.ty === 5) {
      this.layerInterface!.textInterface = (TextExpressionInterface as any)(
        this
      )
      this.layerInterface!.text = this.layerInterface?.textInterface
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
