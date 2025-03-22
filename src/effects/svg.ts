import { GroupEffect } from '@/effects/EffectsManager'
import TransformEffect from '@/effects/TransformEffect'
import { ElementInterfaceIntersect, SVGRendererConfig, Vector3 } from '@/types'
import { createNS, degToRads, rgbToHex } from '@/utils'
import { createElementID, getLocationHref } from '@/utils/getterSetter'

abstract class SVGComposableEffect {
  createMergeNode(resultId: string, ins: string[]) {
    const feMerge = createNS<SVGFEMergeElement>('feMerge')
    feMerge.setAttribute('result', resultId)
    let feMergeNode
    const { length } = ins
    for (let i = 0; i < length; i++) {
      feMergeNode = createNS<SVGFEMergeNodeElement>('feMergeNode')
      feMergeNode.setAttribute('in', ins[i])
      feMerge.appendChild(feMergeNode)
      feMerge.appendChild(feMergeNode)
    }
    return feMerge
  }
}

const linearFilterValue =
  '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0'

export class SVGTintFilter extends SVGComposableEffect {
  filterManager: GroupEffect
  linearFilter: SVGFEColorMatrixElement
  matrixFilter: SVGFEColorMatrixElement
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string,
    source: string
  ) {
    super()
    this.filterManager = filterManager
    let feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')
    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'linearRGB')
    feColorMatrix.setAttribute('values', `${linearFilterValue} 1 0`)
    this.linearFilter = feColorMatrix
    feColorMatrix.setAttribute('result', `${id}_tint_1`)
    filter.appendChild(feColorMatrix)
    feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')
    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB')
    feColorMatrix.setAttribute(
      'values',
      '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'
    )
    feColorMatrix.setAttribute('result', `${id}_tint_2`)
    filter.appendChild(feColorMatrix)
    this.matrixFilter = feColorMatrix

    const feMerge = this.createMergeNode(id, [
      source,
      `${id}_tint_1`,
      `${id}_tint_2`,
    ])
    filter.appendChild(feMerge)
  }

  renderFrame(forceRender?: boolean) {
    if (
      (!forceRender && !this.filterManager._mdf) ||
      !this.filterManager.effectElements
    ) {
      return
    }
    const colorBlack = this.filterManager.effectElements[0].p.v as Vector3
    const colorWhite = this.filterManager.effectElements[1].p.v as Vector3
    const opacity = (this.filterManager.effectElements[2].p.v as number) / 100
    this.linearFilter.setAttribute(
      'values',
      `${linearFilterValue} ${opacity} 0`
    )
    this.matrixFilter.setAttribute(
      'values',
      `${colorWhite[0] - colorBlack[0]} 0 0 0 ${colorBlack[0]} ${
        colorWhite[1] - colorBlack[1]
      } 0 0 0 ${colorBlack[1]} ${colorWhite[2] - colorBlack[2]} 0 0 0 ${
        colorBlack[2]
      } 0 0 0 1 0`
    )
  }
}

export class SVGFillFilter {
  filterManager: GroupEffect
  matrixFilter: SVGFEColorMatrixElement
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string
  ) {
    this.filterManager = filterManager
    const feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')
    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB')
    feColorMatrix.setAttribute(
      'values',
      '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'
    )
    feColorMatrix.setAttribute('result', id)
    filter.appendChild(feColorMatrix)
    this.matrixFilter = feColorMatrix
  }

  renderFrame(forceRender?: boolean) {
    if (
      (!forceRender && !this.filterManager._mdf) ||
      !this.filterManager.effectElements
    ) {
      return
    }
    const color = this.filterManager.effectElements[2].p.v as Vector3
    const opacity = this.filterManager.effectElements[6].p.v as Vector3
    this.matrixFilter.setAttribute(
      'values',
      `0 0 0 0 ${color[0]} 0 0 0 0 ${color[1]} 0 0 0 0 ${color[2]} 0 0 0 ${
        opacity
      } 0`
    )
  }
}

