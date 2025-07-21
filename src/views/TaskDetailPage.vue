<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頂部導航區域 -->
    <div class="bg-gray-100 px-4 py-4 flex items-center">
      <!-- 返回按鈕 -->
      <button 
        @click="goBack"
        class="w-6 h-6 flex items-center justify-center mr-4"
      >
        <svg class="w-4 h-4 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <!-- 任務標題 -->
      <h1 class="flex-1 text-lg font-bold text-primary-900 text-center pr-10">
        {{ task?.title || '任務詳情' }}
      </h1>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="px-4 py-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">載入任務詳情中...</p>
    </div>
    
    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="px-4 py-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="text-red-600 mr-3">⚠️</div>
          <div>
            <h3 class="text-red-800 font-medium">載入失敗</h3>
            <p class="text-red-600 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
        <button 
          @click="loadTaskDetail"
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          重試
        </button>
      </div>
    </div>

    <!-- 任務詳情內容 -->
    <div v-else-if="task" class="flex flex-col">
      <!-- 任務信息區域 -->
      <div class="bg-gray-100 px-4 py-5">
        <h2 class="text-2xl font-bold text-primary-900 mb-2">
          {{ task.title }}
        </h2>
        <p class="text-primary-700 text-base">
          等級：{{ task.difficulty }} | 成長：{{ task.experience }} XP
        </p>
        
        <!-- 任務描述 -->
        <p v-if="task.description" class="text-primary-700 text-sm mt-3">
          {{ task.description }}
        </p>
      </div>

      <!-- 完成任務區域 -->
      <div v-if="task.is_parent_task && subtasks.length > 0" class="bg-white px-4 py-5">
        <h3 class="text-xl font-bold text-primary-900 mb-4">完成任務</h3>
        
        <div class="space-y-3">
          <div
            v-for="subtask in subtasks"
            :key="subtask.id"
            class="flex items-center p-3 bg-gray-50 rounded-lg"
          >
            <!-- 狀態圖標 -->
            <div 
              class="w-5 h-5 rounded mr-3 flex-shrink-0"
              :class="getSubtaskStatusClass(subtask.status)"
            >
              <svg 
                v-if="subtask.status === 'completed'" 
                class="w-4 h-4 text-white m-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            
            <!-- 子任務標題 -->
            <span 
              class="text-primary-900 text-base"
              :class="{ 'line-through text-gray-500': subtask.status === 'completed' }"
            >
              {{ subtask.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- 如果沒有子任務 -->
      <div v-else-if="task.is_parent_task" class="bg-white px-4 py-5">
        <h3 class="text-xl font-bold text-primary-900 mb-4">完成任務</h3>
        <p class="text-gray-600 text-center py-8">
          此任務還沒有子任務
        </p>
      </div>

      <!-- 如果不是大任務 -->
      <div v-else class="bg-white px-4 py-5">
        <div class="text-center py-8">
          <p class="text-gray-600 mb-4">這是一個單獨的任務</p>
          <div class="flex justify-center">
            <button
              v-if="task.status === 'pending'"
              @click="handleToggleStatus"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              :disabled="isLoading"
            >
              {{ isLoading ? '處理中...' : '標記為完成' }}
            </button>
            <span
              v-else-if="task.status === 'completed'"
              class="px-6 py-2 bg-green-100 text-green-800 rounded-lg"
            >
              已完成
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

// 響應式數據
const task = ref<Task | null>(null)
const subtasks = ref<Task[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)

// 返回上一頁
const goBack = () => {
  router.back()
}

// 載入任務詳情
const loadTaskDetail = async () => {
  const taskId = route.params.id as string
  if (!taskId) {
    error.value = '任務ID無效'
    return
  }

  loading.value = true
  error.value = null

  try {
    // 載入任務詳情
    const taskResponse = await apiClient.getTasks()
    if (taskResponse.success) {
      const allTasks = taskResponse.data.map(taskStore.transformBackendTask)
      const foundTask = allTasks.find(t => t.id === taskId)
      
      if (!foundTask) {
        error.value = '找不到指定的任務'
        return
      }
      
      task.value = foundTask

      // 如果是大任務，載入子任務
      if (foundTask.is_parent_task) {
        const subtaskResponse = await apiClient.getSubtasks(taskId)
        if (subtaskResponse.success) {
          subtasks.value = subtaskResponse.data
            .map(taskStore.transformBackendTask)
            .sort((a, b) => (a.task_order || 0) - (b.task_order || 0))
        }
      }
    } else {
      error.value = taskResponse.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '載入任務詳情失敗'
    console.error('Failed to load task detail:', err)
  } finally {
    loading.value = false
  }
}

// 獲取子任務狀態樣式
const getSubtaskStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500'
    case 'in_progress':
      return 'bg-blue-500'
    case 'pending':
      return 'bg-gray-300'
    case 'paused':
      return 'bg-yellow-500'
    case 'cancelled':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

// 切換任務狀態（針對非大任務）
const handleToggleStatus = async () => {
  if (!task.value) return

  isLoading.value = true
  try {
    await taskStore.toggleTaskStatus(task.value.id)
    // 重新載入任務詳情
    await loadTaskDetail()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新任務狀態失敗'
    console.error('Failed to toggle task status:', err)
  } finally {
    isLoading.value = false
  }
}

// 頁面載入時獲取任務詳情
onMounted(() => {
  loadTaskDetail()
})
</script>