import 'react/jsx-runtime'
import 'react/jsx-dev-runtime'
import type { Plugin } from '@custom-elements-manifest/analyzer'
import { RendererType, type PlayMode, type ShapeType } from '@/enums'
import type DotLottiePlayer from '@/elements/DotLottiePlayer'
import type AnimationItem from '@/animation/AnimationItem'
import type PropertyFactory from '@/utils/PropertyFactory'
import type PolynomialBezier from '@/elements/PolynomialBezier'
import type FontManager from '@/utils/FontManager'
import type ProjectInterface from '@/utils/helpers/ProjectInterface'
import type Matrix from '@/utils/Matrix'

export type AnimationDirection = 1 | -1
export type AnimationEventName =
  | 'drawnFrame'
  | 'enterFrame'
  | 'loopComplete'
  | 'complete'
  | 'segmentStart'
  | 'destroy'
  | 'config_ready'
  | 'data_ready'
  | 'DOMLoaded'
  | 'error'
  | 'data_failed'
  | 'loaded_images'
  | '_play'
  | '_pause'
  | '_idle'
  | '_active'
export type AnimationEventCallback<T = unknown> = (args: T) => void

export interface ShapeGroupHandler {
  it: unknown[]
  prevViewData: unknown[]
  gr: SVGElement
}

export interface Transformer {
  container: unknown
  mProps: {
    dynamicProperties: unknown[]
    v?: number
    _mdf?: boolean
  }
  op: {
    effectsSequence: unknown[]
  }
}

export interface LayerInterFace {
  registerEffectsInterface: (effect: unknown) => void
  registerMaskInterface: (effect: unknown) => void
}

export interface ElementInterface {
  animationItem: AnimationItem
  data: LottieLayer
  globalData: GlobalData
  elements: ElementInterface[]
  layerElement: SVGGElement
  layers: LottieLayer[]
  pendingElements: unknown[]
  renderConfig: SVGRendererConfig
  renderedFrame: number
  rendererType: RendererType
  svgElement?: SVGSVGElement
  baseElement: SVGElement
  comp: ElementInterface
  dynamicProperties: unknown[]
  effectsManager: unknown
  hierarchy: boolean
  maskManager: unknown
  maskedElement: SVGGElement
  matteElement: SVGGElement
  supports3d: boolean
  completeLayers: boolean
  initElement: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterface
  ) => void
  initBaseData: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterface
  ) => void
  initTransform: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterface
  ) => void
  initHierarchy: (hierarchy?: unknown[]) => void
  initFrame: () => void
  tm: number
}

export interface PropertyHandler {
  propType: 'multidimensional' | 'uniidimensional'
  effectsSequence: any
  data: any
  keyframes: any[]
  keyframesMetadata: unknown[]
  offsetTime: number
  k: boolean
  kf: boolean
  _isFirstFrame: boolean
  mult: number
  elem: any
  container?: HTMLElement
  comp: any
  getValue: (val: unknown) => unknown
  setVValue: (val: any) => void
  interpolateValue: (frame: number, caching: any) => void
  searchProperty: () => boolean
  copyData: (data?: Partial<DocumentData>, b?: any) => void
  completeTextData: (data?: Partial<DocumentData>) => void
  frameId: number
  v: string | number[]
  pv: string | number[]
  _caching: {
    lastFrame: number
    lastIndex: number
    value: number[]
  }
  _frameId?: number
  _mdf?: boolean
  keysIndex?: number
  addEffect: (effect: Effect) => void
  canResize?: boolean
  minimumFontSize?: number
  currentData?: Partial<DocumentData>
  defaultBoxWidth?: number
  pos: number
}

export interface StyleHandler {
  data: Shape
  type: ShapeType
  d: string
  lvl: number
  _mdf: boolean
  closed: boolean
  pElem: SVGPathElement
  msElem: unknown
}

export interface ShapeHandler {
  caches: unknown[]
  styles: any[]
  elements: ElementInterface[]
  transform: Transformer
  transformers: Transformer[]
  lStr: string
  sh: Shape['ks']
  lvl: number
  _isAnimated?: boolean
}

export interface AnimationEvents {
  DOMLoaded: undefined
  complete: BMCompleteEvent
  config_ready: undefined
  data_failed: undefined
  data_ready: undefined
  destroy: BMDestroyEvent
  drawnFrame: BMEnterFrameEvent
  enterFrame: BMEnterFrameEvent
  error: undefined
  loaded_images: undefined
  loopComplete: BMCompleteLoopEvent
  segmentStart: BMSegmentStartEvent
}

