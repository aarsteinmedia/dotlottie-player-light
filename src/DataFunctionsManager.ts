/* eslint-disable max-depth */
import type {
  AnimationData,
  Characacter,
  DocumentData,
  LottieAsset,
  LottieLayer,
  MaskData,
  Shape,
  ShapeColorValue,
  Vector3,
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import { ShapeType } from '@/enums'

export default class DataFunctionManager {
  static completeData(animationData: AnimationData) {
    if (animationData.__complete) {
      return
    }
    new CheckColors(animationData)
    new CheckText(animationData)
    new CheckChars(animationData)
    new CheckPathProperties(animationData)
    new CheckShapes(animationData)
    this.completeLayers(animationData.layers, animationData.assets)
    this.completeChars(animationData.chars || [], animationData.assets)
    animationData.__complete = true
  }

  static completeLayers(
    layers: LottieLayer[],
    comps: (LottieLayer | LottieAsset)[]
  ) {
    const { length } = layers
    let j
    let jLen
    let k
    let kLen
    for (let i = 0; i < length; i++) {
      if (!('ks' in layers[i]) || layers[i].completed) {
        continue
      }
      layers[i].completed = true
      if (layers[i].hasMask) {
        if (!layers[i].masksProperties) {
          continue
        }
        jLen = layers[i].masksProperties!.length
        for (j = 0; j < jLen; j++) {
          if ((layers[i].masksProperties![j].pt.k as MaskData).i) {
            this.convertPathsToAbsoluteValues(
              layers[i].masksProperties![j].pt.k
            )
            continue
          }
          if (!layers[i].masksProperties![j]) {
            continue
          }
          kLen = (layers[i].masksProperties![j].pt.k as MaskData[]).length
          for (k = 0; k < kLen; k++) {
            if ((layers[i].masksProperties![j].pt.k as MaskData[])[k].s) {
              this.convertPathsToAbsoluteValues(
                (layers[i].masksProperties![j].pt.k as MaskData[])[k].s[0]
              )
            }
            if ((layers[i].masksProperties![j].pt.k as MaskData[])[k].e) {
              this.convertPathsToAbsoluteValues(
                (layers[i].masksProperties![j].pt.k as MaskData[])[k].e?.[0]
              )
            }
          }
        }
      }
      if (layers[i].ty === 0) {
        layers[i].layers = this.findCompLayers(layers[i].refId, comps)
        this.completeLayers(layers[i].layers as LottieLayer[], comps)
      } else if (layers[i].ty === 4) {
        this.completeShapes(layers[i].shapes || [])
      } else if (layers[i].ty === 5) {
        this.completeText(layers[i])
      }
    }
  }

  static completeShapes(arr: Shape[]) {
    const { length } = arr
    let j
    let jLen
    for (let i = length - 1; i >= 0; i -= 1) {
      if (arr[i].ty === 'sh') {
        if ((arr[i].ks?.k as ShapePath).i) {
          this.convertPathsToAbsoluteValues(arr[i].ks?.k)
        } else {
          jLen = (arr[i].ks?.k.length as unknown as number) || 0
          for (j = 0; j < jLen; j++) {
            if ((arr[i].ks?.k as ShapePath[])[j]?.s) {
              this.convertPathsToAbsoluteValues(
                (arr[i].ks?.k as ShapePath[])[j]?.s?.[0]
              )
            }
            if ((arr[i].ks?.k as ShapePath[])[j]?.e) {
              this.convertPathsToAbsoluteValues(
                (arr[i].ks?.k as ShapePath[])[j]?.e?.[0]
              )
            }
          }
        }
        continue
      }
      if (arr[i].ty === 'gr') {
        this.completeShapes(arr[i].it as Shape[])
      }
    }
  }

  private static completeChars(
    chars: Characacter[],
    assets: (LottieLayer | LottieAsset)[]
  ) {
    if (!chars) {
      return
    }
    const { length } = chars
    for (let i = 0; i < length; i++) {
      if (chars[i].t !== 1) {
        continue
      }
      chars[i].data.layers = this.findCompLayers(chars[i].data.refId, assets)
      this.completeLayers(chars[i].data.layers || [], assets)
    }
  }

  private static completeText(_data: LottieLayer) {
    /** Abstract Fallback */
  }

  private static convertPathsToAbsoluteValues(path: any) {
    const { length } = path.i
    for (let i = 0; i < length; i++) {
      path.i[i][0] += path.v[i][0]
      path.i[i][1] += path.v[i][1]
      path.o[i][0] += path.v[i][0]
      path.o[i][1] += path.v[i][1]
    }
  }

  private static findComp(id: string, comps: (LottieLayer | LottieAsset)[]) {
    let i = 0
    const len = comps.length
    while (i < len) {
      if (comps[i].id === id) {
        return comps[i]
      }
      i++
    }
    return null
  }

  private static findCompLayers(
    id?: string,
    comps?: (LottieLayer | LottieAsset)[]
  ) {
    if (!id || !comps) {
      return
    }
    const comp = this.findComp(id, comps)
    if (comp) {
      if (!comp.layers?.__used) {
        comp.layers!.__used = true
        return comp.layers
      }
      return JSON.parse(JSON.stringify(comp.layers))
    }
    return null
  }

  checkVersion(minimum: Vector3, animVersionString: string) {
    const animVersion = animVersionString
      ? animVersionString.split('.').map((str) => Number(str))
      : [100, 100, 100]
    if (minimum[0] > animVersion[0]) {
      return true
    }
    if (animVersion[0] > minimum[0]) {
      return false
    }
    if (minimum[1] > animVersion[1]) {
      return true
    }
    if (animVersion[1] > minimum[1]) {
      return false
    }
    if (minimum[2] > animVersion[2]) {
      return true
    }
    if (animVersion[2] > minimum[2]) {
      return false
    }
    return null
  }
}

class CheckText extends DataFunctionManager {
  private minimumVersion: Vector3 = [4, 4, 14]

  constructor(animationData: AnimationData) {
    super()
    if (this.checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        let i
        const len = animationData.assets.length
        for (i = 0; i < len; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i].layers!)
          }
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
    const { length } = layers
    for (let i = 0; i < length; i++) {
      if (layers[i].ty === 5) {
        this.updateTextLayer(layers[i])
      }
    }
  }

  private updateTextLayer(textLayer: LottieLayer) {
    const documentData = textLayer.t?.d
    if (!textLayer.t?.d || !documentData) {
      return
    }
    textLayer.t.d = {
      k: [
        {
          s: documentData,
          t: 0,
        },
      ],
    } as DocumentData
  }
}