export class SVGStrokeEffect {
  elem: ElementInterfaceIntersect
  filterManager: GroupEffect
  initialized: boolean
  masker?: SVGMaskElement
  pathMasker?: SVGGElement
  paths: { m: number; p: SVGPathElement }[]
  constructor(
    _fil: SVGFilterElement,
    filterManager: GroupEffect,
    elem: ElementInterfaceIntersect
  ) {
    this.initialized = false
    this.filterManager = filterManager
    this.elem = elem
    this.paths = []
  }
  initialize() {
    if (!this.filterManager.effectElements) {
      throw new Error('Missing Effects Elements')
    }
    let elemChildren = Array.from(
      this.elem.layerElement?.children ||
        this.elem.layerElement?.childNodes ||
        []
    )
    let path
    let i
    let len
    if (this.filterManager.effectElements[1].p.v === 1) {
      len = this.elem.maskManager?.masksProperties?.length || 0
      i = 0
    } else {
      i = (this.filterManager.effectElements[0].p.v as number) - 1
      len = i + 1
    }
    const groupPath = createNS<SVGGElement>('g')
    groupPath.setAttribute('fill', 'none')
    groupPath.setAttribute('stroke-linecap', 'round')
    groupPath.setAttribute('stroke-dashoffset', '1')
    for (i; i < len; i++) {
      path = createNS<SVGPathElement>('path')
      groupPath.appendChild(path)
      this.paths.push({ m: i, p: path })
    }
    if (this.filterManager.effectElements[10].p.v === 3) {
      const mask = createNS<SVGMaskElement>('mask')
      const id = createElementID()
      mask.setAttribute('id', id)
      mask.setAttribute('mask-type', 'alpha')
      mask.appendChild(groupPath)
      this.elem.globalData.defs.appendChild(mask)
      const g = createNS<SVGGElement>('g')
      g.setAttribute('mask', `url(${getLocationHref()}#${id})`)
      while (elemChildren[0]) {
        g.appendChild(elemChildren[0])
      }
      this.elem.layerElement?.appendChild(g)
      this.masker = mask
      groupPath.setAttribute('stroke', '#fff')
    } else if (
      this.filterManager.effectElements[10].p.v === 1 ||
      this.filterManager.effectElements[10].p.v === 2
    ) {
      if (this.filterManager.effectElements[10].p.v === 2) {
        elemChildren = Array.from(
          this.elem.layerElement?.children ||
            this.elem.layerElement?.childNodes ||
            []
        )
        while (elemChildren.length) {
          this.elem.layerElement?.removeChild(elemChildren[0])
        }
      }
      this.elem.layerElement?.appendChild(groupPath)
      this.elem.layerElement?.removeAttribute('mask')
      groupPath.setAttribute('stroke', '#fff')
    }
    this.initialized = true
    this.pathMasker = groupPath
  }

  renderFrame(forceRender?: boolean) {
    if (!this.filterManager.effectElements) {
      throw new Error('Missing Effect element')
    }
    if (!this.initialized) {
      this.initialize()
    }
    const { length } = this.paths
    let mask
    let path
    for (let i = 0; i < length; i++) {
      if (this.paths[i].m === -1) {
        continue
      }
      mask = this.elem.maskManager?.viewData[this.paths[i].m]
      path = this.paths[i].p
      if (forceRender || this.filterManager._mdf || mask.prop._mdf) {
        path.setAttribute('d', mask.lastPath)
      }
      if (
        forceRender ||
        this.filterManager.effectElements[9].p._mdf ||
        this.filterManager.effectElements[4].p._mdf ||
        this.filterManager.effectElements[7].p._mdf ||
        this.filterManager.effectElements[8].p._mdf ||
        mask.prop._mdf
      ) {
        let dasharrayValue
        if (
          this.filterManager.effectElements[7].p.v !== 0 ||
          this.filterManager.effectElements[8].p.v !== 100
        ) {
          const s =
            Math.min(
              this.filterManager.effectElements[7].p.v as number,
              this.filterManager.effectElements[8].p.v as number
            ) * 0.01
          const e =
            Math.max(
              this.filterManager.effectElements[7].p.v as number,
              this.filterManager.effectElements[8].p.v as number
            ) * 0.01
          const l = path.getTotalLength()
          dasharrayValue = `0 0 0 ${l * s} `
          const lineLength = l * (e - s)
          const segment =
            1 +
            (this.filterManager.effectElements[4].p.v as number) *
              2 *
              (this.filterManager.effectElements[9].p.v as number) *
              0.01
          const units = Math.floor(lineLength / segment)
          for (let j = 0; j < units; j++) {
            dasharrayValue += `1 ${
              (this.filterManager.effectElements[4].p.v as number) *
              2 *
              (this.filterManager.effectElements[9].p.v as number) *
              0.01
            } `
          }
          dasharrayValue += `0 ${l * 10} 0 0`
        } else {
          dasharrayValue = `1 ${
            (this.filterManager.effectElements[4].p.v as number) *
            2 *
            (this.filterManager.effectElements[9].p.v as number) *
            0.01
          }`
        }
        path.setAttribute('stroke-dasharray', dasharrayValue)
      }
    }
    if (forceRender || this.filterManager.effectElements[4].p._mdf) {
      this.pathMasker?.setAttribute(
        'stroke-width',
        `${(this.filterManager.effectElements[4].p.v as number) * 2}`
      )
    }

    if (forceRender || this.filterManager.effectElements[6].p._mdf) {
      this.pathMasker?.setAttribute(
        'opacity',
        `${this.filterManager.effectElements[6].p.v}`
      )
    }
    if (
      this.filterManager.effectElements[10].p.v === 1 ||
      this.filterManager.effectElements[10].p.v === 2
    ) {
      if (forceRender || this.filterManager.effectElements[3].p._mdf) {
        const color = this.filterManager.effectElements[3].p.v as Vector3
        this.pathMasker?.setAttribute(
          'stroke',
          `rgb(${Math.floor(color[0] * 255)},${Math.floor(color[1] * 255)},${
            color[2] * 255
          })`
        )
      }
    }
  }
}