export interface BMCompleteLoopEvent {
  currentLoop: number
  direction: number
  totalLoops: number
  type: 'loopComplete'
}

export interface BMSegmentStartEvent {
  firstFrame: number
  totalFrames: number
  type: 'segmentStart'
}

export interface BMCompleteEvent {
  direction: number
  type: 'complete'
}

export interface BMDestroyEvent {
  type: 'destroy'
}

export interface BMEnterFrameEvent {
  /** The current time in frames. */
  currentTime: number
  direction: number
  /** The total number of frames. */
  totalTime: number
  type: 'enterFrame'
}

export type BaseRendererConfig = {
  imagePreserveAspectRatio?: string
  className?: string
}

export interface Process {
  [key: string]: unknown
  onError(): void
  onComplete<T>(data: T): void
}

export type FilterSizeConfig = {
  width: string
  height: string
  x: string
  y: string
}

export interface Letter {
  add: number
  an: number
  animatorJustifyOffset: number
  anIndexes: number[]
  l: number
  val: string
  line: number
  n: boolean
  ind?: number
  extra?: number
}

export type SVGRendererConfig = BaseRendererConfig & {
  title?: string
  description?: string
  preserveAspectRatio?: string
  progressiveLoad?: boolean
  hideOnTransparent?: boolean
  viewBoxOnly?: boolean
  viewBoxSize?: string | boolean
  focusable?: boolean
  filterSize?: FilterSizeConfig
  contentVisibility?: string
  runExpressions?: boolean
  width?: number
  height?: number
  id?: string
}

export interface TextHandler {
  textSpans: string[]
  renderType: RendererType
  initElement: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterface
  ) => void
}

export type CanvasRendererConfig = BaseRendererConfig & {
  clearCanvas?: boolean
  context?: CanvasRenderingContext2D
  progressiveLoad?: boolean
  preserveAspectRatio?: string
}

export type HTMLRendererConfig = BaseRendererConfig & {
  hideOnTransparent?: boolean
}

export type AnimationConfiguration<T extends RendererType = RendererType.SVG> =
  {
    animationData?: AnimationData
    animType?: RendererType
    container?: HTMLElement
    wrapper?: HTMLElement
    renderer?: T
    autoloadSegments?: boolean
    loop?: Loop
    autoplay?: boolean
    initialSegment?: Vector2
    name?: string
    assetsPath?: string
    rendererSettings?: {
      svg: SVGRendererConfig
      canvas: CanvasRendererConfig
      html: HTMLRendererConfig
    }[T]
    // audioFactory?(assetPath: string): {
    //   play(): void
    //   seek(): void
    //   playing(): void
    //   rate(): void
    //   setVolume(): void
    // }

    audioFactory?: AudioFactory
    path?: string
    prerender?: boolean
  }

export interface Constructor<T = unknown> {
  // new (...args: any[]): T
  prototype: T
}

type BoolInt = 0 | 1

export interface ShapeData {
  /** In tangents */
  i: (Vector2 | null)[]
  /** Out tangents */
  o: (Vector2 | null)[]
  /** Verticies */
  v: (Vector2 | null)[]
  /** isClosed */
  c: 0 | 1 | boolean
  _length?: number
  length(): number
  setLength(length: number): void
  setPathData(data: any, length: number): void
  setTripleAt(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number
  ): void
  // inflectionPoints(): number[]
  setXYAt(a: number, b: number, c: string, d: number): void
}

export interface GradientColor {
  /** Number of colors */
  p: number
  k: {
    a: 1 | 0
    k: {
      s: number[]
    }[]
  }
}

