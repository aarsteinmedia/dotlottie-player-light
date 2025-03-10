import 'react/jsx-runtime'
import 'react/jsx-dev-runtime'

import type AnimationItem from '@/animation/AnimationItem'
import type {
  AngleEffect,
  CheckboxEffect,
  ColorEffect,
  LayerIndexEffect,
  MaskIndexEffect,
  NoValueEffect,
  PointEffect,
  SliderEffect,
} from '@/effects'
import type BaseElement from '@/elements/BaseElement'
import type DotLottiePlayer from '@/elements/DotLottiePlayer'
import type {
  SVGStrokeStyleData,
  SVGStyleData,
} from '@/elements/helpers/shapes'
import type MaskElement from '@/elements/MaskElement'
import type PolynomialBezier from '@/elements/PolynomialBezier'
import type { RendererType, PlayMode, ShapeType } from '@/enums'
import type AudioController from '@/utils/audio/AudioController'
import type FontManager from '@/utils/FontManager'
import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import type Matrix from '@/utils/Matrix'
import type ShapePath from '@/utils/shapes/ShapePath'
import type SlotManager from '@/utils/SlotManager'
import type TextAnimatorDataProperty from '@/utils/text/TextAnimatorDataProperty'
import type TextProperty from '@/utils/text/TextProperty'
import type { Plugin } from '@custom-elements-manifest/analyzer'

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
  | 'configError'
  | 'renderFrameError'
export type AnimationEventCallback<T = unknown> = (args: T) => void

export interface ShapeGroupHandler {
  gr: SVGElement
  it: unknown[]
  prevViewData: unknown[]
}

export interface SVGGeometry {
  cx: number
  cy: number
  height: number
  width: number
}

export interface Transformer {
  container: unknown
  mProps: {
    dynamicProperties: unknown[]
    v: Matrix
    _mdf?: boolean
  }
  op: {
    effectsSequence: unknown[]
  }
}

export type ElementInterface = BaseElement | SVGStrokeStyleData

export interface LayerInterFace {
  registerEffectsInterface: (effect: unknown) => void
  registerMaskInterface: (effect: unknown) => void
}

export interface CompInterface extends AnimationItem {
  _mdf?: boolean
  addDynamicProperty: (prop: TextProperty | DynamicPropertyContainer) => void
  animationItem: AnimationItem
  assetData: ImageData
  baseElement: SVGElement
  checkParenting: () => void
  comp: CompInterface
  compInterface: CompInterface
  completeLayers: boolean
  configAnimation: (animData: AnimationData) => void
  data: LottieLayer
  destroy: () => void
  dynamicProperties: unknown[]
  effectsManager: unknown
  elements: CompInterface[]
  getBaseElement: () => SVGElement
  getElementByPath: (val: unknown[]) => CompInterface
  getMatte: (id?: number) => string
  globalData: GlobalData
  hierarchy: boolean
  initBaseData: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompInterface
  ) => void
  initElement: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompInterface
  ) => void
  initExpressions: () => void
  initFrame: () => void
  initHierarchy: (hierarchy?: unknown[]) => void
  initItems: () => void
  initTransform: (
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompInterface
  ) => void
  layerElement: SVGGElement
  layers: LottieLayer[]
  maskedElement: SVGGElement
  maskManager: MaskElement
  matteElement: SVGGElement
  pendingElements: unknown[]
  prepareFrame?: (val: number) => void
  renderConfig: SVGRendererConfig
  renderedFrame: number
  rendererType: RendererType
  searchExtraCompositions: (assets: (LottieAsset | LottieLayer)[]) => void
  setAsParent: () => void
  setMatte: (id: string) => void
  supports3d: boolean
  svgElement?: SVGSVGElement
  textProperty?: {
    currentData: {
      l: number[]
    }
  }
  tm: number
}

export interface ProcessedElements {
  elem: LottieLayerData
  pos: number
}

export interface AnimatedContent {
  data: LottieLayerData
  element: ShapeDataInterface
  fn:
    | null
    | ((
        styleData: SVGStyleData,
        itemData: ItemData | ShapeDataInterface,
        isFirstFrame: boolean
      ) => void)
}

