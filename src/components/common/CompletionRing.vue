<template>
  <div class="completion-ring relative" :class="sizeClass">
    <!-- SVG 進度環 -->
    <svg :class="svgSizeClass" class="transform -rotate-90 drop-shadow-sm">
      <!-- 背景圓環 -->
      <circle 
        :cx="center" 
        :cy="center" 
        :r="radius" 
        stroke="#e5e7eb" 
        :stroke-width="strokeWidth" 
        fill="none"
        class="opacity-30"
      />
      <!-- 進度圓環 -->
      <circle 
        :cx="center" 
        :cy="center" 
        :r="radius" 
        :stroke="getProgressColor(task.status)"
        :stroke-width="strokeWidth" 
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashOffset"
        class="transition-all duration-700 ease-out"
        stroke-linecap="round"
      />
    </svg>
    
    <!-- 中心內容 -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div v-if="isCompleted" class="completion-icon">
        <Trophy :class="iconSizeClass" class="text-yellow-500 drop-shadow-sm animate-bounce" />
        <!-- 完成火花效果 -->
        <div v-if="justCompleted" class="absolute inset-0 animate-ping">
          <div class="w-2 h-2 bg-yellow-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          <div class="w-1 h-1 bg-orange-400 rounded-full absolute bottom-0 right-0"></div>
          <div class="w-1 h-1 bg-yellow-400 rounded-full absolute top-1/2 left-0"></div>
        </div>
      </div>
      <div v-else-if="isInProgress" class="pulse-dot">
        <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
      <div v-else>
        <Play :class="iconSizeClass" class="text-gray-400" />
      </div>
    </div>

    <!-- 經驗值提示 -->
    <div v-if="!isCompleted && showExp" 
         class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
      +{{ task.experience }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Play, Trophy } from 'lucide-vue-next'
import type { Task } from '@/types'

interface Props {
  task: Task
  size?: 'small' | 'medium' | 'large'
  showExp?: boolean
  justCompleted?: boolean
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showExp: false,
  justCompleted: false,
  progress: 0
})

const isCompleted = computed(() => 
  props.task.status === 'completed' || props.task.status === 'daily_completed'
)

const isInProgress = computed(() => 
  props.task.status === 'in_progress' || props.task.status === 'daily_in_progress'
)

// 大小配置
const sizeConfig = {
  small: { size: 12, stroke: 2, icon: 'w-3 h-3' },
  medium: { size: 16, stroke: 3, icon: 'w-4 h-4' },
  large: { size: 20, stroke: 4, icon: 'w-5 h-5' }
}

const config = computed(() => sizeConfig[props.size])
const center = computed(() => config.value.size * 2)
const radius = computed(() => config.value.size * 2 - config.value.stroke * 2)
const strokeWidth = computed(() => config.value.stroke)
const circumference = computed(() => 2 * Math.PI * radius.value)

const sizeClass = computed(() => {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16', 
    large: 'w-20 h-20'
  }
  return sizes[props.size]
})

const svgSizeClass = computed(() => {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  }
  return sizes[props.size]
})

const iconSizeClass = computed(() => config.value.icon)

// 計算進度百分比
const progressPercent = computed(() => {
  if (isCompleted.value) return 100
  if (isInProgress.value) return Math.max(props.progress || 30, 30) // 進行中至少顯示30%
  return 0
})

const strokeDashOffset = computed(() => {
  const offset = circumference.value - (progressPercent.value / 100) * circumference.value
  return offset
})

const getProgressColor = (status: Task['status']) => {
  switch(status) {
    case 'completed':
    case 'daily_completed':
      return '#10b981' // green-500
    case 'in_progress':
    case 'daily_in_progress':
      return '#3b82f6' // blue-500
    case 'paused':
      return '#f59e0b' // yellow-500
    default:
      return '#9ca3af' // gray-400
  }
}
</script>

<style scoped>
.completion-ring {
  position: relative;
}

.completion-icon {
  position: relative;
  animation: completionPop 0.6s ease-out;
}

.pulse-dot {
  position: relative;
}

@keyframes completionPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-4px) scale(1.2);
    opacity: 0.7;
  }
}
</style>