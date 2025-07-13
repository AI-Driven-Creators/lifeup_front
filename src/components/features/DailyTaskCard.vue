<template>
  <div class="task-card bg-white rounded-lg p-4 mx-4 mb-4 shadow-sm">
    <div class="flex items-center justify-between">
      <!-- 左側：圖標和任務信息 -->
      <div class="flex items-center space-x-3">
        <!-- 任務圖標 -->
        <div class="task-icon w-12 h-12 bg-warm-gray-100 rounded-lg flex items-center justify-center">
          <div class="w-6 h-6 bg-warm-gray-800 rounded" :class="getIconClass(task.type)">
            <span class="text-white text-sm flex items-center justify-center w-full h-full">
              {{ getTaskIcon(task.type) }}
            </span>
          </div>
        </div>
        
        <!-- 任務信息 -->
        <div class="task-info flex-1">
          <h3 class="task-title text-base font-medium text-warm-gray-900 mb-1 leading-tight">
            {{ task.title }}
          </h3>
          <p class="task-time text-sm text-warm-gray-600">
            {{ formatTime(task.scheduled_time) }}
          </p>
        </div>
      </div>
      
      <!-- 右側：完成狀態按鈕 -->
      <button 
        class="status-button w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
        :class="getStatusButtonClass(task.status)"
        @click="handleToggle"
      >
        <div 
          v-if="task.status === 'completed'"
          class="w-5 h-5 bg-current rounded flex items-center justify-center"
        >
          <span class="text-white text-xs">✓</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types'

interface Props {
  task: Task
}

interface Emits {
  (e: 'toggle', taskId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleToggle = () => {
  emit('toggle', props.task.id)
}

// 根據任務類型獲取圖標
const getTaskIcon = (type: Task['type']) => {
  const icons = {
    main: '🎯',
    side: '📋', 
    challenge: '⚡',
    daily: '📅',
    subtask: '📝'
  }
  return icons[type] || '📝'
}

// 根據任務類型獲取圖標樣式
const getIconClass = (type: Task['type']) => {
  return '' // 保持統一的深色背景
}

// 根據狀態獲取按鈕樣式
const getStatusButtonClass = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-warm-gray-800 border-warm-gray-800'
    case 'in_progress':
      return 'bg-warm-gray-200 border-warm-gray-400'
    default:
      return 'bg-transparent border-warm-gray-300 hover:border-warm-gray-400'
  }
}

// 格式化時間顯示
const formatTime = (timeString?: string) => {
  if (!timeString) {
    // 如果沒有設定時間，根據任務類型提供預設時間
    const now = new Date()
    const hour = now.getHours()
    
    switch (props.task.type) {
      case 'daily':
        return '上午 8:00'
      case 'main':
        return '上午 10:00'
      case 'side':
        return '下午 2:00'
      case 'challenge':
        return '下午 4:00'
      default:
        return `${hour < 12 ? '上午' : '下午'} ${hour % 12 || 12}:00`
    }
  }
  
  try {
    const date = new Date(timeString)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const period = hour < 12 ? '上午' : '下午'
    const displayHour = hour % 12 || 12
    
    return `${period} ${displayHour}:${minute.toString().padStart(2, '0')}`
  } catch {
    return timeString
  }
}
</script>

<style scoped>
.task-card {
  /* 基於 Figma 設計的卡片樣式 */
  background: rgba(255, 255, 255, 1);
  padding: 8px 16px;
  margin: 0 16px 16px 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border-radius: 0; /* 移除圓角以匹配 Figma */
}

.task-icon {
  /* 48x48 圓角矩形背景 */
  width: 48px;
  height: 48px;
  background: rgba(244, 242, 239, 1);
  border-radius: 8px;
}

.task-title {
  /* 符合 Figma 的字體設置 */
  font-family: 'Lexend', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: rgba(22, 22, 17, 1);
}

.task-time {
  /* 符合 Figma 的時間樣式 */
  font-family: 'Lexend', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: rgba(140, 127, 94, 1);
}

.status-button {
  /* 28x28 圓形按鈕 */
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* Warm gray color utilities */
.bg-warm-gray-100 { background-color: rgba(244, 242, 239, 1); }
.bg-warm-gray-200 { background-color: rgba(231, 229, 228, 1); }
.bg-warm-gray-300 { background-color: rgba(214, 211, 209, 1); }
.bg-warm-gray-400 { background-color: rgba(168, 162, 158, 1); }
.bg-warm-gray-600 { background-color: rgba(120, 113, 108, 1); }
.bg-warm-gray-800 { background-color: rgba(22, 22, 17, 1); }
.bg-warm-gray-900 { background-color: rgba(22, 22, 17, 1); }

.text-warm-gray-600 { color: rgba(140, 127, 94, 1); }
.text-warm-gray-800 { color: rgba(22, 22, 17, 1); }
.text-warm-gray-900 { color: rgba(22, 22, 17, 1); }

.border-warm-gray-300 { border-color: rgba(214, 211, 209, 1); }
.border-warm-gray-400 { border-color: rgba(168, 162, 158, 1); }
.border-warm-gray-800 { border-color: rgba(22, 22, 17, 1); }

.hover\:border-warm-gray-400:hover { border-color: rgba(168, 162, 158, 1); }
</style>