import type { AnimationConfiguration, ExpressionsPlugin } from '@/types'

import animationManager from '@/animation/AnimationManager'
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

export default class Lottie {
  static __getFactory = getFactory
  static destroy = animationManager.destroy
  static freeze = animationManager.freeze
  static getRegisteredAnimations = animationManager.getRegisteredAnimations
  static goToAndStop = animationManager.goToAndStop
  static inBrowser = inBrowser
  static mute = animationManager.mute
  static pause = animationManager.pause
  static play = animationManager.play
  static registerAnimation = animationManager.registerAnimation
  static resize = animationManager.resize
  static setDirection = animationManager.setDirection
  static setIDPrefix = setIDPrefix
  static setLocationHref = setLocationHref
  static setQuality = setQuality
  static setSpeed = animationManager.setSpeed
  static setVolume = animationManager.setVolume
  static stop = animationManager.stop
  static togglePause = animationManager.togglePause
  static unfreeze = animationManager.unfreeze
  static unmute = animationManager.unmute
  static useWebWorker = setWebWorker
  static version = '[[BM_VERSION]]'
  // private static animationData = '__[ANIMATIONDATA]__'
  private static readyStateCheckInterval: NodeJS.Timeout
  // private static standalone = '__[STANDALONE]__'
  constructor() {
    Lottie.readyStateCheckInterval = setInterval(Lottie.checkReady, 100)

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
  }
  static installPlugin(type: string, plugin: ExpressionsPlugin) {
    if (type === 'expressions') {
      setExpressionsPlugin(plugin)
    }
  }
  static loadAnimation(params: AnimationConfiguration) {
    // if (standalone === true) {
    //   params.animationData =
    //     typeof animationData === 'string'
    //       ? JSON.parse(animationData)
    //       : animationData
    // }

    return animationManager.loadAnimation(params)
  }
  static searchAnimations() {
    // if (this.standalone === true) {
    //   animationManager.searchAnimations(animationData, this.standalone, renderer)
    // } else {
    animationManager.searchAnimations()
    // }
  }
  static setSubframeRendering(flag: boolean) {
    setSubframeEnabled(flag)
  }
  private static checkReady() {
    if (isServer()) {
      return
    }
    if (document.readyState === 'complete') {
      clearInterval(this.readyStateCheckInterval)
      this.searchAnimations()
    }
  }
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
