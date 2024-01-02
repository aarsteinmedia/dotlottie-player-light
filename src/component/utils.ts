import {
  strFromU8,
  unzip as unzipOrg,
  type Unzipped
} from 'fflate'

import type {
  LottieAsset,
  LottieJSON,
  LottieManifest,
  ObjectFit
} from './types'

export enum PlayerState {
  Completed = 'completed',
  Destroyed = 'destroyed',
  Error = 'error',
  Frozen = 'frozen',
  Loading = 'loading',
  Paused = 'paused',
  Playing = 'playing',
  Stopped = 'stopped',
}

export enum PlayMode {
  Bounce = 'bounce',
  Normal = 'normal',
}

export enum PlayerEvents {
  Complete = 'complete',
  Destroyed = 'destroyed',
  Error = 'error',
  Frame = 'frame',
  Freeze = 'freeze',
  Load = 'load',
  Loop = 'loop',
  Next = 'next',
  Pause = 'pause',
  Play = 'play',
  Previous = 'previous',
  Ready = 'ready',
  Rendered = 'rendered',
  Stop = 'stop',
}

export class CustomError extends Error {
  status?: number
}

export const aspectRatio = (objectFit: ObjectFit) => {
  switch (objectFit) {
    case 'contain':
    case 'scale-down':
      return 'xMidYMid meet';
    case 'cover':
      return 'xMidYMid slice';
    case 'fill':
      return 'none';
    case 'none':
      return 'xMinYMin slice';
    default:
      return 'xMidYMid meet';
  }
},

  /**
   * Download file, either SVG or dotLottie.
   * @param { string } data The data to be downloaded
   * @param { string } name Don't include file extension in the filename
   */
  download = (
    data: string | ArrayBuffer,
    options?: {
      name: string,
      mimeType: string
    }
  ) => {
    const blob = new Blob([data], { type: options?.mimeType }),

      fileName = options?.name || useId(),
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

  getAnimationData = async (input: unknown): Promise<{
    animations: LottieJSON[] | null
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
          manifest: null,
          isDotLottie: false
        }
      }

      const result = await fetch(input)

      if (!result.ok) {
        const error = new CustomError(result.statusText)
        error.status = result.status
        throw error
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
            manifest: null,
            isDotLottie: false
          }
        }
        const text = await result.clone().text()
        try {
          const lottie = JSON.parse(text)
          return {
            animations: [lottie],
            manifest: null,
            isDotLottie: false
          }
        } catch (e) {
          console.warn(e)
        }
      }

      const { data, manifest } = await getLottieJSON(result)

      return {
        animations: data,
        manifest,
        isDotLottie: true
      }

    } catch (err) {
      console.error(`❌ ${handleErrors(err).message}`)
      return {
        animations: null,
        manifest: null,
        isDotLottie: false
      }
    }
  },

  /**
   * Get extension from filename, URL or path
   * @param { string } str Filename, URL or path
   */
  getExt = (str?: string) => {
    if (!str || !hasExt(str))
      return
    return str.split('.').pop()?.toLowerCase()
  },

  /**
   * Parse URL to get filename
   * @param { string } src The url string
   * @param { boolean } keepExt Whether to include file extension
   * @returns { string } Filename, in lowercase
   */
  getFilename = (src: string, keepExt?: boolean) => {
    // Because the regex strips all special characters, we need to extract the file extension, so we can add it later if we need it
    const ext = getExt(src)
    return `${src.replace(/\.[^.]*$/, '').replace(/\W+/g, '')}${keepExt ? `.${ext}` : ''}`.toLowerCase()
  },

  getLottieJSON = async (resp: Response) => {
    const unzipped = await unzip(resp),
      manifest = getManifest(unzipped),
      data = [],
      toResolve: Promise<void>[] = []
    for (const { id } of manifest.animations) {
      const str = strFromU8(unzipped[`animations/${id}.json`]),
        lottie: LottieJSON = JSON.parse(str)

      toResolve.push(resolveAssets(unzipped, lottie.assets))
      data.push(lottie)
    }

    await Promise.all(toResolve)

    return {
      data,
      manifest
    }
  },

  getManifest = (unzipped: Unzipped) => {
    const file = strFromU8(unzipped['manifest.json'], false),
      manifest: LottieManifest = JSON.parse(file)

    if (!('animations' in manifest))
      throw new Error('Manifest not found')
    if (!manifest.animations.length)
      throw new Error('No animations listed in manifest')

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
      status: isServer() ? 500 : 400
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

  isAudio = (asset: LottieAsset) =>
    !('h' in asset) && !('w' in asset) && 'p' in asset && 'e' in asset && 'u' in asset && 'id' in asset,

  isBase64 = (str?: string) => {
    if (!str)
      return false
    const regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    return regex.test(parseBase64(str))
  },

  isImage = (asset: LottieAsset) =>
    'w' in asset && 'h' in asset && !('xt' in asset) && 'p' in asset,

  isServer = () =>
    !(typeof window !== 'undefined' && window.document),

  parseBase64 = (str: string) =>
    str.substring(str.indexOf(',') + 1),

  resolveAssets = async (unzipped: Unzipped, assets?: LottieAsset[]) => {
    if (!Array.isArray(assets))
      return

    const toResolve: Promise<void>[] = []

    for (const asset of assets) {
      if (!isAudio(asset) && !isImage(asset))
        continue

      const type = isImage(asset) ? 'images' : 'audio',
        u8 = unzipped?.[`${type}/${asset.p}`]

      if (!u8)
        continue

      toResolve.push(
        new Promise<void>(resolveAsset => {
          const assetB64 = isServer() ? Buffer.from(u8).toString('base64') :
            btoa(u8.reduce((dat, byte) => (
              `${dat}${String.fromCharCode(byte)}`
            ), ''))

          asset.p = (asset.p?.startsWith('data:') || isBase64(asset.p)) ? asset.p :
            `data:${getMimeFromExt(getExt(asset.p))};base64,${assetB64}`
          asset.e = 1
          asset.u = ''

          resolveAsset()
        })
      )
    }

    await Promise.all(toResolve)
  },

  unzip = async (
    resp: Response,
    // filter: UnzipFileFilter = () => true
  ): Promise<Unzipped> => {
    const buffer = new Uint8Array(await resp.arrayBuffer()),
      unzipped = await new Promise<Unzipped>((resolve, reject) => {
        unzipOrg(buffer, /*{ filter },*/(err, file) => {
          if (err) reject(err)
          resolve(file)
        })
      })
    // console.log('unzipped', unzipped)
    return unzipped
  },

  useId = (prefix?: string) => {
    const s4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return (`${prefix ?? `:${s4()}`}-${s4()}`)
  }