import autoprefixer from 'autoprefixer'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import flexbugs from 'postcss-flexbugs-fixes'
import livereload from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import postcssLit from 'rollup-plugin-postcss-lit'
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve'
import * as rollupPluginSummary from 'rollup-plugin-summary'
import { minify, swc } from 'rollup-plugin-swc3'
import template from 'rollup-plugin-html-literals'
import pkg from './package.json' assert { type: 'json' }

const isProd = process.env.NODE_ENV !== 'development',
  input = './src/index.ts',
  plugins = (preferBuiltins = false) => [
    postcss({
      inject: false,
      plugins: [
        flexbugs(),
        autoprefixer({
          flexbox: 'no-2009',
        }),
      ],
    }),
    postcssLit({
      importPackage: 'lit',
    }),
    template(),
    replace({
      preventAssignment: false,
      'Reflect.decorate': 'undefined',
    }),
    nodeResolve({
      extensions: ['.ts'],
      preferBuiltins,
    }),
    commonjs(),
    swc(),
  ],
  unpkgPlugins = () => [
    ...plugins(),
    isProd && minify(),
    isProd && rollupPluginSummary.default(),
    !isProd &&
      serve({
        open: true,
      }),
    !isProd && livereload(),
  ],
  modulePlugins = () => [
    ...plugins(true),
    isProd && rollupPluginSummary.default()
  ],
  module = {
    input,
    external: [
      'lit',
      'lit/decorators.js',
      'lottie-web/build/player/lottie_light.js',
      'fflate',
    ],
    output: [
      {
        file: pkg.module,
        format: 'esm',
      },
      {
        file: pkg.exports['.'].require,
        format: 'cjs',
      },
    ],
    onwarn(warning, defaultHandler) {
      if (warning.code === 'THIS_IS_UNDEFINED')
      {return}
      defaultHandler(warning)
    },
    plugins: modulePlugins(),
  },
  types = {
    input: './types/index.d.ts',
    output: {
      file: pkg.types,
      format: 'esm',
    },
    plugins: [dts()],
  },
  unpkg = {
    input,
    output: {
      extend: true,
      file: pkg.main,
      format: 'iife',
      name: pkg.name,
    },
    onwarn(warning, defaultHandler) {
      if (warning.code === 'THIS_IS_UNDEFINED')
      {return}
      defaultHandler(warning)
    },
    plugins: unpkgPlugins(),
  }

export default isProd ? [
  types,
  unpkg,
  module,
] : unpkg