import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'

// SSL 憑證路徑
const sslKeyPath = '/root/lfup/ssl/lifeup.key'
const sslCertPath = '/root/lfup/ssl/fullchain.crt'

// 檢查 SSL 憑證是否存在
const hasSSL = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)

export default defineConfig(({ mode }) => {
  // 開發模式使用 HTTP，生產模式使用 HTTPS (需要 SSL 憑證存在)
  const isDevelopment = mode === 'development'
  const useHTTPS = !isDevelopment && hasSSL

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: useHTTPS ? 443 : 5173,
      host: isDevelopment ? '127.0.0.1' : '0.0.0.0',
      allowedHosts: ['lifeup-study.top', '.lifeup-study.top', 'localhost'],
      https: useHTTPS ? {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath)
      } : undefined,
      hmr: useHTTPS ? {
        host: 'lifeup-study.top',
        protocol: 'wss',
        port: 443
      } : undefined
    },
    build: {
      outDir: 'dist',
      sourcemap: isDevelopment,
      minify: isDevelopment ? false : 'terser'
    }
  }
})