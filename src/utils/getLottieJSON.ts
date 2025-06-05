import type { AnimationData, LottieManifest } from '@aarsteinmedia/lottie-web'

import {
  strFromU8, unzip as unzipOrg, type Unzipped
} from 'fflate'

import resolveAssets from '@/utils/resolveAssets'

const unzip = async (resp: Response) => {
    const buffer = new Uint8Array(await resp.arrayBuffer()),
      unzipped: Unzipped = await new Promise((resolve, reject) => {
        unzipOrg(buffer, (err, file) => {
          if (err) {
            reject(err)
          }
          resolve(file)
        })
      })

    return unzipped
  },
  getManifest = (unzipped: Unzipped) => {
    const file = strFromU8(unzipped['manifest.json'], false),
      manifest: LottieManifest = JSON.parse(file)

    if (!('animations' in manifest)) {
      throw new Error('Manifest not found')
    }
    if (manifest.animations.length === 0) {
      throw new Error('No animations listed in manifest')
    }

    return manifest
  },
  prepareString = (str: string) =>
    str
      .replaceAll(new RegExp(/"""/, 'g'), '""')
      .replaceAll(/(["'])(.*?)\1/g, (
        _match, quote: string, content: string
      ) => {
        const replacedContent = content.replaceAll(/[^\w\s.#]/g, '')

        return `${quote}${replacedContent}${quote}`
      })

export default async function getLottieJSON (resp: Response) {
  const unzipped = await unzip(resp),
    manifest = getManifest(unzipped),
    data = [],
    toResolve: Promise<void>[] = [],
    { length } = manifest.animations

  /**
   * Check whether Lottie animations folder is abbreviated.
   */
  let animationsFolder = 'animations'

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (unzipped[`a/${manifest.animations[0].id}.json`]) {
    animationsFolder = 'a'
  }

  for (let i = 0; i < length; i++) {
    const str = strFromU8(unzipped[`${animationsFolder}/${manifest.animations[i].id}.json`]),
      lottie: AnimationData = JSON.parse(prepareString(str))

    toResolve.push(resolveAssets(unzipped, lottie.assets))
    data.push(lottie)
  }

  await Promise.all(toResolve)

  return {
    data,
    manifest,
  }
}