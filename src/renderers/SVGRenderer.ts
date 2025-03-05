import type AnimationItem from '@/animation/AnimationItem'
import type { GlobalData, LottieLayer, SVGRendererConfig } from '@/types'

import SVGCompElement from '@/elements/svg/SVGCompElement'
import { RendererType } from '@/enums'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { createNS } from '@/utils'
import { extendPrototype } from '@/utils/functionExtensions'
import { createElementID } from '@/utils/getterSetter'

/**
 *
 */
export default function SVGRenderer(
  this: {
    animationItem: AnimationItem
    layers: null | LottieLayer[]
    renderedFrame: number
    svgElement: SVGSVGElement
    layerElement: SVGGElement
    renderConfig: SVGRendererConfig
    globalData: GlobalData
    elements: any[]
    pendingElements: any[]
    destroyed: boolean
    rendererType: RendererType
  },
  animationItem: AnimationItem,
  config?: SVGRendererConfig
) {
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
    renderConfig: this.renderConfig,
  }
  this.elements = []
  this.pendingElements = []
  this.destroyed = false
  this.rendererType = RendererType.SVG
}

extendPrototype([SVGRendererBase], SVGRenderer)

SVGRenderer.prototype.createComp = function (data: LottieLayer) {
  return new (SVGCompElement as any)(data, this.globalData, this)
}
