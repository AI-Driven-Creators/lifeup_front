<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="子任務" />
    
    <!-- 載入狀態 -->
    <div v-if="loading" class="px-4 py-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">載入子任務中...</p>
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
          @click="refreshSubtasks"
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          重試
        </button>
      </div>
    </div>
    
    <!-- 子任務列表 -->
    <div v-else class="px-4 py-4 space-y-4">
      <!-- 子任務狀態概覽 -->
      <div v-if="subtasks.length > 0" class="bg-white rounded-lg p-4 shadow-sm">
        <div class="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <span class="block text-gray-600">待處理</span>
            <span class="block font-medium text-orange-600">{{ pendingCount }}</span>
          </div>
          <div>
            <span class="block text-gray-600">進行中</span>
            <span class="block font-medium text-blue-600">{{ inProgressCount }}</span>
          </div>
          <div>
            <span class="block text-gray-600">已完成</span>
            <span class="block font-medium text-green-600">{{ completedCount }}</span>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            class="bg-green-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <p class="text-center text-sm text-gray-600 mt-2">
          {{ completedCount }}/{{ subtasks.length }} 完成 ({{ progressPercentage }}%)
        </p>
      </div>
      
      <!-- 篩選器 -->
      <div v-if="subtasks.length > 0" class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex space-x-2">
          <button
            v-for="status in statusFilters"
            :key="status.value"
            @click="selectedStatus = status.value"
            :class="[
              'px-3 py-1 rounded-full text-sm transition-colors',
              selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
      
      <!-- 子任務卡片列表 -->
      <div class="space-y-3">
        <div
          v-for="subtask in filteredSubtasks"
          :key="subtask.id"
          class="bg-white rounded-lg p-4 shadow-sm border-l-4"
          :class="getStatusBorderClass(subtask.status)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ subtask.title }}</h3>
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
            <div class="ml-4">
              <button
                @click="toggleSubtaskStatus(subtask.id)"
                :class="getStatusButtonClass(subtask.status)"
                class="px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                {{ getStatusText(subtask.status) }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空狀態 -->
      <div v-if="subtasks.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📋</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">還沒有子任務</h3>
        <p class="text-gray-600 mb-4">開始一個大任務來生成子任務吧！</p>
        <button 
          @click="$router.push('/tasks')"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          前往任務頁面
        </button>
      </div>
    </div>
    
    <!-- 懸浮刷新按鈕 -->
    <button
      v-if="!loading && subtasks.length > 0"
      @click="refreshSubtasks"
      class="fixed bottom-20 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      title="刷新子任務"
    >
      🔄
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useTaskStore } from '@/stores/task'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'

const taskStore = useTaskStore()

// 子任務列表
const subtasks = ref<Task[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 狀態篩選
const selectedStatus = ref<string>('all')
const statusFilters = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待處理' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '已完成' },
  { value: 'paused', label: '已暫停' }
]

// 篩選後的子任務
const filteredSubtasks = computed(() => {
  if (selectedStatus.value === 'all') return subtasks.value
  
  const statusMap: { [key: string]: string } = {
    'pending': 'pending',
    'in_progress': 'in_progress', 
    'completed': 'completed',
    'paused': 'paused'
  }
  
  return subtasks.value.filter(task => task.status === statusMap[selectedStatus.value])
})

// 統計數據
const pendingCount = computed(() => subtasks.value.filter(t => t.status === 'pending').length)
const inProgressCount = computed(() => subtasks.value.filter(t => t.status === 'in_progress').length)
const completedCount = computed(() => subtasks.value.filter(t => t.status === 'completed').length)

const progressPercentage = computed(() => {
  if (subtasks.value.length === 0) return 0
  return Math.round((completedCount.value / subtasks.value.length) * 100)
})

// 載入所有子任務
const loadSubtasks = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 首先獲取所有任務
    const response = await apiClient.getTasks()
    if (response.success) {
      const allTasks = response.data.map(taskStore.transformBackendTask)
      
      // 找出所有進行中的大任務
      const activeParentTasks = allTasks.filter(task => 
        task.is_parent_task && task.status === 'in_progress'
      )
      
      // 獲取所有進行中大任務的子任務
      const allSubtasks: Task[] = []
      
      for (const parentTask of activeParentTasks) {
        try {
          const subtaskResponse = await apiClient.getSubtasks(parentTask.id)
          if (subtaskResponse.success) {
            const subtasks = subtaskResponse.data.map(taskStore.transformBackendTask)
            allSubtasks.push(...subtasks)
          }
        } catch (err) {
          console.error(`Failed to load subtasks for ${parentTask.title}:`, err)
        }
      }
      
      // 按照任務順序排序
      subtasks.value = allSubtasks.sort((a, b) => (a.task_order || 0) - (b.task_order || 0))
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '載入子任務失敗'
    console.error('Failed to load subtasks:', err)
  } finally {
    loading.value = false
  }
}

// 切換子任務狀態
const toggleSubtaskStatus = async (taskId: string) => {
  try {
    await taskStore.toggleTaskStatus(taskId)
    
    // 更新本地子任務狀態
    const taskIndex = subtasks.value.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      const updatedTask = taskStore.tasks.find(t => t.id === taskId)
      if (updatedTask) {
        subtasks.value[taskIndex] = { ...updatedTask }
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新子任務狀態失敗'
    console.error('Failed to toggle subtask status:', err)
  }
}

// 刷新子任務
const refreshSubtasks = () => {
  loadSubtasks()
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
const getStatusButtonClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    case 'in_progress': return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'paused': return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200'
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

// 獲取狀態文字
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '開始'
    case 'in_progress': return '完成'
    case 'completed': return '已完成'
    case 'paused': return '繼續'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 頁面載入時獲取子任務
onMounted(async () => {
  await loadSubtasks()
})
</script>