export interface ItemsData {
  gr: SVGGElement
  it: ShapeDataInterface[]
  prevViewData: ItemsData[]
}

export interface ItemData {
  _caching: Caching
  _frameId?: number
  _isFirstFrame: boolean
  _mdf?: boolean
  addEffect: (effect: Effect) => void
  c: ItemData
  canResize?: boolean
  comp: any
  completeTextData: (data?: Partial<DocumentData>) => void
  container?: unknown
  copyData: (data?: Partial<DocumentData>, b?: any) => void
  currentData?: Partial<DocumentData>
  d: ItemData
  dashoffset: Float32Array
  dashStr: string
  data: any
  defaultBoxWidth?: number
  e: any
  effectsSequence: any
  elem: any
  frameId: number
  g: any
  getValue: (val?: unknown) => unknown
  gf: SVGElement
  interpolateValue: (frame: number, caching: any) => void
  k: boolean
  keyframes: number[]
  keyframesMetadata: unknown[]
  keysIndex?: number
  kf: boolean
  minimumFontSize?: number
  mult: number
  o: ItemData
  offsetTime: number
  pos: number
  propType: 'multidimensional' | 'unidimensional'
  pv: string | number[] | number
  s: any
  searchProperty: () => boolean
  setVValue: (val: any) => void
  style: StyleData
  v: string | number[] | number
  vel: number | number[]
  w: ItemData
}

export interface StyleData {
  _mdf: boolean
  closed: boolean
  d: string
  data: Shape
  hd?: boolean
  lvl: number
  msElem: SVGElement | null
  pElem: SVGPathElement
  pt?: AnimatedProperty
  t: number
  ty: ShapeType
  type: ShapeType
}

export interface AnimationEvents {
  complete: BMCompleteEvent
  config_ready: undefined
  data_failed: undefined
  data_ready: undefined
  destroy: BMDestroyEvent
  DOMLoaded: undefined
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

// export interface Process {
//   [key: string]: unknown
//   onComplete<T>(data: T): void
//   onError(): void
// }

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
  extra?: number
  ind?: number
  l: number
  line: number
  n: boolean
  val: string
}

export type SVGRendererConfig = BaseRendererConfig & {
  title?: string
  description?: string
  preserveAspectRatio?: string
  progressiveLoad?: boolean
  hideOnTransparent?: boolean
  viewBoxOnly?: boolean
  viewBoxSize?: string | false
  focusable?: boolean
  filterSize?: FilterSizeConfig
  contentVisibility?: string
  runExpressions?: boolean
  width?: number
  height?: number
  id?: string
}

// export interface TextHandler {
//   initElement: (
//     data: LottieLayer,
//     globalData: GlobalData,
//     comp: CompInterface
//   ) => void
//   renderType: RendererType
//   textSpans: string[]
// }

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

export type Constructor = new (...args: any[]) => object
// export interface Constructor<T = unknown> {
//   // new (...args: any[]): T
//   prototype: T
// }

type BoolInt = 0 | 1

export interface GradientColor {
  k: {
    a: 1 | 0
    k: {
      s: number[]
    }[]
  }
  /** Number of colors */
  p: number
}

export interface PathData {
  _length: number
  _maxLength: number
  c: boolean
  i: Float32Array
  o: Float32Array
  v: Float32Array
}

export interface ShapeDataProperty {
  _mdf?: boolean
  a: 1 | 0
  ix?: number
  k: ShapePath | ShapePath[]
  paths: {
    _length: number
    _maxLength: number
    shapes: PathData[]
  }
}

export interface StrokeData {
  n: 'o' | 'd' | 'g'
  nm?: 'offset' | 'dash' | 'gap'
  p: any
  v?: VectorProperty
}

interface ShapeColor {
  a: 1 | 0
  ix?: number
  k: number | number[] | ShapeColorValue[]
}

export interface ShapeColorValue {
  e: Vector4
  i: Vector4
  s: Vector4
}

