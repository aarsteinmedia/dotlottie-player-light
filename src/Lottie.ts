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

/**
 *
 */
function setLocation(href: string) {
  setLocationHref(href)
}

// const standalone = '__[STANDALONE]__'
// const animationData = '__[ANIMATIONDATA]__'

function searchAnimations() {
  // if (standalone === true) {
  //   animationManager.searchAnimations(animationData, standalone, renderer)
  // } else {
  animationManager.searchAnimations()
  // }
}

/**
 *
 */
function setSubframeRendering(flag: boolean) {
  setSubframeEnabled(flag)
}

/**
 *
 */
function loadAnimation(params: AnimationConfiguration) {
  // if (standalone === true) {
  //   params.animationData =
  //     typeof animationData === 'string'
  //       ? JSON.parse(animationData)
  //       : animationData
  // }

  return animationManager.loadAnimation(params)
}

/**
 *
 */
function installPlugin(type: string, plugin: ExpressionsPlugin) {
  if (type === 'expressions') {
    setExpressionsPlugin(plugin)
  }
}

const Lottie = {
  __getFactory: getFactory,
  destroy: animationManager.destroy,
  freeze: animationManager.freeze,
  getRegisteredAnimations: animationManager.getRegisteredAnimations,
  goToAndStop: animationManager.goToAndStop,
  inBrowser,
  installPlugin,
  loadAnimation,
  mute: animationManager.mute,
  pause: animationManager.pause,
  play: animationManager.play,
  registerAnimation: animationManager.registerAnimation,
  resize: animationManager.resize,
  searchAnimations,
  setDirection: animationManager.setDirection,
  setIDPrefix,
  setLocationHref: setLocation,
  setQuality,
  setSpeed: animationManager.setSpeed,
  setSubframeRendering: setSubframeRendering,
  setVolume: animationManager.setVolume,
  stop: animationManager.stop,
  togglePause: animationManager.togglePause,
  unfreeze: animationManager.unfreeze,
  unmute: animationManager.unmute,
  useWebWorker: setWebWorker,
  version: '[[BM_VERSION]]',
}

function checkReady() {
  if (isServer()) {
    return
  }
  if (document.readyState === 'complete') {
    clearInterval(readyStateCheckInterval)
    searchAnimations()
  }
}

const readyStateCheckInterval = setInterval(checkReady, 100)

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

export default Lottie
