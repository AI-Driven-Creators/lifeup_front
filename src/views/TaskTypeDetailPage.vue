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

      <!-- 新手教學按鈕 -->
      <button
        @click="showTutorialManually"
        class="w-8 h-8 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-sm transition-all"
        title="查看新手教學"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
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

      <!-- 每日任務提示（僅在每日任務頁面顯示且有進行中任務時顯示） -->
      <div v-if="taskType === 'daily' && inProgressCount > 0" class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-start">
          <span class="text-2xl mr-3">🏠</span>
          <div class="flex-1">
            <h3 class="text-base font-bold text-blue-900 mb-1">完成任務提示</h3>
            <p class="text-sm text-blue-700">您有 <span class="font-bold text-blue-900">{{ inProgressCount }}</span> 個進行中的每日任務</p>
            <p class="text-sm text-blue-700 mt-1">請到 <span class="font-bold">首頁</span> 標記任務為完成</p>
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

    <!-- 創建任務浮動按鈕 -->
    <button
      @click="navigateToCreateTask"
      class="fixed bottom-24 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-10"
      :title="`創建${taskTypeConfig.title}`"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- 創建任務對話框 -->
    <CreateTaskDialog
      :show="showCreateDialog"
      :defaultTaskType="taskType"
      @close="handleCloseCreateDialog"
      @created="handleTaskCreated"
    />

    <!-- 新手指引：歡迎卡片 -->
    <WelcomeBanner
      :show="showWelcomeBanner"
      :title="welcomeBannerConfig.title"
      :description="welcomeBannerConfig.description"
      :icon="welcomeBannerConfig.icon"
      :features="welcomeBannerConfig.features"
      @start-tutorial="startTutorial"
      @skip="skipTutorial"
    />

    <!-- 新手指引：浮動提示 -->
    <TutorialTooltip
      :show="showTutorialTooltip"
      :targetSelector="currentTutorialStep.targetSelector"
      :title="currentTutorialStep.title"
      :description="currentTutorialStep.description"
      :icon="currentTutorialStep.icon"
      :currentStep="currentStepIndex + 1"
      :totalSteps="tutorialSteps.length"
      :placement="currentTutorialStep.placement"
      @next="nextTutorialStep"
      @prev="prevTutorialStep"
      @skip="skipTutorial"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskStatusFilter from '@/components/features/TaskStatusFilter.vue'
import MissionTaskCard from '@/components/features/MissionTaskCard.vue'
import CreateTaskDialog from '@/components/features/CreateTaskDialog.vue'
import WelcomeBanner from '@/components/common/WelcomeBanner.vue'
import TutorialTooltip from '@/components/common/TutorialTooltip.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()
const showToast = inject<(text: string, duration?: number) => void>('showToast')

// 響應式數據
const tasks = ref<Task[]>([])
const subtasks = ref<Task[]>([]) // 儲存子任務
const loading = ref(true)
const error = ref<string | null>(null)
const activeStatusFilters = ref<string[]>([])
const pollingTimer = ref<number | null>(null) // 輪詢定時器
const showCreateDialog = ref(false) // 顯示創建任務對話框

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

// 所有任務(包含子任務)
const allTasksIncludingSubtasks = computed(() => [
  ...tasks.value,
  ...subtasks.value
])

// 計算統計數據(包含子任務)
const pendingCount = computed(() =>
  allTasksIncludingSubtasks.value.filter(task => task.status === 'pending').length
)

const inProgressCount = computed(() =>
  allTasksIncludingSubtasks.value.filter(task => ['in_progress', 'daily_in_progress'].includes(task.status)).length
)

const completedCount = computed(() =>
  allTasksIncludingSubtasks.value.filter(task => ['completed', 'daily_completed'].includes(task.status)).length
)

const completionRate = computed(() => {
  if (allTasksIncludingSubtasks.value.length === 0) return 0
  const completed = allTasksIncludingSubtasks.value.filter(task =>
    ['completed', 'daily_completed'].includes(task.status)
  ).length
  return Math.round((completed / allTasksIncludingSubtasks.value.length) * 100)
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

    // 載入所有子任務
    await loadSubtasks()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '載入任務失敗'
    console.error('Failed to load tasks:', err)
  } finally {
    loading.value = false
  }
}

