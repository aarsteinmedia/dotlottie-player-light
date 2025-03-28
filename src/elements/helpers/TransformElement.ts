import type SVGEffects from '@/elements/svg/SVGEffects'
import type { ElementInterfaceIntersect, Transformer, Vector3 } from '@/types'

import BaseElement from '@/elements/BaseElement'
import Matrix from '@/utils/Matrix'
import TransformProperty from '@/utils/TransformProperty'

export const effectTypes = {
  TRANSFORM_EFFECT: 'transformEffect',
}

export default class TransformElement extends BaseElement {
  _isFirstFrame?: boolean
  finalTransform?: Transformer
  hierarchy?: ElementInterfaceIntersect[]
  localTransforms?: Transformer[]
  mHelper = new Matrix()
  renderableEffectsManager?: SVGEffects
  globalToLocal(point: Vector3) {
    let pt = point
    const transforms = []
    transforms.push(this.finalTransform)
    let flag = true
    let comp = this.comp
    while (flag) {
      if (comp?.finalTransform) {
        if (comp.data.hasMask) {
          transforms.splice(0, 0, comp.finalTransform)
        }
        comp = comp.comp
      } else {
        flag = false
      }
    }
    const len = transforms.length
    let ptNew
    for (let i = 0; i < len; i++) {
      ptNew = transforms[i]?.mat.applyToPointArray(0, 0, 0)
      // ptNew = transforms[i].mat.applyToPointArray(pt[0],pt[1],pt[2]);
      pt = [pt[0] - Number(ptNew?.[0]), pt[1] - Number(ptNew?.[1]), 0]
    }
    return pt
  }
  initTransform() {
    const mat = new Matrix()
    this.finalTransform = {
      _localMatMdf: false,
      _matMdf: false,
      _opMdf: false,
      localMat: mat,
      localOpacity: 1,
      mat: mat,
      mProp: this.data?.ks
        ? new TransformProperty(
            this as unknown as ElementInterfaceIntersect,
            this.data.ks,
            this as unknown as ElementInterfaceIntersect
          )
        : ({ o: 0 } as unknown as TransformProperty),
    } as Transformer
    if (this.data?.ao && this.finalTransform) {
      this.finalTransform.mProp.autoOriented = true
    }

    // TODO: check TYPE 11: Guided elements
    if (this.data?.ty !== 11) {
      // this.createElements();
    }
  }
  renderLocalTransform() {
    if (this.localTransforms) {
      let i = 0
      const len = this.localTransforms.length
      this.finalTransform!._localMatMdf = !!this.finalTransform?._matMdf
      if (!this.finalTransform?._localMatMdf || !this.finalTransform._opMdf) {
        while (i < len) {
          if (this.localTransforms[i]._mdf) {
            this.finalTransform!._localMatMdf = true
          }
          if (this.localTransforms[i]._opMdf && !this.finalTransform?._opMdf) {
            this.finalTransform!.localOpacity = Number(
              this.finalTransform?.mProp.o?.v
            )
            this.finalTransform!._opMdf = true
          }
          i++
        }
      }
      if (this.finalTransform?._localMatMdf) {
        const localMat = this.finalTransform.localMat
        this.localTransforms[0].matrix?.clone(localMat)
        for (i = 1; i < len; i++) {
          const lmat = this.localTransforms[i].matrix
          if (lmat) {
            localMat.multiply(lmat)
          }
        }
        localMat.multiply(this.finalTransform.mat)
      }
      if (this.finalTransform?._opMdf) {
        let localOp = this.finalTransform.localOpacity
        for (i = 0; i < len; i++) {
          localOp *= this.localTransforms[i].opacity * 0.01
        }
        this.finalTransform.localOpacity = localOp
      }
    }
  }
  renderTransform() {
    this.finalTransform!._opMdf = !!(
      this.finalTransform?.mProp.o?._mdf || this._isFirstFrame
    )
    this.finalTransform!._matMdf = !!(
      this.finalTransform?.mProp._mdf || this._isFirstFrame
    )

    if (this.hierarchy) {
      let mat
      const finalMat = this.finalTransform?.mat
      let i = 0
      const len = this.hierarchy.length
      // Checking if any of the transformation matrices in the hierarchy chain has changed.
      if (!this.finalTransform?._matMdf) {
        while (i < len) {
          if (this.hierarchy[i].finalTransform?.mProp._mdf) {
            this.finalTransform!._matMdf = true
            break
          }
          i++
        }
      }

      if (this.finalTransform?._matMdf) {
        mat = this.finalTransform.mProp.v.props as unknown as number[]
        finalMat?.cloneFromProps(mat)
        for (i = 0; i < len; i++) {
          if (this.hierarchy[i].finalTransform?.mProp.v) {
            finalMat?.multiply(this.hierarchy[i].finalTransform!.mProp.v)
          }
        }
      }
    }
    if (this.finalTransform?._matMdf) {
      this.finalTransform._localMatMdf = this.finalTransform._matMdf
    }
    if (this.finalTransform?._opMdf) {
      this.finalTransform.localOpacity = Number(this.finalTransform.mProp.o?.v)
    }
  }
  searchEffectTransforms() {
    if (this.renderableEffectsManager) {
      const transformEffects = this.renderableEffectsManager.getEffects(
        effectTypes.TRANSFORM_EFFECT
      )
      if (transformEffects.length) {
        this.localTransforms = []
        if (this.finalTransform) {
          this.finalTransform.localMat = new Matrix()
        }

        const len = transformEffects.length
        for (let i = 0; i < len; i++) {
          this.localTransforms.push(transformEffects[i] as any)
        }
      }
    }
  }
}
