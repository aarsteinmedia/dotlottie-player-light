import { fileURLToPath } from 'url'
import path from 'node:path'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { importMapsPlugin } from '@web/dev-server-import-maps'
// import { playwrightLauncher } from '@web/test-runner-playwright'
import rollupPostcss from 'rollup-plugin-postcss'
import { fromRollup } from '@web/dev-server-rollup'
import { typescriptPaths as rollupTypescriptPaths } from 'rollup-plugin-typescript-paths'

const __dirname = path.dirname(fileURLToPath(import.meta.url)),

 typescriptPaths = fromRollup(rollupTypescriptPaths),
  postcss = fromRollup(rollupPostcss),
  /**
   * @type {import('@web/test-runner').TestRunnerConfig}
   * */
  testRunnerConfig = {
    // browsers: [playwrightLauncher({ product: 'firefox' })],
    files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    nodeResolve: true,
    plugins: [
      typescriptPaths({
        preserveExtensions: true,
      }),
      importMapsPlugin({
        inject: {
          importMap: {
            imports: { '@/': './src/' },
          },
        },
      }),
      esbuildPlugin({
        // json: true,
        loaders: { '.scss': 'css' },
        target: 'esnext',
        ts: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
      postcss(),
    ],
  }

export default testRunnerConfig
