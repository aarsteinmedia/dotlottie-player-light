import 'react/jsx-runtime'
import 'react/jsx-dev-runtime'
import type { AnimationDirection } from 'lottie-web'
import type { Plugin } from '@custom-elements-manifest/analyzer'
import type { PlayMode, ShapeType } from '@/enums'
import type DotLottiePlayer from '@/elements/DotLottiePlayer'

export type ArrayType = 'float32' | 'int16' | 'int32' | 'uint8' | 'uint8c'

type BoolInt = 0 | 1

export interface Shape {
  ind?: number
  ix?: number
  ty: ShapeType
  it?: Omit<Shape, 'np'>[]
  /** Anchor point / Highlight angle for radial gradient */
  a?: VectorProperty<Vector1 | Vector2 | Vector3>
  /** Highlight length for radial gradient */
  h?: {
    a: 1 | 0
    k: Vector2 | number
    ix?: number
  }
  /** Position */
  p?: VectorProperty<Vector2 | Vector3>
  /** Scale / StartPoint for gradient */
  s?: VectorProperty<Vector2 | Vector3>
  /** Endpoint for gradient */
  e?: VectorProperty<Vector2>
  /** Gradient type */
  t?: number
  /** Gradient colors */
  g?: {
    /** Number of colors */
    p: number
    k: {
      a: 1 | 0
      k: number[]
    }
  }
  /** Skew */
  sk?: VectorProperty
  /** Skew Axis */
  sa?: VectorProperty
  /** Color */
  c?: {
    a: 1 | 0
    k: number | number[]
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
  bm?: number
  ks?: {
    a: 1 | 0
    k: {
      /** In tangents */
      i: Vector2[]
      /** Out tangents */
      o: Vector2[]
      /** Verticies */
      v: Vector2[]
      /** isClosed */
      c: 0 | 1 | boolean
    }
    ix?: number
  }
  /** Number of properties */
  np?: number
  tr?: LottieTransform
  nm?: string
  mn?: string
  hd?: boolean
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
}

export interface LottieJSON {
  assets?: LottieAsset[]
  ddd: number
  /** Frames per second, natively */
  fr: number
  /** Height of animation in pixels */
  h: number
  ip: number
  layers: unknown[]
  markers: unknown[]
  meta: {
    a: string
    d: string
    /** Generator */
    g: string
    k: string
    tc: string
  }
  /** Name of animation, from rendering */
  nm: string
  /** Total number of frames */
  op: number
  /** Version */
  v: string
  /** Width of animation in pixels */
  w: number
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

type VectorProperty<T = Vector1> = {
  a: 1 | 0
  k: T
  ix?: number
}

interface Mask {
  inv: boolean
  mode: string
  pt: {
    a: 0 | 1
    k: {
      i: Vector2[]
      o: Vector2[]
      v: Vector2[]
      c: boolean
    }
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

interface DocumentData {
  k: {
    s:
      | {
          s: number
          f: string
          t: string
          ls: number
          j: number
          fc: Vector3 | Vector4
          sc?: Vector3 | Vector4
          sw?: number
          of: boolean
        }
      | DocumentData // TODO: This may be a workarount, idk
    t: number
  }[]
}

interface TextData {
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
    s: {
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
}

interface Effect {
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

interface Asset {
  id: string
  nm?: string
  u: string
  p: string
  e: 0 | 1
  w: number
  h: number
  t?: 'seq'
  sid?: string
  layers?: LottieLayer[]
}

interface FontList {
  origin: number // 0 | 1
  fPath: string
  fClass: string
  fFamily: string
  fWeight: string
  fStyle: string
  fName: string
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
  chars?: {
    data: LottieLayer
    t: number
  }[]
  assets: Asset[]
  fonts: {
    list: FontList[]
  }
  layers: LottieLayer[]
  markers?: []
  meta?: {
    a: string
    d: string
    k: string
    tc: string
    g: string
  }
}

export interface LottieLayer {
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
  completed?: boolean
}

export interface PrecompositionLayer extends LottieLayer {
  id: string
}

declare global {
  interface HTMLElementTagNameMap {
    'dotlottie-player': DotLottiePlayer
  }
  function dotLottiePlayer(): DotLottiePlayer

  // interface Window {
  //   Howl: (x: { src: string[]; html5?: boolean }) => void
  // }
}

type JSXLottiePlayer = Omit<Partial<DotLottiePlayer>, 'style'> & {
  class?: string
  ref?: React.RefObject<unknown>
  style?: React.CSSProperties
  src: string
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
