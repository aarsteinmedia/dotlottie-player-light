import type {
  AnimationData,
  AnimationDirection,
  IntersectData,
  LottieAsset,
  LottieManifest,
  Marker,
  MarkerData,
  SVGGeometry,
  Vector2,
  Vector3,
  Vector4,
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import PolynomialBezier from '@/elements/PolynomialBezier'
import { ObjectFit } from '@/enums'
import { createElementID, roundCorner } from '@/utils/getterSetter'
import Matrix from '@/utils/Matrix'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapePropertyFactory from '@/utils/shapes/ShapeProperty'
import { strFromU8, unzip as unzipOrg, type Unzipped } from 'fflate'

export class CustomError extends Error {
  status?: number
}

export const addBrightnessToRGB = (color: Vector3, offset: number) => {
    const hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255)
    hsv[2] += offset
    if (hsv[2] > 1) {
      hsv[2] = 1
    } else if (hsv[2] < 0) {
      hsv[2] = 0
    }
    return HSVtoRGB(hsv[0], hsv[1], hsv[2])
  },
  addHueToRGB = (color: Vector3, offset: number): Vector3 => {
    const hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255)
    hsv[0] += offset / 360
    if (hsv[0] > 1) {
      hsv[0] -= 1
    } else if (hsv[0] < 0) {
      hsv[0] += 1
    }
    return HSVtoRGB(hsv[0], hsv[1], hsv[2])
  },
  addSaturationToRGB = (color: Vector3, offset: number) => {
    const hsv = RGBtoHSV(color[0] * 255, color[1] * 255, color[2] * 255)
    hsv[1] += offset
    if (hsv[1] > 1) {
      hsv[1] = 1
    } else if (hsv[1] <= 0) {
      hsv[1] = 0
    }
    return HSVtoRGB(hsv[0], hsv[1], hsv[2])
  },
  aspectRatio = (objectFit: string) => {
    switch (objectFit) {
      case ObjectFit.Contain:
      case ObjectFit.ScaleDown:
        return 'xMidYMid meet'
      case ObjectFit.Cover:
        return 'xMidYMid slice'
      case ObjectFit.Fill:
        return 'none'
      case ObjectFit.None:
        return 'xMinYMin slice'
      default:
        return 'xMidYMid meet'
    }
  },
  boxIntersect = (b1: SVGGeometry, b2: SVGGeometry) =>
    Math.abs(b1.cx - b2.cx) * 2 < b1.width + b2.width &&
    Math.abs(b1.cy - b2.cy) * 2 < b1.height + b2.height,
  buildShapeString = (
    pathNodes: ShapePath,
    length: number,
    closed: boolean,
    mat: Matrix
  ) => {
    if (length === 0) {
      return ''
    }
    const _o = pathNodes.o as Vector2[]
    const _i = pathNodes.i as Vector2[]
    const _v = pathNodes.v as Vector2[]
    let i
    let shapeString = ` M${mat.applyToPointStringified(_v[0][0], _v[0][1])}`
    for (i = 1; i < length; i++) {
      shapeString += ` C${mat.applyToPointStringified(
        _o[i - 1][0],
        _o[i - 1][1]
      )} ${mat.applyToPointStringified(
        _i[i][0],
        _i[i][1]
      )} ${mat.applyToPointStringified(_v[i][0], _v[i][1])}`
    }
    if (closed && length) {
      shapeString += ` C${mat.applyToPointStringified(
        _o[i - 1][0],
        _o[i - 1][1]
      )} ${mat.applyToPointStringified(
        _i[0][0],
        _i[0][1]
      )} ${mat.applyToPointStringified(_v[0][0], _v[0][1])}`
      shapeString += 'z'
    }
    return shapeString
  },
  createNS = <T extends SVGElement>(type: string) => {
    if (isServer()) {
      /**
       * This lets the function run without errors in a server context,
       * while still working with TypeScript
       */
      return null as unknown as T
    }
    // return {appendChild:function(){},setAttribute:function(){},style:{}}
    return document.createElementNS('http://www.w3.org/2000/svg', type) as T
  },
  /**
   * Download file, either SVG or dotLottie.
   * @param { string } data The data to be downloaded
   * @param { string } name Don't include file extension in the filename
   */

  createTag = <T extends HTMLElement>(type: string) => {
    if (isServer()) {
      return null as unknown as T
    }
    // return {appendChild:function(){},setAttribute:function(){},style:{}}
    return document.createElement(type) as T
  },
  createQuaternion = (values: Vector3): Vector4 => {
    const heading = values[0] * degToRads
    const attitude = values[1] * degToRads
    const bank = values[2] * degToRads
    const c1 = Math.cos(heading / 2)
    const c2 = Math.cos(attitude / 2)
    const c3 = Math.cos(bank / 2)
    const s1 = Math.sin(heading / 2)
    const s2 = Math.sin(attitude / 2)
    const s3 = Math.sin(bank / 2)
    const w = c1 * c2 * c3 - s1 * s2 * s3
    const x = s1 * s2 * c3 + c1 * c2 * s3
    const y = s1 * c2 * c3 + c1 * s2 * s3
    const z = c1 * s2 * c3 - s1 * c2 * s3

    return [x, y, z, w]
  },
  crossProduct = (a: number[], b: number[]) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],
  download = (
    data: string | ArrayBuffer,
    options?: {
      name: string
      mimeType: string
    }
  ) => {
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
  degToRads = Math.PI / 180,
  floatEqual = (a: number, b: number) =>
    Math.abs(a - b) * 100000 <= Math.min(Math.abs(a), Math.abs(b)),
  floatZero = (f: number) => Math.abs(f) <= 0.00001,
  frameOutput = (frame?: number) =>
    ((frame ?? 0) + 1).toString().padStart(3, '0'),
  getAnimationData = async (
    input: unknown
  ): Promise<{
    animations: AnimationData[] | null
    manifest: LottieManifest | null
    isDotLottie: boolean
  }> => {
    try {
      if (!input || (typeof input !== 'string' && typeof input !== 'object')) {
        throw new Error('Broken file or invalid file format')
      }

      if (typeof input !== 'string') {
        const animations = Array.isArray(input) ? input : [input]
        return {
          animations,
          isDotLottie: false,
          manifest: null,
        }
      }

      const result = await fetch(input)

      if (!result.ok) {
        const error = new CustomError(result.statusText)
        error.status = result.status
        throw error
      }

      /**
       * Check if file is JSON, first by parsing file name for extension,
       * then – if filename has no extension – by cloning the response
       * and parsing it for content.
       */
      const ext = getExt(input)
      if (ext === 'json' || !ext) {
        if (ext) {
          const lottie = await result.json()
          return {
            animations: [lottie],
            isDotLottie: false,
            manifest: null,
          }
        }
        const text = await result.clone().text()
        try {
          const lottie = JSON.parse(text)
          return {
            animations: [lottie],
            isDotLottie: false,
            manifest: null,
          }
        } catch (_e) {
          /* empty */
        }
      }

      const { data, manifest } = await getLottieJSON(result)

      return {
        animations: data,
        isDotLottie: true,
        manifest,
      }
    } catch (err) {
      console.error(`❌ ${handleErrors(err).message}`)
      return {
        animations: null,
        isDotLottie: false,
        manifest: null,
      }
    }
  },
  getBlendMode = (mode = 16) => {
    const blendModeEnums: {
      [key: number]: string
    } = {
      0: 'source-over',
      1: 'multiply',
      10: 'difference',
      11: 'exclusion',
      12: 'hue',
      13: 'saturation',
      14: 'color',
      15: 'luminosity',
      2: 'screen',
      3: 'overlay',
      4: 'darken',
      5: 'lighten',
      6: 'color-dodge',
      7: 'color-burn',
      8: 'hard-light',
      9: 'soft-light',
    }

    return blendModeEnums[mode] || ''
  },
  /**
   * Parse URL to get filename
   * @param { string } src The url string
   * @param { boolean } keepExt Whether to include file extension
   * @returns { string } Filename, in lowercase
   */
  /**
   * Get extension from filename, URL or path
   * @param { string } str Filename, URL or path
   */
  getExt = (str?: string) => {
    if (typeof str !== 'string' || !str || !hasExt(str)) {
      return
    }
    return str.split('.').pop()?.toLowerCase()
  },
  getFactory = (name: string) => {
    switch (name) {
      case 'propertyFactory':
        return PropertyFactory
      case 'shapePropertyFactory':
        return ShapePropertyFactory
      case 'matrix':
        return Matrix
      default:
        return null
    }
  },
  getFilename = (src: string, keepExt?: boolean) => {
    // Because the regex strips all special characters, we need to extract the file extension, so we can add it later if we need it
    const ext = getExt(src)
    return `${src.replace(/\.[^.]*$/, '').replace(/\W+/g, '')}${keepExt ? `.${ext}` : ''}`.toLowerCase()
  },
  getIntersection = (a: any, b: any) => {
    const intersect = a.intersections(b)

    if (intersect.length && floatEqual(intersect[0][0], 1)) {
      intersect.shift()
    }

    if (intersect.length) {
      return intersect[0]
    }

    return null
  },
  getLottieJSON = async (resp: Response) => {
    const unzipped = await unzip(resp),
      manifest = getManifest(unzipped),
      data = [],
      toResolve: Promise<void>[] = [],
      { length } = manifest.animations
    for (let i = 0; i < length; i++) {
      const str = strFromU8(
          unzipped[`animations/${manifest.animations[i].id}.json`]
        ),
        lottie: AnimationData = JSON.parse(prepareString(str))

      toResolve.push(resolveAssets(unzipped, lottie.assets))
      data.push(lottie)
    }

    await Promise.all(toResolve)

    return {
      data,
      manifest,
    }
  },
  getManifest = (unzipped: Unzipped) => {
    const file = strFromU8(unzipped['manifest.json'], false),
      manifest: LottieManifest = JSON.parse(file)

    if (!('animations' in manifest)) {
      throw new Error('Manifest not found')
    }
    if (!manifest.animations.length) {
      throw new Error('No animations listed in manifest')
    }

    return manifest
  },
  getMimeFromExt = (ext?: string) => {
    switch (ext) {
      case 'svg':
      case 'svg+xml':
        return 'image/svg+xml'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
      case 'gif':
      case 'webp':
      case 'avif':
        return `image/${ext}`
      case 'mp3':
      case 'mpeg':
      case 'wav':
        return `audio/${ext}`
      default:
        return ''
    }
  },
  getPerpendicularVector = (pt1: Vector2, pt2: Vector2) => {
    const vector = [pt2[0] - pt1[0], pt2[1] - pt1[1]]
    const rot = -Math.PI * 0.5
    const rotatedVector = [
      Math.cos(rot) * vector[0] - Math.sin(rot) * vector[1],
      Math.sin(rot) * vector[0] + Math.cos(rot) * vector[1],
    ]
    return rotatedVector
  },
  getProjectingAngle = (path: ShapePath, cur: number) => {
    const prevIndex = cur === 0 ? path.length() - 1 : cur - 1
    const nextIndex = (cur + 1) % path.length()
    const prevPoint = path.v[prevIndex]
    const nextPoint = path.v[nextIndex]
    const pVector = getPerpendicularVector(prevPoint!, nextPoint!)
    return Math.atan2(0, 1) - Math.atan2(pVector[1], pVector[0])
  },
  // getQueryVariable = (variableFromProps: string, queryString: string) => {
  //   const vars = queryString.split('&')
  //   for (const variable of vars) {
  //     const pair = variable.split('=')
  //     if (decodeURIComponent(pair[0]) === variableFromProps) {
  //       return decodeURIComponent(pair[1])
  //     }
  //   }
  //   return null
  // },
  handleErrors = (err: unknown) => {
    const res = {
      message: 'Unknown error',
      status: isServer() ? 500 : 400,
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
  hasExt = (path: string) => {
    const lastDotIndex = path.split('/').pop()?.lastIndexOf('.')
    return (lastDotIndex ?? 0) > 1 && path.length - 1 > (lastDotIndex ?? 0)
  },
  HSVtoRGB = (h: number, s: number, v: number): Vector3 => {
    let r = 0
    let g = 0
    let b = 0
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    switch (i % 6) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      case 5:
        r = v
        g = p
        b = q
        break
      default:
        break
    }
    return [r, g, b]
  },
  inBrowser = () => typeof navigator !== 'undefined',
  intersectData = (bez: any, t1: number, t2: number): IntersectData => {
    const box = bez.boundingBox()
    return {
      bez,
      cx: box.cx,
      cy: box.cy,
      height: box.height,
      t: (t1 + t2) / 2,
      t1: t1,
      t2: t2,
      width: box.width,
    }
  },
  intersectsImpl = (
    d1: any,
    d2: any,
    depth: number,
    tolerance: number,
    intersections: unknown[],
    maxRecursion: number
  ) => {
    if (!boxIntersect(d1, d2)) {
      return
    }
    if (
      depth >= maxRecursion ||
      (d1.width <= tolerance &&
        d1.height <= tolerance &&
        d2.width <= tolerance &&
        d2.height <= tolerance)
    ) {
      intersections.push([d1.t, d2.t])
      return
    }
    const d1s = splitData(d1)
    const d2s = splitData(d2)
    intersectsImpl(
      d1s[0],
      d2s[0],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
    intersectsImpl(
      d1s[0],
      d2s[1],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
    intersectsImpl(
      d1s[1],
      d2s[0],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
    intersectsImpl(
      d1s[1],
      d2s[1],
      depth + 1,
      tolerance,
      intersections,
      maxRecursion
    )
  },
  isAudio = (asset: LottieAsset) =>
    !('h' in asset) &&
    !('w' in asset) &&
    'p' in asset &&
    'e' in asset &&
    'u' in asset &&
    'id' in asset,
  isBase64 = (str?: string) => {
    if (!str) {
      return false
    }
    const regex =
      /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
    return regex.test(parseBase64(str))
  },
  isImage = (asset: LottieAsset) =>
    'w' in asset && 'h' in asset && !('xt' in asset) && 'p' in asset,
  isSafari = (): boolean => {
    const result = inBrowser()
      ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      : false

    return result
  },
  isServer = () => !(typeof window !== 'undefined' && window.document),
  joinLines = (
    outputBezier: ShapePath,
    seg1: any,
    seg2: any,
    lineJoin: number,
    miterLimit: number
  ) => {
    const p0: Vector2 = seg1.points[3]
    const p1: Vector2 = seg2.points[0]

    // Bevel
    if (lineJoin === 3) {
      return p0
    }

    // Connected, they don't need a joint
    if (pointEqual(p0, p1)) {
      return p0
    }

    // Round
    if (lineJoin === 2) {
      const angleOut = -seg1.tangentAngle(1)
      const angleIn = -seg2.tangentAngle(0) + Math.PI
      const center = lineIntersection(
        p0,
        polarOffset(p0, angleOut + Math.PI / 2, 100) as Vector2,
        p1,
        polarOffset(p1, angleOut + Math.PI / 2, 100) as Vector2
      )
      const radius = center
        ? pointDistance(center, p0)
        : pointDistance(p0, p1) / 2

      let tan = polarOffset(p0, angleOut, 2 * radius * roundCorner)
      outputBezier.setXYAt(tan[0], tan[1], 'o', outputBezier.length() - 1)

      tan = polarOffset(p1, angleIn, 2 * radius * roundCorner)
      outputBezier.setTripleAt(
        p1[0],
        p1[1],
        p1[0],
        p1[1],
        tan[0],
        tan[1],
        outputBezier.length()
      )

      return p1
    }

    // Miter
    const t0 = pointEqual(p0, seg1.points[2]) ? seg1.points[0] : seg1.points[2]
    const t1 = pointEqual(p1, seg2.points[1]) ? seg2.points[3] : seg2.points[1]
    const intersection = lineIntersection(t0, p0, p1, t1)
    if (intersection && pointDistance(intersection, p0) < miterLimit) {
      outputBezier.setTripleAt(
        intersection[0],
        intersection[1],
        intersection[0],
        intersection[1],
        intersection[0],
        intersection[1],
        outputBezier.length()
      )
      return intersection
    }

    return p0
  },
  lerp = (p0: number, p1: number, amount: number) =>
    p0 * (1 - amount) + p1 * amount,
  lerpPoint = (p0: Vector2, p1: Vector2, amount: number): Vector2 => [
    lerp(p0[0], p1[0], amount),
    lerp(p0[1], p1[1], amount),
  ],
  linearOffset = (p1: Vector2, p2: Vector2, amount: number): Vector2[] => {
    const angle = Math.atan2(p2[0] - p1[0], p2[1] - p1[1])
    return [polarOffset(p1, angle, amount), polarOffset(p2, angle, amount)]
  },
  lineIntersection = (
    start1: Vector2,
    end1: Vector2,
    start2: Vector2,
    end2: Vector2
  ): Vector2 | null => {
    const v1 = [start1[0], start1[1], 1]
    const v2 = [end1[0], end1[1], 1]
    const v3 = [start2[0], start2[1], 1]
    const v4 = [end2[0], end2[1], 1]

    const r = crossProduct(crossProduct(v1, v2), crossProduct(v3, v4))

    if (floatZero(r[2])) {
      return null
    }

    return [r[0] / r[2], r[1] / r[2]]
  },
  markerParser = (_markers: (MarkerData | Marker)[]) => {
    /**
     *
     */
    function parsePayloadLines(payload: string) {
      const lines = payload.split('\r\n'),
        keys: Record<string, string> = {},
        { length } = lines
      let keysCount = 0

      for (let i = 0; i < length; i++) {
        const line = lines[i].split(':')
        if (line.length === 2) {
          keys[line[0]] = line[1].trim()
          keysCount += 1
        }
      }
      if (keysCount === 0) {
        throw new Error()
      }
      return keys
    }

    const markers = [],
      { length } = _markers
    for (let i = 0; i < length; i++) {
      if ('duration' in _markers[i]) {
        markers.push(_markers[i])
        continue
      }

      const markerData: MarkerData = {
        duration: (_markers[i] as Marker).dr,
        time: (_markers[i] as Marker).tm,
      }
      try {
        markerData.payload = JSON.parse((_markers[i] as Marker).cm)
      } catch (_) {
        try {
          markerData.payload = parsePayloadLines((_markers[i] as Marker).cm)
        } catch (__) {
          markerData.payload = {
            name: (_markers[i] as Marker).cm,
          }
        }
      }
      markers.push(markerData)
    }
    return markers
  },
  offsetSegment = (segment: { points: Vector2[] }, amount: number) => {
    let e: Vector2[]
    e = linearOffset(segment.points[0], segment.points[1], amount)
    const p0: Vector2 = e[0]
    const p1a = e[1]
    e = linearOffset(segment.points[1], segment.points[2], amount)
    const p1b = e[0]
    const p2b = e[1]
    e = linearOffset(segment.points[2], segment.points[3], amount)
    const p2a = e[0]
    const p3 = e[1]
    let p1 = lineIntersection(
      p0 as Vector2,
      p1a as Vector2,
      p1b as Vector2,
      p2b as Vector2
    )
    if (p1 === null) {
      p1 = p1a as Vector2
    }
    let p2 = lineIntersection(
      p2a as Vector2,
      p3 as Vector2,
      p1b as Vector2,
      p2b as Vector2
    )
    if (p2 === null) {
      p2 = p2a as Vector2
    }

    return new PolynomialBezier(p0, p1, p2, p3)
  },
  offsetSegmentSplit = (segment: any, amount: number) => {
    /*
    We split each bezier segment into smaller pieces based
    on inflection points, this ensures the control point
    polygon is convex.

    (A cubic bezier can have none, one, or two inflection points)
  */
    const flex = segment.inflectionPoints()
    let left
    let right
    let split

    if (flex.length === 0) {
      return [offsetSegment(segment, amount)]
    }

    if (flex.length === 1 || floatEqual(flex[1], 1)) {
      split = segment.split(flex[0])
      left = split[0]
      right = split[1]

      return [offsetSegment(left, amount), offsetSegment(right, amount)]
    }

    split = segment.split(flex[0])
    left = split[0]
    const t = (flex[1] - flex[0]) / (1 - flex[0])
    split = split[1].split(t)
    const mid = split[0]
    right = split[1]

    return [
      offsetSegment(left, amount),
      offsetSegment(mid, amount),
      offsetSegment(right, amount),
    ]
  },
  parseBase64 = (str: string) => str.substring(str.indexOf(',') + 1),
  polynomialCoefficients = (p0: number, p1: number, p2: number, p3: number) => [
    -p0 + 3 * p1 - 3 * p2 + p3,
    3 * p0 - 6 * p1 + 3 * p2,
    -3 * p0 + 3 * p1,
    p0,
  ],
  pointDistance = (p1: Vector2, p2: Vector2) =>
    Math.hypot(p1[0] - p2[0], p1[1] - p2[1]),
  pointEqual = (p1: Vector2, p2: Vector2) =>
    floatEqual(p1[0], p2[0]) && floatEqual(p1[1], p2[1]),
  polarOffset = (p: Vector2, angle: number, length: number): Vector2 => [
    p[0] + Math.cos(angle) * length,
    p[1] - Math.sin(angle) * length,
  ],
  prepareString = (str: string) =>
    str
      .replace(new RegExp(/"""/, 'g'), '""')
      .replace(/(["'])(.*?)\1/g, (_match, quote: string, content: string) => {
        const replacedContent = content.replace(/[^\w\s\d.#]/g, '')
        return `${quote}${replacedContent}${quote}`
      }),
  pruneIntersections = (segments: any[]) => {
    let e
    for (let i = 1; i < segments.length; i++) {
      e = pruneSegmentIntersection(segments[i - 1], segments[i])
      segments[i - 1] = e[0]
      segments[i] = e[1]
    }

    if (segments.length > 1) {
      e = pruneSegmentIntersection(segments[segments.length - 1], segments[0])
      segments[segments.length - 1] = e[0]
      segments[0] = e[1]
    }

    return segments
  },
  pruneSegmentIntersection = (a: any[], b: any[]) => {
    const outa = a.slice()
    const outb = b.slice()
    let intersect = getIntersection(a[a.length - 1], b[0])
    if (intersect) {
      outa[a.length - 1] = a[a.length - 1].split(intersect[0])[0]
      outb[0] = b[0].split(intersect[1])[1]
    }
    if (a.length > 1 && b.length > 1) {
      intersect = getIntersection(a[0], b[b.length - 1])
      if (intersect) {
        return [
          [a[0].split(intersect[0])[0]],
          [b[b.length - 1].split(intersect[1])[1]],
        ]
      }
    }
    return [outa, outb]
  },
  quadRoots = (a: number, b: number, c: number) => {
    // no root
    if (a === 0) {
      return []
    }
    const s = b * b - 4 * a * c
    // Complex roots
    if (s < 0) {
      return []
    }
    const singleRoot = -b / (2 * a)
    // 1 root
    if (s === 0) {
      return [singleRoot]
    }
    const delta = Math.sqrt(s) / (2 * a)
    // 2 roots
    return [singleRoot - delta, singleRoot + delta]
  },
  quaternionToEuler = (out: Vector3, quat: Vector4) => {
    const qx = quat[0]
    const qy = quat[1]
    const qz = quat[2]
    const qw = quat[3]
    const heading = Math.atan2(
      2 * qy * qw - 2 * qx * qz,
      1 - 2 * qy * qy - 2 * qz * qz
    )
    const attitude = Math.asin(2 * qx * qy + 2 * qz * qw)
    const bank = Math.atan2(
      2 * qx * qw - 2 * qy * qz,
      1 - 2 * qx * qx - 2 * qz * qz
    )
    out[0] = heading / degToRads
    out[1] = attitude / degToRads
    out[2] = bank / degToRads
  },
  resolveAssets = async (unzipped: Unzipped, assets?: LottieAsset[]) => {
    if (!Array.isArray(assets)) {
      return
    }

    const toResolve: Promise<void>[] = [],
      { length } = assets

    for (let i = 0; i < length; i++) {
      if (!isAudio(assets[i]) && !isImage(assets[i])) {
        continue
      }

      const type = isImage(assets[i]) ? 'images' : 'audio',
        u8 = unzipped?.[`${type}/${assets[i].p}`]

      if (!u8) {
        continue
      }

      toResolve.push(
        new Promise<void>((resolveAsset) => {
          const assetB64 = isServer()
            ? Buffer.from(u8).toString('base64')
            : btoa(
                u8.reduce(
                  (dat, byte) => `${dat}${String.fromCharCode(byte)}`,
                  ''
                )
              )

          assets[i].p =
            assets[i].p?.startsWith('data:') || isBase64(assets[i].p)
              ? assets[i].p
              : `data:${getMimeFromExt(getExt(assets[i].p))};base64,${assetB64}`
          assets[i].e = 1
          assets[i].u = ''

          resolveAsset()
        })
      )
    }

    await Promise.all(toResolve)
  },
  rgbToHex = (rVal: number, gVal: number, bVal: number) => {
    const colorMap: string[] = []
    let hex
    for (let i = 0; i < 256; i++) {
      hex = i.toString(16)
      colorMap[i] = hex.length === 1 ? `0${hex}` : hex
    }

    let r = rVal,
      g = gVal,
      b = bVal
    if (rVal < 0) {
      r = 0
    }
    if (gVal < 0) {
      g = 0
    }
    if (bVal < 0) {
      b = 0
    }
    return `#${colorMap[r]}${colorMap[g]}${colorMap[b]}`
  },
  RGBtoHSV = (r: number, g: number, b: number): Vector3 => {
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    let h = 0
    const s = max === 0 ? 0 : d / max
    const v = max / 255

    switch (max) {
      case min:
        h = 0
        break
      case r:
        h = g - b + d * (g < b ? 6 : 0)
        h /= 6 * d
        break
      case g:
        h = b - r + d * 2
        h /= 6 * d
        break
      case b:
        h = r - g + d * 4
        h /= 6 * d
        break
      default:
        break
    }

    return [h, s, v]
  },
  setPoint = (
    outputBezier: ShapePath,
    point: Vector2,
    angle: number,
    direction: AnimationDirection,
    amplitude: number,
    outAmplitude: number,
    inAmplitude: number
  ) => {
    const angO = angle - Math.PI / 2
    const angI = angle + Math.PI / 2
    const px = point[0] + Math.cos(angle) * direction * amplitude
    const py = point[1] - Math.sin(angle) * direction * amplitude

    outputBezier.setTripleAt(
      px,
      py,
      px + Math.cos(angO) * outAmplitude,
      py - Math.sin(angO) * outAmplitude,
      px + Math.cos(angI) * inAmplitude,
      py - Math.sin(angI) * inAmplitude,
      outputBezier.length()
    )
  },
  singlePoint = (p: number[]) => new PolynomialBezier(p, p, p, p, false),
  // based on @Toji's https://github.com/toji/gl-matrix/
  slerp = (a: Vector4, b: Vector4, t: number): Vector4 => {
    const out: Vector4 = [0, 0, 0, 0]
    const ax = a[0]
    const ay = a[1]
    const az = a[2]
    const aw = a[3]
    let bx = b[0]
    let by = b[1]
    let bz = b[2]
    let bw = b[3]

    let omega
    let cosom: number
    let sinom
    let scale0
    let scale1

    cosom = ax * bx + ay * by + az * bz + aw * bw
    if (cosom < 0.0) {
      cosom = -cosom
      bx = -bx
      by = -by
      bz = -bz
      bw = -bw
    }
    if (1.0 - cosom > 0.000001) {
      omega = Math.acos(cosom)
      sinom = Math.sin(omega)
      scale0 = Math.sin((1.0 - t) * omega) / sinom
      scale1 = Math.sin(t * omega) / sinom
    } else {
      scale0 = 1.0 - t
      scale1 = t
    }
    out[0] = scale0 * ax + scale1 * bx
    out[1] = scale0 * ay + scale1 * by
    out[2] = scale0 * az + scale1 * bz
    out[3] = scale0 * aw + scale1 * bw

    return out
  },
  splitData = (data: IntersectData) => {
    const split = data.bez.split(0.5)
    return [
      intersectData(split[0], data.t1, data.t),
      intersectData(split[1], data.t, data.t2),
    ]
  },
  // styleDiv = (element: HTMLElement) => {
  //   element.style.position = 'absolute'
  //   element.style.top = '0'
  //   element.style.left = '0'
  //   element.style.display = 'block'
  //   element.style.transformOrigin = '0 0'
  //   element.style.backfaceVisibility = 'visible'
  //   element.style.transformStyle = 'preserve-3d'
  // },
  unzip = async (
    resp: Response
    // filter: UnzipFileFilter = () => true
  ): Promise<Unzipped> => {
    const buffer = new Uint8Array(await resp.arrayBuffer()),
      unzipped = await new Promise<Unzipped>((resolve, reject) => {
        unzipOrg(
          buffer,
          /* { filter }, */ (err, file) => {
            if (err) {
              reject(err)
            }
            resolve(file)
          }
        )
      })
    // console.log('unzipped', unzipped)
    return unzipped
  }
// useId = (prefix?: string) => {
//   const s4 = () =>
//     (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
//   return `${prefix ?? `:${s4()}`}-${s4()}`
// }
