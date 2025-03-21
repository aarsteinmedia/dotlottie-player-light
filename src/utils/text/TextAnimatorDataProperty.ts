import type { ElementInterfaceIntersect, Vector2 } from '@/types'
import type {
  MultiDimensionalProperty,
  NoProperty,
  ValueProperty,
} from '@/utils/Properties'

import { degToRads } from '@/utils'
import PropertyFactory from '@/utils/PropertyFactory'
import TextSelectorProperty from '@/utils/text/TextSelectorProperty'

export default class TextAnimatorDataProperty {
  a?: {
    a: ValueProperty | NoProperty
    fb: ValueProperty | NoProperty
    fc: ValueProperty | NoProperty
    fh: ValueProperty | NoProperty
    fs: ValueProperty | NoProperty
    o: ValueProperty | NoProperty
    p: MultiDimensionalProperty<Vector2> | NoProperty
    r: ValueProperty | NoProperty
    rx: ValueProperty | NoProperty
    ry: ValueProperty | NoProperty
    s: ValueProperty | NoProperty
    sa: ValueProperty | NoProperty
    sc: ValueProperty | NoProperty
    sk: ValueProperty | NoProperty
    sw: ValueProperty | NoProperty
    t: ValueProperty | NoProperty
  }
  s?: TextSelectorProperty
  constructor(
    elem: ElementInterfaceIntersect,
    animatorProps?: TextAnimatorDataProperty,
    container?: ElementInterfaceIntersect
  ) {
    const defaultData = { propType: false } as NoProperty,
      textAnimatorAnimatables = animatorProps?.a
    this.a = {
      a: textAnimatorAnimatables?.a
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.a,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fb: textAnimatorAnimatables?.fb
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fb,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      fc: textAnimatorAnimatables?.fc
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fc,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fh: textAnimatorAnimatables?.fh
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fh,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fs: textAnimatorAnimatables?.fs
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.fs,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      o: textAnimatorAnimatables?.o
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.o,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      p: textAnimatorAnimatables?.p
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.p,
            1,
            0,
            container
          ) as MultiDimensionalProperty<Vector2>)
        : defaultData,
      r: textAnimatorAnimatables?.r
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.r,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      rx: textAnimatorAnimatables?.rx
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.rx,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      ry: textAnimatorAnimatables?.ry
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.ry,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      s: textAnimatorAnimatables?.s
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.s,
            1,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      sa: textAnimatorAnimatables?.sa
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sa,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      sc: textAnimatorAnimatables?.sc
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sc,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      sk: textAnimatorAnimatables?.sk
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sk,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      sw: textAnimatorAnimatables?.sw
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.sw,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      t: textAnimatorAnimatables?.t
        ? (PropertyFactory(
            elem,
            textAnimatorAnimatables.t,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
    }

    this.s = new TextSelectorProperty(elem, animatorProps?.s as any)
    ;(this.s as any).t = (animatorProps as any)?.s?.t
  }
}