export interface Shape {
  _length: number
  _processed?: boolean
  _render?: boolean
  /** Anchor point / Highlight angle for radial gradient */
  a?: VectorProperty<Vector1 | Vector2 | Vector3>
  /** Blend Mode */
  bm?: number
  /** Color */
  c?: ShapeColor
  cix?: number
  /** CSS Class */
  cl?: string
  closed?: boolean
  d?: StrokeData[]
  /** Endpoint for gradient */
  e?: VectorProperty<Vector2>
  /** Gradient colors */
  g?: GradientColor
  /** Highlight length for radial gradient */
  h?: GenericAnimatedProperty
  hd?: boolean
  ind?: number
  it?: Shape[]
  ix?: number
  ks?: ShapeDataProperty
  lc?: 1 | 2 | 3
  lj?: 1 | 2 | 3
  ln?: string
  /** Stacking order. 1: Above 2. Below */
  m?: 1 | 2
  ml?: number
  mn?: string
  nm?: string
  /** Number of properties */
  np?: number
  o?: VectorProperty
  /** Position */
  p?:
    | { s: number; x: VectorProperty; y: VectorProperty; z: VectorProperty }
    | VectorProperty
  pt?: VectorProperty<ShapePath>
  /** Rotation (for transforms) | Fill-rule (for fills) */
  r?: number | VectorProperty
  /** Scale / StartPoint for gradient */
  s?: VectorProperty<Vector2 | Vector3>
  /** Skew Axis */
  sa?: VectorProperty
  /** Skew */
  sk?: VectorProperty
  /** Gradient type */
  t?: number
  tr?: LottieTransform
  ty: ShapeType
  w?: VectorProperty
}

interface LottieTransform {
  /** Anchor Point */
  a: VectorProperty<Vector2>
  /** End Opacity (for repeater) */
  eo?: VectorProperty
  /** Position */
  p: VectorProperty<Vector2>
  /** Rotation */
  r: VectorProperty
  /** Scale */
  s: VectorProperty<Vector2>
  /** Start Opacity (for repeater) */
  so?: VectorProperty
}

export interface LottieAsset {
  __used?: boolean
  /** Whether the data is embedded/encoded */
  e?: BoolInt
  /** Height of image in pixels */
  h?: number

  /** id/slug of asset – e.g. image_0 / audio_0 */
  id?: string

  layers?: LottieLayer[] & { __used?: boolean }

  /** Name of asset – e.g. "Black Mouse Ears" */
  nm?: string

  /** Filename – e.g image_0.png / audio_0.mp3 | DataURL, Base64 encoded */
  p?: string

  /** Aspect Ratio */
  pr?: string

  sid?: string

  t?: string

  /** Path to asset. Empty string if asset is embedded */
  u?: string
  /** Width of image in pixels */
  w?: number

  /** Extra composition */
  xt?: number
}

export interface AnimationSettings {
  autoplay?: Autoplay
  direction?: AnimationDirection
  loop?: Loop
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
export type Loop = boolean | '' | 'loop' | null | number
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
  /** Overrides default module creation: */
  overrideModuleCreation({
    globs,
    ts,
  }: {
    ts: unknown // TypeScrip
    globs: string[]
  }): unknown[] // SourceFile[]
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: boolean
  /** Provide custom plugins */
  plugins: Array<() => Plugin>
  /** Enable special handling for stencil */
  stencil: boolean
  /** Run in watch mode, runs on file changes */
  watch: boolean
}

type Vector1 = number
export type Vector2 = [number, number]
export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]

export type VectorProperty<T = Vector1> = {
  a: 1 | 0
  k: T
  v?: number
  ix?: number
  sid?: number
}

interface Coordinates {
  c?: boolean
  x: number
  y: number
}

export interface MaskData {
  c?: boolean
  e?: Coordinates[]
  i: Coordinates
  o: Coordinates
  s: Coordinates[]
  t: number
}

export interface Mask {
  cl?: boolean
  d?: StrokeData
  inv: boolean
  mode: string
  nm: string
  o: {
    a: 0 | 1
    k: number
    ix?: number
  }
  pt: {
    a: 0 | 1
    k: MaskData | MaskData[]
    ix?: number
  }
  x: {
    a: 0 | 1
    k: number
    ix?: number
  }
}

interface LayerStyle {
  a?: {
    a: 0 | 1
    k: number
  }
  bm?: {
    a: 0 | 1
    k: number
  }
  c: {
    a: 0 | 1
    k: Vector3 | Vector4
  }
  ch?: {
    a: 0 | 1
    k: number
  }
  d?: {
    a: 0 | 1
    k: number
  }
  mn: string
  nm: string
  no?: {
    a: 0 | 1
    k: number
  }
  o?: {
    a: 0 | 1
    k: number
  }
  s: {
    a: 0 | 1
    k: number
  }
  ty: number
}