export interface Shape {
  closed?: boolean
  ind?: number
  ix?: number
  ln?: string
  ty: ShapeType
  it?: Omit<Shape, 'np'>[]
  /** Anchor point / Highlight angle for radial gradient */
  a?: VectorProperty<Vector1 | Vector2 | Vector3>
  /** Highlight length for radial gradient */
  h?: GenericAnimatedProperty
  /** Position */
  p?: VectorProperty<Vector2 | Vector3>
  /** Scale / StartPoint for gradient */
  s?: VectorProperty<Vector2 | Vector3>
  /** Endpoint for gradient */
  e?: VectorProperty<Vector2>
  /** Gradient type */
  t?: number
  /** Gradient colors */
  g?: GradientColor
  /** Skew */
  sk?: VectorProperty
  /** Skew Axis */
  sa?: VectorProperty
  /** Color */
  c?: {
    a: 1 | 0
    k:
      | number
      | number[]
      | {
          i: Vector4
          s: Vector4
          e: Vector4
        }[]
    ix?: number
  }
  o?: VectorProperty
  /** Stacking order. 1: Above 2. Below */
  m?: 1 | 2
  /** Rotation (for transforms) | Fill-rule (for fills) */
  r?: number | VectorProperty
  lc?: 1 | 2 | 3
  lj?: 1 | 2 | 3
  w?: VectorProperty
  ml?: number
  d?: {
    n: 'o' | 'd' | 'g'
    nm: 'offset' | 'dash' | 'gap'
    v: VectorProperty
  }[]
  /** Blend Mode */
  bm?: number
  /** CSS Class */
  cl?: string
  ks?: {
    a: 1 | 0
    k: ShapeData
    ix?: number
    _mdf?: boolean
  }
  /** Number of properties */
  np?: number
  tr?: LottieTransform
  nm?: string
  mn?: string
  hd?: boolean
  _render?: boolean
  _processed?: boolean
}

interface LottieTransform {
  /** Anchor Point */
  a: VectorProperty<Vector2>
  /** Position */
  p: VectorProperty<Vector2>
  /** Scale */
  s: VectorProperty<Vector2>
  /** Rotation */
  r: VectorProperty
  /** Start Opacity (for repeater) */
  so?: VectorProperty
  /** End Opacity (for repeater) */
  eo?: VectorProperty
}

export interface LottieAsset {
  sid?: string
  /** Whether the data is embedded/encoded */
  e?: BoolInt

  layers?: LottieLayer[]

  /** Height of image in pixels */
  h?: number

  /** id/slug of asset – e.g. image_0 / audio_0 */
  id?: string

  /** Name of asset – e.g. "Black Mouse Ears" */
  nm?: string

  /** Filename – e.g image_0.png / audio_0.mp3 | DataURL, Base64 encoded */
  p?: string

  /** Path to asset. Empty string if asset is embedded */
  u?: string

  /** Extra composition */
  xt?: number

  /** Width of image in pixels */
  w?: number
  t?: string

  /** Aspect Ratio */
  pr?: string
}

export interface AnimationSettings {
  autoplay?: Autoplay
  loop?: Loop
  direction?: AnimationDirection
  mode?: PlayMode
  speed?: number
}

export interface Animation extends AnimationSettings {
  id: string
}

export interface AnimationConfig extends Animation {
  url: string
}

export interface LottieManifest {
  animations: Animation[]
  author?: string
  description?: string
  generator?: string
  keywords?: string
  version?: string
}

export type AnimateOnScroll = boolean | '' | null
export type Autoplay = boolean | '' | 'autoplay' | null
export type Controls = boolean | '' | 'controls' | null
export type Loop = boolean | '' | 'loop' | null
export type Subframe = boolean | '' | null

export interface CEMConfig {
  /** Enable special handling for catalyst */
  catalyst: boolean
  /** Include third party custom elements manifests */
  dependencies: boolean
  /** Run in dev mode, provides extra logging */
  dev: boolean
  /** Globs to exclude */
  exclude: string[]
  /** Enable special handling for fast */
  fast: boolean
  /** Globs to analyze */
  globs: ['src/**/*.ts']
  /** Enable special handling for litelement */
  litelement: boolean
  /** Directory to output CEM to */
  outdir: string
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: boolean
  /** Enable special handling for stencil */
  stencil: boolean
  /** Run in watch mode, runs on file changes */
  watch: boolean
  /** Provide custom plugins */
  plugins: Array<() => Plugin>
  /** Overrides default module creation: */
  overrideModuleCreation({
    globs,
    ts,
  }: {
    ts: unknown // TypeScrip
    globs: string[]
  }): unknown[] // SourceFile[]
}

type Vector1 = number
export type Vector2 = [number, number]
export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export type VectorProperty<T = Vector1> = {
  a: 1 | 0
  k: T
  ix?: number
}

export interface Mask {
  inv: boolean
  mode: string
  pt: {
    a: 0 | 1
    k: ShapeData
    ix?: number
  }
  o: {
    a: 0 | 1
    k: number
    ix?: number
  }
  x: {
    a: 0 | 1
    k: number
    ix?: number
  }
  nm: string
  cl?: boolean
}

