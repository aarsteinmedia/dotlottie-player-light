import { PlayMode } from '@aarsteinmedia/lottie-web/utils'

import type DotLottiePlayer from '@/elements/DotLottiePlayer'

import boomerangIcon from '@/templates/icons/boomerangIcon'
import downloadIcon from '@/templates/icons/downloadIcon'
import loopIcon from '@/templates/icons/loopIcon'
import nextIcon from '@/templates/icons/nextIcon'
import playIcon from '@/templates/icons/playIcon'
import prevIcon from '@/templates/icons/prevIcon'
import settingsIcon from '@/templates/icons/settingsIcon'
import stopIcon from '@/templates/icons/stopIcon'
import { PlayerState } from '@/utils/enums'

/**
 * Render Controls.
 */
export default function renderControls(this: DotLottiePlayer) {
  if (!this.shadow) {
    return
  }

  const slot = this.shadow.querySelector('slot[name=controls]')

  if (!slot) {
    return
  }

  if (!this.controls) {
    slot.innerHTML = ''

    return
  }

  slot.innerHTML = /* HTML */ `
    <div
        class="lottie-controls toolbar ${this.playerState === PlayerState.Error
          ? 'has-error'
          : ''}"
        aria-label="Lottie Animation controls"
      >
        <button
          class="togglePlay"
          data-active="false"
          tabindex="0"
          aria-label="Toggle Play/Pause"
        >
          ${playIcon}
        </button>

        <button class="stop" data-active="true" tabindex="0" aria-label="Stop">
          ${stopIcon}
        </button>
        <button class="prev" tabindex="0" aria-label="Previous animation" hidden>
          ${prevIcon}
        </button>
        <button class="next" tabindex="0" aria-label="Next animation" hidden>
          ${nextIcon}
        </button>
        <form class="progress-container${this.simple ? ' simple' : ''}">
          <input
            class="seeker"
            type="range"
            min="0"
            max="100"
            step="1"
            value="${this._seeker.toString()}"
            aria-valuemin="0"
            aria-valuemax="100"
            role="slider"
            aria-valuenow="${this._seeker.toString()}"
            tabindex="0"
            aria-label="Slider for search"
          />
          <progress max="100" value="${this._seeker}"></progress>
        </form>
        ${this.simple
          ? ''
          : /* HTML */ `
            <button
              class="toggleLoop"
              data-active="${this.loop}"
              tabindex="0"
              aria-label="Toggle loop"
            >
              ${loopIcon}
            </button>
            <button
              class="toggleBoomerang"
              data-active="${this.mode === PlayMode.Bounce}"
              aria-label="Toggle boomerang"
              tabindex="0"
            >
              ${boomerangIcon}
            </button>
            <button
              class="toggleSettings"
              aria-label="Settings"
              aria-haspopup="true"
              aria-expanded="${Boolean(this._isSettingsOpen)}"
              aria-controls="${this._identifier}-settings"
            >
              ${settingsIcon}
            </button>
            <div id="${this._identifier}-settings" class="popover" hidden>
              <button
                class="snapshot"
                aria-label="Download still image"
                tabindex="0"
              >
                ${downloadIcon}
                Download still image
              </button>
            </div>
          `}
      </div>
  `

  const togglePlay = this.shadow.querySelector('.togglePlay')

  if (togglePlay instanceof HTMLButtonElement) {
    togglePlay.onclick = this.togglePlay
  }

  const stop = this.shadow.querySelector('.stop')

  if (stop instanceof HTMLButtonElement) {
    stop.onclick = this.stop
  }

  const prev = this.shadow.querySelector('.prev')

  if (prev instanceof HTMLButtonElement) {
    prev.onclick = this.prev
  }

  const next = this.shadow.querySelector('.next')

  if (next instanceof HTMLButtonElement) {
    next.onclick = this.next
  }

  const seeker = this.shadow.querySelector('.seeker')

  if (seeker instanceof HTMLInputElement) {
    seeker.onchange = this._handleSeekChange
    seeker.onmousedown = this._freeze
  }

  if (!this.simple) {
    const toggleLoop = this.shadow.querySelector('.toggleLoop')

    if (toggleLoop instanceof HTMLButtonElement) {
      toggleLoop.onclick = this.toggleLoop
    }

    const toggleBoomerang = this.shadow.querySelector('.toggleBoomerang')

    if (toggleBoomerang instanceof HTMLButtonElement) {
      toggleBoomerang.onclick = this.toggleBoomerang
    }

    const snapshot = this.shadow.querySelector('.snapshot')

    if (snapshot instanceof HTMLButtonElement) {
      snapshot.onclick = () => this.snapshot(true)
    }

    const toggleSettings = this.shadow.querySelector('.toggleSettings')

    if (toggleSettings instanceof HTMLButtonElement) {
      toggleSettings.onclick = this._handleSettingsClick
      toggleSettings.onblur = this._handleBlur
    }
  }
}
