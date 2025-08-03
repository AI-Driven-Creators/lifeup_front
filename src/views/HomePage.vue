<template>
  <div class="min-h-screen bg-white">
    <!-- 頁面標題 -->
    <PageHeader title="每日任務" />
    
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
          @click="refreshTasks"
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          重試
        </button>
      </div>
    </div>
    
    <!-- 任務列表 -->
    <div v-else class="pb-4">
      <!-- 心理測驗按鈕 -->
      <div class="px-4 pt-4 pb-2">
        <button 
          @click="$router.push('/personality-test')"
          class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl py-4 px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div class="flex items-center justify-center space-x-3">
            <span class="text-2xl">🧠</span>
            <div class="text-left">
              <div class="font-bold text-lg">人格特質測驗</div>
              <div class="text-sm opacity-90">了解你的內在驅動力</div>
            </div>
          </div>
        </button>
      </div>
      <!-- 任務卡片列表 -->
      <DailyTaskCard
        v-for="task in activeTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
      />
      
      <!-- 空狀態 -->
      <div v-if="activeTasks.length === 0" class="text-center py-12 px-4">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">沒有進行中的任務</h3>
        <p class="text-gray-600 mb-4">首頁只顯示進行中的任務。開始一個任務來查看它！</p>
        <button 
          @click="$router.push('/mission')"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          前往任務頁面
        </button>
      </div>
    </div>
    
    <!-- 懸浮刷新按鈕 -->
    <button
      v-if="!loading && activeTasks.length > 0"
      @click="refreshTasks"
      class="fixed bottom-20 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      title="刷新任務"
    >
      🔄
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import DailyTaskCard from '@/components/features/DailyTaskCard.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'

const taskStore = useTaskStore()
const userStore = useUserStore()

// 首頁任務：進行中的子任務和大任務
const homepageTasks = ref<Task[]>([])

// 從首頁任務中篩選出可顯示的任務（進行中、每日進行中、每日已完成）
const activeTasks = computed(() => {
  return homepageTasks.value.filter(task => 
    ['in_progress', 'daily_in_progress', 'daily_completed'].includes(task.status)
  )
})

const loading = ref(false)
const error = ref<string | null>(null)

// 計算完成的任務數量
const completedTasksCount = computed(() => {
  return homepageTasks.value.filter(task => task.status === 'completed').length
})

// 計算進度百分比
const progressPercentage = computed(() => {
  if (homepageTasks.value.length === 0) return 0
  return Math.round((completedTasksCount.value / homepageTasks.value.length) * 100)
})

// 切換任務狀態
const toggleTask = async (taskId: string) => {
  try {
    // 先從本地任務中找到任務
    const task = homepageTasks.value.find(t => t.id === taskId)
    const wasCompleted = task?.status === 'completed'
    
    await taskStore.toggleTaskStatus(taskId)
    
    // 更新本地任務狀態
    if (task) {
      task.status = task.status === 'completed' ? 'in_progress' : 'completed'
    }
    
    // 如果任務剛完成（從其他狀態變成completed），增加經驗值和屬性
    if (task && task.status === 'completed' && !wasCompleted) {
      // 任務完成時增加經驗值和屬性
      userStore.updateExperience(task.experience)
      
      // 根據任務類型增加對應屬性
      if (task.attributes) {
        Object.entries(task.attributes).forEach(([attr, value]) => {
          userStore.updateAttribute(attr as keyof typeof userStore.user.attributes, value)
        })
      }
    }
    
    // 重新載入任務以確保狀態同步
    await loadHomepageTasks()
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新任務狀態失敗'
    console.error('Failed to toggle task:', err)
  }
}

// 載入首頁任務數據
const loadHomepageTasks = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiClient.getHomepageTasks()
    console.log('首頁任務API響應:', response)
    if (response.success) {
      console.log('原始API數據:', response.data)
      const tasks = response.data.map(taskStore.transformBackendTask)
      console.log('轉換後的任務數據:', tasks)
      
      // 調試：顯示每個任務的狀態
      tasks.forEach((task, index) => {
        console.log(`任務 ${index + 1}: ${task.title} - 狀態: ${task.status}`)
      })
      
      // 為每個父任務載入進度數據
      console.log('總共載入了', tasks.length, '個任務')
      
      const tasksWithProgress = await Promise.all(
        tasks.map(async (task) => {
          console.log(`檢查任務 ${task.title}: is_parent_task=${task.is_parent_task}, type=${task.type}`)
          
          // 為所有首頁任務載入進度（現在都是有父任務的子任務）
          if (task.parent_task_id) {
            console.log(`開始載入任務 ${task.title} 的進度（父任務: ${task.parent_task_title}）`)
            try {
              const progressResponse = await apiClient.getTaskProgress(task.parent_task_id)
              console.log(`任務 ${task.title} 的父任務進度API回應:`, progressResponse)
              if (progressResponse.success) {
                task.progress = progressResponse.data
                console.log(`任務 ${task.title} 的父任務進度數據:`, task.progress)
              }
            } catch (err) {
              console.warn(`Failed to load progress for task ${task.parent_task_id}:`, err)
              // 進度載入失敗不影響任務顯示
            }
          } else {
            console.log(`跳過任務 ${task.title} 的進度載入（無父任務）`)
          }
          return task
        })
      )
      
      homepageTasks.value = tasksWithProgress
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '載入首頁任務失敗'
    console.error('Failed to load homepage tasks:', err)
  } finally {
    loading.value = false
  }
}

// 頁面載入時獲取任務
onMounted(async () => {
  await loadHomepageTasks()
})

// 重新載入任務
const refreshTasks = () => {
  loadHomepageTasks()
}

</script>