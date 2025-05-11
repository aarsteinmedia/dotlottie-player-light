import { getExt } from '@/utils'
import { expect } from '@esm-bundle/chai'

it('Get extension from filename, URL or path', async () => {
  await expect(getExt('cat.jpg')).to.equal('jpg')
  await expect(getExt('Hello world.jpeg')).to.equal('jpeg')
  await expect(getExt('image.AVIF')).to.equal('avif')
  await expect(getExt('converted.jpg.webp')).to.equal('webp')
})
