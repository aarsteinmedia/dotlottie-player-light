import type { ElementInterface, Shape, Vector2 } from '@/types'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import { degToRads } from '@/utils'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import Matrix from '@/utils/Matrix'
import PropertyFactory from '@/utils/PropertyFactory'
export default class TransformProperty extends DynamicPropertyContainer {
  _addDynamicProperty = DynamicPropertyContainer.prototype.addDynamicProperty
  _isDirty?: boolean
  a?: MultiDimensionalProperty<Vector2>
  // _mdf?: boolean
  appliedTransformations: number
  autoOriented?: boolean
  data: Shape
  elem: ElementInterface
  frameId: number
  o?: ValueProperty
  or?: ValueProperty
  p?: ValueProperty
  pre: Matrix
  override propType: 'transform'
  px?: ValueProperty
  py?: ValueProperty
  pz?: ValueProperty
  r?: ValueProperty
  rx?: ValueProperty
  ry?: ValueProperty
  rz?: ValueProperty
  s?: MultiDimensionalProperty<Vector2>
  sa?: ValueProperty
  sk?: ValueProperty
  v: Matrix
  private defaultVector: Vector2 = [0, 0]
  constructor(
    elem: ElementInterface,
    data: Shape,
    container: ElementInterface
  ) {
    super()
    this.elem = elem
    this.frameId = -1
    this.propType = 'transform'
    this.data = data
    this.v = new Matrix()
    // Precalculated matrix with non animated properties
    this.pre = new Matrix()
    this.appliedTransformations = 0
    this.initDynamicPropertyContainer(container || elem)
    if (data.p && 's' in data.p) {
      this.px = PropertyFactory.getProp(
        elem,
        (data.p as any).x,
        0,
        0,
        this as any
      )
      this.py = PropertyFactory.getProp(
        elem,
        (data.p as any).y,
        0,
        0,
        this as any
      )
      if ('z' in data.p) {
        this.pz = PropertyFactory.getProp(
          elem,
          data.p.z as any,
          0,
          0,
          this as any
        )
      }
    } else {
      this.p = PropertyFactory.getProp(
        elem,
        data.p || ({ k: [0, 0, 0] } as any),
        1,
        0,
        this as any
      )
    }
    if ('rx' in data) {
      this.rx = PropertyFactory.getProp(elem, data.rx, 0, degToRads, this)
      this.ry = PropertyFactory.getProp(elem, data.ry, 0, degToRads, this)
      this.rz = PropertyFactory.getProp(elem, data.rz, 0, degToRads, this)
      if (data.or?.k[0].ti) {
        const { length } = data.or.k
        for (let i = 0; i < length; i++) {
          data.or.k[i].to = null
          data.or.k[i].ti = null
        }
      }
      this.or = PropertyFactory.getProp(
        elem,
        data.or as any,
        1,
        degToRads,
        this as any
      )
      // sh Indicates it needs to be capped between -180 and 180
      this.or.sh = true as any
    } else {
      this.r = PropertyFactory.getProp(
        elem,
        data.r || ({ k: 0 } as any),
        0,
        degToRads,
        this as any
      )
    }
    if (data.sk) {
      this.sk = PropertyFactory.getProp(elem, data.sk, 0, degToRads, this)
      this.sa = PropertyFactory.getProp(elem, data.sa, 0, degToRads, this)
    }
    this.a = PropertyFactory.getProp(
      elem,
      data.a || { k: [0, 0, 0] },
      1,
      0,
      this
    )
    this.s = PropertyFactory.getProp(
      elem,
      data.s || { k: [100, 100, 100] },
      1,
      0.01,
      this
    )
    // Opacity is not part of the transform properties, that's why it won't use this.dynamicProperties. That way transforms won't get updated if opacity changes.
    if (data.o) {
      this.o = PropertyFactory.getProp(elem, data.o, 0, 0.01, elem)
    } else {
      this.o = { _mdf: false, v: 1 }
    }
    this._isDirty = true
    if (!this.dynamicProperties.length) {
      this.getValue(true)
    }
  }
  override addDynamicProperty(prop: any) {
    this._addDynamicProperty(prop)
    this.elem.addDynamicProperty(prop)
    this._isDirty = true
  }
  applyToMatrix(mat: Matrix) {
    const _mdf = this._mdf
    this.iterateDynamicProperties()
    this._mdf = this._mdf || _mdf
    if (this.a) {
      mat.translate(
        -(this.a.v as number[] as number[])[0],
        -(this.a.v as number[])[1],
        (this.a.v as number[])[2]
      )
    }
    if (this.s) {
      mat.scale(
        (this.s.v as number[])[0],
        (this.s.v as number[])[1],
        (this.s.v as number[])[2]
      )
    }
    if (this.sk) {
      mat.skewFromAxis(-(this.sk.v as number[]), Number(this.sa?.v))
    }
    if (this.r) {
      mat.rotate(-Number(this.r.v))
    } else {
      mat
        .rotateZ(-Number(this.rz?.v))
        .rotateY(Number(this.ry?.v))
        .rotateX(Number(this.rx?.v))
        .rotateZ(-(this.or?.v as number[])[2])
        .rotateY((this.or?.v as number[])[1])
        .rotateX((this.or?.v as number[])[0])
    }
    if (this.data?.p && 's' in this.data.p) {
      if ('z' in this.data.p) {
        mat.translate(
          Number(this.px?.v),
          Number(this.py?.v),
          -Number(this.pz?.v)
        )
      } else {
        mat.translate(Number(this.px?.v), Number(this.py?.v), 0)
      }
    } else {
      mat.translate(
        (this.p?.v as number[])[0],
        (this.p?.v as number[])[1],
        -(this.p?.v as number[])[2]
      )
    }
  }
  autoOrient() {
    //
    // var prevP = this.getValueAtTime();
  }

