declare module '*.scss' {
  import type { CSSResult } from 'lit'
  const content: CSSResult
  export default content
}

declare module 'rollup-plugin-serve'