import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
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
    plugins: [
      vue(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.js',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          globIgnores: ['**/node_modules/**/*']
        },
        manifest: {
          name: '人生升級系統',
          short_name: 'LifeUp',
          description: 'AI驅動的遊戲化自我成長平台',
          theme_color: '#4F46E5',
          background_color: '#ffffff',
          icons: [
            {
              src: '/favicon.ico',
              sizes: '48x48',
              type: 'image/x-icon'
            },
            {
              src: '/icon.svg',
              sizes: 'any',
              type: 'image/svg+xml'
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
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