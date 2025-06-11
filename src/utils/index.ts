import {
  createElementID, _isServer, PreserveAspectRatio
} from '@aarsteinmedia/lottie-web/utils'

import { ObjectFit } from '@/utils/enums'

const hasExt = (path: string) => {
  const lastDotIndex = path.split('/').pop()?.lastIndexOf('.')

  return (lastDotIndex ?? 0) > 1 && path.length - 1 > (lastDotIndex ?? 0)
}


export const aspectRatio = (objectFit: ObjectFit) => {
    switch (objectFit) {
      case ObjectFit.Contain:
      case ObjectFit.ScaleDown: {
        return PreserveAspectRatio.Contain
      }
      case ObjectFit.Cover: {
        return PreserveAspectRatio.Cover
      }
      case ObjectFit.Fill: {
        return PreserveAspectRatio.Initial
      }
      case ObjectFit.None: {
        return PreserveAspectRatio.None
      }
      default: {
        return PreserveAspectRatio.Contain
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
  /**
  * Get extension from filename, URL or path.
  *
  * @param str - Filename, URL or path.
  */
  getExt = (str?: string) => {
    if (typeof str !== 'string' || !str || !hasExt(str)) {
      return
    }

    return str.split('.').pop()?.toLowerCase()
  },
  handleErrors = (err: unknown) => {
    const res = {
      message: 'Unknown error',
      status: _isServer ? 500 : 400,
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
  getFilename = (src: string, keepExt?: boolean) => {
    // Because the regex strips all special characters, we need to extract the file extension, so we can add it later if we need it
    const ext = `.${getExt(src)}`

    return `${src.replace(/\.[^.]*$/, '').replaceAll(/\W+/g, '')}${keepExt ? ext : ''}`.toLowerCase()
  }
