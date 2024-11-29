import { fixture } from '@open-wc/testing'
import { assert, expect } from '@esm-bundle/chai'
import DotLottiePlayer from '@/index'

describe('DotLottiePlayer Component', () => {
  let el: DotLottiePlayer

  beforeEach(async () => {
    el = await fixture<DotLottiePlayer>(
      /* HTML */ `<dotlottie-player
        controls
        src="./assets/dev.lottie"
      ></dotlottie-player>`
    )

    assert(el instanceof DotLottiePlayer)
  })

  it('Is loaded', () => {
    assert('load' in el)
  })

  it('Passes the a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })
})
