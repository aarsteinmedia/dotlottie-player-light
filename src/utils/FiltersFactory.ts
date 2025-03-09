import { createNS, inBrowser } from '@/utils'

export default class FilltersFactory {
  static createAlphaToLuminanceFilter() {
    const feColorMatrix = createNS('feColorMatrix')
    if (!(feColorMatrix instanceof SVGFEColorMatrixElement)) {
      throw new Error('Could not create SVG Element')
    }
    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB')
    feColorMatrix.setAttribute(
      'values',
      '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1'
    )
    return feColorMatrix
  }

  static createFilter(filId: string, skipCoordinates?: boolean) {
    const fil = createNS('filter')
    if (!(fil instanceof SVGFilterElement)) {
      throw new Error(`Could not create ${filId} Element`)
    }
    fil.setAttribute('id', filId)
    if (skipCoordinates !== true) {
      fil.setAttribute('filterUnits', 'objectBoundingBox')
      fil.setAttribute('x', '0%')
      fil.setAttribute('y', '0%')
      fil.setAttribute('width', '100%')
      fil.setAttribute('height', '100%')
    }
    return fil
  }
}

export class FeatureSupport {
  maskType = true
  offscreenCanvas = typeof OffscreenCanvas !== 'undefined'
  svgLumaHidden = true
  constructor() {
    if (!inBrowser()) {
      return
    }
    this.maskType =
      !/MSIE 10/i.test(navigator.userAgent) &&
      !/MSIE 9/i.test(navigator.userAgent) &&
      !/rv:11.0/i.test(navigator.userAgent) &&
      !/Edge\/\d./i.test(navigator.userAgent)
    this.svgLumaHidden = !/firefox/i.test(navigator.userAgent)
  }
}
