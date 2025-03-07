import type { LottieEvent } from '@/events'
import type {
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
} from '@/types'

import AnimationItem from '@/animation/AnimationItem'
import { RendererType } from '@/enums'
import { createTag, isServer } from '@/utils'

const animationManager = (() => {
  const registeredAnimations: {
    animation: AnimationItem
    elem: HTMLElement | null
  }[] = []
  let initTime = 0,
    len = 0,
    playingAnimationsNum = 0,
    _stopped = true,
    _isFrozen = false

  /**
   *
   */
  function removeElement({ target: animItem }: LottieEvent) {
    let i = 0
    if (!(animItem instanceof AnimationItem)) {
      return
    }
    while (i < len) {
      if (animItem && registeredAnimations[i].animation === animItem) {
        registeredAnimations.splice(i, 1)
        i--
        len -= 1
        if (!animItem.isPaused) {
          subtractPlayingCount()
        }
      }
      i++
    }
  }

  /**
   *
   */
  function registerAnimation(
    element: HTMLElement | null,
    animationData?: AnimationData
  ) {
    if (!element) {
      return null
    }
    let i = 0
    while (i < len) {
      if (
        registeredAnimations[i].elem === element &&
        registeredAnimations[i].elem !== null
      ) {
        return registeredAnimations[i].animation
      }
      i++
    }
    const animItem = new AnimationItem()
    setupAnimation(animItem, element)
    animItem.setData(element, animationData)
    return animItem
  }

  /**
   *
   */
  function getRegisteredAnimations() {
    const lenAnims = registeredAnimations.length,
      animations = []
    for (let i = 0; i < lenAnims; i++) {
      animations.push(registeredAnimations[i].animation)
    }
    return animations
  }

  function addPlayingCount() {
    playingAnimationsNum++
    activate()
  }

  function subtractPlayingCount() {
    playingAnimationsNum--
  }

  /**
   *
   */
  function setupAnimation(
    animItem: AnimationItem,
    element: HTMLElement | null
  ) {
    animItem.addEventListener('destroy', removeElement as any)
    animItem.addEventListener('_active', addPlayingCount)
    animItem.addEventListener('_idle', subtractPlayingCount)
    registeredAnimations.push({ animation: animItem, elem: element })
    len += 1
  }

  /**
   *
   */
  function loadAnimation(params: AnimationConfiguration) {
    const animItem = new AnimationItem()
    setupAnimation(animItem, null)
    animItem.setParams(params)
    return animItem
  }

  /**
   *
   */
  function setSpeed(val: number, animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.setSpeed(val, animation)
    }
  }

  /**
   *
   */
  function setDirection(val: AnimationDirection, animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.setDirection(val, animation)
    }
  }

  /**
   *
   */
  function play(animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.play(animation)
    }
  }
  /**
   *
   */
  function resume(nowTime: number) {
    const elapsedTime = nowTime - initTime
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.advanceTime(elapsedTime)
    }
    initTime = nowTime
    if (playingAnimationsNum && !_isFrozen) {
      if (!isServer()) {
        requestAnimationFrame(resume)
      }
    } else {
      _stopped = true
    }
  }

  /**
   *
   */
  function first(nowTime: number) {
    initTime = nowTime
    if (!isServer()) {
      requestAnimationFrame(resume)
    }
  }

  /**
   *
   */
  function pause(animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.pause(animation)
    }
  }

  /**
   *
   */
  function goToAndStop(value: number, isFrame?: boolean, animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.goToAndStop(value, isFrame, animation)
    }
  }

  /**
   *
   */
  function stop(animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.stop(animation)
    }
  }

  /**
   *
   */
  function togglePause(animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.togglePause(animation)
    }
  }

  /**
   *
   */
  function destroy(animation?: string) {
    for (let i = len - 1; i >= 0; i--) {
      registeredAnimations[i].animation.destroy(animation)
    }
  }

  /**
   *
   */
  function searchAnimations(
    animationData?: AnimationData,
    standalone?: boolean,
    rendererFromProps?: RendererType
  ) {
    if (isServer()) {
      return
    }
    let renderer = rendererFromProps
    const animElements = [].concat(
      [].slice.call(document.getElementsByClassName('lottie')),
      [].slice.call(document.getElementsByClassName('bodymovin'))
    ) as HTMLElement[]
    const { length } = animElements
    for (let i = 0; i < length; i++) {
      if (renderer) {
        animElements[i].setAttribute('data-bm-type', renderer)
      }
      registerAnimation(animElements[i], animationData)
    }
    if (standalone && length === 0 && !isServer()) {
      if (!renderer) {
        renderer = RendererType.SVG
      }
      const body = document.getElementsByTagName('body')[0]
      body.innerText = ''
      const div = createTag('div')
      if (!div) {
        throw new Error('Could not create DIV')
      }
      div.style.width = '100%'
      div.style.height = '100%'
      div.setAttribute('data-bm-type', renderer)
      body.appendChild(div)
      registerAnimation(div, animationData)
    }
  }

  function resize() {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.resize()
    }
  }

  function activate() {
    if (!_isFrozen && playingAnimationsNum) {
      if (_stopped && typeof !isServer()) {
        requestAnimationFrame(first)
        _stopped = false
      }
    }
  }

  function freeze() {
    _isFrozen = true
  }

  function unfreeze() {
    _isFrozen = false
    activate()
  }

  /**
   *
   */
  function setVolume(val: number, animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.setVolume(val, animation)
    }
  }

  /**
   *
   */
  function mute(animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.mute(animation)
    }
  }

  /**
   *
   */
  function unmute(animation?: string) {
    for (let i = 0; i < len; i++) {
      registeredAnimations[i].animation.unmute(animation)
    }
  }

  return {
    destroy,
    freeze,
    getRegisteredAnimations,
    goToAndStop,
    loadAnimation,
    mute,
    pause,
    play,
    registerAnimation,
    resize,
    searchAnimations,
    setDirection,
    setSpeed,
    setVolume,
    stop,
    togglePause,
    unfreeze,
    unmute,
  }
})()

