<template>
  <div class="min-h-screen bg-primary-50 pb-16">
    <!-- 頁面標題 -->
    <PageHeader title="我的進度" />
    
    <!-- 設定按鈕 -->
    <div class="px-4 py-2 flex justify-between items-center">
      <!-- 數據重置按鈕區域 - 已隱藏 -->
      <div class="flex items-center gap-2" style="display: none;">
        <button
          @click="showResetOptions = !showResetOptions"
          class="flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
        >
          <span>🗑️</span>
          <span>數據重置</span>
        </button>
      </div>

      <!-- API設定按鈕 - 已隱藏 -->
      <button
        @click="openApiSettings"
        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        style="display: none;"
      >
        <span>⚙️</span>
        <span>API 設定</span>
      </button>

      <!-- 推送通知相關按鈕 -->
      <div class="flex items-center gap-2 flex-wrap">
        <RouterLink
          to="/settings/notifications"
          class="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 border border-indigo-300 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <span>⚙️</span>
          <span>推送通知設定</span>
        </RouterLink>

        <button
          @click="refreshSubscriptions"
          :disabled="loadingSubscriptions"
          class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <span>🔄</span>
          <span>{{ loadingSubscriptions ? '載入中...' : '查看訂閱' }}</span>
        </button>
      </div>
    </div>

    <!-- 推送訂閱狀態面板 -->
    <div v-if="showSubscriptions" class="px-4 py-4 bg-blue-50 border-l-4 border-blue-400">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-blue-800">當前推送訂閱狀態</h3>
        <button @click="showSubscriptions = false" class="text-blue-600 hover:text-blue-800">✕</button>
      </div>

      <div v-if="subscriptions.length === 0" class="text-blue-700">
        ⚠️ 目前沒有任何推送訂閱！請先前往
        <RouterLink to="/settings/notifications" class="underline font-semibold">推送通知設定頁面</RouterLink>
        啟用推送通知。
      </div>

      <div v-else class="space-y-3">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm text-blue-700">
            共有 <strong>{{ subscriptions.length }}</strong> 個訂閱
          </div>
          <button
            @click="clearAllSubscriptions"
            :disabled="clearingSubscriptions"
            class="flex items-center gap-1 px-3 py-1 text-xs text-red-600 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            <span>🗑️</span>
            <span>{{ clearingSubscriptions ? '清除中...' : '清除所有訂閱' }}</span>
          </button>
        </div>
        <div v-for="(sub, index) in subscriptions" :key="sub.id" class="bg-white rounded-lg p-3 border border-blue-200">
          <div class="text-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold text-gray-700">訂閱 #{{ index + 1 }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(sub.created_at) }}</span>
            </div>
            <div class="text-xs text-gray-600 break-all">
              <strong>Endpoint:</strong> {{ sub.endpoint?.substring(0, 60) }}...
            </div>
            <div v-if="sub.user_id" class="text-xs text-gray-600 mt-1">
              <strong>User ID:</strong> {{ sub.user_id }}
            </div>
          </div>
        </div>
      </div>
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
      <!-- 使用者名稱與快速導覽 -->
      <div class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
        <div class="text-lg font-semibold">
          使用者：<span class="text-primary-700">{{ userStore.user?.name || '未登入' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <RouterLink to="/auth/login" class="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">登入</RouterLink>
          <RouterLink to="/auth/register" class="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">註冊</RouterLink>
          <button @click="onLogout" class="px-3 py-2 text-sm border rounded-lg hover:bg-red-50 text-red-600 border-red-300">登出</button>
        </div>
      </div>
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

        <!-- 任務完成編年史 -->
        <TaskHistoryTimeline v-if="userStore.user.id" :user-id="userStore.user.id" />

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

    <!-- 確認對話框 -->
    <ConfirmDialog
      v-model:visible="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :danger="confirmDialog.danger"
      :confirm-text="confirmDialog.confirmText"
      @confirm="confirmDialog.onConfirm"
    />

    <!-- Toast 通知 -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import UserLevelCard from '@/components/features/UserLevelCard.vue'
import AdventureStats from '@/components/features/AdventureStats.vue'
import AchievementSection from '@/components/features/AchievementSection.vue'
import TodayGrowth from '@/components/features/TodayGrowth.vue'
import AttributesRadar from '@/components/features/AttributesRadar.vue'
import GrowthAdvice from '@/components/features/GrowthAdvice.vue'
import ApiSettingsDialog from '@/components/settings/ApiSettingsDialog.vue'
import TaskHistoryTimeline from '@/components/features/TaskHistoryTimeline.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import Toast from '@/components/common/Toast.vue'
import { useUserStore } from '@/stores/user'
import { notificationService } from '@/services/notification'

const userStore = useUserStore()
const showApiSettings = ref(false)

// 確認對話框相關狀態
const showConfirmDialog = ref(false)
const confirmDialog = ref({
  title: '確認',
  message: '',
  danger: false,
  confirmText: '確定',
  onConfirm: () => {}
})

// Toast 引用
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

// 數據重置相關狀態
const showResetOptions = ref(false)
const resetting = ref(false)
const resetResult = ref<{
  total_deleted: number
  details: Record<string, number>
} | null>(null)

// Web Push 相關狀態
const showSubscriptions = ref(false)
const loadingSubscriptions = ref(false)
const subscriptions = ref<any[]>([])
const clearingSubscriptions = ref(false)

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

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW')
}

// 刷新訂閱列表
const refreshSubscriptions = async () => {
  loadingSubscriptions.value = true
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/push/subscriptions`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()
    if (result.success) {
      subscriptions.value = result.data || []
      showSubscriptions.value = true
    } else {
      toastRef.value?.showToast(`獲取訂閱列表失敗：${result.message}`)
    }
  } catch (error) {
    console.error('獲取訂閱列表失敗:', error)
    toastRef.value?.showToast(`獲取訂閱列表失敗: ${error instanceof Error ? error.message : String(error)}`)
  } finally {
    loadingSubscriptions.value = false
  }
}

// 清除所有訂閱
const clearAllSubscriptions = () => {
  confirmDialog.value = {
    title: '確認清除所有訂閱',
    message: '確定要清除所有推送訂閱嗎？此操作會移除所有裝置上的訂閱記錄，您需要重新訂閱才能接收推送通知。',
    danger: true,
    confirmText: '確定清除',
    onConfirm: async () => {
      clearingSubscriptions.value = true
      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/push/clear-all`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: null // 清除所有訂閱，不限定用戶
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json()
        if (result.success) {
          // 同時取消瀏覽器的訂閱
          await notificationService.removePushNotification()
          toastRef.value?.showToast(`成功清除 ${result.data.deleted_count} 個訂閱`)
          // 清空訂閱列表
          subscriptions.value = []
        } else {
          toastRef.value?.showToast(`清除訂閱失敗：${result.message}`)
        }
      } catch (error) {
        console.error('清除訂閱失敗:', error)
        toastRef.value?.showToast(`清除訂閱失敗: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        clearingSubscriptions.value = false
      }
    }
  }
  showConfirmDialog.value = true
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
    alert(`重置失敗: ${error instanceof Error ? error.message : String(error)}`)
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
    alert(`重置失敗: ${error instanceof Error ? error.message : String(error)}`)
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

const onLogout = async () => {
  await userStore.logout()
}
</script>