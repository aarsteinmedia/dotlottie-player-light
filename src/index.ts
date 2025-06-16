import {
  isServer, PlayerEvents, PlayMode
} from '@aarsteinmedia/lottie-web/utils'

import DotLottiePlayer from '@/elements/DotLottiePlayer'

export default DotLottiePlayer

export { PlayerEvents, PlayMode }
export { PlayerState } from '@/utils/enums'

export const tagName = 'dotlottie-player'

if (!isServer) {
  /**
   * Expose DotLottiePlayer class as global variable.
   */
  globalThis.dotLottiePlayer = (): DotLottiePlayer => new DotLottiePlayer()

  /**
   * Add a definition for the custom element to the custom element registry,
   * mapping its name to the constructor which will be used to create it.
   */
  customElements.define(tagName, DotLottiePlayer)
}
