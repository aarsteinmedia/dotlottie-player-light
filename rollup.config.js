import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import autoprefixer from 'autoprefixer'
import { readFile } from 'fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import flexbugs from 'postcss-flexbugs-fixes'
import { dts } from 'rollup-plugin-dts'
import template from 'rollup-plugin-html-literals'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import { summary } from 'rollup-plugin-summary'
import { minify, swc } from 'rollup-plugin-swc3'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

const isProd = process.env.NODE_ENV !== 'development',
  __dirname = path.dirname(fileURLToPath(import.meta.url)),
  /**
   * @type {typeof import('./package.json')}
   * */
  pkg = JSON.parse(
    (
      await readFile(
        new URL(path.resolve(__dirname, 'package.json'), import.meta.url)
      )
    ).toString()
  ),
  injectVersion = () => ({
    name: 'inject-version',
    renderChunk: (code) => code.replace('[[BM_VERSION]]', pkg.version),
  }),
  input = path.resolve(__dirname, 'src', 'index.ts'),
  /**
   * @type {import('rollup').RollupOptions.InputPluginOption}
   * */
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
      include: [
        path.resolve(__dirname, 'src', 'elements', 'DotLottiePlayer.ts'),
        path.resolve(__dirname, 'src', 'templates', '*'),
      ],
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
    injectVersion(),
    swc(),
  ],
  /**
   * @type {import('rollup').RollupOptions.InputPluginOption}
   * */
  unpkgPlugins = () => [...plugins(), isProd && minify(), isProd && summary()],
  /**
   * @type {import('rollup').RollupOptions.InputPluginOption}
   * */
  modulePlugins = () => [
    ...plugins(true),
    isProd && summary(),
    !isProd &&
      serve({
        open: true,
      }),
    !isProd && livereload(),
  ],
  /**
   * @type {import('rollup').RollupOptions}
   * */
  types = {
    external: [
      '@aarsteinmedia/lottie-web/light',
      '@aarsteinmedia/lottie-web/utils',
      'react',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
    ],
    input: path.resolve(__dirname, 'types', 'index.d.ts'),
    output: {
      file: pkg.types,
      format: 'esm',
    },
    plugins: [dts()],
  },
  /**
   * @type {import('rollup').RollupOptions}
   * */
  unpkg = {
    input,
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
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
  /**
   * @type {import('rollup').RollupOptions}
   * */
  module = {
    external: [
      '@aarsteinmedia/lottie-web/light',
      '@aarsteinmedia/lottie-web/utils',
      'fflate',
      'react',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
    ],
    input,
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return
      }
      warn(warning)
    },
    output: {
      exports: 'named',
      file: pkg.main,
      format: 'esm',
    },

    plugins: modulePlugins(),
  }

export default isProd ? [module, types, unpkg] : module