// export default class AnimationManager {
//   static initTime: number
//   private _isFrozen: boolean
//   private _stopped: boolean
//   len: number
//   private registeredAnimations: {
//     animation: AnimationItem
//     elem: HTMLElement | null
//   }[]

//   constructor() {
//     this.registeredAnimations = []
//     AnimationManager.initTime = 0
//     this.len = 0
//     this._stopped = true
//     this._isFrozen = false
//   }

//   static getRegisteredAnimations() {
//     const lenAnims = this.registeredAnimations.length,
//       animations = []
//     for (let i = 0; i < lenAnims; i++) {
//       animations.push(this.registeredAnimations[i].animation)
//     }
//     return animations
//   }

//   static goToAndStop(value: number, isFrame?: boolean, animation?: string) {
//     for (let i = 0; i < this.len; i++) {
//       this.registeredAnimations[i].animation.goToAndStop(
//         value,
//         isFrame,
//         animation
//       )
//     }
//   }

//   static loadAnimation(params: AnimationConfiguration) {
//     const animItem = new AnimationItem()
//     this.setupAnimation(animItem, null)
//     animItem.setParams(params)
//     return animItem
//   }

//   static mute(animation?: string) {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.mute(animation)
//     }
//   }

//   static pause(animation?: string) {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.pause(animation)
//     }
//   }

//   static play(animation?: string) {
//     for (let i = 0; i < this.len; i++) {
//       this.registeredAnimations[i].animation.play(animation)
//     }
//   }

//   static registerAnimation(
//     element: HTMLElement | null,
//     animationData?: AnimationData
//   ) {
//     if (!element) {
//       return null
//     }
//     let i = 0
//     while (i < this.len) {
//       if (
//         this.registeredAnimations[i].elem === element &&
//         this.registeredAnimations[i].elem !== null
//       ) {
//         return this.registeredAnimations[i].animation
//       }
//       i++
//     }
//     const animItem = new AnimationItem()
//     this.setupAnimation(animItem, element)
//     animItem.setData(element, animationData)
//     return animItem
//   }

//   static resize() {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.resize()
//     }
//   }

