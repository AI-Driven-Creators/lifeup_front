<template>
  <div class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleToggle">
    <div class="flex items-center space-x-3">
      <!-- 任務狀態圓圈 -->
      <div class="flex-shrink-0">
        <div
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
          :class="task.status === 'completed' 
            ? 'bg-primary-500 border-primary-500' 
            : 'border-gray-300 hover:border-primary-400'"
        >
          <span v-if="task.status === 'completed'" class="text-white text-sm">✓</span>
        </div>
      </div>
      
      <!-- 任務內容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 
            class="font-medium text-primary-900 truncate"
            :class="{ 'line-through text-primary-700': task.status === 'completed' }"
          >
            {{ task.title }}
          </h3>
          <button 
            class="btn-secondary text-sm px-3 py-1"
            :class="{ 'opacity-50': task.status === 'completed' }"
          >
            開始
          </button>
        </div>
        
        <div class="flex items-center justify-between mt-1">
          <span class="text-sm text-primary-700">{{ task.estimatedTime }}</span>
          <span class="text-sm text-primary-600 font-medium">+{{ task.experience }} XP</span>
        </div>
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
</script>