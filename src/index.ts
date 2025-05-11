import DotLottiePlayer from '@/elements/DotLottiePlayer'
import { isServer } from '@aarsteinmedia/lottie-web/utils'

export default DotLottiePlayer

export {
  PlayerEvents, PlayerState,PlayMode
} from '@/enums'

export const tagName = 'dotlottie-player'

if (!isServer()) {
  /**
   * Expose DotLottiePlayer class as global variable.
   */
  globalThis.dotLottiePlayer = (): DotLottiePlayer => new DotLottiePlayer()

  /**
   * Add a definition for the custom element to the custom element registry,
   * mapping its name to the constructor which will be used to create it.
   */
  customElements.define('dotlottie-player', DotLottiePlayer)
}
