import { Options } from 'tsup';

export * from 'tsup';

export const tsupConfigBase = {
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: true,
} satisfies Options;
