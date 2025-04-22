import type {
  AnimationData,
  LottieAsset,
  LottieManifest,
} from '@aarsteinmedia/lottie-web/light'

import { ObjectFit } from '@/enums'
import { createElementID, isServer } from '@aarsteinmedia/lottie-web/utils'
import { strFromU8, unzip as unzipOrg, type Unzipped } from 'fflate'

export const aspectRatio = (objectFit: string) => {
    switch (objectFit) {
      case ObjectFit.Contain:
      case ObjectFit.ScaleDown:
        return 'xMidYMid meet'
      case ObjectFit.Cover:
        return 'xMidYMid slice'
      case ObjectFit.Fill:
        return 'none'
      case ObjectFit.None:
        return 'xMinYMin slice'
      default:
        return 'xMidYMid meet'
    }
  },
  download = (
    data: string | ArrayBuffer,
    options?: {
      name: string
      mimeType: string
    }
  ) => {
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
  // degToRads = Math.PI / 180,
  // floatEqual = (a: number, b: number) =>
  //   Math.abs(a - b) * 100000 <= Math.min(Math.abs(a), Math.abs(b)),
  // floatZero = (f: number) => Math.abs(f) <= 0.00001,
  frameOutput = (frame?: number) =>
    ((frame ?? 0) + 1).toString().padStart(3, '0'),
  getAnimationData = async (
    input: unknown
  ): Promise<{
    animations: AnimationData[] | null
    manifest: LottieManifest | null
    isDotLottie: boolean
  }> => {
    try {
      if (!input || (typeof input !== 'string' && typeof input !== 'object')) {
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
        } catch (_e) {
          /* empty */
        }
      }

      const { data, manifest } = await getLottieJSON(result)

      return {
        animations: data,
        isDotLottie: true,
        manifest,
      }
    } catch (err) {
      console.error(`❌ ${handleErrors(err).message}`)
      return {
        animations: null,
        isDotLottie: false,
        manifest: null,
      }
    }
  },
  /**
   * Parse URL to get filename
   * @param { string } src The url string
   * @param { boolean } keepExt Whether to include file extension
   * @returns { string } Filename, in lowercase
   */
  /**
   * Get extension from filename, URL or path
   * @param { string } str Filename, URL or path
   */
  getExt = (str?: string) => {
    if (typeof str !== 'string' || !str || !hasExt(str)) {
      return
    }
    return str.split('.').pop()?.toLowerCase()
  },
  getFilename = (src: string, keepExt?: boolean) => {
    // Because the regex strips all special characters, we need to extract the file extension, so we can add it later if we need it
    const ext = getExt(src)
    return `${src.replace(/\.[^.]*$/, '').replace(/\W+/g, '')}${keepExt ? `.${ext}` : ''}`.toLowerCase()
  },
  getLottieJSON = async (resp: Response) => {
    const unzipped = await unzip(resp),
      manifest = getManifest(unzipped),
      data = [],
      toResolve: Promise<void>[] = [],
      { length } = manifest.animations
    for (let i = 0; i < length; i++) {
      const str = strFromU8(
          unzipped[`animations/${manifest.animations[i].id}.json`]
        ),
        lottie: AnimationData = JSON.parse(prepareString(str))

      toResolve.push(resolveAssets(unzipped, lottie.assets))
      data.push(lottie)
    }

    await Promise.all(toResolve)

    return {
      data,
      manifest,
    }
  },
  getManifest = (unzipped: Unzipped) => {
    const file = strFromU8(unzipped['manifest.json'], false),
      manifest: LottieManifest = JSON.parse(file)

    if (!('animations' in manifest)) {
      throw new Error('Manifest not found')
    }
    if (!manifest.animations.length) {
      throw new Error('No animations listed in manifest')
    }

    return manifest
  },
  getMimeFromExt = (ext?: string) => {
    switch (ext) {
      case 'svg':
      case 'svg+xml':
        return 'image/svg+xml'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
      case 'gif':
      case 'webp':
      case 'avif':
        return `image/${ext}`
      case 'mp3':
      case 'mpeg':
      case 'wav':
        return `audio/${ext}`
      default:
        return ''
    }
  },
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
  hasExt = (path: string) => {
    const lastDotIndex = path.split('/').pop()?.lastIndexOf('.')
    return (lastDotIndex ?? 0) > 1 && path.length - 1 > (lastDotIndex ?? 0)
  },
  // inBrowser = () => typeof navigator !== 'undefined',
  isAudio = (asset: LottieAsset) =>
    !('h' in asset) &&
    !('w' in asset) &&
    'p' in asset &&
    'e' in asset &&
    'u' in asset &&
    'id' in asset,
  isBase64 = (str?: string) => {
    if (!str) {
      return false
    }
    const regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    return regex.test(parseBase64(str))
  },
  isImage = (asset: LottieAsset) =>
    'w' in asset && 'h' in asset && !('xt' in asset) && 'p' in asset,
  parseBase64 = (str: string) => str.substring(str.indexOf(',') + 1),
  prepareString = (str: string) =>
    str
      .replace(new RegExp(/"""/, 'g'), '""')
      .replace(/(["'])(.*?)\1/g, (_match, quote: string, content: string) => {
        const replacedContent = content.replace(/[^\w\s\d.#]/g, '')
        return `${quote}${replacedContent}${quote}`
      }),
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
        u8 = unzipped?.[`${type}/${assets[i].p}`]

      if (!u8) {
        continue
      }

      toResolve.push(
        new Promise<void>((resolveAsset) => {
          const assetB64 = isServer()
            ? Buffer.from(u8).toString('base64')
            : btoa(
                u8.reduce(
                  (dat, byte) => `${dat}${String.fromCharCode(byte)}`,
                  ''
                )
              )

          assets[i].p =
            assets[i].p?.startsWith('data:') || isBase64(assets[i].p)
              ? assets[i].p
              : `data:${getMimeFromExt(getExt(assets[i].p))};base64,${assetB64}`
          assets[i].e = 1
          assets[i].u = ''

          resolveAsset()
        })
      )
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
  }
