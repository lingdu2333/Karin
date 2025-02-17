import fs from 'node:fs'
import { URL } from 'node:url'
import { defineConfig } from 'tsup'

fs.rmSync('dist/module', { recursive: true, force: true })
const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  entry: ['exports/module/*.ts'],
  format: ['cjs', 'esm'],
  target: 'node16',
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  outDir: 'dist/module',
  treeshake: true,
  external: Object.keys(pkg.dependencies),
})
