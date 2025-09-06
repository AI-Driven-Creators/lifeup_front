<template>
  <div class="flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-primary-50">
    <!-- 頂部導航區域 -->
    <div class="bg-white px-4 py-4 flex items-center shadow-sm shrink-0">
      <!-- 返回按鈕 -->
      <button 
        @click="goBack"
        class="w-8 h-8 flex items-center justify-center mr-3 hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <!-- 任務類型標題 -->
      <div class="flex-1">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">{{ taskTypeConfig.icon }}</span>
          <div>
            <h1 class="text-lg font-bold text-gray-900">{{ taskTypeConfig.title }}</h1>
            <p class="text-sm text-gray-500">{{ taskTypeConfig.subtitle }}</p>
          </div>
        </div>
      </div>
      
      <!-- 任務統計 -->
      <div class="text-right">
        <div class="text-lg font-bold text-primary-600">{{ filteredTasks.length }}</div>
        <div class="text-xs text-gray-500">個任務</div>
      </div>
    </div>
    
    <!-- 可滾動內容區域 -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <!-- 載入狀態 -->
      <div v-if="loading" class="px-4 py-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">載入任務中...</p>
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
          @click="loadTasks"
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          重試
        </button>
      </div>
      </div>
      
      <!-- 任務內容 -->
      <div v-else class="px-4 py-6 space-y-6 pb-4">
      <!-- 狀態篩選器 -->
      <TaskStatusFilter 
        :tasks="tasks"
        @filter-change="handleFilterChange"
        :show-progress="true"
      />

      <!-- 任務統計卡片 -->
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="grid grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-xl font-bold text-orange-600">{{ pendingCount }}</div>
            <div class="text-xs text-gray-500">待辦</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-blue-600">{{ inProgressCount }}</div>
            <div class="text-xs text-gray-500">進行中</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-green-600">{{ completedCount }}</div>
            <div class="text-xs text-gray-500">已完成</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-gray-600">{{ completionRate }}%</div>
            <div class="text-xs text-gray-500">完成率</div>
          </div>
        </div>
      </div>

      <!-- 任務列表 -->
      <div v-if="filteredTasks.length > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">任務列表</h3>
          <div class="text-sm text-gray-500">
            顯示 {{ filteredTasks.length }} / {{ tasks.length }} 個任務
          </div>
        </div>
        
        <div class="space-y-3">
          <MissionTaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @toggle="handleToggleTask"
            @task-updated="handleTaskUpdate"
          />
        </div>
      </div>
      
      <!-- 空狀態 -->
      <div v-else-if="tasks.length === 0" class="text-center py-12">
        <div class="text-4xl mb-4">{{ taskTypeConfig.emptyIcon || '📝' }}</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">還沒有{{ taskTypeConfig.title }}</h3>
        <p class="text-gray-500 text-sm">開始創建您的第一個{{ taskTypeConfig.title }}吧！</p>
      </div>
      
      <!-- 篩選後空狀態 -->
      <div v-else class="text-center py-12">
        <div class="text-4xl mb-4">🔍</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">沒有符合條件的任務</h3>
        <p class="text-gray-500 text-sm mb-4">嘗試調整篩選條件查看更多任務</p>
        <button 
          @click="clearFilters"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
        >
          清除篩選條件
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskStatusFilter from '@/components/features/TaskStatusFilter.vue'
import MissionTaskCard from '@/components/features/MissionTaskCard.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import type { Task } from '@/types'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()

// 響應式數據
const tasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const activeStatusFilters = ref<string[]>([])

// 獲取任務類型
const taskType = computed(() => route.params.type as string)

// 任務類型配置
const taskTypeConfigs = {
  daily: {
    title: '每日任務',
    subtitle: '培養習慣，日日精進',
    icon: '📅',
    emptyIcon: '🗓️'
  },
  main: {
    title: '主線任務',
    subtitle: '核心目標，重點突破',
    icon: '🎯',
    emptyIcon: '🎯'
  },
  side: {
    title: '支線任務',
    subtitle: '輔助成長，拓展視野',
    icon: '🌟',
    emptyIcon: '⭐'
  },
  challenge: {
    title: '挑戰任務',
    subtitle: '挑戰自我，突破極限',
    icon: '🔥',
    emptyIcon: '💪'
  }
}

const taskTypeConfig = computed(() => 
  taskTypeConfigs[taskType.value as keyof typeof taskTypeConfigs] || taskTypeConfigs.main
)

// 計算統計數據
const pendingCount = computed(() => 
  filteredTasks.value.filter(task => task.status === 'pending').length
)

const inProgressCount = computed(() => 
  filteredTasks.value.filter(task => ['in_progress', 'daily_in_progress'].includes(task.status)).length
)

const completedCount = computed(() => 
  filteredTasks.value.filter(task => ['completed', 'daily_completed'].includes(task.status)).length
)

const completionRate = computed(() => {
  if (filteredTasks.value.length === 0) return 0
  return Math.round((completedCount.value / filteredTasks.value.length) * 100)
})

// 篩選後的任務
const filteredTasks = computed(() => {
  if (activeStatusFilters.value.length === 0) {
    return tasks.value
  }
  return tasks.value.filter(task => activeStatusFilters.value.includes(task.status))
})

// 載入任務
const loadTasks = async () => {
  loading.value = true
  error.value = null
  
  try {
    const taskList = await taskStore.fetchTasksByType(taskType.value)
    tasks.value = taskList
  } catch (err) {
    error.value = err instanceof Error ? err.message : '載入任務失敗'
    console.error('Failed to load tasks:', err)
  } finally {
    loading.value = false
  }
}

// 處理狀態篩選變化
const handleFilterChange = (filters: string[]) => {
  activeStatusFilters.value = filters
}

// 清除篩選條件
const clearFilters = () => {
  activeStatusFilters.value = []
}

// 切換任務狀態
const handleToggleTask = async (taskId: string) => {
  try {
    // 先記錄任務完成前的狀態
    const task = tasks.value.find(t => t.id === taskId)
    const wasCompleted = task?.status === 'completed'
    
    await taskStore.toggleTaskStatus(taskId)
    
    // 重新載入任務數據確保狀態同步
    await loadTasks()
    
    // 檢查任務完成獎勵
    const updatedTask = tasks.value.find(t => t.id === taskId)
    const isNowCompleted = updatedTask?.status === 'completed'
    
    if (updatedTask && isNowCompleted && !wasCompleted) {
      // 任務完成時增加經驗值和屬性
      userStore.updateExperience(updatedTask.experience)
      
      // 根據任務屬性增加對應屬性
      if (updatedTask.attributes) {
        Object.entries(updatedTask.attributes).forEach(([attr, value]) => {
          userStore.updateAttribute(attr as keyof typeof userStore.user.attributes, value)
        })
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新任務狀態失敗'
    console.error('Failed to toggle task:', err)
  }
}

// 處理任務更新
const handleTaskUpdate = (updatedTask: Task) => {
  const index = tasks.value.findIndex(t => t.id === updatedTask.id)
  if (index !== -1) {
    tasks.value[index] = updatedTask
  }
}

// 返回上一頁
const goBack = () => {
  router.back()
}

// 頁面載入時獲取任務
onMounted(() => {
  loadTasks()
})
</script>