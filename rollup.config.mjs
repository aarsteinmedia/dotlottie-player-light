import autoprefixer from 'autoprefixer'
import commonjs from '@rollup/plugin-commonjs'
import { dts } from 'rollup-plugin-dts'
import flexbugs from 'postcss-flexbugs-fixes'
import json from '@rollup/plugin-json'
import livereload from 'rollup-plugin-livereload'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import * as rollupPluginSummary from 'rollup-plugin-summary'
import { minify, swc } from 'rollup-plugin-swc3'
import template from 'rollup-plugin-html-literals'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import pkg from './package.json' assert { type: 'json' }

const isProd = process.env.NODE_ENV !== 'development',
  input = './src/index.ts',
  plugins = (preferBuiltins = false) => [
    typescriptPaths(),
    postcss({
      inject: false,
      plugins: isProd
        ? [
            flexbugs(),
            autoprefixer({
              flexbox: 'no-2009',
            }),
          ]
        : [],
    }),
    template({
      include: './src/index.ts',
      options: {
        shouldMinify({ parts }) {
          return parts.some(
            ({ text }) =>
              text.includes('<figure') ||
              text.includes('<div') ||
              text.includes('<svg')
          )
        },
      },
    }),
    json({
      compact: true,
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
    isProd && rollupPluginSummary.default(),
  ],
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
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return
      }
      warn(warning)
    },
    output: {
      exports: 'named',
      extend: true,
      file: pkg.unpkg,
      format: 'iife',
      name: pkg.name,
    },
    plugins: unpkgPlugins(),
  },
  module = {
    external: ['lottie-web/build/player/lottie_light.js', 'fflate'],
    input,
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return
      }
      warn(warning)
    },
    output: [
      {
        exports: 'named',
        file: pkg.module,
        format: 'esm',
      },
      {
        exports: 'named',
        file: pkg.exports['.'].require,
        format: 'cjs',
      },
    ],
    plugins: modulePlugins(),
  }

export default isProd ? [types, unpkg, module] : unpkg
