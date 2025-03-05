import type { ImageData, LottieAsset, AssetHandler } from '@/types'

import dataManager from '@/dataManager'
import { RendererType } from '@/enums'
import { createNS, createTag, isSafari, isServer } from '@/utils'

const ImagePreloader = (() => {
  const proxyImage = (() => {
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
  })()

  /**
   *
   */
  function imageLoaded(this: AssetHandler) {
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
  /**
   *
   */
  function footageLoaded(this: AssetHandler) {
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

  /**
   *
   */
  function getAssetsPath(
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

  /**
   *
   */
  function testImageLoaded(this: AssetHandler, img: SVGGraphicsElement) {
    if (isServer()) {
      return
    }
    let _count = 0
    const intervalId = setInterval(
      function (this: AssetHandler) {
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

  /**
   *
   */
  function createImageData(this: AssetHandler, assetData: LottieAsset) {
    const path = getAssetsPath(assetData, this.assetsPath, this.path)
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
      function (this: AssetHandler) {
        if (proxyImage) {
          obj.img = proxyImage
        }
        this._imageLoaded()
      }.bind(this),
      false
    )
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path)
    if (this._elementHelper.append) {
      this._elementHelper.append(img)
    } else {
      this._elementHelper.appendChild(img)
    }
    const obj: ImageData = {
      assetData,
      img,
    }
    return obj
  }

  /**
   *
   */
  function createImgData(this: AssetHandler, assetData: LottieAsset) {
    const path = getAssetsPath(assetData, this.assetsPath, this.path)
    const img = createTag('img')
    if (!(img instanceof HTMLMediaElement)) {
      return
    }
    img.crossOrigin = 'anonymous'
    img.addEventListener('load', this._imageLoaded, false)
    img.addEventListener(
      'error',
      function (this: AssetHandler) {
        if (proxyImage) {
          obj.img = proxyImage
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

  /**
   *
   */
  function createFootageData(this: AssetHandler, data: LottieAsset) {
    const obj: ImageData = {
      assetData: data,
      img: null,
    }
    const path = getAssetsPath(data, this.assetsPath, this.path)
    dataManager.loadData(
      path,
      function (this: AssetHandler, footageData: unknown) {
        if (footageData) {
          obj.img = footageData as SVGElement
        }
        this._footageLoaded()
      }.bind(this),
      function (this: { _footageLoaded: () => void }) {
        this._footageLoaded()
      }.bind(this)
    )
    return obj
  }

  /**
   *
   */
  function loadAssets(
    this: AssetHandler,
    assets: LottieAsset[],
    cb: AssetHandler['imagesLoadedCb']
  ) {
    this.imagesLoadedCb = cb
    const { length } = assets
    for (let i = 0; i < length; i++) {
      if (assets[i].layers) {
        continue
      }
      if (!assets[i].t || assets[i].t === 'seq') {
        this.totalImages += 1
        this.images.push(this._createImageData(assets[i]))
        continue
      }

      if (Number(assets[i].t) === 3) {
        this.totalFootages += 1
        this.images.push(this.createFootageData(assets[i]))
      }
    }
  }

  /**
   *
   */
  function setPath(this: AssetHandler, path?: string) {
    this.path = path || ''
  }

  /**
   *
   */
  function setAssetsPath(this: AssetHandler, path?: string) {
    this.assetsPath = path || ''
  }

  /**
   *
   */
  function getAsset(this: AssetHandler, assetData: LottieAsset) {
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

  /**
   *
   */
  function destroy(this: AssetHandler) {
    this.imagesLoadedCb = null
    this.images.length = 0
  }

  /**
   *
   */
  function loadedImages(this: AssetHandler) {
    return this.totalImages === this.loadedAssets
  }

  /**
   *
   */
  function loadedFootages(this: AssetHandler) {
    return this.totalFootages === this.loadedFootagesCount
  }

  /**
   *
   */
  function setCacheType(
    this: AssetHandler,
    type: string,
    elementHelper: SVGElement
  ) {
    if (type === RendererType.SVG) {
      this._elementHelper = elementHelper
      this._createImageData = this.createImageData.bind(this)
    } else {
      this._createImageData = this.createImgData.bind(this)
    }
  }

  /**
   *
   */
  function ImagePreloaderFactory(this: AssetHandler) {
    this._imageLoaded = imageLoaded.bind(this)
    this._footageLoaded = footageLoaded.bind(this)
    this.testImageLoaded = testImageLoaded.bind(this)
    this.createFootageData = createFootageData.bind(this)
    this.assetsPath = ''
    this.path = ''
    this.totalImages = 0
    this.totalFootages = 0
    this.loadedAssets = 0
    this.loadedFootagesCount = 0
    this.imagesLoadedCb = null
    this.images = []
  }

  ImagePreloaderFactory.prototype = {
    createImageData,
    createImgData,
    destroy,
    footageLoaded,
    getAsset,
    imageLoaded,
    loadAssets,
    loadedFootages,
    loadedImages,
    setAssetsPath,
    setCacheType,
    setPath,
  }

  return ImagePreloaderFactory
})()

export default ImagePreloader
