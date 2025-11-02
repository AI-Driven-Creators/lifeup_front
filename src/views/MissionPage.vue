<template>
  <!-- 調整高度避免被底部導航影響，並確保內容區域可滾動 -->
  <div class="flex flex-col min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <div class="shrink-0">
      <PageHeader title="任務總覽" />
    </div>

    <!-- 可滾動內容區域 -->
    <div class="pb-20">
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
            @click="loadTasksByType"
            class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            重試
          </button>
        </div>
      </div>
      
      <!-- 任務總覽內容 -->
      <div v-else class="px-4 py-6">
        <div class="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-xl font-bold text-blue-600">{{ totalActiveTasks }}</div>
              <div class="text-xs text-gray-500">活躍任務</div>
            </div>
            <div>
              <div class="text-xl font-bold text-green-600">{{ todayCompletedTasks }}</div>
              <div class="text-xs text-gray-500">已完成</div>
            </div>
            <div>
              <div class="text-xl font-bold text-orange-600">{{ overallCompletionRate }}%</div>
              <div class="text-xs text-gray-500">完成率</div>
            </div>
          </div>
        </div>

        <!-- 任務類型卡片 -->
        <div class="space-y-3 pb-4">
          <TaskTypeCard
            type="daily"
            title="每日任務"
            subtitle="培養習慣，日日精進"
            :tasks="dailyTasks"
            @click="navigateToTaskType"
          />
          <TaskTypeCard
            type="main"
            title="主線任務"
            subtitle="核心目標，重點突破"
            :tasks="mainTasks"
            @click="navigateToTaskType"
          />
          <TaskTypeCard
            type="side"
            title="支線任務"
            subtitle="輔助成長，拓展視野"
            :tasks="sideTasks"
            @click="navigateToTaskType"
          />
          <TaskTypeCard
            type="challenge"
            title="挑戰任務"
            subtitle="挑戰自我，突破極限"
            :tasks="challengeTasks"
            @click="navigateToTaskType"
          />
        </div>

      </div>
    </div>

    <!-- 創建任務浮動按鈕 -->
    <button
      @click="navigateToCreateTask"
      class="fixed bottom-24 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-10"
      title="創建新任務"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- 創建任務對話框 -->
    <CreateTaskDialog
      :show="showCreateDialog"
      :editTaskData="editTaskData"
      @close="handleCloseCreateDialog"
      @created="handleTaskCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import TaskTypeCard from '@/components/features/TaskTypeCard.vue'