export class SVGTritoneFilter {
  feFuncB: SVGFEFuncBElement
  feFuncG: SVGFEFuncGElement
  feFuncR: SVGFEFuncRElement
  filterManager: GroupEffect
  matrixFilter: SVGFEComponentTransferElement
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string
  ) {
    this.filterManager = filterManager
    const feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')
    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'linearRGB')
    feColorMatrix.setAttribute(
      'values',
      '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
    )
    filter.appendChild(feColorMatrix)
    const feComponentTransfer = createNS<SVGFEComponentTransferElement>(
      'feComponentTransfer'
    )
    feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB')
    feComponentTransfer.setAttribute('result', id)
    this.matrixFilter = feComponentTransfer
    const feFuncR = createNS<SVGFEFuncRElement>('feFuncR')
    feFuncR.setAttribute('type', 'table')
    feComponentTransfer.appendChild(feFuncR)
    this.feFuncR = feFuncR
    const feFuncG = createNS<SVGFEFuncGElement>('feFuncG')
    feFuncG.setAttribute('type', 'table')
    feComponentTransfer.appendChild(feFuncG)
    this.feFuncG = feFuncG
    const feFuncB = createNS<SVGFEFuncBElement>('feFuncB')
    feFuncB.setAttribute('type', 'table')
    feComponentTransfer.appendChild(feFuncB)
    this.feFuncB = feFuncB
    filter.appendChild(feComponentTransfer)
  }

  renderFrame(forceRender?: boolean) {
    if (
      (!forceRender && !this.filterManager._mdf) ||
      !this.filterManager.effectElements
    ) {
      return
    }
    const color1 = this.filterManager.effectElements[0].p.v as Vector3
    const color2 = this.filterManager.effectElements[1].p.v as Vector3
    const color3 = this.filterManager.effectElements[2].p.v as Vector3
    const tableR = `${color3[0]} ${color2[0]} ${color1[0]}`
    const tableG = `${color3[1]} ${color2[1]} ${color1[1]}`
    const tableB = `${color3[2]} ${color2[2]} ${color1[2]}`
    this.feFuncR.setAttribute('tableValues', tableR)
    this.feFuncG.setAttribute('tableValues', tableG)
    this.feFuncB.setAttribute('tableValues', tableB)
  }
}