// 載入子任務
const loadSubtasks = async () => {
  try {
    const subtaskPromises = tasks.value
      .filter(task => task.is_parent_task)
      .map(task => apiClient.getSubtasks(task.id))

    const subtaskResponses = await Promise.all(subtaskPromises)

    // 合併所有子任務
    subtasks.value = subtaskResponses
      .filter(response => response.success)
      .flatMap(response => response.data.map((task: any) => taskStore.transformBackendTask(task)))

    console.log(`載入 ${taskType.value} 類型的子任務數量:`, subtasks.value.length)
  } catch (err) {
    console.error('載入子任務失敗:', err)
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

    await taskStore.toggleTaskStatus(taskId, task?.status)
    
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
    // 如果任務被刪除，從列表中移除
    if (!updatedTask.id || (updatedTask as any).status === 'deleted') {
      tasks.value.splice(index, 1)
    } else {
      // 否則更新任務
      tasks.value[index] = updatedTask
    }
  }
}

// 返回上一頁
const goBack = () => {
  router.back()
}

// 檢查是否有任務正在生成子任務
const hasGeneratingTasks = computed(() => {
  return tasks.value.some(task =>
    task.task_category === 'coach_generating_subtasks' && task.is_parent_task
  )
})

// 啟動輪詢檢查子任務生成狀態
const startPollingForSubtasks = () => {
  // 先清除已有的定時器
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
  }

  // 每3秒檢查一次
  pollingTimer.value = window.setInterval(async () => {
    // 只在有任務正在生成子任務時進行輪詢
    if (hasGeneratingTasks.value) {
      console.log('[TaskTypeDetailPage] 輪詢檢查子任務生成狀態...')

      try {
        // 重新載入任務列表
        await loadTasks()
      } catch (err) {
        console.error('[TaskTypeDetailPage] 輪詢檢查失敗:', err)
      }
    }
  }, 3000) // 3秒一次
}

// 停止輪詢
const stopPolling = () => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
    console.log('[TaskTypeDetailPage] 輪詢已停止')
  }
}

// 顯示創建任務對話框
const navigateToCreateTask = () => {
  showCreateDialog.value = true
}

// 處理創建任務對話框關閉
const handleCloseCreateDialog = () => {
  showCreateDialog.value = false
}

// 處理任務創建成功
const handleTaskCreated = async (newTask: Task) => {
  try {
    // 關閉對話框
    showCreateDialog.value = false

    // 重新載入任務以確保數據同步
    await loadTasks()

    console.log('任務創建成功:', newTask)
    console.log('當前任務列表:', tasks.value)
  } catch (error) {
    console.error('處理新任務失敗:', error)
    await loadTasks()
  }
}

// ========== 新手指引系統 ==========
const getTutorialKey = () => `task-type-${taskType.value}-tutorial-completed`

// 新手指引狀態
const showWelcomeBanner = ref(false)
const showTutorialTooltip = ref(false)
const currentStepIndex = ref(0)

// 歡迎卡片配置（根據任務類型動態生成）
const welcomeBannerConfig = computed(() => {
  const configs = {
    daily: {
      title: '歡迎來到每日任務！',
      description: '每日任務幫助您培養良好習慣，透過每天的小進步累積大成就。堅持就是力量！',
      icon: '📅',
      features: [
        '查看所有每日任務的完成情況',
        '使用狀態篩選快速找到待辦任務',
        '追蹤完成率和進度統計',
        '創建新的每日習慣任務'
      ]
    },
    main: {
      title: '歡迎來到主線任務！',
      description: '主線任務是您的核心目標，專注於這些重點突破，讓您的成長更有方向性。',
      icon: '🎯',
      features: [
        '管理您的核心目標和重點任務',
        '追蹤任務進度和完成狀態',
        '查看詳細的統計數據',
        '創建新的主線任務挑戰自己'
      ]
    },
    side: {
      title: '歡迎來到支線任務！',
      description: '支線任務是輔助成長的好幫手，拓展視野、豐富技能，讓您的成長更全面。',
      icon: '🌟',
      features: [
        '探索各種輔助成長的任務',
        '靈活管理支線目標',
        '追蹤多元化的成長路徑',
        '創建感興趣的支線任務'
      ]
    },
    challenge: {
      title: '歡迎來到挑戰任務！',
      description: '挑戰任務是突破極限的舞台，勇敢面對高難度目標，證明您的實力！',
      icon: '🔥',
      features: [
        '接受高難度的挑戰任務',
        '追蹤挑戰進度和成就',
        '突破自我，獲得更多獎勵',
        '創建專屬的挑戰目標'
      ]
    }
  }
  return configs[taskType.value as keyof typeof configs] || configs.main
})

