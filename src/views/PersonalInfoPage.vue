<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="我的進度" />
    
    <!-- 設定按鈕 -->
    <div class="px-4 py-2 flex justify-between items-center">
      <!-- 數據重置按鈕區域 -->
      <div class="flex items-center gap-2">
        <button
          @click="showResetOptions = !showResetOptions"
          class="flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
        >
          <span>🗑️</span>
          <span>數據重置</span>
        </button>
      </div>

      <button
        @click="openApiSettings"
        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <span>⚙️</span>
        <span>API 設定</span>
      </button>
    </div>

    <!-- 數據重置選項面板 -->
    <div v-if="showResetOptions" class="px-4 py-4 bg-red-50 border-l-4 border-red-400">
      <h3 class="text-lg font-semibold text-red-800 mb-4">數據重置選項</h3>
      <p class="text-sm text-red-700 mb-4">⚠️ 警告：重置操作將永久刪除對應的數據，且無法恢復！</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <!-- 選擇性重置按鈕 -->
        <button
          @click="resetUserData(['tasks'])"
          :disabled="resetting"
          class="flex flex-col items-center gap-2 p-3 text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          <span>📋</span>
          <span>重置任務</span>
        </button>

        <button
          @click="resetUserData(['skills'])"
          :disabled="resetting"
          class="flex flex-col items-center gap-2 p-3 text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          <span>🎯</span>
          <span>重置技能</span>
        </button>

        <button
          @click="resetUserData(['chat'])"
          :disabled="resetting"
          class="flex flex-col items-center gap-2 p-3 text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          <span>💬</span>
          <span>重置聊天</span>
        </button>

        <button
          @click="resetUserData(['progress'])"
          :disabled="resetting"
          class="flex flex-col items-center gap-2 p-3 text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          <span>📊</span>
          <span>重置進度</span>
        </button>

        <button
          @click="resetUserData(['achievements'])"
          :disabled="resetting"
          class="flex flex-col items-center gap-2 p-3 text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          <span>🏆</span>
          <span>重置成就</span>
        </button>

        <button
          @click="resetUserData(['profile'])"
          :disabled="resetting"
          class="flex flex-col items-center gap-2 p-3 text-sm bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
        >
          <span>👤</span>
          <span>重置檔案</span>
        </button>

        <!-- 完全重置按鈕 -->
        <button
          @click="confirmFullReset"
          :disabled="resetting"
          class="col-span-2 flex items-center justify-center gap-2 p-3 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          <span>💥</span>
          <span>完全重置</span>
        </button>
      </div>

      <!-- 載入狀態 -->
      <div v-if="resetting" class="mt-4 flex items-center justify-center gap-2 text-red-600">
        <div class="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <span>重置中...</span>
      </div>

      <!-- 重置結果 -->
      <div v-if="resetResult" class="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
        <p class="text-green-800 font-semibold">重置完成！</p>
        <p class="text-sm text-green-700">共刪除 {{ resetResult.total_deleted }} 筆記錄</p>
        <div v-if="Object.keys(resetResult.details).length > 0" class="mt-2">
          <p class="text-xs text-green-600">詳細信息：</p>
          <ul class="text-xs text-green-600 ml-4">
            <li v-for="(count, table) in resetResult.details" :key="table">
              {{ table }}: {{ count }} 筆
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="px-4 py-6 space-y-6">
      <!-- 載入狀態 -->
      <div v-if="userStore.loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-gray-600">載入用戶資料中...</p>
      </div>
      
      <!-- 用戶數據已載入 -->
      <template v-else-if="userStore.user && userStore.user.id">
        <!-- 用戶等級卡片 -->
        <UserLevelCard :user="userStore.user" />
        
        <!-- 冒險統計 -->
        <AdventureStats :user="userStore.user" :loading="userStore.loading" />
        
        <!-- 成就 -->
        <AchievementSection />
        
        <!-- 今天的成長 -->
        <TodayGrowth :progress="userStore.todayProgress" :loading="userStore.loading" />
        
        <!-- 屬性雷達圖 -->
        <AttributesRadar v-if="userStore.user.attributes" :attributes="userStore.user.attributes" />
        
        <!-- 平衡提醒和建議 -->
        <GrowthAdvice v-if="userStore.user.attributes" :attributes="userStore.user.attributes" />
      </template>
      
      <!-- 錯誤狀態 -->
      <div v-else-if="userStore.error" class="text-center py-8">
        <div class="text-red-600 mb-4">{{ userStore.error }}</div>
        <button 
          @click="retryLoadUser"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          重試
        </button>
      </div>
    </div>
    
    <!-- API 設定對話框 -->
    <ApiSettingsDialog 
      :is-open="showApiSettings" 
      @close="showApiSettings = false"
      @saved="handleApiSettingsSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import UserLevelCard from '@/components/features/UserLevelCard.vue'