export class SVGProLevelsFilter {
  feFuncA?: SVGFEFuncAElement
  feFuncB?: SVGFEFuncBElement
  feFuncBComposed?: SVGFEFuncBElement
  feFuncG?: SVGFEFuncGElement
  feFuncGComposed?: SVGFEFuncGElement
  feFuncR?: SVGFEFuncRElement
  feFuncRComposed?: SVGFEFuncRElement
  filterManager: GroupEffect
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string
  ) {
    this.filterManager = filterManager
    const { effectElements } = this.filterManager

    if (!effectElements) {
      throw new Error('Missing Effect Elements')
    }

    let feComponentTransfer = createNS<SVGFEComponentTransferElement>(
      'feComponentTransfer'
    )

    // Red
    if (
      effectElements[10].p.k ||
      effectElements[10].p.v !== 0 ||
      effectElements[11].p.k ||
      effectElements[11].p.v !== 1 ||
      effectElements[12].p.k ||
      effectElements[12].p.v !== 1 ||
      effectElements[13].p.k ||
      effectElements[13].p.v !== 0 ||
      effectElements[14].p.k ||
      effectElements[14].p.v !== 1
    ) {
      this.feFuncR = this.createFeFunc('feFuncR', feComponentTransfer)
    }
    // Green
    if (
      effectElements[17].p.k ||
      effectElements[17].p.v !== 0 ||
      effectElements[18].p.k ||
      effectElements[18].p.v !== 1 ||
      effectElements[19].p.k ||
      effectElements[19].p.v !== 1 ||
      effectElements[20].p.k ||
      effectElements[20].p.v !== 0 ||
      effectElements[21].p.k ||
      effectElements[21].p.v !== 1
    ) {
      this.feFuncG = this.createFeFunc('feFuncG', feComponentTransfer)
    }
    // Blue
    if (
      effectElements[24].p.k ||
      effectElements[24].p.v !== 0 ||
      effectElements[25].p.k ||
      effectElements[25].p.v !== 1 ||
      effectElements[26].p.k ||
      effectElements[26].p.v !== 1 ||
      effectElements[27].p.k ||
      effectElements[27].p.v !== 0 ||
      effectElements[28].p.k ||
      effectElements[28].p.v !== 1
    ) {
      this.feFuncB = this.createFeFunc('feFuncB', feComponentTransfer)
    }
    // Alpha
    if (
      effectElements[31].p.k ||
      effectElements[31].p.v !== 0 ||
      effectElements[32].p.k ||
      effectElements[32].p.v !== 1 ||
      effectElements[33].p.k ||
      effectElements[33].p.v !== 1 ||
      effectElements[34].p.k ||
      effectElements[34].p.v !== 0 ||
      effectElements[35].p.k ||
      effectElements[35].p.v !== 1
    ) {
      this.feFuncA = this.createFeFunc('feFuncA', feComponentTransfer)
    }
    // RGB
    if (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) {
      feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB')
      filter.appendChild(feComponentTransfer)
    }

    if (
      effectElements[3].p.k ||
      effectElements[3].p.v !== 0 ||
      effectElements[4].p.k ||
      effectElements[4].p.v !== 1 ||
      effectElements[5].p.k ||
      effectElements[5].p.v !== 1 ||
      effectElements[6].p.k ||
      effectElements[6].p.v !== 0 ||
      effectElements[7].p.k ||
      effectElements[7].p.v !== 1
    ) {
      feComponentTransfer = createNS<SVGFEComponentTransferElement>(
        'feComponentTransfer'
      )
      feComponentTransfer.setAttribute('color-interpolation-filters', 'sRGB')
      feComponentTransfer.setAttribute('result', id)
      filter.appendChild(feComponentTransfer)
      this.feFuncRComposed = this.createFeFunc('feFuncR', feComponentTransfer)
      this.feFuncGComposed = this.createFeFunc('feFuncG', feComponentTransfer)
      this.feFuncBComposed = this.createFeFunc('feFuncB', feComponentTransfer)
    }
  }

  createFeFunc<T extends SVGElement>(
    type: string,
    feComponentTransfer: SVGFEComponentTransferElement
  ) {
    const feFunc = createNS<T>(type)
    feFunc.setAttribute('type', 'table')
    feComponentTransfer.appendChild(feFunc)
    return feFunc
  }

  getTableValue(
    inputBlack: number,
    inputWhite: number,
    gamma: number,
    outputBlack: number,
    outputWhite: number
  ) {
    let cnt = 0
    const segments = 256
    let perc
    const min = Math.min(inputBlack, inputWhite)
    const max = Math.max(inputBlack, inputWhite)
    const table = Array.call(null, { length: segments })
    let colorValue
    let pos = 0
    const outputDelta = outputWhite - outputBlack
    const inputDelta = inputWhite - inputBlack
    while (cnt <= 256) {
      perc = cnt / 256
      if (perc <= min) {
        colorValue = inputDelta < 0 ? outputWhite : outputBlack
      } else if (perc >= max) {
        colorValue = inputDelta < 0 ? outputBlack : outputWhite
      } else {
        colorValue =
          outputBlack +
          outputDelta * Math.pow((perc - inputBlack) / inputDelta, 1 / gamma)
      }
      table[pos] = colorValue
      pos++
      cnt += 256 / (segments - 1)
    }
    return table.join(' ')
  }

  renderFrame(forceRender?: boolean) {
    if (
      (!forceRender && !this.filterManager._mdf) ||
      !this.filterManager.effectElements
    ) {
      return
    }
    let val
    const { effectElements } = this.filterManager
    if (
      this.feFuncRComposed &&
      (forceRender ||
        effectElements[3].p._mdf ||
        effectElements[4].p._mdf ||
        effectElements[5].p._mdf ||
        effectElements[6].p._mdf ||
        effectElements[7].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[3].p.v as number,
        effectElements[4].p.v as number,
        effectElements[5].p.v as number,
        effectElements[6].p.v as number,
        effectElements[7].p.v as number
      )
      this.feFuncRComposed.setAttribute('tableValues', val)
      this.feFuncGComposed?.setAttribute('tableValues', val)
      this.feFuncBComposed?.setAttribute('tableValues', val)
    }

    if (
      this.feFuncR &&
      (forceRender ||
        effectElements[10].p._mdf ||
        effectElements[11].p._mdf ||
        effectElements[12].p._mdf ||
        effectElements[13].p._mdf ||
        effectElements[14].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[10].p.v as number,
        effectElements[11].p.v as number,
        effectElements[12].p.v as number,
        effectElements[13].p.v as number,
        effectElements[14].p.v as number
      )
      this.feFuncR.setAttribute('tableValues', val)
    }

    if (
      this.feFuncG &&
      (forceRender ||
        effectElements[17].p._mdf ||
        effectElements[18].p._mdf ||
        effectElements[19].p._mdf ||
        effectElements[20].p._mdf ||
        effectElements[21].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[17].p.v as number,
        effectElements[18].p.v as number,
        effectElements[19].p.v as number,
        effectElements[20].p.v as number,
        effectElements[21].p.v as number
      )
      this.feFuncG.setAttribute('tableValues', val)
    }

    if (
      this.feFuncB &&
      (forceRender ||
        effectElements[24].p._mdf ||
        effectElements[25].p._mdf ||
        effectElements[26].p._mdf ||
        effectElements[27].p._mdf ||
        effectElements[28].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[24].p.v as number,
        effectElements[25].p.v as number,
        effectElements[26].p.v as number,
        effectElements[27].p.v as number,
        effectElements[28].p.v as number
      )
      this.feFuncB.setAttribute('tableValues', val)
    }

    if (
      this.feFuncA &&
      (forceRender ||
        effectElements[31].p._mdf ||
        effectElements[32].p._mdf ||
        effectElements[33].p._mdf ||
        effectElements[34].p._mdf ||
        effectElements[35].p._mdf)
    ) {
      val = this.getTableValue(
        effectElements[31].p.v as number,
        effectElements[32].p.v as number,
        effectElements[33].p.v as number,
        effectElements[34].p.v as number,
        effectElements[35].p.v as number
      )
      this.feFuncA.setAttribute('tableValues', val)
    }
  }
}

