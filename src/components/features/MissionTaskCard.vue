<template>
  <div 
    class="card hover:shadow-md transition-shadow cursor-pointer"
    @click="handleCardClick"
  >
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
          <span v-if="task.cancel_count && task.cancel_count > 0" class="flex items-center text-red-600 font-medium">
            取消次數：{{ task.cancel_count }}
          </span>
        </div>
        
        <p v-if="task.description" class="text-sm text-primary-700 mb-3">
          {{ task.description }}
        </p>
        
        <!-- 技能標籤 -->
        <SkillTags :skill-tags="task.skillTags" />
      </div>
      
      <!-- 大任務控制按鈕 -->
      <div v-if="task.is_parent_task" class="ml-4 flex space-x-2">
        <button 
          v-if="task.status === 'pending'"
          class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          @click.stop="handleStartTask"
          :disabled="isLoading"
        >
          {{ isLoading ? '處理中...' : '開始' }}
        </button>
        
        <button 
          v-if="task.status === 'in_progress'"
          class="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors"
          @click.stop="handlePauseTask"
          :disabled="isLoading"
        >
          {{ isLoading ? '處理中...' : '暫停' }}
        </button>
        
        <button 
          v-if="task.status === 'paused'"
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          @click.stop="handleStartTask"
          :disabled="isLoading"
        >
          {{ isLoading ? '處理中...' : '繼續' }}
        </button>
        
        <button 
          v-if="['pending', 'in_progress', 'paused'].includes(task.status)"
          class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          @click.stop="handleCancelTask"
          :disabled="isLoading"
        >
          {{ isLoading ? '處理中...' : '取消' }}
        </button>
        
        <span v-if="task.status === 'completed'" class="px-3 py-1 bg-gray-400 text-white rounded text-sm">
          已完成
        </span>
        
        <button 
          v-if="task.status === 'cancelled'"
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          @click.stop="handleRestartTask"
          :disabled="isLoading"
        >
          {{ isLoading ? '處理中...' : '重新開始' }}
        </button>
      </div>
      
      <!-- 一般任務切換按鈕 -->
      <button 
        v-else
        class="btn-primary ml-4"
        :class="{ 'bg-gray-400': task.status === 'completed' }"
        @click.stop="handleToggle"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '@/types'
import { apiClient } from '@/services/api'
import SkillTags from '@/components/common/SkillTags.vue'

interface Props {
  task: Task
}

interface Emits {
  (e: 'toggle', taskId: string): void
  (e: 'taskUpdated', task: Task): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const isLoading = ref(false)

const handleToggle = () => {
  emit('toggle', props.task.id)
}

// 處理卡片點擊，跳轉到任務詳情頁面
const handleCardClick = (event: Event) => {
  // 防止按鈕點擊事件冒泡到卡片
  const target = event.target as HTMLElement
  if (target.tagName === 'BUTTON' || target.closest('button')) {
    return
  }
  
  // 跳轉到任務詳情頁面
  router.push(`/task/${props.task.id}`)
}

const handleStartTask = async () => {
  isLoading.value = true
  try {
    const response = await apiClient.startTask(props.task.id)
    if (response.success) {
      // 更新任務狀態
      const updatedTask = { ...props.task, status: 'in_progress' as const }
      emit('taskUpdated', updatedTask)
      console.log(response.message)
    } else {
      alert(`開始任務失敗: ${response.message}`)
    }
  } catch (error) {
    console.error('Failed to start task:', error)
    alert('開始任務失敗')
  } finally {
    isLoading.value = false
  }
}

const handlePauseTask = async () => {
  isLoading.value = true
  try {
    const response = await apiClient.pauseTask(props.task.id)
    if (response.success) {
      // 更新任務狀態
      const updatedTask = { ...props.task, status: 'paused' as const }
      emit('taskUpdated', updatedTask)
      console.log(response.message)
    } else {
      alert(`暫停任務失敗: ${response.message}`)
    }
  } catch (error) {
    console.error('Failed to pause task:', error)
    alert('暫停任務失敗')
  } finally {
    isLoading.value = false
  }
}

const handleCancelTask = async () => {
  if (!confirm('確定要取消此任務嗎？相關的子任務將會被刪除。')) {
    return
  }
  
  isLoading.value = true
  try {
    const response = await apiClient.cancelTask(props.task.id)
    if (response.success) {
      // 更新任務狀態和取消計數
      const updatedTask = { 
        ...props.task, 
        status: 'cancelled' as const,
        cancel_count: response.data?.cancel_count || (props.task.cancel_count || 0) + 1,
        last_cancelled_at: response.data?.last_cancelled_at
      }
      emit('taskUpdated', updatedTask)
      console.log(response.message)
    } else {
      alert(`取消任務失敗: ${response.message}`)
    }
  } catch (error) {
    console.error('Failed to cancel task:', error)
    alert('取消任務失敗')
  } finally {
    isLoading.value = false
  }
}

const handleRestartTask = async () => {
  if (!confirm(`確定要重新開始此任務嗎？這是第${(props.task.cancel_count || 0) + 1}次嘗試。`)) {
    return
  }
  
  isLoading.value = true
  try {
    const response = await apiClient.restartTask(props.task.id)
    if (response.success) {
      // 更新任務狀態為待開始
      const updatedTask = { ...props.task, status: 'pending' as const }
      emit('taskUpdated', updatedTask)
      console.log(response.message)
    } else {
      alert(`重新開始任務失敗: ${response.message}`)
    }
  } catch (error) {
    console.error('Failed to restart task:', error)
    alert('重新開始任務失敗')
  } finally {
    isLoading.value = false
  }
}

const getTypeLabel = (type: Task['type']) => {
  const labels = {
    main: '主線',
    side: '支線', 
    challenge: '挑戰',
    daily: '每日',
    subtask: '子任務'
  }
  return labels[type]
}

const getTypeStyle = (type: Task['type']) => {
  const styles = {
    main: 'bg-blue-100 text-blue-800',
    side: 'bg-green-100 text-green-800',
    challenge: 'bg-purple-100 text-purple-800',
    daily: 'bg-orange-100 text-orange-800',
    subtask: 'bg-gray-100 text-gray-800'
  }
  return styles[type]
}
</script>