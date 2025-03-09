import type { ExpressionsPlugin } from '@/types'

import AnimationManager from '@/animation/AnimationManager'
import { RendererType } from '@/enums'
import SVGRenderer from '@/renderers/SVGRenderer'
import { getFactory, inBrowser, isServer } from '@/utils'
import {
  registerRenderer,
  setExpressionsPlugin,
  setIDPrefix,
  setLocationHref,
  setQuality,
  setSubframeEnabled,
  setWebWorker,
} from '@/utils/getterSetter'
import OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import RoundCornersModifier from '@/utils/shapes/RoundCornersModifier'
import ShapeModifiers from '@/utils/shapes/ShapeModifiers'
import TrimModifier from '@/utils/shapes/TrimModifier'
import ZigZagModifier from '@/utils/shapes/ZigZagModifier'

export default class Lottie extends AnimationManager {
  static __getFactory = getFactory
  static inBrowser = inBrowser
  static setIDPrefix = setIDPrefix
  static setLocationHref = setLocationHref
  static setQuality = setQuality
  static useWebWorker = setWebWorker
  static version = '[[BM_VERSION]]'

  static installPlugin(type: string, plugin: ExpressionsPlugin) {
    if (type === 'expressions') {
      setExpressionsPlugin(plugin)
    }
  }
  static setSubframeRendering(flag: boolean) {
    setSubframeEnabled(flag)
  }
}

const checkReady = () => {
    if (isServer()) {
      return
    }
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)
      Lottie.searchAnimations()
    }
  },
  readyStateCheckInterval = setInterval(checkReady, 100)

// this adds bodymovin to the window object for backwards compatibility
try {
  if (
    !(typeof exports === 'object' && typeof module !== 'undefined') &&
    // @ts-expect-error: define must be a global object from bodymovin
    !(typeof define === 'function' && define.amd) &&
    !isServer()
  ) {
    // @ts-expect-error: bodymovin is not in window
    window.bodymovin = Lottie
  }
} catch (_err) {
  //
}

// Registering renderers
registerRenderer(RendererType.SVG, SVGRenderer)

// Registering shape modifiers
ShapeModifiers.registerModifier('tm', TrimModifier)
ShapeModifiers.registerModifier('pb', PuckerAndBloatModifier)
ShapeModifiers.registerModifier('rp', RepeaterModifier)
ShapeModifiers.registerModifier('rd', RoundCornersModifier)
ShapeModifiers.registerModifier('zz', ZigZagModifier)
ShapeModifiers.registerModifier('op', OffsetPathModifier)
