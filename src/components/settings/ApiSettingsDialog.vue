<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h2 class="text-xl font-bold mb-4">API 設定</h2>
      
      <div class="mb-4">
        <label for="baseUrl" class="block text-sm font-medium text-gray-700 mb-2">
          後端服務器地址
        </label>
        <input
          id="baseUrl"
          v-model="localConfig.baseURL"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="http://localhost:8080"
        />
        <p class="text-sm text-gray-500 mt-1">
          請輸入完整的URL，包含協議(http/https)和端口號
        </p>
      </div>

      <div class="mb-4">
        <button
          @click="testConnection"
          :disabled="isTestingConnection"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {{ isTestingConnection ? '測試中...' : '測試連接' }}
        </button>
        <span v-if="connectionStatus" class="ml-2 text-sm" :class="connectionStatusClass">
          {{ connectionStatus }}
        </span>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="resetToDefault"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          重置為預設
        </button>
        <button
          @click="cancel"
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          取消
        </button>
        <button
          @click="save"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { loadApiConfig, saveApiConfig, resetApiConfig, defaultConfig, type ApiConfig } from '../../config/api'
import { ApiClient, resetApiClient } from '../../services/api'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localConfig = ref<ApiConfig>({ ...loadApiConfig() })
const isTestingConnection = ref(false)
const connectionStatus = ref('')

const connectionStatusClass = computed(() => {
  if (connectionStatus.value.includes('成功')) {
    return 'text-green-600'
  } else if (connectionStatus.value.includes('失敗')) {
    return 'text-red-600'
  }
  return 'text-gray-600'
})

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // 對話框打開時重新載入配置
    localConfig.value = { ...loadApiConfig() }
    connectionStatus.value = ''
  }
})

async function testConnection() {
  if (!localConfig.value.baseURL.trim()) {
    connectionStatus.value = '請輸入有效的URL'
    return
  }

  isTestingConnection.value = true
  connectionStatus.value = ''

  try {
    const testClient = new ApiClient(localConfig.value.baseURL)
    await testClient.healthCheck()
    connectionStatus.value = '✅ 連接成功'
  } catch (error) {
    connectionStatus.value = '❌ 連接失敗'
    console.error('連接測試失敗:', error)
  } finally {
    isTestingConnection.value = false
  }
}

function resetToDefault() {
  localConfig.value = { ...defaultConfig }
  connectionStatus.value = ''
}

function cancel() {
  emit('close')
}

function save() {
  if (!localConfig.value.baseURL.trim()) {
    alert('請輸入有效的後端服務器地址')
    return
  }

  saveApiConfig(localConfig.value)
  // 重置 API 客戶端以使用新配置
  resetApiClient()
  emit('saved')
  emit('close')
}
</script>