interface LayerStyle {
  nm: string
  mn: string
  ty: number
  c: {
    a: 0 | 1
    k: Vector3 | Vector4
  }
  o?: {
    a: 0 | 1
    k: number
  }
  s: {
    a: 0 | 1
    k: number
  }
  a?: {
    a: 0 | 1
    k: number
  }
  d?: {
    a: 0 | 1
    k: number
  }
  ch?: {
    a: 0 | 1
    k: number
  }
  bm?: {
    a: 0 | 1
    k: number
  }
  no?: {
    a: 0 | 1
    k: number
  }
}

export interface LetterProperties {
  s: number
  f: string
  t: string
  ls: number
  j: number
  fc?: Vector3 | Vector4 | string
  sc?: Vector3 | Vector4 | string
  sw?: number
  of: boolean
  m?: number | string
  o?: number
  p?: number | number[]
  _mdf: {
    fc: boolean
    m: boolean
    o: boolean
    p: boolean
    sc: boolean
    sw: boolean
  }
}

export interface DocumentData extends FontList {
  k: {
    s: LetterProperties | DocumentData // TODO: This may be a workarount, idk
    t: number
  }[]
  s: number
  finalSize?: number
  finalText: string[]
  sid?: unknown
  finalLineHeight?: number
  lh: number
  tr: number
  f: unknown
  sz: Vector2
  l?: Letter[]
  boxWidth?: number
  justifyOffset?: number
  lineWidths?: number[]
  strokeColorAnim?: boolean
  strokeWidthAnim?: boolean
  fillColorAnim?: boolean
  yOffset?: number
  ls?: number
  ascent?: number
  t: string | number
  j?: number
  fc?: Vector3 | string
  sw?: number
  sc?: string
  ps?: Vector2 | null
  of?: string
  __complete?: boolean
}

export interface TextRangeValue {
  t: 0 | 1
  /** Offset */
  o: {
    a: 0 | 1
    k: number
  }
  /** Start */
  s: {
    a: 0 | 1
    k: number
  }
  /** End */
  e: {
    a: 0 | 1
    k: number
  }
  /** Max Amount */
  a: {
    a: 0 | 1
    k: number
  }
  /** Based On */
  b: number
  /** Randomize */
  rn: 0 | 1
  /** Shape */
  sh: number
  /** Max Ease */
  xe: {
    a: 0 | 1
    k: number
  }
  /** Min Ease */
  ne: {
    a: 0 | 1
    k: number
  }
  /** Smoothness */
  sm: {
    a: 0 | 1
    k: number
  }
  /** Range units */
  r: number
}

export interface StyleObject {
  type: ShapeType
  d: string
  lvl: number
  data: Shape
  msElem?: SVGElement
}

export interface ShapeDataInterface {
  _isAnimated: boolean
  /** SVG Path Data */
  caches: string[]
  lStr: string
  lvl: number
  sh: {
    propType: string
    k: boolean
    kf: boolean
    _mdf: boolean
    comp: ElementInterface
  }
  container: any
  styles: StyleObject[]
  transformers: Transformer[]
  setAsAnimated: () => void
}

export interface TextData {
  /** Text Document */
  d: DocumentData
  /** Text Follow Path TODO: */
  p: {
    a: unknown
    p: unknown
    r: unknown
  }
  /** Text Alignment */
  m: {
    /** Grouping */
    g: number
    a: {
      a: 0 | 1
      k: Vector2
      ix?: number
    }
  }
  /** Text range */
  a: {
    nm: string
    s: TextRangeValue
    /** Text Style */
    a: {
      /** Position */
      p: {
        a: 0 | 1
        k: Vector2 | Vector3
      }
      /** Rotation */
      r: {
        a: 0 | 1
        k: number
      }
      /** Opacity */
      o: {
        a: 0 | 1
        k: number
      }
      /** Fill Color */
      fc: {
        a: 0 | 1
        k: Vector3 | Vector4
      }
      /** Fill hue */
      fh: {
        a: 0 | 1
        k: number
      }
      /** Fill Saturation */
      fs: {
        a: 0 | 1
        k: number
      }
      /** Fill Brightness */
      fb: {
        a: 0 | 1
        k: number
      }
      /** Stroke color */
      sc?: {
        a: 0 | 1
        k: Vector3 | Vector4
      }
      /** Stroke Width */
      sw?: {
        a: 0 | 1
        k: number
      }
      /** Letter Spacing */
      t: {
        a: 0 | 1
        k: number
      }
    }
  }[]
  __complete?: boolean
}

export interface Effect {
  nm?: string
  np: number
  ty: number
  ix?: number
  en: 1 | 0
  ef: {
    ty: number
    v: {
      a: 1 | 0
      k: number | Vector3 | Vector4
    }
  }[]
}