export class SVGDropShadowEffect extends SVGComposableEffect {
  feFlood: SVGFEFloodElement
  feGaussianBlur: SVGFEGaussianBlurElement
  feOffset: SVGFEOffsetElement
  filterManager: GroupEffect
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string,
    source: string
  ) {
    super()
    const globalFilterSize = (
      filterManager.container?.globalData.renderConfig as SVGRendererConfig
    )?.filterSize
    const filterSize = filterManager.data?.fs ||
      globalFilterSize || {
        height: '100%',
        width: '100%',
        x: '0%',
        y: '0%',
      }
    filter.setAttribute('x', filterSize.x)
    filter.setAttribute('y', filterSize.y)
    filter.setAttribute('width', filterSize.width)
    filter.setAttribute('height', filterSize.height)
    this.filterManager = filterManager

    const feGaussianBlur = createNS<SVGFEGaussianBlurElement>('feGaussianBlur')
    feGaussianBlur.setAttribute('in', 'SourceAlpha')
    feGaussianBlur.setAttribute('result', `${id}_drop_shadow_1`)
    feGaussianBlur.setAttribute('stdDeviation', '0')
    this.feGaussianBlur = feGaussianBlur
    filter.appendChild(feGaussianBlur)

    const feOffset = createNS<SVGFEOffsetElement>('feOffset')
    feOffset.setAttribute('dx', '25')
    feOffset.setAttribute('dy', '0')
    feOffset.setAttribute('in', `${id}_drop_shadow_1`)
    feOffset.setAttribute('result', `${id}_drop_shadow_2`)
    this.feOffset = feOffset
    filter.appendChild(feOffset)
    const feFlood = createNS<SVGFEFloodElement>('feFlood')
    feFlood.setAttribute('flood-color', '#00ff00')
    feFlood.setAttribute('flood-opacity', '1')
    feFlood.setAttribute('result', `${id}_drop_shadow_3`)
    this.feFlood = feFlood
    filter.appendChild(feFlood)

    const feComposite = createNS<SVGFECompositeElement>('feComposite')
    feComposite.setAttribute('in', `${id}_drop_shadow_3`)
    feComposite.setAttribute('in2', `${id}_drop_shadow_2`)
    feComposite.setAttribute('operator', 'in')
    feComposite.setAttribute('result', `${id}_drop_shadow_4`)
    filter.appendChild(feComposite)

    const feMerge = this.createMergeNode(id, [`${id}_drop_shadow_4`, source])
    filter.appendChild(feMerge)
  }

  renderFrame(forceRender?: boolean) {
    if (
      (!forceRender && !this.filterManager._mdf) ||
      !this.filterManager.effectElements
    ) {
      return
    }
    if (forceRender || this.filterManager.effectElements[4].p._mdf) {
      this.feGaussianBlur.setAttribute(
        'stdDeviation',
        `${(this.filterManager.effectElements[4].p.v as number) / 4}`
      )
    }
    if (forceRender || this.filterManager.effectElements[0].p._mdf) {
      const col = this.filterManager.effectElements[0].p.v as Vector3
      this.feFlood.setAttribute(
        'flood-color',
        rgbToHex(
          Math.round(col[0] * 255),
          Math.round(col[1] * 255),
          Math.round(col[2] * 255)
        )
      )
    }
    if (forceRender || this.filterManager.effectElements[1].p._mdf) {
      this.feFlood.setAttribute(
        'flood-opacity',
        `${(this.filterManager.effectElements[1].p.v as number) / 255}`
      )
    }
    if (
      forceRender ||
      this.filterManager.effectElements[2].p._mdf ||
      this.filterManager.effectElements[3].p._mdf
    ) {
      const distance = this.filterManager.effectElements[3].p.v as number
      const angle =
        ((this.filterManager.effectElements[2].p.v as number) - 90) * degToRads
      const x = distance * Math.cos(angle)
      const y = distance * Math.sin(angle)
      this.feOffset.setAttribute('dx', `${x}`)
      this.feOffset.setAttribute('dy', `${y}`)
    }
  }
}

