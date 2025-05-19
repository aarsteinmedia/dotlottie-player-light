/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-namespace */
import 'react/jsx-runtime'
import 'react/jsx-dev-runtime'

import type { Plugin } from '@custom-elements-manifest/analyzer'

import type DotLottiePlayer from '@/elements/DotLottiePlayer'

interface BaseRendererConfig {
  className?: string
  imagePreserveAspectRatio?: string
}

interface FilterSizeConfig {
  height: string
  width: string
  x: string
  y: string
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

export type CanvasRendererConfig = BaseRendererConfig & {
  clearCanvas?: boolean
  context?: CanvasRenderingContext2D
  progressiveLoad?: boolean
  preserveAspectRatio?: string
}

export type HTMLRendererConfig = BaseRendererConfig & { hideOnTransparent?: boolean }

export type AnimateOnScroll = boolean | '' | null
export type Autoplay = boolean | '' | 'autoplay' | null
export type Controls = boolean | '' | 'controls' | null
export type Loop = boolean | '' | 'loop' | null | number
export type Subframe = boolean | '' | null

export interface CEMConfig {
  /** Enable special handling for catalyst. */
  catalyst: boolean
  /** Include third party custom elements manifests. */
  dependencies: boolean
  /** Run in dev mode, provides extra logging. */
  dev: boolean
  /** Globs to exclude. */
  exclude: string[]
  /** Enable special handling for fast. */
  fast: boolean
  /** Globs to analyze. */
  globs: ['src/**/*.ts']
  /** Enable special handling for litelement. */
  litelement: boolean
  /** Directory to output CEM to. */
  outdir: string
  /** Overrides default module creation. */
  overrideModuleCreation: ({
    globs,
    ts,
  }: {
    /**
     * TypeScript.
     */
    ts: unknown
    globs: string[]
  }) => unknown[]
  /** Output CEM path to `package.json`, defaults to true. */
  packagejson: boolean
  /** Provide custom plugins. */
  plugins: (() => Plugin)[]
  /** Enable special handling for stencil. */
  stencil: boolean
  /** Run in watch mode, runs on file changes. */
  watch: boolean
}

type JSXLottiePlayer = Omit<Partial<DotLottiePlayer>, 'style'> & {
  class?: string
  ref?: React.RefObject<unknown>
  style?: React.CSSProperties
  src: string
}

declare global {
  interface HTMLElementTagNameMap {'dotlottie-player': DotLottiePlayer}
  function dotLottiePlayer(): DotLottiePlayer
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {'dotlottie-player': JSXLottiePlayer}
  }
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {'dotlottie-player': JSXLottiePlayer}
  }
}

declare module 'react/jsx-dev-runtime' {
  namespace JSX {
    interface IntrinsicElements {'dotlottie-player': JSXLottiePlayer}
  }
}