export interface LetterProperties {
  __complete?: boolean
  _mdf: {
    fc: boolean
    m: boolean
    o: boolean
    p: boolean
    sc: boolean
    sw: boolean
  }
  f: string
  fc?: Vector3 | Vector4 | string
  j: number
  ls: number
  m?: number | string
  o?: number
  of: boolean
  p?: number | number[]
  s: number
  sc?: Vector3 | Vector4 | string
  sw?: number
  t: string
}

export interface DocumentData extends FontList {
  __complete?: boolean
  ascent?: number
  boxWidth?: Vector2 | number
  f: string
  fc?: Vector3 | string
  fillColorAnim?: boolean
  finalLineHeight?: number
  finalSize?: number
  finalText: string[]
  j?: number
  justifyOffset?: number
  k: {
    s: LetterProperties | DocumentData // TODO: This may be a workarount, idk
    t: number
  }[]
  l?: Letter[]
  lh: number
  lineWidths?: number[]
  ls?: number
  of?: string
  ps?: Vector2 | null
  s: number
  sc?: string
  sid?: unknown
  strokeColorAnim?: boolean
  strokeWidthAnim?: boolean
  sw?: number
  sz: Vector2[]
  t: string | number
  tr: number
  yOffset?: number
}

export interface TextRangeValue {
  /** Max Amount */
  a: {
    a: 0 | 1
    k: number
  }
  /** Based On */
  b: number
  /** End */
  e: {
    a: 0 | 1
    k: number
  }
  /** Min Ease */
  ne: {
    a: 0 | 1
    k: number
  }
  /** Offset */
  o: {
    a: 0 | 1
    k: number
  }
  /** Range units */
  r: number
  /** Randomize */
  rn: 0 | 1
  /** Start */
  s: {
    a: 0 | 1
    k: number
  }
  /** Shape */
  sh: number
  /** Smoothness */
  sm: {
    a: 0 | 1
    k: number
  }
  t: 0 | 1
  totalChars: number
  /** Max Ease */
  xe: {
    a: 0 | 1
    k: number
  }
}

export interface StyleObject {
  _mdf?: boolean
  closed?: boolean
  d: string
  data: Shape
  lvl: number
  msElem?: SVGElement
  pElem?: SVGPathElement
  reset(): void
  type: ShapeType
}

export interface ShapeDataInterface {
  _isAnimated: boolean
  /** SVG Path Data */
  caches: string[]
  container: CompInterface
  elements: CompInterface[]
  lStr: string
  lvl: number
  setAsAnimated: () => void
  sh: {
    propType: string
    k: boolean
    kf: boolean
    _mdf: boolean
    comp: CompInterface
    paths: ShapePath[]
  }
  styles: SVGStyleData[]
  transform: Transformer
  transformers: Transformer[]
}

export interface TextAnimatorAnimatables {
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
    propType: boolean
  }
  nm: string
  s: TextRangeValue
}

export interface TextData {
  __complete: boolean
  /** Text range */
  a?: TextAnimatorDataProperty[]
  ascent: number
  boxWidth: Vector2
  /** Text Document */
  d?: DocumentData
  f: string
  fc: string
  fillColorAnim: boolean
  finalLineHeight: number
  finalSize: number
  finalText: string[]
  fStyle: string
  fWeight: string
  justifyOffset: number
  l: Letter[]
  lh: number
  lineWidths: number[]
  ls: number
  /** Text Alignment */
  m?: {
    /** Grouping */
    g: number
    a: {
      a: 0 | 1
      k: Vector2
      ix?: number
    }
  }
  of: string
  /** Text Follow Path TODO: */
  p?: {
    a: unknown
    p: unknown
    r: unknown
  }
  ps: null | Vector2
  s: number
  sc: string
  strokeColorAnim: boolean
  strokeWidthAnim: boolean
  sw: number
  t: string // number
  tr: number
  yOffset: number
}