const _svgMatteSymbols: ElementInterfaceIntersect[] = []

export class SVGMatte3Effect {
  elem: ElementInterfaceIntersect
  filterElem: SVGFilterElement
  filterManager: GroupEffect
  initialized?: boolean

  constructor(
    filterElem: SVGFilterElement,
    filterManager: GroupEffect,
    elem: ElementInterfaceIntersect
  ) {
    this.initialized = false
    this.filterManager = filterManager
    this.filterElem = filterElem
    this.elem = elem
    elem.matteElement = createNS<SVGGElement>('g')
    if (elem.layerElement) {
      elem.matteElement.appendChild(elem.layerElement)
    }
    if (elem.transformedElement) {
      elem.matteElement.appendChild(elem.transformedElement)
    }
    elem.baseElement = elem.matteElement
  }
  findSymbol(mask: ElementInterfaceIntersect) {
    let i = 0
    const len = _svgMatteSymbols.length
    while (i < len) {
      if (_svgMatteSymbols[i] === mask) {
        return _svgMatteSymbols[i]
      }
      i++
    }
    return null
  }
  initialize() {
    const ind = this.filterManager.effectElements?.[0].p.v
    const elements = this.elem.comp?.elements || []
    let i = 0
    const { length } = elements
    while (i < length) {
      if (elements[i] && elements[i].data.ind === ind) {
        this.setElementAsMask(this.elem, elements[i])
      }
      i++
    }
    this.initialized = true
  }
  renderFrame() {
    if (!this.initialized) {
      this.initialize()
    }
  }