class CheckChars extends DataFunctionManager {
  private minimumVersion: Vector3 = [4, 7, 99]
  constructor(animationData: AnimationData) {
    super()
    if (
      !animationData.chars ||
      this.checkVersion(this.minimumVersion, animationData.v)
    ) {
      return
    }
    const { length } = animationData.chars
    for (let i = 0; i < length; i++) {
      if (animationData.chars[i].data && animationData.chars[i].data.shapes) {
        CheckChars.completeShapes(animationData.chars[i].data.shapes || [])
        animationData.chars[i].data.ip = 0
        animationData.chars[i].data.op = 99999
        animationData.chars[i].data.st = 0
        animationData.chars[i].data.sr = 1
        animationData.chars[i].data.ks = {
          a: { a: 0, k: [0, 0] },
          o: { a: 0, k: 100 },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 as any },
          s: { a: 0, k: [100, 100] },
        } as any
        if (!animationData.chars[i].t) {
          animationData.chars[i].data.shapes?.push({
            ty: ShapeType.NoStyle,
          } as Shape)
          animationData.chars[i].data.shapes?.[0].it?.push({
            a: { a: 0, k: [0, 0] },
            o: { a: 0, k: 100 },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 },
            s: { a: 0, k: [100, 100] },
            sa: { a: 0, k: 0 },
            sk: { a: 0, k: 0 },
            ty: ShapeType.Transform,
          } as unknown as Shape)
        }
      }
    }
  }
}

class CheckPathProperties extends DataFunctionManager {
  private minimumVersion: Vector3 = [5, 7, 15]

  constructor(animationData: AnimationData) {
    super()
    if (this.checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        const { length } = animationData.assets
        for (let i = 0; i < length; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i].layers!)
          }
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
    const { length } = layers
    for (let i = 0; i < length; i++) {
      if (layers[i].ty === 5) {
        this.updateTextLayer(layers[i])
      }
    }
  }

  private updateTextLayer(textLayer: LottieLayer) {
    const pathData = textLayer.t?.p
    if (!pathData) {
      return
    }
    if (typeof pathData.a === 'number') {
      pathData.a = {
        a: 0,
        k: pathData.a,
      }
    }
    if (typeof pathData.p === 'number') {
      pathData.p = {
        a: 0,
        k: pathData.p,
      }
    }
    if (typeof pathData.r === 'number') {
      pathData.r = {
        a: 0,
        k: pathData.r,
      }
    }
  }
}

