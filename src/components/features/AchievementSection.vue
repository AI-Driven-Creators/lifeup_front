<template>
  <div class="card">
    <h3 class="text-lg font-bold text-primary-900 mb-4">成就</h3>
    
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-8 text-gray-500">
      {{ error }}
    </div>
    
    <div v-else class="grid grid-cols-3 gap-4">
      <!-- 成就徽章 -->
      <div 
        v-for="achievement in achievements" 
        :key="achievement.id"
        class="flex flex-col items-center space-y-2"
        :title="achievement.description"
      >
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center"
          :class="achievement.unlocked ? 'bg-primary-100' : 'bg-gray-200'"
        >
          <span class="text-2xl">{{ achievement.icon }}</span>
        </div>
        <span 
          class="text-xs text-center"
          :class="achievement.unlocked ? 'text-primary-700' : 'text-gray-500'"
        >
          {{ achievement.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAchievementStore } from '@/stores/achievement'

const userStore = useUserStore()
const achievementStore = useAchievementStore()

// 使用 store 的響應式數據
const achievements = computed(() => achievementStore.achievements)
const loading = computed(() => achievementStore.loading)
const error = computed(() => achievementStore.error)

const fetchUserAchievements = async () => {
  try {
    // 確保有用戶 ID
    if (!userStore.user?.id) {
      await userStore.fetchFirstAvailableUser()
    }
    
    const userId = userStore.user?.id
    if (!userId) {
      console.error('無法獲取用戶信息')
      return
    }
    
    await achievementStore.fetchUserAchievements(userId)
  } catch (err) {
    console.error('獲取成就數據失敗:', err)
  }
}

onMounted(() => {
  fetchUserAchievements()
})
</script> 