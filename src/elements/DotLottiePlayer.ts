import type {
  AnimateOnScroll,
  Autoplay,
  Controls,
  Loop,
  Subframe,
} from '@/types'

import PropertyCallbackElement from '@/elements/helpers/PropertyCallbackElement'
import {
  ObjectFit,
  PlayMode,
  PlayerEvents,
  PlayerState,
  PreserveAspectRatio,
  RendererType,
} from '@/enums'
import styles from '@/styles.css'
import renderControls from '@/templates/controls'
import renderPlayer from '@/templates/player'
import {
  aspectRatio,
  download,
  frameOutput,
  getAnimationData,
  getFilename,
  handleErrors,
} from '@/utils'
import Lottie, {
  type AnimationConfiguration,
  type AnimationData,
  type AnimationDirection,
  type AnimationItem,
  type AnimationSettings,
  type LottieManifest,
  type Vector2,
} from '@aarsteinmedia/lottie-web/light'
import { createElementID, isServer } from '@aarsteinmedia/lottie-web/utils'

/**
 * dotLottie Player Web Component
 * @exports
 * @class DotLottiePlayer
 * @extends { PropertyCallbackElement }
 * @description Web Component for playing Lottie animations in your web app.
 */
export default class DotLottiePlayer extends PropertyCallbackElement {
  /**
   * Attributes to observe
   */
  static get observedAttributes() {
    return [
      'animateOnScroll',
      'autoplay',
      'controls',
      'direction',
      'hover',
      'loop',
      'mode',
      'speed',
      'src',
      'subframe',
    ]
  }

  static get observedProperties() {
    return [
      'playerState',
      '_isSettingsOpen',
      '_seeker',
      '_currentAnimation',
      '_animations',
    ]
  }

  /**
   * Return the styles for the component
   */
  static get styles() {
    const styleSheet = new CSSStyleSheet()
    styleSheet.replace(styles)
    return styleSheet
  }

  /**
   * @state
   * Player state
   */
  public playerState?: PlayerState = PlayerState.Loading
  public shadow: ShadowRoot

  public template: HTMLTemplateElement
  /**
   * Whether to trigger next frame with scroll
   */
  set animateOnScroll(value: AnimateOnScroll) {
    this.setAttribute('animateOnScroll', (!!value).toString())
  }

  get animateOnScroll() {
    const val = this.getAttribute('animateOnScroll')
    if (val === 'true' || val === '' || val === '1') {
      return true
    }
    return false
  }

  /**
   * Autoplay
   */
  set autoplay(value: Autoplay) {
    this.setAttribute('autoplay', (!!value).toString())
  }

  get autoplay() {
    const val = this.getAttribute('autoplay')
    if (val === 'true' || val === '' || val === '1') {
      return true
    }
    return false
  }

  /**
   * Background color
   */
  set background(value: string) {
    this.setAttribute('background', value)
  }

  get background() {
    return this.getAttribute('background') || 'transparent'
  }

  /**
   * Show controls
   */
  set controls(value: Controls) {
    this.setAttribute('controls', (!!value).toString())
  }

  get controls() {
    const val = this.getAttribute('controls')
    if (val === 'true' || val === '' || val === '1') {
      return true
    }
    return false
  }

  /**
   * Number of times to loop
   */
  set count(value: number) {
    this.setAttribute('count', value.toString())
  }

  get count() {
    const val = this.getAttribute('count')
    if (val) {
      return Number(val)
    }
    return 0
  }

  /**
   * Description for screen readers
   */
  set description(value: string | null) {
    if (value) {
      this.setAttribute('description', value)
    }
  }

  get description() {
    return this.getAttribute('description')
  }

  /**
   * Direction of animation
   */
  set direction(value: AnimationDirection) {
    this.setAttribute('direction', value.toString())
  }

  get direction() {
    const val = Number(this.getAttribute('direction'))
    if (val === -1) {
      return val
    }
    return 1
  }

  /**
   * Whether to play on mouseover
   */
  set hover(value: boolean) {
    this.setAttribute('hover', value.toString())
  }

  get hover() {
    const val = this.getAttribute('hover')
    if (val === 'true' || val === '' || val === '1') {
      return true
    }
    return false
  }

  /**
   * Pause between loop intrations, in miliseconds
   */
  set intermission(value: number) {
    this.setAttribute('intermission', value.toString())
  }

  get intermission() {
    const val = Number(this.getAttribute('intermission'))
    if (!isNaN(val)) {
      return val
    }
    return 0
  }

  /**
   * Loop animation
   */
  set loop(value: Loop) {
    this.setAttribute('loop', (!!value).toString())
  }

  get loop() {
    const val = this.getAttribute('loop')
    if (val === 'true' || val === '' || val === '1') {
      return true
    }
    return false
  }