export type EffectElement =
  | typeof SliderEffect
  | typeof AngleEffect
  | typeof ColorEffect
  | typeof PointEffect
  | typeof CheckboxEffect
  | typeof NoValueEffect
  | typeof LayerIndexEffect
  | typeof MaskIndexEffect
export interface EffectValue {
  ty: number
  v: {
    a: 1 | 0
    k: number | Vector3 | Vector4
  }
}

export interface Effect {
  ef: EffectValue[]
  en: 1 | 0
  ix?: number
  nm?: string
  np: number
  ty: number
}

export interface FontList {
  cache?: Record<string, unknown>
  fClass: string
  fFamily: string
  fName: string
  fOrigin: string
  fPath: string
  fStyle: string
  fWeight: string
  helper?: {
    measureText: (str: string, fontName?: string, size?: number) => number
  }
  loaded?: boolean
  monoCase?: {
    node: HTMLElement
    parent: HTMLElement
    w: number
  }
  origin: number // 0 | 1
  sansCase?: {
    node: HTMLElement
    parent: HTMLElement
    w: number
  }
}

// export interface FontHandler {
//   _warned?: boolean
//   chars: Characacter[] | null
//   checkLoadedFonts: (args: unknown) => void
//   checkLoadedFontsBinded: (args: unknown) => void
//   fonts: FontList[]
//   getFontByName: (name?: string) => FontList
//   initTime: number
//   isLoaded: boolean
//   setIsLoaded: (val: boolean) => void
//   setIsLoadedBinded: (val: boolean) => void
//   typekitLoaded: number
// }

export interface Characacter {
  ch?: Characacter
  data: LottieLayer
  fFamily?: string
  shapes: Shape[]
  size: number
  style?: string
  t: number
  w: number
}

export interface AnimationData {
  __complete?: boolean
  $schema?: string
  ao?: 0 | 1
  assets: LottieAsset[]
  /** Characters */
  chars?: Characacter[]
  /** Is three dimensional */
  ddd: 0 | 1
  fonts: {
    list: DocumentData[]
  }
  /** Framerate */
  fr: number
  /** Height */
  h: number
  /** In point */
  ip: number
  layers: LottieLayer[]
  markers?: MarkerData[]
  meta?: {
    a: string
    d: string
    k: string
    tc: string
    g: string
  }
  /** Match name */
  mn?: string
  /** Name */
  nm: string
  /** Out point */
  op: number
  segments: {
    time: number
  }[]
  slots?: {
    [key: string]: {
      p: any
    }
  }
  /** Version */
  v: string
  /** Width */
  w: number
}

export interface LottieLayerData {
  a: {
    a: 0 | 1
    k: number[]
    ix?: number
    l?: number
  }
  autoOriented?: boolean
  nm: string
  o: VectorProperty
  p: {
    a: 0 | 1
    k: number[]
    ix?: number
    l?: number
  }
  r: VectorProperty
  s: {
    a: 0 | 1
    k: number[]
    ix?: number
    l?: number
  }
  sa: {
    a: 0 | 1
    k: number
    ix?: number
  }
  sk: {
    a: 0 | 1
    k: number
    ix?: number
  }
}

export interface LottieLayer {
  __used?: boolean
  ao?: number
  au?: {
    lv?: {
      k: number[]
    }
  }
  /** Blend Mode */
  bm?: number
  chars?: Characacter[]
  cl?: string
  completed?: boolean
  /** Whether transforms should be applied before or after masks */
  ct?: 0 | 1
  ddd?: 0 | 1
  ef?: Readonly<Effect[]>
  fonts?: {
    list: DocumentData[]
  }
  fr?: number
  h?: number
  hasMask?: boolean
  hd?: boolean
  height?: number
  id?: string
  ind?: number
  /** In point */
  ip: number
  ks: LottieLayerData
  layers?: LottieLayer[] & { __used?: boolean }
  ln?: string
  masksProperties?: Mask[]
  nm: string
  /** Out point */
  op: number
  parent?: number
  /** Asset ID */
  refId?: string
  sc?: string
  sh?: number
  shapes?: Shape[] // Readonly<Shape[]>
  singleShape?: boolean
  slots?: {
    [key: string]: {
      p: any
    }
  }
  /** Time stretch */
  sr?: number
  /** Start time */
  st: number
  sw?: number
  sy?: LayerStyle[]
  /** Text Data */
  t?: TextData
  /** Matte target: If set to 1 it means a layer is using this layer as a track matte */
  td?: 0 | 1
  textData?: {
    height: number
    width: number
  }
  /** Time remappoing */
  tm?: AnimatedProperty
  /** Matte reference (for shape) */
  tp?: number
  /** Matte mode */
  tt?: number
  /** Layer type */
  ty: number
  w?: number
  width?: number
  xt?: number
}

