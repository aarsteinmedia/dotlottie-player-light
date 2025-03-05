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
  function removeElement({ target: animItem }: Event) {
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
    animItem.addEventListener('destroy', removeElement)
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

export default animationManager
