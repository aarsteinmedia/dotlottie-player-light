import type { LottieEvent } from '@/events'
import type {
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
} from '@/types'

import AnimationItem from '@/animation/AnimationItem'
import { RendererType } from '@/enums'
import { createTag, isServer } from '@/utils'

export default class AnimationManager {
  private static _isFrozen = false
  private static _stopped = true
  private static initTime = 0
  private static len = 0
  private static playingAnimationsNum = 0
  private static registeredAnimations: {
    animation: AnimationItem
    elem: HTMLElement | null
  }[] = []
  static destroy(animation?: string) {
    for (let i = this.len - 1; i >= 0; i--) {
      this.registeredAnimations[i].animation.destroy(animation)
    }
  }
  static freeze() {
    this._isFrozen = true
  }
  static getRegisteredAnimations() {
    const lenAnims = this.registeredAnimations.length,
      animations = []
    for (let i = 0; i < lenAnims; i++) {
      animations.push(this.registeredAnimations[i].animation)
    }
    return animations
  }
  static goToAndStop(value: number, isFrame?: boolean, animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.goToAndStop(
        value,
        isFrame,
        animation
      )
    }
  }
  static loadAnimation(params: AnimationConfiguration) {
    const animItem = new AnimationItem()
    this.setupAnimation = this.setupAnimation.bind(this)
    this.setupAnimation(animItem, null)
    animItem.setParams(params)
    return animItem
  }
  static mute(animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.mute(animation)
    }
  }
  static pause(animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.pause(animation)
    }
  }
  static play(animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.play(animation)
    }
  }
  static registerAnimation(
    element: HTMLElement | null,
    animationData?: AnimationData
  ) {
    if (!element) {
      return null
    }
    let i = 0
    while (i < this.len) {
      if (
        this.registeredAnimations[i].elem === element &&
        this.registeredAnimations[i].elem !== null
      ) {
        return this.registeredAnimations[i].animation
      }
      i++
    }
    const animItem = new AnimationItem()
    this.setupAnimation(animItem, element)
    animItem.setData(element, animationData)
    return animItem
  }
  static resize() {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.resize()
    }
  }
  static searchAnimations(
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
      this.registerAnimation(animElements[i], animationData)
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
      this.registerAnimation(div, animationData)
    }
  }
  static setDirection(val: AnimationDirection, animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.setDirection(val, animation)
    }
  }
  static setSpeed(val: number, animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.setSpeed(val, animation)
    }
  }
  static setVolume(val: number, animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.setVolume(val, animation)
    }
  }
  static stop(animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.stop(animation)
    }
  }
  static togglePause(animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.togglePause(animation)
    }
  }
  static unfreeze() {
    this._isFrozen = false
    this.activate()
  }
  static unmute(animation?: string) {
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.unmute(animation)
    }
  }
  private static activate() {
    if (!this._isFrozen && this.playingAnimationsNum) {
      if (this._stopped && typeof !isServer()) {
        window.requestAnimationFrame(this.first)
        this._stopped = false
      }
    }
  }
  private static addPlayingCount() {
    this.playingAnimationsNum++
    this.activate()
  }
  private static first(nowTime: number) {
    this.initTime = nowTime
    if (!isServer()) {
      window.requestAnimationFrame(this.resume)
    }
  }
  private static removeElement({ target: animItem }: LottieEvent) {
    let i = 0
    if (!(animItem instanceof AnimationItem)) {
      return
    }
    while (i < this.len) {
      if (animItem && this.registeredAnimations[i].animation === animItem) {
        this.registeredAnimations.splice(i, 1)
        i--
        this.len -= 1
        if (!animItem.isPaused) {
          this.subtractPlayingCount()
        }
      }
      i++
    }
  }
  private static resume(nowTime: number) {
    const elapsedTime = nowTime - this.initTime
    for (let i = 0; i < this.len; i++) {
      this.registeredAnimations[i].animation.advanceTime(elapsedTime)
    }
    this.initTime = nowTime
    if (this.playingAnimationsNum && !this._isFrozen) {
      if (!isServer()) {
        window.requestAnimationFrame(this.resume)
      }
    } else {
      this._stopped = true
    }
  }
  private static setupAnimation(
    animItem: AnimationItem,
    element: HTMLElement | null
  ) {
    this.destroy = this.destroy.bind(this)
    this.freeze = this.freeze.bind(this)
    this.getRegisteredAnimations = this.getRegisteredAnimations.bind(this)
    this.goToAndStop = this.goToAndStop.bind(this)
    this.loadAnimation = this.loadAnimation.bind(this)
    this.mute = this.mute.bind(this)
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)
    this.registerAnimation = this.registerAnimation.bind(this)
    this.searchAnimations = this.searchAnimations.bind(this)
    this.setDirection = this.setDirection.bind(this)
    this.setSpeed = this.setSpeed.bind(this)
    this.setVolume = this.setVolume.bind(this)
    this.stop = this.stop.bind(this)
    this.togglePause = this.togglePause.bind(this)
    this.unfreeze = this.unfreeze.bind(this)
    this.unmute = this.unmute.bind(this)

    this.activate = this.activate.bind(this)
    this.addPlayingCount = this.addPlayingCount.bind(this)
    this.first = this.first.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.resume = this.resume.bind(this)
    this.subtractPlayingCount = this.subtractPlayingCount.bind(this)

    animItem.addEventListener('destroy', this.removeElement as any)
    animItem.addEventListener('_active', this.addPlayingCount)
    animItem.addEventListener('_idle', this.subtractPlayingCount)
    this.registeredAnimations.push({ animation: animItem, elem: element })
    this.len++
  }
  private static subtractPlayingCount() {
    this.playingAnimationsNum--
  }
}