// 教學步驟定義
interface TutorialStep {
  targetSelector: string
  title: string
  description: string
  icon: string
  placement: 'top' | 'bottom' | 'left' | 'right'
}

const tutorialSteps = ref<TutorialStep[]>([
  {
    targetSelector: '.bg-white.px-4.py-4',
    title: '任務類型標題',
    description: '這裡顯示當前任務類型的名稱、圖標和說明，以及該類型的任務總數。',
    icon: '📌',
    placement: 'bottom'
  },
  {
    targetSelector: '.bg-white.rounded-xl.p-4.shadow-sm',
    title: '任務統計卡片',
    description: '快速查看待辦、進行中、已完成的任務數量，以及整體完成率。',
    icon: '📊',
    placement: 'bottom'
  },
  {
    targetSelector: '.space-y-3:has(.bg-white.rounded-lg.p-4.border)',
    title: '任務列表',
    description: '這裡顯示所有任務卡片。點擊任務可查看詳情，長按或點擊更多選項可進行編輯、刪除等操作。',
    icon: '📋',
    placement: 'top'
  },
  {
    targetSelector: '.fixed.bottom-24.right-6',
    title: '創建新任務',
    description: '點擊浮動按鈕即可創建該類型的新任務。任務類型會自動鎖定為當前類型。',
    icon: '➕',
    placement: 'left'
  }
])

const currentTutorialStep = computed(() => {
  return tutorialSteps.value[currentStepIndex.value] || tutorialSteps.value[0]
})

// 檢查是否已完成教學
const checkTutorialStatus = () => {
  const completed = localStorage.getItem(getTutorialKey())
  if (!completed) {
    // 延遲顯示歡迎卡片，確保頁面已渲染
    setTimeout(() => {
      showWelcomeBanner.value = true
    }, 500)
  }
}

// 手動顯示教學（點擊 info 按鈕時）
const showTutorialManually = () => {
  // 重置教學狀態
  currentStepIndex.value = 0
  showTutorialTooltip.value = false
  // 顯示歡迎卡片
  showWelcomeBanner.value = true
}

// 開始教學
const startTutorial = () => {
  showWelcomeBanner.value = false
  currentStepIndex.value = 0

  // 延遲顯示提示，確保歡迎卡片已關閉
  setTimeout(() => {
    showTutorialTooltip.value = true
  }, 300)
}

// 下一步
const nextTutorialStep = () => {
  if (currentStepIndex.value < tutorialSteps.value.length - 1) {
    currentStepIndex.value++
  } else {
    // 完成教學
    completeTutorial()
  }
}

// 上一步
const prevTutorialStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

// 跳過教學
const skipTutorial = () => {
  showWelcomeBanner.value = false
  showTutorialTooltip.value = false
  completeTutorial()
}

// 完成教學
const completeTutorial = () => {
  localStorage.setItem(getTutorialKey(), 'true')
  showTutorialTooltip.value = false
  showToast && showToast('新手指引已完成！', 2000)
}

// 頁面載入時獲取任務
onMounted(() => {
  loadTasks()
  // 啟動輪詢
  startPollingForSubtasks()
  // 檢查並顯示新手指引
  checkTutorialStatus()
})

// 頁面卸載時清理定時器
onUnmounted(() => {
  stopPolling()
})
</script>