  /**
   * Play mode
   */
  set mode(value: PlayMode) {
    this.setAttribute('mode', value.toString())
  }

  get mode() {
    const val = this.getAttribute('mode')
    if (val === PlayMode.Bounce) {
      return val
    }
    return PlayMode.Normal
  }

  /**
   * Resizing to container
   */
  set objectfit(value: string) {
    this.setAttribute('objectfit', value)
  }

  get objectfit() {
    const val = this.getAttribute('objectfit')
    if (val && Object.values(ObjectFit).includes(val as ObjectFit)) {
      return val as ObjectFit
    }
    return ObjectFit.Contain
  }

  /**
   * Resizing to container (Deprecated)
   */
  set preserveAspectRatio(value: PreserveAspectRatio | null) {
    this.setAttribute(
      'preserveAspectRatio',
      value || PreserveAspectRatio.Contain
    )
  }

  get preserveAspectRatio() {
    const val = this.getAttribute('preserveAspectRatio')
    if (
      val &&
      Object.values(PreserveAspectRatio).includes(val as PreserveAspectRatio)
    ) {
      return val as PreserveAspectRatio
    }
    return null
  }

  /**
   * Hide advanced controls
   */
  set simple(value: boolean) {
    this.setAttribute('simple', value.toString())
  }

  get simple() {
    const val = this.getAttribute('simple')
    if (val === 'true' || val === '' || val === '1') {
      return true
    }
    return false
  }

  /**
   * Speed
   */
  set speed(value: number) {
    this.setAttribute('speed', value?.toString())
  }

  get speed() {
    const val = this.getAttribute('speed')
    if (val !== null && !isNaN(Number(val))) {
      return Number(val)
    }
    return 1
  }

  /**
   * Source, either path or JSON string
   */
  set src(value: string | null) {
    this.setAttribute('src', value || '')
  }

  get src() {
    return this.getAttribute('src')
  }

  /**
   * Subframe
   */
  set subframe(value: Subframe) {
    this.setAttribute('subframe', (!!value).toString())
  }

  get subframe() {
    const val = this.getAttribute('subframe')
    if (val === 'true' || val === '' || val === '1') {
      return true
    }
    return false
  }

  /**
   * Animation Container
   */
  protected _container: HTMLElement | null = null

  protected _errorMessage = 'Something went wrong'

  protected _identifier = this.id || createElementID()

  /**
   * @state
   * Whether settings toolbar is open
   */
  protected _isSettingsOpen = false

  protected _playerState: {
    prev: PlayerState
    count: number
    loaded: boolean
    visible: boolean
    scrollY: number
    scrollTimeout: NodeJS.Timeout | null
  } = {
    count: 0,
    loaded: false,
    prev: PlayerState.Loading,
    scrollTimeout: null,
    scrollY: 0,
    visible: false,
  }

  protected _render = renderPlayer

  protected _renderControls = renderControls

  /**
   * @state
   * Seeker
   */
  protected _seeker = 0

  /**
   * @state
   * This is included in watched properties,
   * so that next-button will show up
   * on load, if controls are visible
   */
  private _animations: AnimationData[] = []

  /**
   * @state
   * Which animation to show, if several
   */
  private _currentAnimation = 0

  private _intersectionObserver?: IntersectionObserver

  private _isBounce = false

  private _lottieInstance: null | AnimationItem = null // AnimationItem | null = null

  private _manifest?: LottieManifest

  /**
   * Multi-animation settings
   */
  private _multiAnimationSettings: AnimationSettings[] = []

  /**
   * Segment
   */
  private _segment?: Vector2

