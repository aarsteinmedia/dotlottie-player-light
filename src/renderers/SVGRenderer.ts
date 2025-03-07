import type AnimationItem from '@/animation/AnimationItem'
import type { GlobalData, LottieLayer, SVGRendererConfig } from '@/types'

import SVGCompElement from '@/elements/svg/SVGCompElement'
import { RendererType } from '@/enums'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { createNS } from '@/utils'
// import { applyMixins } from '@/utils/functionExtensions'
import { createElementID } from '@/utils/getterSetter'

export default class SVGRenderer extends SVGRendererBase {
  animationItem: AnimationItem
  destroyed: boolean
  elements: any[]
  globalData: null | GlobalData
  layerElement: SVGGElement
  layers: null | LottieLayer[]
  pendingElements: any[]
  renderConfig: SVGRendererConfig
  renderedFrame: number
  rendererType: RendererType
  svgElement: SVGSVGElement
  constructor(animationItem: AnimationItem, config?: SVGRendererConfig) {
    super()
    this.animationItem = animationItem
    this.layers = null
    this.renderedFrame = -1
    this.svgElement = createNS('svg')
    let ariaLabel = ''
    if (config?.title) {
      const titleElement = createNS('title')
      const titleId = createElementID()
      titleElement.setAttribute('id', titleId)
      titleElement.textContent = config.title
      this.svgElement.appendChild(titleElement)
      ariaLabel += titleId
    }
    if (config?.description) {
      const descElement = createNS('desc')
      const descId = createElementID()
      descElement.setAttribute('id', descId)
      descElement.textContent = config.description
      this.svgElement.appendChild(descElement)
      ariaLabel += ` ${descId}`
    }
    if (ariaLabel) {
      this.svgElement.setAttribute('aria-labelledby', ariaLabel)
    }
    const defs = createNS<SVGDefsElement>('defs')
    this.svgElement.appendChild(defs)
    const maskElement = createNS<SVGGElement>('g')
    this.svgElement.appendChild(maskElement)
    this.layerElement = maskElement
    this.renderConfig = {
      className: config?.className || '',
      contentVisibility: config?.contentVisibility || 'visible',
      filterSize: {
        height: (config?.filterSize && config.filterSize.height) || '100%',
        width: (config?.filterSize && config.filterSize.width) || '100%',
        x: (config?.filterSize && config.filterSize.x) || '0%',
        y: (config?.filterSize && config.filterSize.y) || '0%',
      },
      focusable: config?.focusable,
      height: config?.height,
      hideOnTransparent: !(config?.hideOnTransparent === false),
      id: config?.id || '',
      imagePreserveAspectRatio:
        config?.imagePreserveAspectRatio || 'xMidYMid slice',
      preserveAspectRatio: config?.preserveAspectRatio || 'xMidYMid meet',
      progressiveLoad: config?.progressiveLoad || false,
      runExpressions:
        !config || config.runExpressions === undefined || config.runExpressions,
      viewBoxOnly: config?.viewBoxOnly || false,
      viewBoxSize: config?.viewBoxSize || false,
      width: config?.width,
    }

    this.globalData = {
      _mdf: false,
      defs: defs,
      frameNum: -1,
      frameRate: 60,
      renderConfig: this.renderConfig,
    }
    this.elements = []
    this.pendingElements = []
    this.destroyed = false
    this.rendererType = RendererType.SVG
  }

  createComp(data: LottieLayer) {
    return new SVGCompElement(data, this.globalData, this as any)
  }
}

// applyMixins(SVGRenderer, [SVGRendererBase])

// interface SVGRenderer extends SVGRendererBase {}

// export default SVGRenderer
