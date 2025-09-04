<template>
  <div class="space-y-6">
    <!-- 智能生成成就按鈕 -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-primary-900">成就系統</h3>
        <button
          @click="handleGenerateAchievement"
          :disabled="achievementStore.generatingAchievement || userStore.loading"
          class="relative overflow-hidden px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:scale-105"
        >
          <span class="flex items-center gap-2">
            <span v-if="achievementStore.generatingAchievement" class="animate-spin">⏳</span>
            <span v-else>✨</span>
            <span v-if="achievementStore.generatingAchievement">生成中...</span>
            <span v-else>智能生成成就</span>
          </span>
        </button>
      </div>
      
      <!-- 生成結果提示 -->
      <div v-if="achievementStore.generationResult" class="mb-4 p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <span class="text-2xl">🎉</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              {{ achievementStore.generationResult.message }}
            </p>
            <p class="mt-1 text-sm text-green-700">
              新成就「{{ achievementStore.generationResult.achievement.name }}」已
              {{ achievementStore.generationResult.isUnlocked ? '解鎖' : '創建' }}！
            </p>
            <button 
              @click="achievementStore.clearGenerationResult()"
              class="mt-2 text-xs text-green-600 hover:text-green-800 underline"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
      
      <!-- 錯誤提示 -->
      <div v-if="achievementStore.error && !achievementStore.loading" class="mb-4 p-4 rounded-lg border-l-4 border-red-500 bg-red-50">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-2xl">⚠️</span>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">
              {{ achievementStore.error }}
            </p>
            <button 
              @click="achievementStore.error = null"
              class="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-8 text-gray-500">
      {{ error }}
    </div>
    
    <div v-else class="space-y-6">
      <!-- 已完成成就 -->
      <div class="card">
        <h3 class="text-lg font-bold text-primary-900 mb-4">已完成成就</h3>
        
        <div v-if="unlockedAchievements.length === 0" class="text-center py-4 text-gray-500">
          尚無完成的成就
        </div>
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="achievement in unlockedAchievements" 
            :key="achievement.id"
            class="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 cursor-pointer group"
            :title="`${achievement.name} - ${achievement.description}`"
          >
            <div class="w-16 h-16 rounded-full flex items-center justify-center bg-primary-100 group-hover:bg-primary-200 transition-colors shadow-md">
              <span class="text-2xl">{{ achievement.icon }}</span>
            </div>
            <span class="text-xs text-center text-primary-700 font-medium">
              {{ achievement.name }}
            </span>
            <div class="text-xs text-green-600 font-semibold">
              ✓ 已完成
            </div>
          </div>
        </div>
      </div>

      <!-- 待完成成就 -->
      <div class="card">
        <h3 class="text-lg font-bold text-primary-900 mb-4">待完成成就</h3>
        
        <div v-if="lockedAchievements.length === 0" class="text-center py-4 text-gray-500">
          暫無待完成的成就
        </div>
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div 
            v-for="achievement in lockedAchievements" 
            :key="achievement.id"
            class="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
            :title="`${achievement.name} - ${achievement.description}\n需要: ${getRequirementText(achievement)}`"
          >
            <div class="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 relative group-hover:bg-gray-300 transition-colors shadow-md">
              <span class="text-2xl opacity-50 group-hover:opacity-70 transition-opacity">{{ achievement.icon }}</span>
              <!-- 進度指示器 -->
              <div 
                v-if="achievement.progress > 0" 
                class="absolute inset-0 rounded-full"
                :style="{ 
                  background: `conic-gradient(from -90deg, #3b82f6 ${achievement.progress * 3.6}deg, transparent ${achievement.progress * 3.6}deg)`,
                  'border-radius': '50%',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))'
                }"
              >
              </div>
            </div>
            <span class="text-xs text-center text-gray-600 font-medium group-hover:text-gray-700">
              {{ achievement.name }}
            </span>
            <!-- 進度信息 -->
            <div class="text-xs text-center">
              <div v-if="achievement.progress > 0" class="text-primary-600 font-semibold">
                {{ Math.round(achievement.progress) }}% 完成
              </div>
              <div v-else class="text-gray-400">
                尚未開始
              </div>
            </div>
            <!-- 需求信息 -->
            <div class="text-xs text-gray-400 text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {{ getRequirementText(achievement) }}
            </div>
          </div>
        </div>
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
const unlockedAchievements = computed(() => achievementStore.unlockedAchievements)
const lockedAchievements = computed(() => achievementStore.lockedAchievements)
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

// 處理生成成就
const handleGenerateAchievement = async () => {
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
    
    console.log('開始生成成就，用戶 ID:', userId)
    const result = await achievementStore.generateAchievementFromTasks(userId)
    
    if (result.success) {
      console.log('成就生成成功:', result)
      // 成功提示會通過 store 的狀態自動顯示
    } else {
      console.error('成就生成失敗:', result.message)
      // 錯誤提示會通過 store 的狀態自動顯示
    }
  } catch (err) {
    console.error('生成成就失敗:', err)
  }
}

// 獲取成就需求描述文字
const getRequirementText = (achievement: any) => {
  const requirementMap: Record<string, string> = {
    'task_complete': `完成 ${achievement.requirement_value} 個任務`,
    'consecutive_days': `連續登入 ${achievement.requirement_value} 天`,
    'learning_task_complete': `完成 ${achievement.requirement_value} 個學習任務`,
    'skill_level': `技能等級達到 ${achievement.requirement_value} 級`,
    'social_attribute': `社交力達到 ${achievement.requirement_value} 點`,
    'focus_attribute': `專注力達到 ${achievement.requirement_value} 點`,
    'creativity_attribute': `創造力達到 ${achievement.requirement_value} 點`,
    'intelligence_attribute': `智力達到 ${achievement.requirement_value} 點`,
    'endurance_attribute': `毅力達到 ${achievement.requirement_value} 點`,
    'adaptability_attribute': `適應力達到 ${achievement.requirement_value} 點`,
  }
  
  return requirementMap[achievement.requirement_type] || `需求: ${achievement.requirement_value}`
}

onMounted(() => {
  fetchUserAchievements()
})
</script> 