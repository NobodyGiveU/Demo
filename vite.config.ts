import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/data': resolve(__dirname, 'src/data')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        browser: 'browser-view.html',
        mobile: 'mobile-view.html',
        laptop: 'laptop-view.html',
        overall: 'overall-view.html',
        share: 'share-stats.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})