  constructor() {
    super()
    this._complete = this._complete.bind(this)
    this._dataFailed = this._dataFailed.bind(this)
    this._dataReady = this._dataReady.bind(this)
    this._DOMLoaded = this._DOMLoaded.bind(this)
    this._enterFrame = this._enterFrame.bind(this)
    this._freeze = this._freeze.bind(this)
    this._handleBlur = this._handleBlur.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this._handleSeekChange = this._handleSeekChange.bind(this)
    this._handleWindowBlur = this._handleWindowBlur.bind(this)
    this._loopComplete = this._loopComplete.bind(this)
    this._mouseEnter = this._mouseEnter.bind(this)
    this._mouseLeave = this._mouseLeave.bind(this)
    this._onVisibilityChange = this._onVisibilityChange.bind(this)
    this._switchInstance = this._switchInstance.bind(this)

    this.togglePlay = this.togglePlay.bind(this)
    this.stop = this.stop.bind(this)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.snapshot = this.snapshot.bind(this)
    this.toggleLoop = this.toggleLoop.bind(this)
    this.toggleBoomerang = this.toggleBoomerang.bind(this)

    this.destroy = this.destroy.bind(this)

    this.template = document.createElement('template')
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  /**
   * Runs when the value of an attribute is changed on the component
   */
  async attributeChangedCallback(
    name: string,
    _oldValue: unknown,
    value: string
  ) {
    if (!this._lottieInstance) {
      return
    }

    if (name === 'animateOnScroll') {
      if (value === '' || Boolean(value)) {
        this._lottieInstance.autoplay = false
        addEventListener('scroll', this._handleScroll, {
          capture: true,
          passive: true,
        })
        return
      }
      removeEventListener('scroll', this._handleScroll, true)
    }

    if (name === 'autoplay') {
      if (this.animateOnScroll) {
        return
      }
      if (value === '' || Boolean(value)) {
        this.play()
        return
      }
      this.stop()
    }

    if (name === 'controls') {
      this._renderControls()
    }

    if (name === 'direction') {
      if (Number(value) === -1) {
        return this.setDirection(-1)
      }
      this.setDirection(1)
    }

    if (name === 'hover' && this._container) {
      if (value === '' || Boolean(value)) {
        this._container.addEventListener('mouseenter', this._mouseEnter)
        this._container.addEventListener('mouseleave', this._mouseLeave)
        return
      }
      this._container.removeEventListener('mouseenter', this._mouseEnter)
      this._container.removeEventListener('mouseleave', this._mouseLeave)
    }

    if (name === 'loop') {
      const toggleLoop = this.shadow.querySelector('.toggleLoop')
      if (toggleLoop instanceof HTMLButtonElement) {
        toggleLoop.dataset.active = value
      }
      this.setLoop(value === '' || Boolean(value))
    }

    if (name === 'mode') {
      const toggleBoomerang = this.shadow.querySelector('.toggleBoomerang')
      if (toggleBoomerang instanceof HTMLButtonElement) {
        toggleBoomerang.dataset.active = (value === PlayMode.Bounce).toString()
      }
      this._isBounce = value === PlayMode.Bounce
    }

    if (name === 'speed') {
      const val = Number(value)
      if (val && !isNaN(val)) {
        this.setSpeed(val)
      }
    }

    if (name === 'src') {
      await this.load(value)
    }

    if (name === 'subframe') {
      this.setSubframe(value === '' || Boolean(value))
    }
  }
  /**
   * Initialize everything on component first render
   */
  override async connectedCallback() {
    super.connectedCallback()
    this._render()

    this._container = this.shadow.querySelector('.animation')
    this._renderControls()

    // Add listener for Visibility API's change event.
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibilityChange)
    }

    // Add intersection observer for detecting component being out-of-view.
    this._addIntersectionObserver()

