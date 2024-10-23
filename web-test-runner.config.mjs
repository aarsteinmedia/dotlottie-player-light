import { esbuildPlugin } from '@web/dev-server-esbuild'
import { playwrightLauncher } from '@web/test-runner-playwright'
import { fromRollup } from '@web/dev-server-rollup'
import { typescriptPaths as rollupTypescriptPaths } from 'rollup-plugin-typescript-paths'

const typescriptPaths = fromRollup(rollupTypescriptPaths)

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 * */
const testRunnerConfig = {
  browsers: [playwrightLauncher({ product: 'firefox' })],
  files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
  nodeResolve: true,
  plugins: [typescriptPaths(), esbuildPlugin({ ts: true })],
}

export default testRunnerConfig
