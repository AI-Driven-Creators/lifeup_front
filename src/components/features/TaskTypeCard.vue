<template>
  <div 
    class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-primary-200"
    @click="handleClick"
  >
    <!-- 簡潔卡片內容 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 flex items-center justify-center">
          <component :is="iconComponent" class="w-6 h-6 text-primary-600" :stroke-width="2" />
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
          <p class="text-xs text-gray-500">{{ subtitle }}</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg font-bold" :class="getCountColor()">{{ totalTasks }}</div>
        <div class="text-xs text-gray-400">個任務</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import { Calendar, Target, Star, Flame } from 'lucide-vue-next'

interface Props {
  type: string
  title: string
  subtitle: string
  icon?: string // 保留為可選，以便向後相容
  tasks: Task[]
}

interface Emits {
  (e: 'click', type: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 根據任務類型返回對應的圖示元件
const iconComponent = computed(() => {
  switch (props.type) {
    case 'daily':
      return Calendar
    case 'main':
      return Target
    case 'side':
      return Star
    case 'challenge':
      return Flame
    default:
      return Target
  }
})

// 計算統計數據
const totalTasks = computed(() => props.tasks.length)

// 樣式相關方法
const getCountColor = () => {
  if (totalTasks.value === 0) return 'text-gray-400'
  return 'text-primary-600'
}

// 處理點擊事件
const handleClick = () => {
  emit('click', props.type)
}
</script>