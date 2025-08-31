<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="任務總覽" />
    
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
      <div class="space-y-3">
        <TaskTypeCard
          type="daily"
          title="每日任務"
          subtitle="培養習慣，日日精進"
          icon="📅"
          :tasks="dailyTasks"
          @click="navigateToTaskType"
        />
        <TaskTypeCard
          type="main"
          title="主線任務"
          subtitle="核心目標，重點突破"
          icon="🎯"
          :tasks="mainTasks"
          @click="navigateToTaskType"
        />
        <TaskTypeCard
          type="side"
          title="支線任務"
          subtitle="輔助成長，拓展視野"
          icon="🌟"
          :tasks="sideTasks"
          @click="navigateToTaskType"
        />
        <TaskTypeCard
          type="challenge"
          title="挑戰任務"
          subtitle="挑戰自我，突破極限"
          icon="🔥"
          :tasks="challengeTasks"
          @click="navigateToTaskType"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import TaskTypeCard from '@/components/features/TaskTypeCard.vue'
import { useTaskStore } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import type { Task } from '@/types'

const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()

const mainTasks = ref<Task[]>([])
const sideTasks = ref<Task[]>([])
const challengeTasks = ref<Task[]>([])
const dailyTasks = ref<Task[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// 所有任務的計算屬性
const allTasks = computed(() => [
  ...mainTasks.value,
  ...sideTasks.value,
  ...challengeTasks.value,
  ...dailyTasks.value
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

// 切換任務狀態
const toggleTask = async (taskId: string) => {
  try {
    // 先記錄任務完成前的狀態
    const allTasks = [...mainTasks.value, ...sideTasks.value, ...challengeTasks.value, ...dailyTasks.value]
    const task = allTasks.find(t => t.id === taskId)
    const wasCompleted = task?.status === 'completed'
    
    await taskStore.toggleTaskStatus(taskId)
    
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
      if (task.attributes) {
        Object.entries(task.attributes).forEach(([attr, value]) => {          userStore.updateAttribute(attr as keyof typeof userStore.user.attributes, value)
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
  return allTasks.value.filter(task => 
    ['pending', 'in_progress', 'daily_in_progress'].includes(task.status)
  ).length
})

const todayCompletedTasks = computed(() => {
  // 這裡可以根據實際的任務完成時間來判斷，目前簡化處理
  return allTasks.value.filter(task => {
    const isCompleted = ['completed', 'daily_completed'].includes(task.status)
    return isCompleted
  }).length
})

const overallCompletionRate = computed(() => {
  if (allTasks.value.length === 0) return 0
  const completed = allTasks.value.filter(task => 
    ['completed', 'daily_completed'].includes(task.status)
  ).length
  return Math.round((completed / allTasks.value.length) * 100)
})

// 導航到特定任務類型頁面
const navigateToTaskType = (type: string) => {
  router.push(`/mission/${type}`)
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
})
</script>