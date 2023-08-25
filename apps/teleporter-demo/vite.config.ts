/* eslint-disable new-cap -- ignore */
import react from '@vitejs/plugin-react-swc';
import { dotenvLoad } from 'dotenv-mono';
import * as path from 'path';
import bundleVisualizer from 'rollup-plugin-visualizer';
import loadVersion from 'vite-plugin-package-version';
import removeConsole from 'vite-plugin-remove-console';
import { Plugin, defineConfig } from 'vite';

/**
 * Because we want to use one single .env file for all projects we need to load the .env file from
 * root. Vite has a built in system for this but it assumes the .env file is at the root of the vite project
 * where as dotenv-mono deals with sharing the file across all projects and apps
 */
dotenvLoad();

// @ts-expect-error -- ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- ignore
const getBundleVisualizerPlugin: Plugin = () => ({
  ...bundleVisualizer({
    template: 'treemap', // or sunburst
    open: true,
    gzipSize: true,
  }),
  apply: 'build',
  enforce: 'post',
});

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(() => ({
  define: {
    'process.env': {},
    'import.meta.env.BUILD_TIMESTAMP': JSON.stringify(new Date()), // timestamp printed in footer for QA
  },
  plugins: [
    loadVersion(),
    removeConsole({ includes: ['log', 'warn', 'table'] }), // remove console.log from production builds, only keep console.error
    react(),
    // getBundleVisualizerPlugin(), // uncomment this to analyze bundle
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  assetsInclude: ['**/*.riv'],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  css: {
    transformer: 'lightningcss',
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  build: {
    target: 'esnext',
    outDir: './dist',
    cssMinify: 'lightningcss',
    chunkSizeWarningLimit: 5000, // 5000 kbs
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: ({ name }) => {
          if (!name) {
            throw new Error('Missing name in assetFileNames');
          }

          const fileExt = name.split('.').pop();

          if (fileExt === 'woff' || fileExt === 'woff2') {
            // removing hash on fonts so they can be preloaded
            return `assets/[name].[ext]`;
          }

          return `assets/[name].[hash].[ext]`;
        },
      },
    },
  },
}));