export interface FontList {
  fOrigin: string
  origin: number // 0 | 1
  fPath: string
  fClass: string
  fFamily: string
  fWeight: string
  fStyle: string
  fName: string
  helper?: {
    measureText: (str: string, fontName?: string, size?: number) => number
  }
  cache?: Record<string, unknown>
  monoCase?: {
    node: HTMLElement
    parent: HTMLElement
    w: number
  }
  sansCase?: {
    node: HTMLElement
    parent: HTMLElement
    w: number
  }
  loaded?: boolean
}

export interface FontHandler {
  chars: Characacter[] | null
  isLoaded: boolean
  fonts: FontList[]
  getFontByName: (name?: string) => FontList
  checkLoadedFonts: (args: unknown) => void
  checkLoadedFontsBinded: (args: unknown) => void
  typekitLoaded: number
  initTime: number
  setIsLoadedBinded: (val: boolean) => void
  setIsLoaded: (val: boolean) => void
  _warned?: boolean
}

export interface Characacter {
  data: LottieLayer
  t: number
  shapes: Shape[]
  size: number
  w: number
  style?: string
  fFamily?: string
  ch?: Characacter
}

export interface AnimationData {
  $schema?: string
  /** Version */
  v: string
  /** Framerate */
  fr: number
  /** In point */
  ip: number
  /** Out point */
  op: number
  /** Width */
  w: number
  /** Height */
  h: number
  /** Match name */
  mn?: string
  /** Name */
  nm: string
  ao?: 0 | 1
  /** Is three dimensional */
  ddd: 0 | 1
  /** Characters */
  chars?: Characacter[]
  assets: LottieAsset[]
  fonts: {
    list: FontList[]
  }
  layers: LottieLayer[]
  segments: {
    time: number
  }[]
  markers?: MarkerData[]
  meta?: {
    a: string
    d: string
    k: string
    tc: string
    g: string
  }
  __complete?: boolean
}

export interface LottieLayer {
  id?: string
  ddd?: 0 | 1
  ind?: number
  /** Layer type */
  ty: number
  /** Asset ID */
  refId?: string
  nm: string
  /** Time stretch */
  sr?: number
  ks: {
    o: VectorProperty
    r: VectorProperty
    p: {
      a: 0 | 1
      k: number[]
      ix?: number
      l?: number
    }
    a: {
      a: 0 | 1
      k: number[]
      ix?: number
      l?: number
    }
    s: {
      a: 0 | 1
      k: number[]
      ix?: number
      l?: number
    }
    sk: {
      a: 0 | 1
      k: number
      ix?: number
    }
    sa: {
      a: 0 | 1
      k: number
      ix?: number
    }
  }
  ef?: Readonly<Effect[]>
  sy?: LayerStyle[]
  ao?: number
  hasMask?: boolean
  masksProperties?: Readonly<Mask[]>
  sw?: number
  sh?: number
  sc?: string
  /** In point */
  ip: number
  /** Out point */
  op: number
  /** Start time */
  st: number
  /** Blend Mode */
  bm?: number
  parent?: number
  shapes?: Shape[] // Readonly<Shape[]>
  /** Text Data */
  t?: TextData
  /** Matte target: If set to 1 it means a layer is using this layer as a track matte */
  td?: 0 | 1
  /** Matte mode */
  tt?: number
  /** Matte reference (for shape) */
  tp?: number
  /** Whether transforms should be applied before or after masks */
  ct?: 0 | 1
  layers?: LottieLayer[] & { __used?: boolean }
  /** Time remappoing */
  tm?: AnimatedProperty
  xt?: number
  completed?: boolean
  __used?: boolean
}

interface AnimatedProperty {
  a: 0 | 1
  ix?: number
}

export interface UniDimensionalAnimatedProperty extends AnimatedProperty {
  k: number
}

export interface MultiDimensionalAnimatedProperty extends AnimatedProperty {
  k: number[]
}

export interface GenericAnimatedProperty extends AnimatedProperty {
  k: number | number[]
}

export interface Marker {
  /** Comment */
  cm: string
  /** Time */
  tm: number
  /** Duration */
  dr: number
}

export interface MarkerData {
  duration: number
  time: number
  payload?: Record<string, unknown>
}

