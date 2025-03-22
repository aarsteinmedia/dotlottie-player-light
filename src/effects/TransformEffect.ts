import { GroupEffect } from '@/effects/EffectsManager'
import { effectTypes } from '@/elements/helpers/TransformElement'
import { Vector2, Vector3 } from '@/types'
import { degToRads } from '@/utils'
import Matrix from '@/utils/Matrix'

export default abstract class TransformEffect {
  _mdf?: boolean
  _opMdf?: boolean
  effectsManager?: GroupEffect
  matrix?: Matrix
  opacity?: number
  type?: string
  init(effectsManager: GroupEffect) {
    this.effectsManager = effectsManager
    this.type = effectTypes.TRANSFORM_EFFECT
    this.matrix = new Matrix()
    this.opacity = -1
    this._mdf = false
    this._opMdf = false
  }

  renderFrame(forceFrame?: boolean) {
    this._opMdf = false
    this._mdf = false
    if (forceFrame || this.effectsManager?._mdf) {
      const effectElements = this.effectsManager?.effectElements || [],
        anchor = effectElements[0].p.v as Vector3,
        position = effectElements[1].p.v as Vector2,
        isUniformScale = effectElements[2].p.v === 1,
        scaleHeight = effectElements[3].p.v as number,
        scaleWidth = isUniformScale
          ? scaleHeight
          : (effectElements[4].p.v as number),
        skew = effectElements[5].p.v as number,
        skewAxis = effectElements[6].p.v as number,
        rotation = effectElements[7].p.v as number
      this.matrix?.reset()
      this.matrix?.translate(-anchor[0], -anchor[1], anchor[2])
      this.matrix?.scale(scaleWidth * 0.01, scaleHeight * 0.01, 1)
      this.matrix?.rotate(-rotation * degToRads)
      this.matrix?.skewFromAxis(-skew * degToRads, (skewAxis + 90) * degToRads)
      this.matrix?.translate(position[0], position[1], 0)
      this._mdf = true
      if (this.opacity !== effectElements[8].p.v) {
        this.opacity = effectElements[8].p.v as number
        this._opMdf = true
      }
    }
  }
}
