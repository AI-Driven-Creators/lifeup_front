import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 443,
    host: '0.0.0.0',
    allowedHosts: ['lifeup-study.top', '.lifeup-study.top'],
    https: {
      key: fs.readFileSync('/root/lfup/ssl/lifeup.key'),
      cert: fs.readFileSync('/root/lfup/ssl/fullchain.crt')
    }
  }
})