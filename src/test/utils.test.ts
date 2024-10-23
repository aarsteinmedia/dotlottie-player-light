import { expect } from '@esm-bundle/chai'
import { getExt } from '@/utils'

it('sums up 2 numbers', () => {
  expect(getExt('Hello world.jpeg')).to.equal('jpeg')
  expect(getExt('image.AVIF')).to.equal('avif')
})
