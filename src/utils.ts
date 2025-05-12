import type {
  AnimationData,
  LottieAsset,
  LottieManifest,
} from '@aarsteinmedia/lottie-web/light'

import { ObjectFit } from '@/enums'
import { createElementID, isServer } from '@aarsteinmedia/lottie-web/utils'
import {
  strFromU8, unzip as unzipOrg, type Unzipped
} from 'fflate'

const hasExt = (path: string) => {
  const lastDotIndex = path.split('/').pop()?.lastIndexOf('.')

  return (lastDotIndex ?? 0) > 1 && path.length - 1 > (lastDotIndex ?? 0)
}

/**
 * Get extension from filename, URL or path.
 *
 * @param str - Filename, URL or path.
 */
export const getExt = (str?: string) => {
  if (typeof str !== 'string' || !str || !hasExt(str)) {
    return
  }

  return str.split('.').pop()?.toLowerCase()
}


const getMimeFromExt = (ext = '') => {
    switch (ext) {
      case 'svg':
      case 'svg+xml': {
        return 'image/svg+xml'
      }
      case 'jpg':
      case 'jpeg': {
        return 'image/jpeg'
      }
      case 'png':
      case 'gif':
      case 'webp':
      case 'avif': {
        return `image/${ext}`
      }
      case 'mp3':
      case 'mpeg':
      case 'wav': {
        return `audio/${ext}`
      }
      default: {
        return ''
      }
    }
  },
  isAudio = (asset: LottieAsset) =>
    !('h' in asset) &&
    !('w' in asset) &&
    'p' in asset &&
    'e' in asset &&
    'u' in asset &&
    'id' in asset,
  parseBase64 = (str: string) => str.slice(Math.max(0, str.indexOf(',') + 1)),
  isBase64 = (str?: string) => {
    if (!str) {
      return false
    }
    const regex =
      /^(?:[0-9a-z+/]{4})*(?:[0-9a-z+/]{2}==|[0-9a-z+/]{3}=)?$/i


    return regex.test(parseBase64(str))
  },
  isImage = (asset: LottieAsset) =>
    'w' in asset && 'h' in asset && !('xt' in asset) && 'p' in asset,
  resolveAssets = async (unzipped: Unzipped, assets?: LottieAsset[]) => {
    if (!Array.isArray(assets)) {
      return
    }

    const toResolve: Promise<void>[] = [],
      { length } = assets

    for (let i = 0; i < length; i++) {
      if (!isAudio(assets[i]) && !isImage(assets[i])) {
        continue
      }

      const type = isImage(assets[i]) ? 'images' : 'audio',
        u8 = unzipped[`${type}/${assets[i].p}`]

      if (u8.length === 0) {
        continue
      }

      toResolve.push(new Promise<void>((resolveAsset) => {
        const assetB64 = isServer()
          ? Buffer.from(u8).toString('base64')
          : btoa(
            // eslint-disable-next-line unicorn/no-array-reduce
            u8.reduce((dat, byte) => `${dat}${String.fromCharCode(byte)}`,
              ''))

        assets[i].p =
            assets[i].p?.startsWith('data:') || isBase64(assets[i].p)
              ? assets[i].p
              : `data:${getMimeFromExt(getExt(assets[i].p))};base64,${assetB64}`
        assets[i].e = 1
        assets[i].u = ''

        resolveAsset()
      }))
    }

    await Promise.all(toResolve)
  },
  unzip = async (resp: Response) => {
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
      }),
  getLottieJSON = async (resp: Response) => {
    const unzipped = await unzip(resp),
      manifest = getManifest(unzipped),
      data = [],
      toResolve: Promise<void>[] = [],
      { length } = manifest.animations

    for (let i = 0; i < length; i++) {
      const str = strFromU8(unzipped[`animations/${manifest.animations[i].id}.json`]),
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

export const aspectRatio = (objectFit: ObjectFit) => {
    switch (objectFit) {
      case ObjectFit.Contain:
      case ObjectFit.ScaleDown: {
        return 'xMidYMid meet'
      }
      case ObjectFit.Cover: {
        return 'xMidYMid slice'
      }
      case ObjectFit.Fill: {
        return 'none'
      }
      case ObjectFit.None: {
        return 'xMinYMin slice'
      }
      default: {
        return 'xMidYMid meet'
      }
    }
  },
  download = (data: string | ArrayBuffer,
    options?: {
      name: string
      mimeType: string
    }) => {
    const blob = new Blob([data], { type: options?.mimeType }),
      fileName = options?.name || createElementID(),
      dataURL = URL.createObjectURL(blob),
      link = document.createElement('a')

    link.href = dataURL
    link.download = fileName
    link.hidden = true
    document.body.appendChild(link)

    link.click()

    setTimeout(() => {
      link.remove()
      URL.revokeObjectURL(dataURL)
    }, 1000)
  },
  frameOutput = (frame?: number) =>
    ((frame ?? 0) + 1).toString().padStart(3, '0'),
  handleErrors = (err: unknown) => {
    const res = {
      message: 'Unknown error',
      status: isServer() ? 500 : 400,
    }

    if (err && typeof err === 'object') {
      if ('message' in err && typeof err.message === 'string') {
        res.message = err.message
      }
      if ('status' in err) {
        res.status = Number(err.status)
      }
    }

    return res
  },
  getAnimationData = async (input: unknown): Promise<{
    animations: AnimationData[] | null
    manifest: LottieManifest | null
    isDotLottie: boolean
  }> => {
    try {
      if (!input || typeof input !== 'string' && typeof input !== 'object') {
        throw new Error('Broken file or invalid file format')
      }

      if (typeof input !== 'string') {
        const animations = Array.isArray(input) ? input : [input]

        return {
          animations,
          isDotLottie: false,
          manifest: null,
        }
      }

      const result = await fetch(input)

      if (!result.ok) {
        throw new Error(result.statusText)
      }

      /**
       * Check if file is JSON, first by parsing file name for extension,
       * then – if filename has no extension – by cloning the response
       * and parsing it for content.
       */
      const ext = getExt(input)

      if (ext === 'json' || !ext) {
        if (ext) {
          const lottie = await result.json()

          return {
            animations: [lottie],
            isDotLottie: false,
            manifest: null,
          }
        }
        const text = await result.clone().text()

        try {
          const lottie = JSON.parse(text)

          return {
            animations: [lottie],
            isDotLottie: false,
            manifest: null,
          }
        } catch (error) {
          /* empty */
        }
      }

      const { data, manifest } = await getLottieJSON(result)

      return {
        animations: data,
        isDotLottie: true,
        manifest,
      }
    } catch (error) {
      console.error(`❌ ${handleErrors(error).message}`)

      return {
        animations: null,
        isDotLottie: false,
        manifest: null,
      }
    }
  },
  getFilename = (src: string, keepExt?: boolean) => {
    // Because the regex strips all special characters, we need to extract the file extension, so we can add it later if we need it
    const ext = `.${getExt(src)}`

    return `${src.replace(/\.[^.]*$/, '').replaceAll(/\W+/g, '')}${keepExt ? ext : ''}`.toLowerCase()
  }