  replaceInParent(mask: ElementInterfaceIntersect, symbolId: string) {
    const parentNode = mask.layerElement?.parentNode
    if (!parentNode) {
      return
    }
    const children = parentNode.children
    let i = 0
    const len = children.length
    while (i < len) {
      if (children[i] === mask.layerElement) {
        break
      }
      i++
    }
    let nextChild
    if (i <= len - 2) {
      nextChild = children[i + 1]
    }
    const useElem = createNS<SVGUseElement>('use')
    useElem.setAttribute('href', `#${symbolId}`)
    if (nextChild) {
      parentNode.insertBefore(useElem, nextChild)
    } else {
      parentNode.appendChild(useElem)
    }
  }

  setElementAsMask(
    elem: ElementInterfaceIntersect,
    mask: ElementInterfaceIntersect
  ) {
    if (!this.findSymbol(mask)) {
      const symbolId = createElementID()
      const masker = createNS<SVGMaskElement>('mask')
      masker.setAttribute('id', mask.layerId || '')
      masker.setAttribute('mask-type', 'alpha')
      _svgMatteSymbols.push(mask)
      const defs = elem.globalData.defs
      defs.appendChild(masker)
      const symbol = createNS<SVGSymbolElement>('symbol')
      symbol.setAttribute('id', symbolId)
      this.replaceInParent(mask, symbolId)
      if (mask.layerElement) {
        symbol.appendChild(mask.layerElement)
      }

      defs.appendChild(symbol)
      const useElem = createNS<SVGUseElement>('use')
      useElem.setAttribute('href', `#${symbolId}`)
      masker.appendChild(useElem)
      mask.data.hd = false
      mask.show()
    }
    elem.setMatte(mask.layerId || '')
  }
}

export class SVGGaussianBlurEffect {
  feGaussianBlur: SVGFEGaussianBlurElement
  filterManager: GroupEffect
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string
  ) {
    // Outset the filter region by 100% on all sides to accommodate blur expansion.
    filter.setAttribute('x', '-100%')
    filter.setAttribute('y', '-100%')
    filter.setAttribute('width', '300%')
    filter.setAttribute('height', '300%')

    this.filterManager = filterManager
    const feGaussianBlur = createNS<SVGFEGaussianBlurElement>('feGaussianBlur')
    feGaussianBlur.setAttribute('result', id)
    filter.appendChild(feGaussianBlur)
    this.feGaussianBlur = feGaussianBlur
  }

  renderFrame(forceRender?: boolean) {
    if (
      (!forceRender && !this.filterManager._mdf) ||
      !this.filterManager.effectElements
    ) {
      return
    }
    // Empirical value, matching AE's blur appearance.
    const kBlurrinessToSigma = 0.3,
      sigma =
        (this.filterManager.effectElements[0].p.v as number) *
        kBlurrinessToSigma,
      // Dimensions mapping:
      //
      //   1 -> horizontal & vertical
      //   2 -> horizontal only
      //   3 -> vertical only
      //
      dimensions = this.filterManager.effectElements[1].p.v,
      sigmaX = dimensions == 3 ? 0 : sigma, // eslint-disable-line eqeqeq
      sigmaY = dimensions == 2 ? 0 : sigma // eslint-disable-line eqeqeq

    // console.log(this.filterManager.effectElements.map((el) => el.p.v))

    this.feGaussianBlur.setAttribute('stdDeviation', `${sigmaX} ${sigmaY}`)

    // Repeat edges mapping:
    //
    //   0 -> off -> duplicate
    //   1 -> on  -> wrap
    const edgeMode =
      this.filterManager.effectElements[2].p.v == 1 ? 'wrap' : 'duplicate' // eslint-disable-line eqeqeq
    this.feGaussianBlur.setAttribute('edgeMode', edgeMode)
  }
}

export class SVGTransformEffect extends TransformEffect {
  constructor(_: any, filterManager: GroupEffect) {
    super()
    this.init(filterManager)
  }
}
