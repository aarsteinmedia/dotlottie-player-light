import { createNS, inBrowser } from '@/utils'

/**
 *
 */
export function createAlphaToLuminanceFilter() {
  const feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')
  if (!feColorMatrix) {
    throw new Error('Could not create SVGFEColorMatrixElement Element')
  }
  feColorMatrix.setAttribute('type', 'matrix')
  feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB')
  feColorMatrix.setAttribute(
    'values',
    '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1'
  )
  return feColorMatrix
}

/**
 *
 */
export function createFilter(filId: string, skipCoordinates?: boolean) {
  const fil = createNS<SVGFilterElement>('filter')
  if (!fil) {
    throw new Error(`Could not create ${filId} filter element`)
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
