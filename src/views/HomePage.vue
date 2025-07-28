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

// 從首頁任務中篩選出進行中的任務
const activeTasks = computed(() => {
  return homepageTasks.value.filter(task => 
    task.status === 'in_progress'
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
    await taskStore.toggleTaskStatus(taskId)
    
    // 計算經驗值獎勵
    const task = taskStore.tasks.find(t => t.id === taskId)
    if (task && task.status === 'completed') {
      // 任務完成時增加經驗值和屬性
      userStore.updateExperience(task.experience)
      
      // 根據任務類型增加對應屬性
      if (task.attributes) {
        Object.entries(task.attributes).forEach(([attr, value]) => {
          userStore.updateAttribute(attr as keyof typeof userStore.user.attributes, value)
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
  
  try {
    const response = await apiClient.getHomepageTasks()
    if (response.success) {
      homepageTasks.value = response.data.map(taskStore.transformBackendTask)
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