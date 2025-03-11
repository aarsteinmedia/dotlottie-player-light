import type { Transformer } from '@/types'

import MaskElement from '@/elements/MaskElement'
import SVGEffects from '@/elements/svg/SVGEffects'
import BaseRenderer from '@/renderers/BaseRenderer'
import { createNS } from '@/utils'
import FiltersFactory, { FeatureSupport } from '@/utils/FiltersFactory'
import { createElementID, getLocationHref } from '@/utils/getterSetter'

export default class SVGBaseElement extends BaseRenderer {
  _sizeChanged?: boolean
  finalTransform?: Transformer
  maskedElement?: SVGGElement
  matteElement?: SVGGElement
  matteMasks?: {
    [key: number]: string
  }
  renderableEffectsManager?: SVGEffects
  transformedElement?: SVGGElement
  createContainerElements() {
    this.matteElement = createNS<SVGGElement>('g')
    this.transformedElement = this.layerElement
    this.maskedElement = this.layerElement
    this._sizeChanged = false
    let layerElementParent = null
    // If this layer acts as a mask for the following layer
    if (this.data?.td) {
      this.matteMasks = {}
      const gg = createNS<SVGGElement>('g')
      if (this.layerId) {
        gg.setAttribute('id', this.layerId)
      }
      if (this.layerElement) {
        gg.appendChild(this.layerElement)
      }

      layerElementParent = gg
      this.globalData?.defs.appendChild(gg)
    } else if (this.data?.tt) {
      if (this.layerElement) {
        this.matteElement.appendChild(this.layerElement)
      }

      layerElementParent = this.matteElement
      this.baseElement = this.matteElement
    } else {
      this.baseElement = this.layerElement
    }
    if (this.data?.ln) {
      this.layerElement?.setAttribute('id', this.data.ln)
    }
    if (this.data?.cl) {
      this.layerElement?.setAttribute('class', this.data.cl)
    }
    // Clipping compositions to hide content that exceeds boundaries. If collapsed transformations is on, component should not be clipped
    if (this.data?.ty === 0 && !this.data.hd) {
      const cp = createNS<SVGClipPathElement>('clipPath'),
        pt = createNS<SVGPathElement>('path')
      pt.setAttribute(
        'd',
        `M0,0 L${this.data.w},0 L${this.data.w},${this.data.h} L0,${
          this.data.h
        }z`
      )
      const clipId = createElementID()
      cp.setAttribute('id', clipId)
      cp.appendChild(pt)
      this.globalData?.defs.appendChild(cp)

      if (this.checkMasks()) {
        const cpGroup = createNS<SVGGElement>('g')
        cpGroup.setAttribute('clip-path', `url(${getLocationHref()}#${clipId})`)
        if (this.layerElement) {
          cpGroup.appendChild(this.layerElement)
        }

        this.transformedElement = cpGroup
        if (layerElementParent) {
          layerElementParent.appendChild(this.transformedElement)
        } else {
          this.baseElement = this.transformedElement
        }
      } else {
        this.layerElement?.setAttribute(
          'clip-path',
          `url(${getLocationHref()}#${clipId})`
        )
      }
    }
    if (this.data?.bm !== 0) {
      this.setBlendMode() // TODO: Must be inherited
    }
  }
  createRenderableComponents() {
    if (!this.data || !this.globalData) {
      throw new Error("Can't access Global Data")
    }
    this.maskManager = new MaskElement(this.data, this, this.globalData)
    this.renderableEffectsManager = new SVGEffects(this as any)
    this.searchEffectTransforms() // TODO: Must be inherited
  }
  destroyBaseElement() {
    this.layerElement = null as any
    this.matteElement = null as any
    this.maskManager?.destroy()
  }
  getBaseElement() {
    if (this.data?.hd) {
      return null
    }
    return this.baseElement
  }
  getMatte(matteType = 1): string {
    // This should not be a common case. But for backward compatibility, we'll create the matte object.
    // It solves animations that have two consecutive layers marked as matte masks.
    // Which is an undefined behavior in AE.
    if (!this.matteMasks) {
      this.matteMasks = {}
    }
    const featureSupport = new FeatureSupport()
    if (!this.matteMasks[matteType]) {
      const id = `${this.layerId}_${matteType}`
      let filId
      let fil
      let useElement
      let gg
      if (matteType === 1 || matteType === 3) {
        const masker = createNS('mask')
        masker?.setAttribute('id', id)
        masker?.setAttribute(
          'mask-type',
          matteType === 3 ? 'luminance' : 'alpha'
        )
        useElement = createNS('use')
        useElement?.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'href',
          `#${this.layerId}`
        )
        masker.appendChild(useElement)
        this.globalData?.defs.appendChild(masker)
        if (!featureSupport.maskType && matteType === 1) {
          masker.setAttribute('mask-type', 'luminance')
          filId = createElementID()
          fil = FiltersFactory.createFilter(filId)
          this.globalData?.defs.appendChild(fil)
          fil.appendChild(FiltersFactory.createAlphaToLuminanceFilter())
          gg = createNS('g')
          gg?.appendChild(useElement)
          masker.appendChild(gg)
          gg?.setAttribute('filter', `url(${getLocationHref()}#${filId})`)
        }
      } else if (matteType === 2) {
        const maskGroup = createNS('mask')
        maskGroup.setAttribute('id', id)
        maskGroup.setAttribute('mask-type', 'alpha')
        const maskGrouper = createNS('g')
        maskGroup.appendChild(maskGrouper)
        filId = createElementID()
        fil = FiltersFactory.createFilter(filId)
        // / /
        const feCTr = createNS<SVGFEComponentTransferElement>(
          'feComponentTransfer'
        )
        feCTr.setAttribute('in', 'SourceGraphic')
        fil.appendChild(feCTr)
        const feFunc = createNS('feFuncA')
        feFunc.setAttribute('type', 'table')
        feFunc.setAttribute('tableValues', '1.0 0.0')
        feCTr.appendChild(feFunc)
        // / /
        this.globalData?.defs.appendChild(fil)
        const alphaRect = createNS<SVGRectElement>('rect')
        if (!alphaRect) {
          throw new Error('Could not create RECT element')
        }
        alphaRect.setAttribute('width', `${Number(this.comp?.data?.w)}`)
        alphaRect.setAttribute('height', `${Number(this.comp?.data?.h)}`)
        alphaRect.setAttribute('x', '0')
        alphaRect.setAttribute('y', '0')
        alphaRect.setAttribute('fill', '#ffffff')
        alphaRect.setAttribute('opacity', '0')
        maskGrouper.setAttribute('filter', `url(${getLocationHref()}#${filId})`)
        maskGrouper.appendChild(alphaRect)
        useElement = createNS('use')
        useElement.setAttributeNS(
          'http://www.w3.org/1999/xlink',
          'href',
          `#${this.layerId}`
        )
        maskGrouper.appendChild(useElement)
        if (!featureSupport.maskType) {
          maskGroup.setAttribute('mask-type', 'luminance')
          fil.appendChild(FiltersFactory.createAlphaToLuminanceFilter())
          gg = createNS('g')
          maskGrouper.appendChild(alphaRect)
          if (this.layerElement) {
            gg.appendChild(this.layerElement)
          }

          maskGrouper.appendChild(gg)
        }
        this.globalData?.defs.appendChild(maskGroup)
      }
      this.matteMasks[matteType] = id
    }
    return this.matteMasks[matteType]
  }
  initRendererElement() {
    this.layerElement = createNS('g')
  }
  renderElement() {
    if (this.finalTransform?._localMatMdf) {
      this.transformedElement?.setAttribute(
        'transform',
        this.finalTransform.localMat.to2dCSS()
      )
    }
    if (this.finalTransform?._opMdf) {
      this.transformedElement?.setAttribute(
        'opacity',
        `${this.finalTransform.localOpacity}`
      )
    }
  }
  // setBlendMode() {
  //   throw new Error('Method not yet implemented') TODO: Must be inherited
  // }
  // searchEffectTransforms() {
  //   throw new Error('Method not yet implemented') TODO: Must be inherited
  // }
  setMatte(id: string) {
    if (!this.matteElement) {
      return
    }
    this.matteElement.setAttribute('mask', `url(${getLocationHref()}#${id})`)
  }
}