import AdventureStats from '@/components/features/AdventureStats.vue'
import AchievementSection from '@/components/features/AchievementSection.vue'
import TodayGrowth from '@/components/features/TodayGrowth.vue'
import AttributesRadar from '@/components/features/AttributesRadar.vue'
import GrowthAdvice from '@/components/features/GrowthAdvice.vue'
import ApiSettingsDialog from '@/components/settings/ApiSettingsDialog.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const showApiSettings = ref(false)

// 數據重置相關狀態
const showResetOptions = ref(false)
const resetting = ref(false)
const resetResult = ref<{
  total_deleted: number
  details: Record<string, number>
} | null>(null)

// 重置類型定義
type ResetType = 'tasks' | 'skills' | 'chat' | 'progress' | 'achievements' | 'profile' | 'all'

// API 設定相關方法
const openApiSettings = () => {
  showApiSettings.value = true
}

const handleApiSettingsSaved = () => {
  // 設定保存後，可以重新載入數據或顯示通知
  console.log('API 設定已保存')
}

// 數據重置相關方法
const resetUserData = async (resetTypes: ResetType[]) => {
  if (!userStore.user?.id) {
    alert('無法獲取用戶ID')
    return
  }

  if (!confirm(`確定要重置 ${resetTypes.join(', ')} 數據嗎？此操作無法恢復！`)) {
    return
  }

  resetting.value = true
  resetResult.value = null

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userStore.user.id}/reset`
    console.log('發送選擇性重置請求到:', url)
    console.log('重置類型:', resetTypes)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reset_types: resetTypes
      })
    })

    console.log('響應狀態:', response.status)
    console.log('響應頭:', response.headers.get('content-type'))

    // 檢查響應狀態
    if (!response.ok) {
      const text = await response.text()
      console.error('HTTP 錯誤響應:', text)
      throw new Error(`HTTP ${response.status}: ${text}`)
    }

    // 檢查是否是 JSON 響應
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('非 JSON 響應:', text)
      throw new Error(`預期 JSON 響應，但收到: ${contentType}\n內容: ${text}`)
    }

    const result = await response.json()
    console.log('解析結果:', result)

    if (result.success) {
      resetResult.value = result.data
      // 重置完成後重新載入用戶數據
      setTimeout(() => {
        loadUserData()
        resetResult.value = null
      }, 3000)
    } else {
      alert(`重置失敗：${result.message}`)
    }
  } catch (error) {
    console.error('重置失敗:', error)
    alert(`重置失敗: ${error.message}`)
  } finally {
    resetting.value = false
  }
}

const confirmFullReset = async () => {
  console.log('用戶信息:', userStore.user)
  console.log('用戶 ID:', userStore.user?.id)
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)

  if (!userStore.user?.id) {
    alert(`無法獲取用戶ID，當前用戶信息: ${JSON.stringify(userStore.user)}`)
    return
  }

  const confirmed = confirm(
    '⚠️ 警告：此操作將完全重置您的所有數據，包括：\n' +
    '• 所有任務和進度\n' +
    '• 技能數據\n' +
    '• 聊天記錄\n' +
    '• 成就數據\n' +
    '• 個人檔案\n\n' +
    '此操作無法恢復，確定要繼續嗎？'
  )

  if (!confirmed) return

  const doubleConfirmed = confirm('請再次確認：您確定要完全重置所有數據嗎？')
  if (!doubleConfirmed) return

  resetting.value = true
  resetResult.value = null

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userStore.user.id}/reset`
    console.log('發送完全重置請求到:', url)

    const response = await fetch(url, {
      method: 'DELETE'
    })

    console.log('響應狀態:', response.status)
    console.log('響應頭:', response.headers.get('content-type'))

    // 檢查響應狀態
    if (!response.ok) {
      const text = await response.text()
      console.error('HTTP 錯誤響應:', text)
      throw new Error(`HTTP ${response.status}: ${text}`)
    }

    // 檢查是否是 JSON 響應
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('非 JSON 響應:', text)
      throw new Error(`預期 JSON 響應，但收到: ${contentType}\n內容: ${text}`)
    }

    const result = await response.json()
    console.log('解析結果:', result)

    if (result.success) {
      resetResult.value = result.data
      alert('完全重置成功！頁面將重新載入...')
      // 完全重置後重新載入頁面
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      alert(`重置失敗：${result.message}`)
    }
  } catch (error) {
    console.error('完全重置失敗:', error)
    alert(`重置失敗: ${error.message}`)
  } finally {
    resetting.value = false
  }
}

// 載入用戶數據
const loadUserData = async () => {
  try {
    // 先獲取用戶列表來找到實際的用戶ID
    const usersResponse = await userStore.fetchFirstAvailableUser()
    if (!usersResponse) {
      console.warn('No users found, using default data')
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
}

// 重試載入
const retryLoadUser = () => {
  loadUserData()
}

// 頁面載入時獲取最新的遊戲化用戶數據
onMounted(() => {
  loadUserData()
})
</script>