    // Setup lottie player
    await this.load(this.src)
    this.dispatchEvent(new CustomEvent(PlayerEvents.Rendered))
  }
  /**
   * Destroy animation and element
   */
  public destroy() {
    if (!this._lottieInstance) {
      return
    }

    this.playerState = PlayerState.Destroyed

    this._lottieInstance.destroy?.()
    this._lottieInstance = null
    this.dispatchEvent(new CustomEvent(PlayerEvents.Destroyed))
    this.remove()

    document.removeEventListener('visibilitychange', this._onVisibilityChange)
  }
  /**
   * Cleanup on component destroy
   */
  disconnectedCallback() {
    // Remove intersection observer for detecting component being out-of-view
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect()
      this._intersectionObserver = undefined
    }

    // Destroy the animation instance
    this._lottieInstance?.destroy?.()

    // Remove the attached Visibility API's change event listener
    document.removeEventListener('visibilitychange', this._onVisibilityChange)
  }

  /**
   * Returns the Lottie instance used in the component
   */
  public getLottie() {
    return this._lottieInstance
  }

  /**
   * Get Lottie Manifest
   */
  public getManifest() {
    return this._manifest
  }

  /**
   * Get Multi-animation settings
   * @returns { AnimationSettings[] }
   */
  public getMultiAnimationSettings() {
    return this._multiAnimationSettings
  }

  /**
   * Get playback segment
   * @returns { AnimationSegment }
   */
  public getSegment() {
    return this._segment
  }

  /**
   * Initialize Lottie Web player
   */
  public async load(src: string | null) {
    if (!this.shadowRoot || !src) {
      return
    }

    // Load the resource
    try {
      const { animations, manifest } = await getAnimationData(src)

      if (
        !animations ||
        animations.some((animation) => !this._isLottie(animation))
      ) {
        throw new Error('Broken or corrupted file')
      }

      this._isBounce = this.mode === PlayMode.Bounce
      if (this._multiAnimationSettings?.length) {
        if (this._multiAnimationSettings[this._currentAnimation]?.mode) {
          this._isBounce =
            this._multiAnimationSettings[this._currentAnimation].mode ===
            PlayMode.Bounce
        }
      }

      this._animations = animations
      this._manifest = manifest ?? {
        animations: [
          {
            autoplay: !this.animateOnScroll && this.autoplay,
            direction: this.direction,
            id: createElementID(),
            loop: this.loop,
            mode: this.mode,
            speed: this.speed,
          },
        ],
      }

      // Clear previous animation, if any
      this._lottieInstance?.destroy?.()

      this.playerState = PlayerState.Stopped
      if (
        !this.animateOnScroll &&
        (this.autoplay ||
          this._multiAnimationSettings?.[this._currentAnimation]?.autoplay)
      ) {
        this.playerState = PlayerState.Playing
      }

      // Initialize lottie player and load animation
      if (!isServer()) {
        this._lottieInstance = Lottie.loadAnimation({
          ...this._getOptions(),
          animationData: animations[this._currentAnimation],
        })
      }
    } catch (err) {
      this._errorMessage = handleErrors(err).message

      this.playerState = PlayerState.Error

      this.dispatchEvent(new CustomEvent(PlayerEvents.Error))
      return
    }

    this._addEventListeners()

    const speed =
        this._multiAnimationSettings?.[this._currentAnimation]?.speed ??
        this.speed ??
        this._manifest.animations[this._currentAnimation].speed,
      direction =
        this._multiAnimationSettings?.[this._currentAnimation]?.direction ??
        this.direction ??
        this._manifest.animations[this._currentAnimation].direction ??
        1

    // Set initial playback speed and direction
    this._lottieInstance?.setSpeed(speed)
    this._lottieInstance?.setDirection(direction)
    this._lottieInstance?.setSubframe(!!this.subframe)

    // Start playing if autoplay is enabled
    if (this.autoplay || this.animateOnScroll) {
      if (this.direction === -1) {
        this.seek('99%')
      }

      if (!('IntersectionObserver' in window)) {
        if (!this.animateOnScroll) {
          this.play()
        }
        this._playerState.visible = true
      }

      this._addIntersectionObserver()
    }
  }

  /**
   * Skip to next animation
   */
  public next() {
    this._currentAnimation++
    this._switchInstance()
  }

  /**
   * Pause
   */
  public pause() {
    if (!this._lottieInstance) {
      return
    }
    if (this.playerState) {
      this._playerState.prev = this.playerState
    }

    try {
      this._lottieInstance.pause()
      this.dispatchEvent(new CustomEvent(PlayerEvents.Pause))
    } finally {
      this.playerState = PlayerState.Paused
    }
  }

  /**
   * Play
   */
  public async play() {
    if (!this._lottieInstance) {
      return
    }
    if (this.playerState) {
      this._playerState.prev = this.playerState
    }

    try {
      this._lottieInstance.play()
      this.dispatchEvent(new CustomEvent(PlayerEvents.Play))
    } finally {
      this.playerState = PlayerState.Playing
    }
  }

  /**
   * Skip to previous animation
   */
  public prev() {
    this._currentAnimation--
    this._switchInstance(true)
  }

  // name: string, oldValue: string, newValue: string
  propertyChangedCallback(name: string, _oldValue: unknown, value: unknown) {
    if (!this.shadow) {
      return
    }

    const togglePlay = this.shadow.querySelector('.togglePlay'),
      stop = this.shadow.querySelector('.stop'),
      prev = this.shadow.querySelector('.prev'),
      next = this.shadow.querySelector('.next'),
      seeker = this.shadow.querySelector('.seeker'),
      progress = this.shadow.querySelector('progress'),
      popover = this.shadow.querySelector('.popover')

    if (
      !(togglePlay instanceof HTMLButtonElement) ||
      !(stop instanceof HTMLButtonElement) ||
      !(next instanceof HTMLButtonElement) ||
      !(prev instanceof HTMLButtonElement) ||
      !(seeker instanceof HTMLInputElement) ||
      !(progress instanceof HTMLProgressElement)
    ) {
      return
    }

    if (name === 'playerState') {
      togglePlay.dataset.active = (
        value === PlayerState.Playing || value === PlayerState.Paused
      ).toString()
      stop.dataset.active = (value === PlayerState.Stopped).toString()

      if (value === PlayerState.Playing) {
        togglePlay.innerHTML = /* HTML */ `
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path
              d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.015h3.984v13.969H6z"
            />
          </svg>
        `
      } else {
        togglePlay.innerHTML = /* HTML */ `
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <path d="M8.016 5.016L18.985 12 8.016 18.984V5.015z" />
          </svg>
        `
      }
    }

    if (name === '_seeker' && typeof value === 'number') {
      seeker.value = value.toString()
      seeker.ariaValueNow = value.toString()
      progress.value = value
    }

    if (name === '_animations' && Array.isArray(value)) {
      if (this._currentAnimation + 1 < value.length) {
        next.hidden = false
      }
    }

    if (name === '_currentAnimation' && typeof value === 'number') {
      if (value + 1 >= this._animations.length) {
        next.hidden = true
      } else {
        next.hidden = false
      }

      if (value) {
        prev.hidden = false
      } else {
        prev.hidden = true
      }
    }

    if (
      name === '_isSettingsOpen' &&
      typeof value === 'boolean' &&
      popover instanceof HTMLDivElement
    ) {
      popover.hidden = !value
    }
  }

  /**
   * Reload animation
   */
  public async reload() {
    if (!this.src) {
      return
    }

    this._lottieInstance?.destroy?.()

    await this.load(this.src)
  }

  /**
   * Seek to a given frame
   * @param { number | string } value Frame to seek to
   */
  public seek(value: number | string) {
    if (!this._lottieInstance) {
      return
    }

    // Extract frame number from either number or percentage value
    const matches = value.toString().match(/^([0-9]+)(%?)$/)
    if (!matches) {
      return
    }

    // Calculate and set the frame number
    const frame = Math.round(
      matches[2] === '%'
        ? (this._lottieInstance.totalFrames * Number(matches[1])) / 100
        : Number(matches[1])
    )

    // Set seeker to new frame number
    this._seeker = frame

    // Send lottie player to the new frame
    if (
      this.playerState === PlayerState.Playing ||
      (this.playerState === PlayerState.Frozen &&
        this._playerState.prev === PlayerState.Playing)
    ) {
      this._lottieInstance.goToAndPlay(frame, true)
      this.playerState = PlayerState.Playing
      return
    }
    this._lottieInstance.goToAndStop(frame, true)
    this._lottieInstance.pause()
  }

  /**
   * Dynamically set count for loops
   */
  public setCount(value: number) {
    this.count = value
  }

  /**
   * Animation play direction
   * @param { AnimationDirection } value Animation direction
   */
  public setDirection(value: AnimationDirection) {
    if (!this._lottieInstance) {
      return
    }
    this._lottieInstance.setDirection(value)
  }

  /**
   * Set loop
   * @param { boolean } value
   */
  public setLoop(value: boolean) {
    if (!this._lottieInstance) {
      return
    }
    this._lottieInstance.setLoop(value)
  }

  /**
   * Set Multi-animation settings
   * @param { AnimationSettings[] } settings
   */
  public setMultiAnimationSettings(settings: AnimationSettings[]) {
    this._multiAnimationSettings = settings
  }

  /**
   * Set playback segment
   * @param { AnimationSegment } settings
   */
  public setSegment(segment: Vector2) {
    this._segment = segment
  }

  /**
   * Set animation playback speed
   * @param { number } value Playback speed
   */
  public setSpeed(value = 1) {
    if (!this._lottieInstance) {
      return
    }
    this._lottieInstance.setSpeed(value)
  }

  /**
   * Toggles subframe, for more smooth animations
   * @param { boolean } value Whether animation uses subframe
   */
  public setSubframe(value: boolean) {
    if (!this._lottieInstance) {
      return
    }
    this._lottieInstance.setSubframe(value)
  }

  /**
   * Snapshot and download the current frame as SVG
   */
  public snapshot(shouldDownload = true, name = 'AM Lottie') {
    try {
      if (!this.shadowRoot) {
        throw new Error('Unknown error')
      }

      // Get SVG element and serialize markup
      const svgElement = this.shadowRoot.querySelector('.animation svg')

      if (!svgElement) {
        throw new Error('Could not retrieve animation from DOM')
      }
      const data =
        svgElement instanceof Node
          ? new XMLSerializer().serializeToString(svgElement)
          : null

      if (!data) {
        throw new Error('Could not serialize SVG element')
      }

      if (shouldDownload) {
        download(data, {
          mimeType: 'image/svg+xml',
          name: `${getFilename(this.src || name)}-${frameOutput(this._seeker)}.svg`,
        })
      }

      return data
    } catch (err) {
      console.error(err)
      return null
    }
  }

  /**
   * Stop
   */
  public stop() {
    if (!this._lottieInstance) {
      return
    }
    if (this.playerState) {
      this._playerState.prev = this.playerState
    }
    this._playerState.count = 0

    try {
      this._lottieInstance.stop()
      this.dispatchEvent(new CustomEvent(PlayerEvents.Stop))
    } finally {
      this.playerState = PlayerState.Stopped
    }
  }

  /**
   * Toggle Boomerang
   */
  public toggleBoomerang() {
    const curr = this._multiAnimationSettings?.[this._currentAnimation]

    if (curr?.mode !== undefined) {
      if (curr.mode === PlayMode.Normal) {
        curr.mode = PlayMode.Bounce
        this._isBounce = true
        return
      }
      curr.mode = PlayMode.Normal
      this._isBounce = false
      return
    }

    if (this.mode === PlayMode.Normal) {
      this.mode = PlayMode.Bounce
      this._isBounce = true
      return
    }

    this.mode = PlayMode.Normal
    this._isBounce = false
  }

  /**
   * Toggle loop
   */
  public toggleLoop() {
    const val = !this.loop
    this.loop = val
    this.setLoop(val)
  }

  /**
   * Toggle playing state
   */
  public togglePlay() {
    if (!this._lottieInstance) {
      return
    }

    const { currentFrame, playDirection, totalFrames } = this._lottieInstance
    if (this.playerState === PlayerState.Playing) {
      return this.pause()
    }
    if (this.playerState !== PlayerState.Completed) {
      return this.play()
    }
    this.playerState = PlayerState.Playing
    if (this._isBounce) {
      this.setDirection((playDirection * -1) as AnimationDirection)
      return this._lottieInstance.goToAndPlay(currentFrame, true)
    }
    if (playDirection === -1) {
      return this._lottieInstance.goToAndPlay(totalFrames, true)
    }
    return this._lottieInstance.goToAndPlay(0, true)
  }

  /**
   * Freeze animation.
   * This internal state pauses animation and is used to differentiate between
   * user requested pauses and component instigated pauses.
   */
  protected _freeze() {
    if (!this._lottieInstance) {
      return
    }

    if (this.playerState) {
      this._playerState.prev = this.playerState
    }

    try {
      this._lottieInstance.pause()
      this.dispatchEvent(new CustomEvent(PlayerEvents.Freeze))
    } finally {
      this.playerState = PlayerState.Frozen
    }
  }

  /**
   * Handle blur
   */
  protected _handleBlur() {
    setTimeout(() => this._toggleSettings(false), 200)
  }

  /**
   * Handles click and drag actions on the progress track
   * @param { Event & { HTMLInputElement } } event
   */
  protected _handleSeekChange({ target }: Event) {
    if (
      !(target instanceof HTMLInputElement) ||
      !this._lottieInstance ||
      isNaN(Number(target.value))
    ) {
      return
    }

    this.seek(
      Math.round(
        (Number(target.value) / 100) * this._lottieInstance.totalFrames
      )
    )
  }

  /**
   * Handle settings click event
   */
  protected _handleSettingsClick = ({ target }: Event) => {
    this._toggleSettings()
    // Because Safari does not add focus on click, we need to add it manually, so the onblur event will fire
    if (target instanceof HTMLElement) {
      target.focus()
    }
  }

  /**
   * Add event listeners
   */
  private _addEventListeners() {
    this._toggleEventListeners('add')
  }

  /**
   * Add IntersectionObserver
   */
  private _addIntersectionObserver() {
    if (
      !this._container ||
      this._intersectionObserver ||
      !('IntersectionObserver' in window)
    ) {
      return
    }

    this._intersectionObserver = new IntersectionObserver((entries) => {
      const { length } = entries
      for (let i = 0; i < length; i++) {
        if (!entries[i].isIntersecting || document.hidden) {
          if (this.playerState === PlayerState.Playing) {
            this._freeze()
          }
          this._playerState.visible = false
          continue
        }
        if (!this.animateOnScroll && this.playerState === PlayerState.Frozen) {
          this.play()
        }
        if (!this._playerState.scrollY) {
          this._playerState.scrollY = scrollY
        }
        this._playerState.visible = true
      }
    })

    this._intersectionObserver.observe(this._container)
  }

  private _complete() {
    if (!this._lottieInstance) {
      return
    }

    if (this._animations.length > 1) {
      if (
        this._multiAnimationSettings?.[this._currentAnimation + 1]?.autoplay
      ) {
        return this.next()
      }
      if (this.loop && this._currentAnimation === this._animations.length - 1) {
        this._currentAnimation = 0
        return this._switchInstance()
      }
    }

    const { currentFrame, totalFrames } = this._lottieInstance
    this._seeker = Math.round((currentFrame / totalFrames) * 100)

    this.playerState = PlayerState.Completed

    this.dispatchEvent(
      new CustomEvent(PlayerEvents.Complete, {
        detail: {
          frame: currentFrame,
          seeker: this._seeker,
        },
      })
    )
  }

  private _dataFailed() {
    this.playerState = PlayerState.Error
    this.dispatchEvent(new CustomEvent(PlayerEvents.Error))
  }

  private _dataReady() {
    this.dispatchEvent(new CustomEvent(PlayerEvents.Load))
  }

  private _DOMLoaded() {
    this._playerState.loaded = true
    this.dispatchEvent(new CustomEvent(PlayerEvents.Ready))
  }

  private _enterFrame() {
    if (!this._lottieInstance) {
      return
    }
    const { currentFrame, totalFrames } = this._lottieInstance
    this._seeker = Math.round((currentFrame / totalFrames) * 100)

    this.dispatchEvent(
      new CustomEvent(PlayerEvents.Frame, {
        detail: {
          frame: currentFrame,
          seeker: this._seeker,
        },
      })
    )
  }

  /**
   * Get options from props
   * @returns { AnimationConfiguration<'svg'> }
   */
  private _getOptions() {
    if (!this._container) {
      throw new Error('Container not rendered')
    }
    const preserveAspectRatio =
        this.preserveAspectRatio ??
        (this.objectfit && aspectRatio(this.objectfit)),
      currentAnimationSettings = this._multiAnimationSettings?.length
        ? this._multiAnimationSettings?.[this._currentAnimation]
        : undefined,
      currentAnimationManifest =
        this._manifest?.animations?.[this._currentAnimation]

    // Loop
    let loop = !!this.loop
    if (
      currentAnimationManifest?.loop !== undefined &&
      this.loop === undefined
    ) {
      loop = !!currentAnimationManifest.loop
    }
    if (currentAnimationSettings?.loop !== undefined) {
      loop = !!currentAnimationSettings.loop
    }

    // Autoplay
    let autoplay = !!this.autoplay
    if (
      currentAnimationManifest?.autoplay !== undefined &&
      this.autoplay === undefined
    ) {
      autoplay = !!currentAnimationManifest.autoplay
    }
    if (currentAnimationSettings?.autoplay !== undefined) {
      autoplay = !!currentAnimationSettings.autoplay
    }
    if (this.animateOnScroll) {
      autoplay = false
    }

    // Segment
    let initialSegment = this._segment
    if (this._segment?.every((val) => val > 0)) {
      initialSegment = [this._segment[0] - 1, this._segment[1] - 1]
    }
    if (this._segment?.some((val) => val < 0)) {
      initialSegment = undefined
    }

    const options: AnimationConfiguration<RendererType.SVG> = {
      autoplay,
      container: this._container,
      initialSegment,
      loop,
      renderer: RendererType.SVG,
      rendererSettings: {
        hideOnTransparent: true,
        imagePreserveAspectRatio: preserveAspectRatio,
        preserveAspectRatio,
        progressiveLoad: true,
      },
    }

    return options
  }

  /**
   * Handle scroll
   */
  private _handleScroll() {
    if (!this.animateOnScroll || !this._lottieInstance) {
      return
    }
    if (isServer()) {
      console.warn(
        'DotLottie: Scroll animations might not work properly in a Server Side Rendering context. Try to wrap this in a client component.'
      )
      return
    }
    if (this._playerState.visible) {
      if (this._playerState.scrollTimeout) {
        clearTimeout(this._playerState.scrollTimeout)
      }
      this._playerState.scrollTimeout = setTimeout(() => {
        this.playerState = PlayerState.Paused
      }, 400)

      const adjustedScroll =
          scrollY > this._playerState.scrollY
            ? scrollY - this._playerState.scrollY
            : this._playerState.scrollY - scrollY,
        clampedScroll = Math.min(
          Math.max(adjustedScroll / 3, 1),
          this._lottieInstance.totalFrames * 3
        ),
        roundedScroll = clampedScroll / 3

      window.requestAnimationFrame(() => {
        if (roundedScroll < (this._lottieInstance?.totalFrames ?? 0)) {
          this.playerState = PlayerState.Playing
          this._lottieInstance?.goToAndStop(roundedScroll, true)
        } else {
          this.playerState = PlayerState.Paused
        }
      })
    }
  }

  private _handleWindowBlur({ type }: FocusEvent) {
    if (this.playerState === PlayerState.Playing && type === 'blur') {
      this._freeze()
    }
    if (this.playerState === PlayerState.Frozen && type === 'focus') {
      this.play()
    }
  }

  private _isLottie(json: AnimationData) {
    const mandatory: string[] = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h']

    return mandatory.every((field: string) =>
      Object.prototype.hasOwnProperty.call(json, field)
    )
  }

  private _loopComplete() {
    if (!this._lottieInstance) {
      return
    }

    const {
        playDirection,
        // firstFrame,
        totalFrames,
      } = this._lottieInstance,
      inPoint = this._segment ? this._segment[0] : 0,
      outPoint = this._segment ? this._segment[0] : totalFrames

    if (this.count) {
      if (this._isBounce) {
        this._playerState.count += 0.5
      } else {
        this._playerState.count += 1
      }

      if (this._playerState.count >= this.count) {
        this.setLoop(false)

        this.playerState = PlayerState.Completed
        this.dispatchEvent(new CustomEvent(PlayerEvents.Complete))

        return
      }
    }

    this.dispatchEvent(new CustomEvent(PlayerEvents.Loop))

    if (this._isBounce) {
      this._lottieInstance.goToAndStop(
        playDirection === -1 ? inPoint : outPoint * 0.99,
        true
      )

      this._lottieInstance.setDirection(
        (playDirection * -1) as AnimationDirection
      )

      return setTimeout(() => {
        if (!this.animateOnScroll) {
          this._lottieInstance?.play()
        }
      }, this.intermission)
    }

    this._lottieInstance.goToAndStop(
      playDirection === -1 ? outPoint * 0.99 : inPoint,
      true
    )

    return setTimeout(() => {
      if (!this.animateOnScroll) {
        this._lottieInstance?.play()
      }
    }, this.intermission)
  }

  /**
   * Handle MouseEnter
   */
  private _mouseEnter() {
    if (this.hover && this.playerState !== PlayerState.Playing) {
      this.play()
    }
  }

  /**
   * Handle MouseLeave
   */
  private _mouseLeave() {
    if (this.hover && this.playerState === PlayerState.Playing) {
      this.stop()
    }
  }

  /**
   * Handle visibility change events
   */
  private _onVisibilityChange() {
    if (document.hidden && this.playerState === PlayerState.Playing) {
      this._freeze()
      return
    }

    if (this.playerState === PlayerState.Frozen) {
      this.play()
    }
  }

  /**
   * Remove event listeners
   */
  private _removeEventListeners() {
    this._toggleEventListeners('remove')
  }

  private _switchInstance(isPrevious = false) {
    // Bail early if there is not animation to play
    if (!this._animations[this._currentAnimation]) {
      return
    }

    try {
      // Clear previous animation
      this._lottieInstance?.destroy?.()

      // Re-initialize lottie player
      if (!isServer()) {
        this._lottieInstance = Lottie.loadAnimation({
          ...this._getOptions(),
          animationData: this._animations[this._currentAnimation],
        })
      }

      // Check play mode for current animation
      if (this._multiAnimationSettings?.[this._currentAnimation]?.mode) {
        this._isBounce =
          this._multiAnimationSettings[this._currentAnimation].mode ===
          PlayMode.Bounce
      }

      // Remove event listeners to new Lottie instance, and add new
      this._removeEventListeners()
      this._addEventListeners()

      this.dispatchEvent(
        new CustomEvent(isPrevious ? PlayerEvents.Previous : PlayerEvents.Next)
      )

      if (
        this._multiAnimationSettings?.[this._currentAnimation]?.autoplay ??
        this.autoplay
      ) {
        if (this.animateOnScroll) {
          this._lottieInstance?.goToAndStop(0, true)
          this.playerState = PlayerState.Paused
          return
        }

        this._lottieInstance?.goToAndPlay(0, true)
        this.playerState = PlayerState.Playing
        return
      }

      this._lottieInstance?.goToAndStop(0, true)
      this.playerState = PlayerState.Stopped
    } catch (err) {
      this._errorMessage = handleErrors(err).message

      this.playerState = PlayerState.Error

      this.dispatchEvent(new CustomEvent(PlayerEvents.Error))
    }
  }

  /**
   * Toggle event listeners
   */
  private _toggleEventListeners(action: 'add' | 'remove') {
    const method = action === 'add' ? 'addEventListener' : 'removeEventListener'

    if (this._lottieInstance) {
      this._lottieInstance[method]('enterFrame', this._enterFrame)
      this._lottieInstance[method]('complete', this._complete)
      this._lottieInstance[method]('loopComplete', this._loopComplete)
      this._lottieInstance[method]('DOMLoaded', this._DOMLoaded)
      this._lottieInstance[method]('data_ready', this._dataReady)
      this._lottieInstance[method]('data_failed', this._dataFailed)
    }

    if (this._container && this.hover) {
      this._container[method]('mouseenter', this._mouseEnter)
      this._container[method]('mouseleave', this._mouseLeave)
    }

    window[method]('focus', this._handleWindowBlur as EventListener, {
      capture: false,
      passive: true,
    })
    window[method]('blur', this._handleWindowBlur as EventListener, {
      capture: false,
      passive: true,
    })

    if (this.animateOnScroll) {
      window[method]('scroll', this._handleScroll, {
        capture: true,
        passive: true,
      })
    }
  }

  /**
   * Toggle show Settings
   */
  private _toggleSettings(flag?: boolean) {
    if (flag === undefined) {
      this._isSettingsOpen = !this._isSettingsOpen
      return
    }
    this._isSettingsOpen = flag
  }
}