  override getValue(forceRender?: boolean) {
    if (this.elem.globalData.frameId === this.frameId) {
      return
    }
    if (this._isDirty) {
      this.precalculateMatrix()
      this._isDirty = false
    }

    this.iterateDynamicProperties()

    if (this._mdf || forceRender) {
      let frameRate
      this.v.cloneFromProps(this.pre.props as unknown as number[])
      if (this.appliedTransformations < 1) {
        this.v.translate(
          -(this.a?.v as number[])[0],
          -(this.a?.v as number[])[1],
          (this.a?.v as number[])[2]
        )
      }
      if (this.appliedTransformations < 2) {
        this.v.scale(
          (this.s?.v as number[])[0],
          (this.s?.v as number[])[1],
          (this.s?.v as number[])[2]
        )
      }
      if (this.sk && this.appliedTransformations < 3) {
        this.v.skewFromAxis(-(this.sk.v as number[]), Number(this.sa?.v))
      }
      if (this.r && this.appliedTransformations < 4) {
        this.v.rotate(-Number(this.r.v))
      } else if (!this.r && this.appliedTransformations < 4) {
        this.v
          .rotateZ(-Number(this.rz?.v))
          .rotateY(this.ry.v)
          .rotateX(this.rx.v)
          .rotateZ(-this.or.v[2])
          .rotateY(this.or.v[1])
          .rotateX(this.or.v[0])
      }
      if (this.autoOriented) {
        let v1
        let v2
        frameRate = this.elem.globalData.frameRate
        if (this.p && this.p.keyframes && 'getValueAtTime' in this.p) {
          if (
            Number(this.p._caching?.lastFrame) + Number(this.p.offsetTime) <=
            this.p.keyframes[0].t
          ) {
            v1 = (this.p as any).getValueAtTime?.(
              (this.p.keyframes[0].t + 0.01) / frameRate,
              0
            )
            v2 = (this.p as any).getValueAtTime(
              Number(this.p.keyframes[0].t) / frameRate,
              0
            )
          } else if (
            Number(this.p._caching?.lastFrame) + Number(this.p.offsetTime) >=
            this.p.keyframes[this.p.keyframes.length - 1].t
          ) {
            v1 = (this.p as any).getValueAtTime(
              this.p.keyframes[this.p.keyframes.length - 1].t / frameRate,
              0
            )
            v2 = (this.p as any).getValueAtTime(
              (this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) /
                frameRate,
              0
            )
          } else {
            v1 = this.p.pv
            v2 = (this.p as any).getValueAtTime(
              (Number(this.p._caching?.lastFrame) +
                Number(this.p.offsetTime) -
                0.01) /
                frameRate,
              this.p.offsetTime
            )
          }
        } else if (
          this.px &&
          this.px.keyframes &&
          this.py?.keyframes &&
          'getValueAtTime' in this.px &&
          'getValueAtTime' in this.py
        ) {
          v1 = []
          v2 = []
          const px = this.px
          const py = this.py
          if (
            Number(px._caching?.lastFrame) + Number(px.offsetTime) <=
            Number(px.keyframes?.[0].t)
          ) {
            v1[0] = (px as any).getValueAtTime(
              (Number(px.keyframes?.[0].t) + 0.01) / frameRate,
              0
            )
            v1[1] = (py as any).getValueAtTime(
              (Number(py.keyframes?.[0].t) + 0.01) / frameRate,
              0
            )
            v2[0] = (px as any).getValueAtTime(
              Number(px.keyframes?.[0].t) / frameRate,
              0
            )
            v2[1] = (py as any).getValueAtTime(
              Number(py.keyframes?.[0]?.t) / frameRate,
              0
            )
          } else if (
            Number(px._caching?.lastFrame) + Number(px.offsetTime) >=
            Number(px.keyframes?.[Number(px.keyframes?.length) - 1].t)
          ) {
            v1[0] = (px as any).getValueAtTime(
              Number(px.keyframes?.[Number(px.keyframes?.length) - 1].t) /
                frameRate,
              0
            )
            v1[1] = (py as any).getValueAtTime(
              Number(py.keyframes?.[Number(py.keyframes?.length) - 1].t) /
                frameRate,
              0
            )
            v2[0] = (px as any).getValueAtTime(
              (Number(px.keyframes?.[Number(px.keyframes?.length) - 1].t) -
                0.01) /
                frameRate,
              0
            )
            v2[1] = (py as any).getValueAtTime(
              (Number(py.keyframes?.[Number(py.keyframes?.length) - 1].t) -
                0.01) /
                frameRate,
              0
            )
          } else {
            v1 = [px.pv, py.pv]
            v2[0] = (px as any).getValueAtTime(
              (Number(px._caching?.lastFrame) + Number(px.offsetTime) - 0.01) /
                frameRate,
              px.offsetTime
            )
            v2[1] = (py as any).getValueAtTime(
              (Number(py._caching?.lastFrame) + Number(py.offsetTime) - 0.01) /
                frameRate,
              py.offsetTime
            )
          }
        } else {
          v2 = this.defaultVector
          v1 = v2
        }
        this.v.rotate(-Math.atan2(v1[1] - v2[1], v1[0] - v2[0]))
      }
      if (this.data.p && 's' in this.data.p) {
        if ('z' in this.data.p) {
          this.v.translate(
            Number(this.px?.v),
            Number(this.py?.v),
            -Number(this.pz?.v)
          )
        } else {
          this.v.translate(Number(this.px?.v), Number(this.py?.v), 0)
        }
      } else {
        this.v.translate(
          (this.p?.v as number[])[0],
          (this.p?.v as number[])[1],
          -(this.p?.v as number[])[2]
        )
      }
    }
    this.frameId = this.elem.globalData.frameId!
  }
  precalculateMatrix() {
    this.appliedTransformations = 0
    this.pre.reset()

    if (this.a.effectsSequence.length) {
      return
    }
    this.pre.translate(
      -(this.a.v as number[])[0],
      -(this.a.v as number[])[1],
      (this.a.v as number[])[2]
    )
    this.appliedTransformations = 1

    if (this.s.effectsSequence.length) {
      return
    }
    this.pre.scale(
      (this.s.v as number[])[0],
      (this.s.v as number[])[1],
      (this.s.v as number[])[2]
    )
    this.appliedTransformations = 2

    if (this.sk) {
      if (this.sk.effectsSequence.length || this.sa.effectsSequence.length) {
        return
      }
      this.pre.skewFromAxis(-(this.sk.v as number[]), this.sa.v)
      this.appliedTransformations = 3
    }
    if (this.r) {
      if (!this.r.effectsSequence.length) {
        this.pre.rotate(-this.r.v)
        this.appliedTransformations = 4
      }
      return
    }

    if (
      !this.rz.effectsSequence.length &&
      !this.ry.effectsSequence.length &&
      !this.rx.effectsSequence.length &&
      !this.or.effectsSequence.length
    ) {
      this.pre
        .rotateZ(-this.rz.v)
        .rotateY(this.ry.v)
        .rotateX(this.rx.v)
        .rotateZ(-this.or.v[2])
        .rotateY(this.or.v[1])
        .rotateX(this.or.v[0])
      this.appliedTransformations = 4
    }
  }
}
