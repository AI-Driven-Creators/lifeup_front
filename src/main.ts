import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import { validateEnvironmentVariables, showEnvironmentError } from './utils/env-check'

// 在應用啟動前驗證環境變數
console.log('🔍 檢查環境變數設定...')
const envValidation = validateEnvironmentVariables()

if (!envValidation.isValid) {
  console.error('❌ 環境變數驗證失敗，應用無法啟動')
  showEnvironmentError(envValidation)
  
  // 阻止應用繼續啟動
  throw new Error(`環境設定錯誤: ${envValidation.errorMessage}`)
}

console.log('✅ 環境變數驗證通過')
console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL)

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')