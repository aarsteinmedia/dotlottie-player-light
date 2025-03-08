// import type { TextAnimatorAnimatables } from '@/types'

import { degToRads } from '@/utils'
import PropertyFactory, {
  ValueProperty,
  // type KeyframedMultidimensionalProperty,
  type NoProperty,
} from '@/utils/PropertyFactory'
import TextSelectorProperty from '@/utils/text/TextSelectorProperty'

export default class TextAnimatorDataProperty {
  a: {
    a: unknown
    fb: unknown
    fc: unknown
    fh: unknown
    fs: unknown
    o: ValueProperty
    p: unknown
    r: unknown
    rx: unknown
    ry: unknown
    s: unknown
    sa: unknown
    sc: unknown
    sk: unknown
    sw: unknown
    t: unknown
  }
  s: TextSelectorProperty
  constructor(
    elem: any,
    animatorProps: TextAnimatorDataProperty,
    container: any
  ) {
    const defaultData: NoProperty = { propType: false }
    const { getProp } = PropertyFactory
    const textAnimatorAnimatables = animatorProps.a
    this.a = {
      a: textAnimatorAnimatables.a
        ? getProp(elem, textAnimatorAnimatables.a, 1, 0, container)
        : defaultData,
      fb: textAnimatorAnimatables.fb
        ? getProp(elem, textAnimatorAnimatables.fb, 0, 0.01, container)
        : defaultData,
      fc: textAnimatorAnimatables.fc
        ? getProp(elem, textAnimatorAnimatables.fc, 1, 0, container)
        : defaultData,
      fh: textAnimatorAnimatables.fh
        ? getProp(elem, textAnimatorAnimatables.fh, 0, 0, container)
        : defaultData,
      fs: textAnimatorAnimatables.fs
        ? getProp(elem, textAnimatorAnimatables.fs, 0, 0.01, container)
        : defaultData,
      o: textAnimatorAnimatables.o
        ? getProp(elem, textAnimatorAnimatables.o, 0, 0.01, container)
        : defaultData,
      p: textAnimatorAnimatables.p
        ? getProp(elem, textAnimatorAnimatables.p, 1, 0, container)
        : defaultData,
      r: textAnimatorAnimatables.r
        ? getProp(elem, textAnimatorAnimatables.r, 0, degToRads, container)
        : defaultData,
      rx: textAnimatorAnimatables.rx
        ? getProp(elem, textAnimatorAnimatables.rx, 0, degToRads, container)
        : defaultData,
      ry: textAnimatorAnimatables.ry
        ? getProp(elem, textAnimatorAnimatables.ry, 0, degToRads, container)
        : defaultData,
      s: textAnimatorAnimatables.s
        ? getProp(elem, textAnimatorAnimatables.s, 1, 0.01, container)
        : defaultData,
      sa: textAnimatorAnimatables.sa
        ? getProp(elem, textAnimatorAnimatables.sa, 0, degToRads, container)
        : defaultData,
      sc: textAnimatorAnimatables.sc
        ? getProp(elem, textAnimatorAnimatables.sc, 1, 0, container)
        : defaultData,
      sk: textAnimatorAnimatables.sk
        ? getProp(elem, textAnimatorAnimatables.sk, 0, degToRads, container)
        : defaultData,
      sw: textAnimatorAnimatables.sw
        ? getProp(elem, textAnimatorAnimatables.sw, 0, 0, container)
        : defaultData,
      t: textAnimatorAnimatables.t
        ? getProp(elem, textAnimatorAnimatables.t, 0, 0, container)
        : defaultData,
    }

    this.s = new TextSelectorProperty(
      elem,
      animatorProps.s
      // container
    )
    this.s.t = animatorProps.s.t
  }
}
