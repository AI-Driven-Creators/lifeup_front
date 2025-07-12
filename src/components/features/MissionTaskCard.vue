<template>
  <div class="card hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <h3 
          class="font-medium text-primary-900 mb-1"
          :class="{ 'line-through text-primary-700': task.status === 'completed' }"
        >
          {{ task.title }}
        </h3>
        
        <div class="flex items-center space-x-4 text-sm text-primary-700 mb-2">
          <span class="flex items-center">
            等級：{{ task.difficulty }}
          </span>
          <span class="flex items-center text-primary-600 font-medium">
            成長：{{ task.experience }} XP
          </span>
        </div>
        
        <p v-if="task.description" class="text-sm text-primary-700 mb-3">
          {{ task.description }}
        </p>
      </div>
      
      <button 
        class="btn-primary ml-4"
        :class="{ 'bg-gray-400': task.status === 'completed' }"
        @click="handleToggle"
      >
        {{ task.status === 'completed' ? '已完成' : '開始' }}
      </button>
    </div>
    
    <!-- 任務類型標籤 -->
    <div class="flex items-center justify-between mt-3">
      <span 
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="getTypeStyle(task.type)"
      >
        {{ getTypeLabel(task.type) }}
      </span>
      
      <!-- 難度星級 -->
      <div class="flex items-center space-x-1">
        <span
          v-for="n in 5"
          :key="n"
          class="text-xs"
          :class="n <= task.difficulty ? 'text-yellow-400' : 'text-gray-300'"
        >
          ★
        </span>
      </div>
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

const getTypeLabel = (type: Task['type']) => {
  const labels = {
    main: '主線',
    side: '支線', 
    challenge: '挑戰',
    daily: '每日'
  }
  return labels[type]
}

const getTypeStyle = (type: Task['type']) => {
  const styles = {
    main: 'bg-blue-100 text-blue-800',
    side: 'bg-green-100 text-green-800',
    challenge: 'bg-purple-100 text-purple-800',
    daily: 'bg-orange-100 text-orange-800'
  }
  return styles[type]
}
</script>