export interface DataFunctionManager {
  completeData?: (animationData: AnimationData | AnimationItem) => void
  checkColors?: (animationData: AnimationData) => void
  checkChars?: (animationData: AnimationData) => void
  checkPathProperties?: (animationData: AnimationData) => void
  checkShapes?: (animationData: AnimationData) => void
  completeLayers?: (layers: LottieLayer[], comps: LottieComp[]) => void
}

export type AssetLoader = (
  path: string,
  fullPath: string,
  onComplete: (data: AnimationData) => void,
  onError?: (x?: unknown) => unknown
) => void

export interface WorkerEvent {
  data: {
    id: string
    type: string
    path: string
    fullPath: string
    animation: AnimationItem
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dotlottie-player': DotLottiePlayer
  }
  function dotLottiePlayer(): DotLottiePlayer
}

export interface ExpressionsPlugin {
  resetFrame(): void
  initExpressions(animItem: AnimationItem): void
}

type JSXLottiePlayer = Omit<Partial<DotLottiePlayer>, 'style'> & {
  class?: string
  ref?: React.RefObject<unknown>
  style?: React.CSSProperties
  src: string
}

export interface Audio {
  volume(x: number): void
  resume(): void
  pause(): void
  play(): void
  setRate(x: number): void
}

export type AudioFactory = (path: string) => Audio

export type LottieComp = LottieLayer | LottieAsset

export interface ImageData {
  assetData: LottieAsset
  img: null | SVGElement | HTMLCanvasElement | HTMLMediaElement
}

export interface Caching {
  lastFrame: number
  lastIndex: number
  value: number
  _lastKeyframeIndex: number
  _lastAddedLength: number
  _lastPoint: number
}

export interface PropertyElement {
  comp: unknown
  data: {
    st: number
  }
}

export interface SegmentPool {
  lengths: unknown[]
  totalLength: number
}

// TODO:!!!
export interface GlobalData {
  _mdf?: boolean
  audioController?: unknown
  defs?: SVGDefsElement
  projectInterface?: ReturnType<typeof ProjectInterface>
  progressiveLoad?: boolean
  fontManager?: typeof FontManager
  slotManager?: typeof PropertyFactory
  getAssetData?: AnimationItem['getAssetData']
  compSize?: unknown
  frameId?: number
  frameRate?: number
  frameNum?: number
  imageLoader?: any
  nm?: string
  getAssetsPath?: AnimationItem['getAssetsPath']
  renderConfig?: SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig
}

interface SequenceValue<T = number> {
  effectsSequence: unknown[]
  v: T
}

export interface TransformHandler {
  pre: Matrix
  appliedTransformations: number
  a: SequenceValue<number[]>
  s: SequenceValue<number[]>
  sk: SequenceValue<number[]>
  sa: SequenceValue
  r?: SequenceValue
  rz: SequenceValue
  ry: SequenceValue
  rx: SequenceValue
  or: SequenceValue<number[]>
}

export interface AssetHandler {
  loadedAssets: number
  totalImages: number
  loadedFootagesCount: number
  totalFootages: number
  imagesLoadedCb: null | ((images: ImageData[] | null) => void)
  createImageData: (assetData: LottieAsset) => ImageData
  createFootageData: (assetData: LottieAsset) => ImageData
  _createImageData: (assetData: LottieAsset) => ImageData
  createImgData: (assetData: LottieAsset) => ImageData
  destroy: () => void
  footageLoaded: () => void
  getAsset: (assetData: LottieAsset) => LottieAsset
  imageLoaded: (this: AssetHandler) => void
  loadAssets: (assets: LottieAsset[], cb?: (arg: unknown) => void) => void
  loadedFootages: () => boolean
  loadedImages: () => boolean
  setAssetsPath: (path: string) => void
  setCacheType: (type: string, elementHelper: SVGElement) => void
  setPath: (path?: string) => void
  assetsPath: string
  path: string
  _imageLoaded: () => void
  _footageLoaded: () => void
  testImageLoaded: (image: SVGImageElement) => void
  _elementHelper: SVGElement
  images: ImageData[]
}

export interface IntersectData {
  bez: typeof PolynomialBezier
  cx: number
  cy: number
  height: number
  t: number
  t1: number
  t2: number
  width: number
}

export interface BMEvent {
  type: string
  direction: AnimationDirection
  totalTime: number
  currentTime: number
  currentLoop: number
  nativeError: unknown
  totalLoops: number
  firstFrame: number
  totalFrames: number
  target: BMEvent
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': JSXLottiePlayer
    }
  }
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': JSXLottiePlayer
    }
  }
}

declare module 'react/jsx-dev-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': JSXLottiePlayer
    }
  }
}