export interface AnimatedProperty<T = number> {
  _placeholder?: boolean
  a: 0 | 1
  ix?: number
  v?: T
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
  /** Duration */
  dr: number
  /** Time */
  tm: number
}

export interface MarkerData {
  duration: number
  payload?: Record<string, unknown>
  time: number
}

export interface DataFunctionManager {
  checkChars?: (animationData: AnimationData) => void
  checkColors?: (animationData: AnimationData) => void
  checkPathProperties?: (animationData: AnimationData) => void
  checkShapes?: (animationData: AnimationData) => void
  completeData?: (animationData: AnimationData) => void
  completeLayers?: (layers: LottieLayer[], comps: LottieComp[]) => void
}

export interface WorkerEvent {
  data: {
    id: string
    type: string
    path: string
    fullPath: string
    animation: AnimationData
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dotlottie-player': DotLottiePlayer
  }
  function dotLottiePlayer(): DotLottiePlayer
}

export interface ExpressionsPlugin {
  initExpressions(animItem: AnimationItem): void
  resetFrame(): void
}

type JSXLottiePlayer = Omit<Partial<DotLottiePlayer>, 'style'> & {
  class?: string
  ref?: React.RefObject<unknown>
  style?: React.CSSProperties
  src: string
}

export interface Audio {
  pause(): void
  play(): void
  playing(): boolean
  rate(val: number): void
  resume(): void
  seek(val?: number): number
  setRate(val: number): void
  volume(val: number): void
}

export type AudioFactory = (path?: string) => Audio

export type LottieComp = LottieLayer | LottieAsset

export interface ImageData {
  assetData: LottieAsset
  img: null | SVGElement | HTMLCanvasElement | HTMLMediaElement
}

export interface Keyframe {
  e: Vector2
  h?: number
  i: {
    x: number | number[]
    y: number | number[]
  }
  keyframeMetadata: any
  n: string
  o: {
    x: number | number[]
    y: number | number[]
  }
  s: Vector3
  t: number
  ti: Vector2
  to: Vector2
}

export interface Caching {
  _lastAddedLength: number
  _lastKeyframeIndex: number
  _lastPoint: number
  lastFrame: number
  lastIndex: number
  value: any
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
  audioController?: AudioController
  compSize?: {
    w: number
    h: number
  }
  defs: SVGDefsElement
  fontManager?: FontManager
  frameId: number
  frameNum?: number
  frameRate: number
  getAssetData?: AnimationItem['getAssetData']
  getAssetsPath?: AnimationItem['getAssetsPath']
  imageLoader?: any
  nm?: string
  progressiveLoad?: boolean
  projectInterface?: any // ProjectInterface
  renderConfig?: SVGRendererConfig | CanvasRendererConfig | HTMLRendererConfig
  slotManager?: SlotManager
}

interface SequenceValue<T = number> {
  effectsSequence: unknown[]
  v: T
}

export interface TransformHandler {
  a: SequenceValue<number[]>
  appliedTransformations: number
  or: SequenceValue<number[]>
  pre: Matrix
  r?: SequenceValue
  rx: SequenceValue
  ry: SequenceValue
  rz: SequenceValue
  s: SequenceValue<number[]>
  sa: SequenceValue
  sk: SequenceValue<number[]>
}

export interface IntersectData {
  bez: PolynomialBezier
  cx: number
  cy: number
  height: number
  t: number
  t1: number
  t2: number
  width: number
}

// export interface BMEvent {
//   currentLoop: number
//   currentTime: number
//   direction: AnimationDirection
//   firstFrame: number
//   nativeError: unknown
//   target: BMEvent
//   totalFrames: number
//   totalLoops: number
//   totalTime: number
//   type: string
// }

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
