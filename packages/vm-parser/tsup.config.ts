import { tsupConfigBase, defineConfig } from '@avalabs/tsup';

export default defineConfig({
  ...tsupConfigBase,
  entry: ['src/index.ts'],
});
