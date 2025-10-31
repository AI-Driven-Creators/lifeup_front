import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'

// SSL 憑證路徑
const sslKeyPath = '/root/lfup/ssl/lifeup.key'
const sslCertPath = '/root/lfup/ssl/fullchain.crt'

// 檢查 SSL 憑證是否存在
const hasSSL = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: hasSSL ? 443 : 5173,
    host: '0.0.0.0',
    allowedHosts: hasSSL ? ['lifeup-study.top', '.lifeup-study.top'] : undefined,
    https: hasSSL ? {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath)
    } : undefined
  }
})