class CheckColors extends DataFunctionManager {
  private minimumVersion: Vector3 = [4, 1, 9]

  constructor(animationData: AnimationData) {
    super()
    if (this.checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        const len = animationData.assets.length
        for (let i = 0; i < len; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i].layers!)
          }
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
    const len = layers.length
    for (let i = 0; i < len; i++) {
      if (layers[i].ty === 4) {
        this.iterateShapes(layers[i].shapes)
      }
    }
  }

  private iterateShapes(shapes?: Shape[]) {
    if (!shapes) {
      return
    }
    const { length } = shapes
    let j
    let jLen
    for (let i = 0; i < length; i++) {
      if (shapes[i].ty === 'gr') {
        this.iterateShapes(shapes[i].it)
        continue
      }
      if (shapes[i].ty !== 'fl' && shapes[i].ty !== 'st') {
        continue
      }
      if (shapes[i].c?.k && (shapes[i].c?.k as ShapeColorValue[])[0].i) {
        jLen = (shapes[i].c?.k as ShapeColorValue[]).length || 0
        for (j = 0; j < jLen; j++) {
          if ((shapes[i].c?.k as ShapeColorValue[])[j].s) {
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[0] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[1] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[2] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[3] /= 255
          }
          if ((shapes[i].c?.k as ShapeColorValue[])[j].e) {
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[0] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[1] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[2] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[3] /= 255
          }
        }
        continue
      }
      ;(shapes[i].c?.k as number[])[0] /= 255
      ;(shapes[i].c?.k as number[])[1] /= 255
      ;(shapes[i].c?.k as number[])[2] /= 255
      ;(shapes[i].c?.k as number[])[3] /= 255
    }
  }
}

class CheckShapes extends DataFunctionManager {
  private minimumVersion: Vector3 = [4, 4, 18]

  constructor(animationData: AnimationData) {
    super()
    if (this.checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        const { length } = animationData.assets
        for (let i = 0; i < length; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i]?.layers || [])
          }
        }
      }
    }
  }

  private completeClosingShapes(arr: Shape[]) {
    const { length } = arr
    let j
    let jLen
    for (let i = length - 1; i >= 0; i--) {
      if (arr[i].ty === 'gr') {
        this.completeClosingShapes(arr[i].it as Shape[])
        continue
      }
      if (arr[i].ty !== 'sh') {
        continue
      }
      if ((arr[i].ks?.k as ShapePath).i) {
        ;(arr[i].ks?.k as ShapePath).c = !!arr[i].closed
        continue
      }
      jLen = (arr[i].ks?.k as ShapePath[]).length || 0
      for (j = 0; j < jLen; j++) {
        if ((arr[i].ks?.k as ShapePath[])[j]?.s) {
          ;(arr[i].ks?.k as ShapePath[])[j].s![0].c = !!arr[i].closed
        }
        if ((arr[i].ks?.k as ShapePath[])[j]?.e) {
          ;(arr[i].ks?.k as ShapePath[])[j].e![0].c = !!arr[i].closed
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
    const { length } = layers
    let j
    let jLen
    let k
    let kLen
    for (let i = 0; i < length; i++) {
      if (layers[i].hasMask) {
        const maskProps = layers[i].masksProperties
        jLen = Number(maskProps?.length)
        for (j = 0; j < jLen; j++) {
          if (!maskProps) {
            continue
          }
          if ((maskProps[j].pt.k as MaskData).i) {
            ;(maskProps[j].pt.k as MaskData).c = !!maskProps[j].cl
            continue
          }
          kLen = (maskProps[j].pt.k as MaskData[]).length as unknown as number
          for (k = 0; k < kLen; k += 1) {
            if ((maskProps[j].pt.k as MaskData[])[k].s) {
              ;(maskProps[j].pt.k as MaskData[])[k].s[0].c = !!maskProps?.[j].cl
            }
            if ((maskProps[j].pt.k as MaskData[])[k].e) {
              ;(maskProps[j].pt.k as MaskData[])[k].e![0].c =
                !!maskProps?.[j].cl
            }
          }
        }
      }
      if (layers[i].ty === 4) {
        this.completeClosingShapes(layers[i].shapes || [])
      }
    }
  }
}
