import { isServer, PreserveAspectRatio } from '@aarsteinmedia/lottie-web/utils'

import { ObjectFit } from '@/utils/enums'

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

  frameOutput = (frame?: number) =>
    ((frame ?? 0) + 1).toString().padStart(3, '0'),

  handleErrors = (err: unknown) => {
    const res = {
      message: 'Unknown error',
      status: isServer ? 500 : 400,
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
  }
