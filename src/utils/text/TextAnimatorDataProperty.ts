import type { ElementInterfaceIntersect } from '@/types'
import type { NoProperty, ValueProperty } from '@/utils/Properties'

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
    p: ValueProperty | NoProperty
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
      { getProp } = PropertyFactory,
      textAnimatorAnimatables = animatorProps?.a
    this.a = {
      a: textAnimatorAnimatables?.a
        ? (getProp(
            elem,
            textAnimatorAnimatables.a,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fb: textAnimatorAnimatables?.fb
        ? (getProp(
            elem,
            textAnimatorAnimatables.fb,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      fc: textAnimatorAnimatables?.fc
        ? (getProp(
            elem,
            textAnimatorAnimatables.fc,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fh: textAnimatorAnimatables?.fh
        ? (getProp(
            elem,
            textAnimatorAnimatables.fh,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      fs: textAnimatorAnimatables?.fs
        ? (getProp(
            elem,
            textAnimatorAnimatables.fs,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      o: textAnimatorAnimatables?.o
        ? (getProp(
            elem,
            textAnimatorAnimatables.o,
            0,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      p: textAnimatorAnimatables?.p
        ? (getProp(
            elem,
            textAnimatorAnimatables.p,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      r: textAnimatorAnimatables?.r
        ? (getProp(
            elem,
            textAnimatorAnimatables.r,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      rx: textAnimatorAnimatables?.rx
        ? (getProp(
            elem,
            textAnimatorAnimatables.rx,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      ry: textAnimatorAnimatables?.ry
        ? (getProp(
            elem,
            textAnimatorAnimatables.ry,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      s: textAnimatorAnimatables?.s
        ? (getProp(
            elem,
            textAnimatorAnimatables.s,
            1,
            0.01,
            container
          ) as ValueProperty)
        : defaultData,
      sa: textAnimatorAnimatables?.sa
        ? (getProp(
            elem,
            textAnimatorAnimatables.sa,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      sc: textAnimatorAnimatables?.sc
        ? (getProp(
            elem,
            textAnimatorAnimatables.sc,
            1,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      sk: textAnimatorAnimatables?.sk
        ? (getProp(
            elem,
            textAnimatorAnimatables.sk,
            0,
            degToRads,
            container
          ) as ValueProperty)
        : defaultData,
      sw: textAnimatorAnimatables?.sw
        ? (getProp(
            elem,
            textAnimatorAnimatables.sw,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
      t: textAnimatorAnimatables?.t
        ? (getProp(
            elem,
            textAnimatorAnimatables.t,
            0,
            0,
            container
          ) as ValueProperty)
        : defaultData,
    }

    this.s = new TextSelectorProperty(
      elem,
      animatorProps?.s as any
      // container
    )
    ;(this.s as any).t = (animatorProps as any)?.s?.t
  }
}
