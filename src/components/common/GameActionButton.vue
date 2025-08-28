<template>
  <button 
    class="game-action-btn w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 relative overflow-hidden"
    :class="getButtonStyle(task.status)"
    @click="handleClick"
    :disabled="isCompleted"
  >
    <div class="flex items-center justify-center space-x-3 relative z-10">
      <component :is="getButtonIcon(task.status)" class="w-5 h-5" />
      <span class="flex-1 text-center">{{ getButtonText(task.status) }}</span>
      <div v-if="!isCompleted && showExp" class="text-sm opacity-90 bg-black/20 px-2 py-1 rounded-full">
        +{{ task.experience }} EXP
      </div>
    </div>

    <!-- 完成時的慶祝動畫背景 -->
    <div v-if="justCompleted" class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse"></div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Play, CheckCircle, RotateCcw, Zap } from 'lucide-vue-next'
import type { Task } from '@/types'

interface Props {
  task: Task
  showExp?: boolean
  justCompleted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showExp: true,
  justCompleted: false
})

const emit = defineEmits<{
  action: [task: Task]
}>()

const isCompleted = computed(() => 
  props.task.status === 'completed' || props.task.status === 'daily_completed'
)

const getButtonStyle = (status: Task['status']) => {
  switch(status) {
    case 'completed': 
    case 'daily_completed':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-default shadow-lg'
    case 'in_progress': 
    case 'daily_in_progress':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-98 shadow-lg hover:shadow-xl'
    case 'paused':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 active:scale-98 shadow-lg hover:shadow-xl'
    default:
      return 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black active:scale-98 shadow-lg hover:shadow-xl'
  }
}

const getButtonIcon = (status: Task['status']) => {
  switch(status) {
    case 'completed':
    case 'daily_completed':
      return CheckCircle
    case 'paused':
      return RotateCcw
    case 'in_progress':
    case 'daily_in_progress':
      return Zap
    default:
      return Play
  }
}

const getButtonText = (status: Task['status']) => {
  switch(status) {
    case 'completed':
    case 'daily_completed':
      return '已完成'
    case 'in_progress':
    case 'daily_in_progress':
      return '繼續進行'
    case 'paused':
      return '恢復任務'
    case 'daily_not_completed':
      return '開始任務'
    default:
      return '開始任務'
  }
}

const handleClick = () => {
  if (!isCompleted.value) {
    emit('action', props.task)
  }
}
</script>

<style scoped>
.game-action-btn {
  position: relative;
  transform-origin: center;
}

.game-action-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.game-action-btn:not(:disabled):active {
  transform: translateY(0) scale(0.98);
}

.game-action-btn:disabled {
  cursor: not-allowed;
}

@keyframes celebration {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.celebrate {
  animation: celebration 0.6s ease-in-out;
}
</style>