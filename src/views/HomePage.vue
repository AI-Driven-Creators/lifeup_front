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
          class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl py-4 px-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div class="text-center">
            <div class="font-semibold text-lg">找到你的理想職業</div>
            <div class="text-sm text-slate-600">5分鐘測驗，獲得專屬職涯建議</div>
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
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          前往任務頁面
        </button>
      </div>
    </div>
    
    <!-- 懸浮刷新按鈕 -->
    <button
      v-if="!loading && activeTasks.length > 0"
      @click="refreshTasks"
      class="fixed bottom-20 right-4 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
      title="刷新任務"
    >
      <RefreshCw class="w-5 h-5" />
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
import { RefreshCw } from 'lucide-vue-next'
import type { Task } from '@/types'

const taskStore = useTaskStore()
const userStore = useUserStore()

// 首頁任務：進行中的子任務和大任務
const homepageTasks = ref<Task[]>([])

// 從首頁任務中篩選出可顯示的任務，並按完成狀態排序
const activeTasks = computed(() => {
  const tasks = homepageTasks.value.filter(task => 
    ['in_progress', 'daily_in_progress', 'daily_completed', 'daily_not_completed', 'completed'].includes(task.status)
  )
  
  // 排序邏輯：職業主線任務保持原始順序，其他任務按完成狀態排序
  return tasks.sort((a, b) => {
    // 檢查是否為職業主線任務
    const aIsCareer = a.task_category === 'career_subtask' || a.career_mainline_id
    const bIsCareer = b.task_category === 'career_subtask' || b.career_mainline_id

    // 如果都是職業主線任務，保持原始順序（按 task_order 或創建時間）
    if (aIsCareer && bIsCareer) {
      return (a.task_order || 0) - (b.task_order || 0)
    }

    // 如果都不是職業主線任務，按完成狀態排序
    if (!aIsCareer && !bIsCareer) {
      const aCompleted = a.status === 'completed' || a.status === 'daily_completed'
      const bCompleted = b.status === 'completed' || b.status === 'daily_completed'

      if (aCompleted && !bCompleted) return 1  // a 完成，b 未完成，a 排後面
      if (!aCompleted && bCompleted) return -1 // a 未完成，b 完成，a 排前面
      return 0
    }

    // 混合情況保持原順序
    return 0
  })
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
    const wasCompleted = task?.status === 'completed' || task?.status === 'daily_completed'

    await taskStore.toggleTaskStatus(taskId, task?.status)
    
    // 重新載入任務以確保狀態同步（移除手動狀態更新，依賴後端回應）
    await loadHomepageTasks()
    
    // 在重新載入後，重新找到任務並檢查是否剛完成
    const updatedTask = homepageTasks.value.find(t => t.id === taskId)
    const isNowCompleted = updatedTask?.status === 'completed' || updatedTask?.status === 'daily_completed'
    
    // 如果任務剛完成（從其他狀態變成completed），增加經驗值和屬性
    if (updatedTask && isNowCompleted && !wasCompleted) {
      // 任務完成時增加經驗值和屬性
      userStore.updateExperience(updatedTask.experience)
      
      // 根據任務類型增加對應屬性
      if (updatedTask.attributes) {
        Object.entries(updatedTask.attributes).forEach(([attr, value]) => {          userStore.updateAttribute(attr as keyof typeof userStore.user.attributes, value)
        })
      }
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新任務狀態失敗'
    console.error('Failed to toggle task:', err)
  }
}

// 載入首頁任務數據
const loadHomepageTasks = async () => {
  loading.value = true
  error.value = null

  // 確保用戶已登入
  if (!userStore.user.id) {
    console.warn('用戶未登入，無法載入首頁任務')
    loading.value = false
    error.value = '請先登入'
    return
  }

  try {
    console.log('正在載入首頁任務，user_id:', userStore.user.id)
    const response = await apiClient.getHomepageTasks(userStore.user.id)
    console.log('首頁任務API響應:', response)
    if (response.success) {
      const tasks = response.data.map(taskStore.transformBackendTask)
      console.log('解析後的任務數量:', tasks.length)
      
      const tasksWithProgress = await Promise.all(
        tasks.map(async (task) => {
          // 為所有首頁任務載入進度（現在都是有父任務的子任務）
          if (task.parent_task_id) {
            try {
              const progressResponse = await apiClient.getTaskProgress(task.parent_task_id, userStore.user.id)
              if (progressResponse.success) {
                task.progress = progressResponse.data
              } else {
                console.warn(`進度API失敗 (${task.title}):`, progressResponse.message)
              }
            } catch (err) {
              console.warn(`Failed to load progress for task ${task.parent_task_id}:`, err)
              // 進度載入失敗不影響任務顯示
            }
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