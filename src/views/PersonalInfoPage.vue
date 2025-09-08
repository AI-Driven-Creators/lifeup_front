<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="我的進度" />
    
    <!-- 設定按鈕 -->
    <div class="px-4 py-2 flex justify-end">
      <button
        @click="openApiSettings"
        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <span>⚙️</span>
        <span>API 設定</span>
      </button>
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

// API 設定相關方法
const openApiSettings = () => {
  showApiSettings.value = true
}

const handleApiSettingsSaved = () => {
  // 設定保存後，可以重新載入數據或顯示通知
  console.log('API 設定已保存')
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