import CreateTaskDialog from '@/components/features/CreateTaskDialog.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'
import { AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()
const userStore = useUserStore()
const showToast = inject<(text: string, duration?: number) => void>('showToast')

const mainTasks = ref<Task[]>([])
const sideTasks = ref<Task[]>([])
const challengeTasks = ref<Task[]>([])
const dailyTasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const editTaskData = ref<any>(null)
const allSubtasks = ref<Task[]>([]) // 儲存所有子任務

// 所有任務的計算屬性
const allTasks = computed(() => [
  ...mainTasks.value,
  ...sideTasks.value,
  ...challengeTasks.value,
  ...dailyTasks.value
])

// 所有任務(包含子任務)的計算屬性
const allTasksIncludingSubtasks = computed(() => [
  ...allTasks.value,
  ...allSubtasks.value
])

// 載入不同類型的任務
const loadTasksByType = async () => {
  loading.value = true
  error.value = null
  
  try {
    const [main, side, challenge, daily] = await Promise.all([
      taskStore.fetchTasksByType('main'),
      taskStore.fetchTasksByType('side'),
      taskStore.fetchTasksByType('challenge'),
      taskStore.fetchTasksByType('daily')
    ])
    
    mainTasks.value = main
    sideTasks.value = side
    challengeTasks.value = challenge
    dailyTasks.value = daily

    // 載入所有子任務
    await loadAllSubtasks()

    // 調試：檢查技能標籤
    console.log('主線任務技能標籤:', main.map(t => ({ title: t.title, skillTags: t.skillTags })))
    console.log('支線任務技能標籤:', side.map(t => ({ title: t.title, skillTags: t.skillTags })))
    console.log('挑戰任務技能標籤:', challenge.map(t => ({ title: t.title, skillTags: t.skillTags })))
    console.log('每日任務技能標籤:', daily.map(t => ({ title: t.title, skillTags: t.skillTags })))
  } catch (err) {
    error.value = err instanceof Error ? err.message : '載入任務失敗'
    console.error('Failed to load tasks by type:', err)
  } finally {
    loading.value = false
  }
}

// 載入所有子任務
const loadAllSubtasks = async () => {
  try {
    const subtaskPromises = allTasks.value
      .filter(task => task.is_parent_task)
      .map(task => apiClient.getSubtasks(task.id))

    const subtaskResponses = await Promise.all(subtaskPromises)

    // 合併所有子任務
    allSubtasks.value = subtaskResponses
      .filter(response => response.success)
      .flatMap(response => response.data.map((task: any) => taskStore.transformBackendTask(task)))

    console.log('載入子任務數量:', allSubtasks.value.length)
  } catch (err) {
    console.error('載入子任務失敗:', err)
  }
}

// 切換任務狀態
const toggleTask = async (taskId: string) => {
  try {
    // 先記錄任務完成前的狀態
    const currentAllTasks = [...mainTasks.value, ...sideTasks.value, ...challengeTasks.value, ...dailyTasks.value]
    const originalTask = currentAllTasks.find(t => t.id === taskId)
    const wasCompleted = originalTask?.status === 'completed'

    await taskStore.toggleTaskStatus(taskId, originalTask?.status)
    
    // 重新載入任務數據確保狀態同步
    await loadTasksByType()
    
    // 在重新載入後檢查任務完成獎勵
    const updatedAllTasks = [...mainTasks.value, ...sideTasks.value, ...challengeTasks.value, ...dailyTasks.value]
    const updatedTask = updatedAllTasks.find(t => t.id === taskId)
    const isNowCompleted = updatedTask?.status === 'completed'
    
    if (updatedTask && isNowCompleted && !wasCompleted) {
      // 任務完成時增加經驗值和屬性
      userStore.updateExperience(updatedTask.experience)
      
      // 根據任務類型增加對應屬性
      if (updatedTask.attributes) {
        Object.entries(updatedTask.attributes).forEach(([attr, value]) => {
          userStore.updateAttribute(attr as keyof typeof userStore.user.attributes, value as number)
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
  const updateTaskInList = (taskList: Task[]) => {
    const index = taskList.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      taskList[index] = updatedTask
    }
  }
  
  // 根據任務類型更新對應的列表
  switch (updatedTask.type) {
    case 'main':
      updateTaskInList(mainTasks.value)
      break
    case 'side':
      updateTaskInList(sideTasks.value)
      break
    case 'challenge':
      updateTaskInList(challengeTasks.value)
      break
    case 'daily':
      updateTaskInList(dailyTasks.value)
      break
  }
}


// 計算統計數據
const totalActiveTasks = computed(() => {
  return allTasksIncludingSubtasks.value.filter(task =>
    ['pending', 'in_progress', 'daily_in_progress'].includes(task.status)
  ).length
})

const todayCompletedTasks = computed(() => {
  // 這裡可以根據實際的任務完成時間來判斷,目前簡化處理
  return allTasksIncludingSubtasks.value.filter(task => {
    const isCompleted = ['completed', 'daily_completed'].includes(task.status)
    return isCompleted
  }).length
})

const overallCompletionRate = computed(() => {
  // 計算所有任務(包含子任務)的完成率
  if (allTasksIncludingSubtasks.value.length === 0) return 0
  const completed = allTasksIncludingSubtasks.value.filter(task =>
    ['completed', 'daily_completed'].includes(task.status)
  ).length
  return Math.round((completed / allTasksIncludingSubtasks.value.length) * 100)
})

// 導航到特定任務類型頁面
const navigateToTaskType = (type: string) => {
  router.push(`/mission/${type}`)
}

// 顯示創建任務對話框
const showCreateDialog = ref(false)

const navigateToCreateTask = () => {
  showCreateDialog.value = true
}

// 處理創建任務對話框關閉
const handleCloseCreateDialog = () => {
  showCreateDialog.value = false
  editTaskData.value = null // 清理編輯資料
}

// 處理任務創建成功
const handleTaskCreated = async (newTask: Task) => {
  try {
    // 根據任務類型將新任務加入對應列表
    switch (newTask.type) {
      case 'main':
        mainTasks.value.push(newTask)
        break
      case 'side':
        sideTasks.value.push(newTask)
        break
      case 'challenge':
        challengeTasks.value.push(newTask)
        break
      case 'daily':
        dailyTasks.value.push(newTask)
        break
    }

    // 檢查任務狀態來決定提示訊息
    const isStarted = newTask.status === 'in_progress'
    const taskTitle = newTask.title || '新任務'

    if (isStarted) {
      showToast && showToast(`任務「${taskTitle}」已創建並開始，子任務已生成！`, 4000)
    } else {
      showToast && showToast(`任務「${taskTitle}」創建成功！`, 3000)
    }

    // 清理編輯資料
    editTaskData.value = null

    // 可選：重新載入任務列表以確保數據同步
    // await loadTasksByType()

  } catch (error) {
    console.error('處理新任務失敗:', error)
    // 如果出錯，重新載入任務列表
    await loadTasksByType()
  }
}

// 快速操作方法
const showActiveTasksOnly = () => {
  // 導航到主線任務頁面並預設篩選活躍任務
  router.push('/mission/main')
}

const showTodayTasks = () => {
  // 導航到每日任務頁面
  router.push('/mission/daily')
}

// 頁面載入時獲取任務
onMounted(() => {
  loadTasksByType()

  // 檢查是否從 coach 頁面的編輯模式跳轉過來
  if (route.query.editMode === 'true') {
    const editTaskDataString = sessionStorage.getItem('editTaskData')
    if (editTaskDataString) {
      try {
        // 解析並存儲編輯資料
        editTaskData.value = JSON.parse(editTaskDataString)

        // 清除 sessionStorage 中的資料
        sessionStorage.removeItem('editTaskData')

        // 開啟創建任務對話框並預填資料
        showCreateDialog.value = true

        showToast && showToast('已從小教練模式載入任務資料，請繼續編輯', 3000)
      } catch (error) {
        console.error('載入編輯資料失敗:', error)
      }
    }
  }
})

// 清理 sessionStorage
onUnmounted(() => {
  // 如果用戶離開頁面但沒有使用編輯資料，清理 sessionStorage
  if (sessionStorage.getItem('editTaskData')) {
    sessionStorage.removeItem('editTaskData')
  }
})
</script>