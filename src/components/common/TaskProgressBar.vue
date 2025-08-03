<template>
  <div class="task-progress-container">
    <!-- 進度條 -->
    <div class="progress-bar-wrapper">
      <div class="progress-bar bg-gray-200 rounded-full h-2 mb-2">
        <div 
          class="progress-fill h-2 rounded-full transition-all duration-300"
          :class="getProgressBarClass()"
          :style="{ width: `${Math.min(progressPercentage, 100)}%` }"
        ></div>
      </div>
      
      <!-- 進度百分比 -->
      <div class="flex justify-between text-xs text-gray-600 mb-1">
        <span>完成進度</span>
        <span class="font-medium">{{ Math.round(progressPercentage) }}%</span>
      </div>
    </div>
    
    <!-- 每日任務詳細統計 -->
    <div v-if="showDailyStats && progress" class="daily-stats mt-2">
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="stat-item">
          <span class="text-green-600">✓</span>
          <span class="ml-1">已完成: {{ progress.completed_days }}天</span>
        </div>
        <div class="stat-item">
          <span class="text-red-500">✗</span>
          <span class="ml-1">缺席: {{ progress.missed_days }}天</span>
        </div>
        <div class="stat-item">
          <span class="text-blue-500">⏰</span>
          <span class="ml-1">剩餘: {{ progress.remaining_days }}天</span>
        </div>
        <div class="stat-item">
          <span class="text-purple-500">🎯</span>
          <span class="ml-1">目標: {{ Math.round(progress.target_rate * 100) }}%</span>
        </div>
      </div>
      
      <!-- 今日狀態 -->
      <div v-if="showDailyStats && progress.is_daily_completed !== undefined" class="daily-status mt-2 p-2 rounded-lg text-xs">
        <div 
          class="flex items-center"
          :class="progress.is_daily_completed ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'"
        >
          <span class="mr-2">
            {{ progress.is_daily_completed ? '✅' : '⏳' }}
          </span>
          <span>
            今日任務: {{ progress.is_daily_completed ? '已完成' : '進行中' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TaskProgress } from '@/types'

interface Props {
  progress?: TaskProgress
  showDailyStats?: boolean // 是否顯示每日任務的詳細統計
}

const props = withDefaults(defineProps<Props>(), {
  showDailyStats: false
})

// 計算進度百分比
const progressPercentage = computed(() => {
  if (!props.progress) return 0
  // Debug log for progress data
  console.log('TaskProgressBar props:', {
    showDailyStats: props.showDailyStats,
    progress: props.progress
  })
  return props.progress.completion_rate * 100
})

// 根據進度獲取進度條顏色
const getProgressBarClass = () => {
  const percentage = progressPercentage.value
  
  if (percentage >= 80) {
    return 'bg-green-500' // 綠色 - 良好
  } else if (percentage >= 60) {
    return 'bg-blue-500' // 藍色 - 正常
  } else if (percentage >= 40) {
    return 'bg-yellow-500' // 黃色 - 需要努力
  } else {
    return 'bg-red-500' // 紅色 - 需要關注
  }
}
</script>

<style scoped>
.task-progress-container {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 8px;
}

.progress-bar {
  background-color: rgba(229, 231, 235, 1);
  overflow: hidden;
}

.progress-fill {
  transition: width 0.3s ease-in-out;
}

.stat-item {
  display: flex;
  align-items: center;
  color: rgba(75, 85, 99, 1);
}

.daily-status {
  background: rgba(249, 250, 251, 1);
  border: 1px solid rgba(229, 231, 235, 1);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .daily-stats .grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>