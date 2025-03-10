import type { ElementInterface } from '@/types'
import type { NoProperty, ValueProperty } from '@/utils/Properties'

import { degToRads } from '@/utils'
import PropertyFactory from '@/utils/PropertyFactory'
import TextSelectorProperty from '@/utils/text/TextSelectorProperty'

export default class TextAnimatorDataProperty {
  a?: {
    a: ValueProperty
    fb: ValueProperty
    fc: ValueProperty
    fh: ValueProperty
    fs: ValueProperty
    o: ValueProperty
    p: ValueProperty
    r: ValueProperty
    rx: ValueProperty
    ry: ValueProperty
    s: ValueProperty
    sa: ValueProperty
    sc: ValueProperty
    sk: ValueProperty
    sw: ValueProperty
    t: ValueProperty
  }
  s?: TextSelectorProperty
  constructor(
    elem: ElementInterface,
    animatorProps?: TextAnimatorDataProperty,
    container?: ElementInterface
  ) {
    const defaultData = { propType: false } as NoProperty,
      { getProp } = PropertyFactory,
      textAnimatorAnimatables = animatorProps?.a
    this.a = {
      a: textAnimatorAnimatables?.a
        ? getProp(elem, textAnimatorAnimatables.a, 1, 0, container)
        : defaultData,
      fb: textAnimatorAnimatables?.fb
        ? getProp(elem, textAnimatorAnimatables.fb, 0, 0.01, container)
        : defaultData,
      fc: textAnimatorAnimatables?.fc
        ? getProp(elem, textAnimatorAnimatables.fc, 1, 0, container)
        : defaultData,
      fh: textAnimatorAnimatables?.fh
        ? getProp(elem, textAnimatorAnimatables.fh, 0, 0, container)
        : defaultData,
      fs: textAnimatorAnimatables?.fs
        ? getProp(elem, textAnimatorAnimatables.fs, 0, 0.01, container)
        : defaultData,
      o: textAnimatorAnimatables?.o
        ? getProp(elem, textAnimatorAnimatables.o, 0, 0.01, container)
        : defaultData,
      p: textAnimatorAnimatables?.p
        ? getProp(elem, textAnimatorAnimatables.p, 1, 0, container)
        : defaultData,
      r: textAnimatorAnimatables?.r
        ? getProp(elem, textAnimatorAnimatables.r, 0, degToRads, container)
        : defaultData,
      rx: textAnimatorAnimatables?.rx
        ? getProp(elem, textAnimatorAnimatables.rx, 0, degToRads, container)
        : defaultData,
      ry: textAnimatorAnimatables?.ry
        ? getProp(elem, textAnimatorAnimatables.ry, 0, degToRads, container)
        : defaultData,
      s: textAnimatorAnimatables?.s
        ? getProp(elem, textAnimatorAnimatables.s, 1, 0.01, container)
        : defaultData,
      sa: textAnimatorAnimatables?.sa
        ? getProp(elem, textAnimatorAnimatables.sa, 0, degToRads, container)
        : defaultData,
      sc: textAnimatorAnimatables?.sc
        ? getProp(elem, textAnimatorAnimatables.sc, 1, 0, container)
        : defaultData,
      sk: textAnimatorAnimatables?.sk
        ? getProp(elem, textAnimatorAnimatables.sk, 0, degToRads, container)
        : defaultData,
      sw: textAnimatorAnimatables?.sw
        ? getProp(elem, textAnimatorAnimatables.sw, 0, 0, container)
        : defaultData,
      t: textAnimatorAnimatables?.t
        ? getProp(elem, textAnimatorAnimatables.t, 0, 0, container)
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
