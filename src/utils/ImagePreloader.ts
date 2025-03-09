import type { ImageData, LottieAsset } from '@/types'

import DataManager from '@/DataManager'
import { RendererType } from '@/enums'
import { createNS, createTag, isSafari, isServer } from '@/utils'

export default class ImagePreloader {
  assetsPath: string
  images: ImageData[]
  imagesLoadedCb: null | ((images: ImageData[] | null) => void)
  loadedAssets: number
  loadedFootagesCount: number
  path: string
  totalFootages: number
  totalImages: number
  private _createImageData?: (assetData: LottieAsset) => ImageData | undefined
  private _elementHelper?: SVGElement
  private _footageLoaded
  private _imageLoaded
  private proxyImage: HTMLCanvasElement | null
  constructor() {
    this._imageLoaded = this.imageLoaded.bind(this)
    this._footageLoaded = this.footageLoaded.bind(this)
    this.testImageLoaded = this.testImageLoaded.bind(this)
    this.createFootageData = this.createFootageData.bind(this)
    this.assetsPath = ''
    this.path = ''
    this.totalImages = 0
    this.totalFootages = 0
    this.loadedAssets = 0
    this.loadedFootagesCount = 0
    this.imagesLoadedCb = null
    this.images = []
    this.proxyImage = this._createProxyImage()
  }
  createFootageData(data: LottieAsset) {
    const obj: ImageData = {
      assetData: data,
      img: null,
    }
    const path = this.getAssetsPath(data, this.assetsPath, this.path)
    DataManager.loadData(
      path,
      function (this: ImagePreloader, footageData: unknown) {
        if (footageData) {
          obj.img = footageData as SVGElement
        }
        this._footageLoaded()
      }.bind(this),
      function (this: ImagePreloader) {
        this._footageLoaded()
      }.bind(this)
    )
    return obj
  }
  public createImageData(assetData: LottieAsset) {
    const path = this.getAssetsPath(assetData, this.assetsPath, this.path)
    const img = createNS('image')
    if (!(img instanceof SVGImageElement)) {
      throw new Error('Could not generate SVG')
    }
    if (isSafari()) {
      this.testImageLoaded(img)
    } else {
      img.addEventListener('load', this._imageLoaded, false)
    }
    img.addEventListener(
      'error',
      function (this: ImagePreloader) {
        if (this.proxyImage) {
          obj.img = this.proxyImage
        }
        this._imageLoaded()
      }.bind(this),
      false
    )
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path)
    if (this._elementHelper?.append) {
      this._elementHelper.append(img)
    } else {
      this._elementHelper?.appendChild(img)
    }
    const obj: ImageData = {
      assetData,
      img,
    }
    return obj
  }
  public destroy() {
    this.imagesLoadedCb = null
    this.images.length = 0
  }
  public footageLoaded() {
    this.loadedFootagesCount += 1
    if (
      this.loadedAssets === this.totalImages &&
      this.loadedFootagesCount === this.totalFootages
    ) {
      if (this.imagesLoadedCb) {
        this.imagesLoadedCb(null)
      }
    }
  }
  public getAsset(assetData: LottieAsset) {
    let i = 0
    const { length } = this.images
    while (i < length) {
      if (this.images[i].assetData === assetData) {
        return this.images[i].img
      }
      i++
    }
    return null
  }
  public imageLoaded() {
    this.loadedAssets += 1
    if (
      this.loadedAssets === this.totalImages &&
      this.loadedFootagesCount === this.totalFootages
    ) {
      if (this.imagesLoadedCb) {
        this.imagesLoadedCb(null)
      }
    }
  }
  public loadAssets(
    assets: LottieAsset[],
    cb: ImagePreloader['imagesLoadedCb']
  ) {
    this.imagesLoadedCb = cb
    const { length } = assets
    for (let i = 0; i < length; i++) {
      if (assets[i].layers) {
        continue
      }
      if ((!assets[i].t || assets[i].t === 'seq') && this._createImageData) {
        this.totalImages += 1
        this.images.push(this._createImageData(assets[i])!)
        continue
      }

      if (Number(assets[i].t) === 3) {
        this.totalFootages += 1
        this.images.push(this.createFootageData(assets[i]))
      }
    }
  }
  public loadedFootages() {
    return this.totalFootages === this.loadedFootagesCount
  }
  public loadedImages() {
    return this.totalImages === this.loadedAssets
  }
  public setAssetsPath(path?: string) {
    this.assetsPath = path || ''
  }
  public setCacheType(type: string, elementHelper: SVGElement) {
    if (type === RendererType.SVG) {
      this._elementHelper = elementHelper
      this._createImageData = this.createImageData.bind(this)
    } else {
      this._createImageData = this.createImgData.bind(this)
    }
  }
  public setPath(path?: string) {
    this.path = path || ''
  }
  private _createProxyImage() {
    if (isServer()) {
      return null
    }
    const canvas = createTag(RendererType.Canvas)
    if (!(canvas instanceof HTMLCanvasElement)) {
      return null
    }
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'rgba(0,0,0,0)'
      ctx.fillRect(0, 0, 1, 1)
    }
    return canvas
  }
  private createImgData(assetData: LottieAsset) {
    const path = this.getAssetsPath(assetData, this.assetsPath, this.path)
    const img = createTag('img')
    if (!(img instanceof HTMLMediaElement)) {
      return
    }
    img.crossOrigin = 'anonymous'
    img.addEventListener('load', this._imageLoaded, false)
    img.addEventListener(
      'error',
      function (this: ImagePreloader) {
        if (this.proxyImage) {
          obj.img = this.proxyImage
        }

        this._imageLoaded()
      }.bind(this),
      false
    )
    img.src = path
    const obj: ImageData = {
      assetData,
      img,
    }
    return obj
  }
  private getAssetsPath(
    assetData: LottieAsset,
    assetsPath: string,
    originalPath: string
  ): string {
    if (assetData.e) {
      return assetData.p || ''
    }

    if (assetsPath) {
      let imagePath = assetData.p
      if (imagePath?.indexOf('images/') !== -1) {
        imagePath = imagePath?.split('/')[1]
      }
      return `${assetsPath}${imagePath || ''}`
    }
    let path = originalPath
    path += assetData.u ? assetData.u : ''
    path += assetData.p
    return path
  }
  private testImageLoaded(img: SVGGraphicsElement) {
    if (isServer()) {
      return
    }
    let _count = 0
    const intervalId = setInterval(
      function (this: ImagePreloader) {
        const box = img.getBBox()
        if (box.width || _count > 500) {
          this._imageLoaded()
          clearInterval(intervalId)
        }
        _count += 1
      }.bind(this),
      50
    )
  }
}
