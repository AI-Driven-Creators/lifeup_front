<template>
  <div class="min-h-screen bg-white">
    <!-- 頁面標題 -->
    <PageHeader title="每日任務" />

    <!-- 新手引導 -->
    <OnboardingGuide />
    
    <!-- 載入狀態 -->
    <div v-if="loading" class="px-4 py-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">載入任務中...</p>
    </div>
    
    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="px-4 py-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <AlertTriangle class="w-5 h-5 text-red-600 mr-3" />
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
          id="personality-test-button"
          @click="$router.push('/personality-test')"
          :class="[
            'w-full rounded-xl py-4 px-6 transition-all duration-300',
            hasCareerMainline
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-sm hover:shadow-md'
              : 'bg-gradient-to-br from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 text-amber-900 border-2 border-amber-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] py-5'
          ]"
        >
          <div class="text-center">
            <div :class="hasCareerMainline ? 'font-semibold text-lg' : 'font-bold text-lg mb-1'">找到你的理想職業</div>
            <div :class="hasCareerMainline ? 'text-sm text-slate-600' : 'text-sm text-amber-700 font-medium'">5分鐘測驗，獲得專屬職涯建議</div>
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
        <div class="flex justify-center mb-4">
          <ClipboardList class="w-16 h-16 text-gray-400" :stroke-width="1.5" />
        </div>
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
import OnboardingGuide from '@/components/common/OnboardingGuide.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { apiClient } from '@/services/api'
import { RefreshCw, ClipboardList, AlertTriangle } from 'lucide-vue-next'
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

// 檢查是否有職業主線任務
const hasCareerMainline = ref(false)

// 檢查用戶是否已有職業主線任務
const checkCareerMainline = async () => {
  try {
    const response = await apiClient.getTasks(userStore.user.id)
    if (response.success) {
      hasCareerMainline.value = response.data.some(task =>
        task.task_category === 'career_mainline'
      )
      console.log('檢查職業主線任務結果:', hasCareerMainline.value)
    }
  } catch (err) {
    console.error('Failed to check career mainline:', err)
  }
}

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

    // 判斷是否為回復操作（任務已完成）
    const isCompleted = task?.status === 'completed' || task?.status === 'daily_completed'

    // 使用 task store 的 toggleTaskStatus，傳入 reverse 參數
    await taskStore.toggleTaskStatus(taskId, task?.status, isCompleted)

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

      // 收集所有唯一的父任務ID
      const uniqueParentIds = [...new Set(
        tasks
          .filter(task => task.parent_task_id)
          .map(task => task.parent_task_id)
      )]

      console.log('需要載入進度的父任務數量:', uniqueParentIds.length)

      // 批量載入所有父任務的進度（避免重複查詢）
      const progressMap = new Map()
      await Promise.all(
        uniqueParentIds.map(async (parentId) => {
          try {
            const progressResponse = await apiClient.getTaskProgress(parentId!, userStore.user.id)
            if (progressResponse.success) {
              progressMap.set(parentId, progressResponse.data)
            }
          } catch (err) {
            console.warn(`Failed to load progress for parent task ${parentId}:`, err)
          }
        })
      )

      // 將進度數據附加到對應的任務
      const tasksWithProgress = tasks.map(task => {
        if (task.parent_task_id && progressMap.has(task.parent_task_id)) {
          task.progress = progressMap.get(task.parent_task_id)
        }
        return task
      })

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
  await Promise.all([
    loadHomepageTasks(),
    checkCareerMainline()
  ])
})

// 重新載入任務
const refreshTasks = async () => {
  await Promise.all([
    loadHomepageTasks(),
    checkCareerMainline()
  ])
}

</script>