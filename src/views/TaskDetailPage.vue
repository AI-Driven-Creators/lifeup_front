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
            v-for="subtask in sortedSubtasks"
            :key="subtask.id"
            class="bg-white rounded-lg p-4 shadow-sm border-l-4"
            :class="getStatusBorderClass(subtask.status)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ subtask.title }}</h4>
                <p v-if="subtask.description" class="text-gray-600 text-sm mt-1">{{ subtask.description }}</p>
                
                <!-- 任務屬性 -->
                <div class="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <span class="flex items-center">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                    難度 {{ subtask.difficulty }}/5
                  </span>
                  <span class="flex items-center">
                    <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    {{ subtask.experience }} EXP
                  </span>
                  <span v-if="subtask.task_order" class="flex items-center">
                    <span class="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                    順序 {{ subtask.task_order }}
                  </span>
                </div>
              </div>
              
              <!-- 狀態控制 -->
              <div class="ml-4 flex flex-col items-end space-y-2">
                <!-- 狀態標籤 -->
                <div 
                  :class="getStatusLabelClass(subtask)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getStatusLabel(subtask) }}
                </div>
                
                <!-- 操作按鈕組 -->
                <div class="flex space-x-2">
                  <!-- 主要操作按鈕 -->
                  <button
                    v-if="subtask.status !== 'completed'"
                    @click="toggleSubtaskStatus(subtask)"
                    :disabled="isLoading || (subtask.status === 'paused' && task?.status === 'paused')"
                    :class="[
                      getStatusButtonClass(subtask),
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                    class="px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    {{ isLoading ? '處理中...' : getStatusText(subtask) }}
                  </button>
                  
                  <!-- 回復按鈕 (僅在進行中和已完成時顯示) -->
                  <button
                    v-if="['in_progress', 'completed'].includes(subtask.status)"
                    @click="revertSubtaskStatus(subtask)"
                    :disabled="isLoading"
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium transition-colors border',
                      'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400',
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                    :title="getRevertButtonTitle(subtask)"
                  >
                    {{ isLoading ? '...' : '↶' }}
                  </button>
                </div>
              </div>
            </div>
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
import { ref, onMounted, computed } from 'vue'
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

// 排序後的子任務
const sortedSubtasks = computed(() => {
  if (!subtasks.value) return []
  
  return [...subtasks.value].sort((a, b) => {
    // 定義狀態優先級：待處理(0) > 進行中(1) > 已完成(2) > 其他(3)
    const getStatusPriority = (status: string) => {
      switch (status) {
        case 'pending': return 0
        case 'in_progress': return 1
        case 'completed': return 2
        default: return 3 // paused, cancelled 等其他狀態
      }
    }
    
    const priorityA = getStatusPriority(a.status)
    const priorityB = getStatusPriority(b.status)
    
    // 如果狀態優先級相同，則按任務順序排序
    if (priorityA === priorityB) {
      return (a.task_order || 0) - (b.task_order || 0)
    }
    
    // 否則按狀態優先級排序
    return priorityA - priorityB
  })
})

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

// 切換子任務狀態
const toggleSubtaskStatus = async (subtask: Task) => {
  // 如果父任務暫停，則不允許操作子任務
  if (subtask.status === 'paused' && task.value?.status === 'paused') {
    console.log('父任務暫停中，無法操作子任務')
    return
  }
  
  // 防止重複點擊
  if (isLoading.value) {
    return
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    console.log('嘗試切換子任務狀態:', subtask.id, '當前狀態:', subtask.status)
    
    await taskStore.toggleTaskStatus(subtask.id, subtask.status)
    
    // 重新載入任務詳情以確保數據一致性
    await loadTaskDetail()
    
    console.log('子任務狀態更新成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新子任務狀態失敗'
    console.error('Failed to toggle subtask status:', err)
    
    // 顯示錯誤提示
    setTimeout(() => {
      error.value = null
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// 回復子任務狀態到上一個階段
const revertSubtaskStatus = async (subtask: Task) => {
  // 如果父任務暫停，則不允許操作子任務
  if (subtask.status === 'paused' && task.value?.status === 'paused') {
    console.log('父任務暫停中，無法操作子任務')
    return
  }
  
  // 防止重複點擊
  if (isLoading.value) {
    return
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    console.log('嘗試回復子任務狀態:', subtask.id, '當前狀態:', subtask.status, 'reverse: true')
    
    await taskStore.toggleTaskStatus(subtask.id, subtask.status, true) // reverse = true
    
    // 重新載入任務詳情以確保數據一致性
    await loadTaskDetail()
    
    console.log('子任務狀態回復成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '回復子任務狀態失敗'
    console.error('Failed to revert subtask status:', err)
    
    // 顯示錯誤提示
    setTimeout(() => {
      error.value = null
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// 獲取狀態邊框樣式
const getStatusBorderClass = (status: string) => {
  switch (status) {
    case 'pending': return 'border-orange-400'
    case 'in_progress': return 'border-blue-400'
    case 'completed': return 'border-green-400'
    case 'paused': return 'border-gray-400'
    case 'cancelled': return 'border-red-400'
    default: return 'border-gray-200'
  }
}

// 獲取狀態按鈕樣式
const getStatusButtonClass = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    case 'in_progress': return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'paused': 
      // 如果是因為父任務暫停而暫停，使用不可點擊的樣式
      return task.value?.status === 'paused'
        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200'
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

// 獲取狀態文字
const getStatusText = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return '開始'
    case 'in_progress': return '完成'
    case 'completed': return '已完成'
    case 'paused': 
      // 判斷是否因為父任務暫停而暫停
      return task.value?.status === 'paused' ? '主任務暫停中' : '繼續'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 獲取狀態標籤文字
const getStatusLabel = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return '待處理'
    case 'in_progress': return '進行中'
    case 'completed': return '已完成'
    case 'paused': return '已暫停'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 獲取狀態標籤樣式
const getStatusLabelClass = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return 'bg-orange-100 text-orange-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'paused': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// 獲取回復按鈕的提示文字
const getRevertButtonTitle = (subtask: Task) => {
  switch (subtask.status) {
    case 'completed': return '回復到進行中'
    case 'in_progress': return '回復到待處理'
    default: return '回復'
  }
}

// 頁面載入時獲取任務詳情
onMounted(() => {
  loadTaskDetail()
})
</script>