//   static searchAnimations(
//     animationData?: AnimationData,
//     standalone?: boolean,
//     rendererFromProps?: RendererType
//   ) {
//     if (isServer()) {
//       return
//     }
//     let renderer = rendererFromProps
//     const animElements = [].concat(
//       [].slice.call(document.getElementsByClassName('lottie')),
//       [].slice.call(document.getElementsByClassName('bodymovin'))
//     ) as HTMLElement[]
//     const { length } = animElements
//     for (let i = 0; i < length; i++) {
//       if (renderer) {
//         animElements[i].setAttribute('data-bm-type', renderer)
//       }
//       this.registerAnimation(animElements[i], animationData)
//     }
//     if (standalone && length === 0 && !isServer()) {
//       if (!renderer) {
//         renderer = RendererType.SVG
//       }
//       const body = document.getElementsByTagName('body')[0]
//       body.innerText = ''
//       const div = createTag('div')
//       if (!div) {
//         throw new Error('Could not create DIV')
//       }
//       div.style.width = '100%'
//       div.style.height = '100%'
//       div.setAttribute('data-bm-type', renderer)
//       body.appendChild(div)
//       this.registerAnimation(div, animationData)
//     }
//   }

//   static setDirection(val: AnimationDirection, animation?: string) {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.setDirection(val, animation)
//     }
//   }
//   static setSpeed(val: number, animation?: string) {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.setSpeed(val, animation)
//     }
//   }

//   static setVolume(val: number, animation?: string) {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.setVolume(val, animation)
//     }
//   }

//   static stop(animation?: string) {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.stop(animation)
//     }
//   }

//   static togglePause(animation?: string) {
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.togglePause(animation)
//     }
//   }

//   static unfreeze() {
//     this._isFrozen = false
//     this.activate()
//   }

//   static unmute(animation?: string) {
//     for (let i = 0; i < this.len; i++) {
//       this.registeredAnimations[i].animation.unmute(animation)
//     }
//   }

//   private activate() {
//     if (!this._isFrozen && this.playingAnimationsNum) {
//       if (this._stopped && typeof !isServer()) {
//         requestAnimationFrame(this.first)
//         this._stopped = false
//       }
//     }
//   }

//   private addPlayingCount() {
//     this.playingAnimationsNum++
//     this.activate()
//   }

//   private destroy(animation?: string) {
//     for (let i = len - 1; i >= 0; i--) {
//       this.registeredAnimations[i].animation.destroy(animation)
//     }
//   }

//   private first(nowTime: number) {
//     this.initTime = nowTime
//     if (!isServer()) {
//       requestAnimationFrame(this.resume)
//     }
//   }

//   private freeze() {
//     this._isFrozen = true
//   }

//   private removeElement({ target: animItem }: Event) {
//     let i = 0
//     if (!(animItem instanceof AnimationItem)) {
//       return
//     }
//     while (i < this.len) {
//       if (animItem && this.registeredAnimations[i].animation === animItem) {
//         this.registeredAnimations.splice(i, 1)
//         i--
//         len -= 1
//         if (!animItem.isPaused) {
//           this.subtractPlayingCount()
//         }
//       }
//       i++
//     }
//   }

//   private resume(nowTime: number) {
//     const elapsedTime = nowTime - initTime
//     for (let i = 0; i < len; i++) {
//       this.registeredAnimations[i].animation.advanceTime(elapsedTime)
//     }
//     this.initTime = nowTime
//     if (playingAnimationsNum && !_isFrozen) {
//       if (!isServer()) {
//         requestAnimationFrame(resume)
//       }
//     } else {
//       this._stopped = true
//     }
//   }

//   private setupAnimation(animItem: AnimationItem, element: HTMLElement | null) {
//     animItem.addEventListener('destroy', this.removeElement)
//     animItem.addEventListener('_active', this.addPlayingCount)
//     animItem.addEventListener('_idle', this.subtractPlayingCount)
//     this.registeredAnimations.push({ animation: animItem, elem: element })
//     this.len += 1
//   }

//   private subtractPlayingCount() {
//     this.playingAnimationsNum--
//   }
// }

export default animationManager
