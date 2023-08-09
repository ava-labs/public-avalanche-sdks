import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./src/index.ts'],
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: true,
  minify: true,
  treeshake: true,
  tsconfig: './tsconfig.json',
});
