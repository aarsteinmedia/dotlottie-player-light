import type EffectsManager from '@/effects/EffectsManager'
import type { Vector3 } from '@/types'

import Matrix from '@/utils/Matrix'
import TransformPropertyFactory from '@/utils/TransformProperty'

const effectTypes = {
  TRANSFORM_EFFECT: 'transformEFfect',
}

export default function TransformElement() {}

TransformElement.prototype = {
  globalToLocal: function (point: Vector3) {
    let pt = point
    const transforms = []
    transforms.push(this.finalTransform)
    let flag = true
    let comp = this.comp
    while (flag) {
      if (comp.finalTransform) {
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
      ptNew = transforms[i].mat.applyToPointArray(0, 0, 0)
      // ptNew = transforms[i].mat.applyToPointArray(pt[0],pt[1],pt[2]);
      pt = [pt[0] - ptNew[0], pt[1] - ptNew[1], 0]
    }
    return pt
  },
  initTransform: function () {
    const mat = new Matrix()
    this.finalTransform = {
      _localMatMdf: false,
      _matMdf: false,
      _opMdf: false,
      localMat: mat,
      localOpacity: 1,
      mat: mat,
      mProp: this.data.ks
        ? TransformPropertyFactory.getTransformProperty(
            this,
            this.data.ks,
            this
          )
        : { o: 0 },
    }
    if (this.data.ao) {
      this.finalTransform.mProp.autoOriented = true
    }

    // TODO: check TYPE 11: Guided elements
    if (this.data.ty !== 11) {
      // this.createElements();
    }
  },
  mHelper: new Matrix(),
  renderLocalTransform: function () {
    if (this.localTransforms) {
      let i = 0
      const len = this.localTransforms.length
      this.finalTransform._localMatMdf = this.finalTransform._matMdf
      if (!this.finalTransform._localMatMdf || !this.finalTransform._opMdf) {
        while (i < len) {
          if (this.localTransforms[i]._mdf) {
            this.finalTransform._localMatMdf = true
          }
          if (this.localTransforms[i]._opMdf && !this.finalTransform._opMdf) {
            this.finalTransform.localOpacity = this.finalTransform.mProp.o.v
            this.finalTransform._opMdf = true
          }
          i++
        }
      }
      if (this.finalTransform._localMatMdf) {
        const localMat = this.finalTransform.localMat
        this.localTransforms[0].matrix.clone(localMat)
        for (i = 1; i < len; i++) {
          const lmat = this.localTransforms[i].matrix
          localMat.multiply(lmat)
        }
        localMat.multiply(this.finalTransform.mat)
      }
      if (this.finalTransform._opMdf) {
        let localOp = this.finalTransform.localOpacity
        for (i = 0; i < len; i++) {
          localOp *= this.localTransforms[i].opacity * 0.01
        }
        this.finalTransform.localOpacity = localOp
      }
    }
  },
  renderTransform: function () {
    this.finalTransform._opMdf =
      this.finalTransform.mProp.o._mdf || this._isFirstFrame
    this.finalTransform._matMdf =
      this.finalTransform.mProp._mdf || this._isFirstFrame

    if (this.hierarchy) {
      let mat
      const finalMat = this.finalTransform.mat
      let i = 0
      const len = this.hierarchy.length
      // Checking if any of the transformation matrices in the hierarchy chain has changed.
      if (!this.finalTransform._matMdf) {
        while (i < len) {
          if (this.hierarchy[i].finalTransform.mProp._mdf) {
            this.finalTransform._matMdf = true
            break
          }
          i++
        }
      }

      if (this.finalTransform._matMdf) {
        mat = this.finalTransform.mProp.v.props
        finalMat.cloneFromProps(mat)
        for (i = 0; i < len; i++) {
          finalMat.multiply(this.hierarchy[i].finalTransform.mProp.v)
        }
      }
    }
    if (this.finalTransform._matMdf) {
      this.finalTransform._localMatMdf = this.finalTransform._matMdf
    }
    if (this.finalTransform._opMdf) {
      this.finalTransform.localOpacity = this.finalTransform.mProp.o.v
    }
  },
  searchEffectTransforms: function () {
    if (this.renderableEffectsManager) {
      const transformEffects = this.renderableEffectsManager.getEffects(
        effectTypes.TRANSFORM_EFFECT
      )
      if (transformEffects.length) {
        this.localTransforms = []
        this.finalTransform.localMat = new Matrix()
        const len = transformEffects.length
        for (let i = 0; i < len; i++) {
          this.localTransforms.push(transformEffects[i])
        }
      }
    }
  },
}

class _TransformElement {
  // Static property for effect types
  static effectTypes = {
    TRANSFORM_EFFECT: 'transformEFfect',
  }

  _isFirstFrame: boolean = false
  comp: any
  data: any
  // Properties
  finalTransform: {
    _localMatMdf: boolean
    _matMdf: boolean
    _opMdf: boolean
    localMat: Matrix
    localOpacity: number
    mat: Matrix
    mProp: any
  }
  hierarchy: any[] | null = null
  localTransforms: any[] | null = null
  mHelper: Matrix = new Matrix()
  renderableEffectsManager: EffectsManager | null = null

  constructor() {
    this.finalTransform = {
      _localMatMdf: false,
      _matMdf: false,
      _opMdf: false,
      localMat: new Matrix(),
      localOpacity: 1,
      mat: new Matrix(),
      mProp: { o: 0 },
    }
  }

  // Method to convert global coordinates to local coordinates
  globalToLocal(point: Vector3): Vector3 {
    let pt = point
    const transforms = []
    transforms.push(this.finalTransform)

    let flag = true
    let comp = this.comp
    while (flag) {
      if (comp.finalTransform) {
        if (comp.data.hasMask) {
          transforms.splice(0, 0, comp.finalTransform)
        }
        comp = comp.comp
      } else {
        flag = false
      }
    }

    const len = transforms.length
    let ptNew: Vector3
    for (let i = 0; i < len; i++) {
      ptNew = transforms[i].mat.applyToPointArray(0, 0, 0) as Vector3
      pt = [pt[0] - ptNew[0], pt[1] - ptNew[1], 0]
    }
    return pt
  }

  // Method to initialize the transform
  initTransform() {
    const mat = new Matrix()
    this.finalTransform = {
      _localMatMdf: false,
      _matMdf: false,
      _opMdf: false,
      localMat: mat,
      localOpacity: 1,
      mat: mat,
      mProp: this.data.ks
        ? TransformPropertyFactory.getTransformProperty(
            this,
            this.data.ks,
            this
          )
        : { o: 0 },
    }

    if (this.data.ao) {
      this.finalTransform.mProp.autoOriented = true
    }

    // TODO: check TYPE 11: Guided elements
    if (this.data.ty !== 11) {
      // this.createElements();
    }
  }

  // Method to render local transformations
  renderLocalTransform() {
    if (this.localTransforms) {
      let i = 0
      const len = this.localTransforms.length
      this.finalTransform._localMatMdf = this.finalTransform._matMdf

      if (!this.finalTransform._localMatMdf || !this.finalTransform._opMdf) {
        while (i < len) {
          if (this.localTransforms[i]._mdf) {
            this.finalTransform._localMatMdf = true
          }
          if (this.localTransforms[i]._opMdf && !this.finalTransform._opMdf) {
            this.finalTransform.localOpacity = this.finalTransform.mProp.o.v
            this.finalTransform._opMdf = true
          }
          i++
        }
      }

      if (this.finalTransform._localMatMdf) {
        const localMat = this.finalTransform.localMat
        this.localTransforms[0].matrix.clone(localMat)
        for (i = 1; i < len; i++) {
          const lmat = this.localTransforms[i].matrix
          localMat.multiply(lmat)
        }
        localMat.multiply(this.finalTransform.mat)
      }

      if (this.finalTransform._opMdf) {
        let localOp = this.finalTransform.localOpacity
        for (i = 0; i < len; i++) {
          localOp *= this.localTransforms[i].opacity * 0.01
        }
        this.finalTransform.localOpacity = localOp
      }
    }
  }

  // Method to render transformations
  renderTransform() {
    this.finalTransform._opMdf =
      this.finalTransform.mProp.o._mdf || this._isFirstFrame
    this.finalTransform._matMdf =
      this.finalTransform.mProp._mdf || this._isFirstFrame

    if (this.hierarchy) {
      let mat
      const finalMat = this.finalTransform.mat
      let i = 0
      const len = this.hierarchy.length

      // Check if any transformation matrices in the hierarchy chain have changed
      if (!this.finalTransform._matMdf) {
        while (i < len) {
          if (this.hierarchy[i].finalTransform.mProp._mdf) {
            this.finalTransform._matMdf = true
            break
          }
          i++
        }
      }

      if (this.finalTransform._matMdf) {
        mat = this.finalTransform.mProp.v.props
        finalMat.cloneFromProps(mat)
        for (i = 0; i < len; i++) {
          finalMat.multiply(this.hierarchy[i].finalTransform.mProp.v)
        }
      }
    }

    if (this.finalTransform._matMdf) {
      this.finalTransform._localMatMdf = this.finalTransform._matMdf
    }
    if (this.finalTransform._opMdf) {
      this.finalTransform.localOpacity = this.finalTransform.mProp.o.v
    }
  }

  // Method to search for effect transforms
  searchEffectTransforms() {
    if (this.renderableEffectsManager) {
      const transformEffects = this.renderableEffectsManager.getEffects(
        TransformElement.effectTypes.TRANSFORM_EFFECT
      )
      if (transformEffects.length) {
        this.localTransforms = []
        this.finalTransform.localMat = new Matrix()
        const len = transformEffects.length
        for (let i = 0; i < len; i++) {
          this.localTransforms.push(transformEffects[i])
        }
      }
    }
  }
}
