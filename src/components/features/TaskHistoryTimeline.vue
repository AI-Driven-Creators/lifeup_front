<template>
  <div class="card">
    <h3 class="text-lg font-bold text-primary-900 mb-4">任務完成編年史</h3>

    <!-- 類型篩選按鈕 -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      <button
        v-for="type in taskTypes"
        :key="type.value"
        @click="selectType(type.value)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
          selectedType === type.value
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ type.label }}
      </button>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading && tasks.length === 0" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- 空狀態 -->
    <div v-else-if="tasks.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📜</div>
      <p class="text-gray-500 text-lg">還沒有完成的任務記錄</p>
      <p class="text-gray-400 text-sm mt-2">開始完成任務來建立你的成長編年史吧！</p>
    </div>

    <!-- 時間軸 -->
    <div v-else class="relative">
      <!-- 時間軸線條 -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <!-- 任務項目 -->
      <div v-for="(task, index) in tasks" :key="task.id" class="relative pl-12 pb-8 last:pb-0">
        <!-- 時間軸圓點 -->
        <div class="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary-600 border-2 border-white shadow"></div>

        <!-- 任務卡片 -->
        <div class="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <!-- 任務標題 -->
          <h4 class="font-semibold text-gray-900 mb-2">{{ task.title }}</h4>

          <!-- 任務資訊 -->
          <div class="flex flex-wrap gap-3 text-sm">
            <!-- 完成時間 -->
            <div class="flex items-center text-gray-600">
              <span class="mr-1">📅</span>
              <span>{{ formatDate(task.completed_at) }}</span>
            </div>

            <!-- 經驗值 -->
            <div class="flex items-center text-yellow-600 font-medium">
              <span class="mr-1">⭐</span>
              <span>+{{ task.experience }} 經驗</span>
            </div>

            <!-- 任務類型標籤 -->
            <div class="flex items-center">
              <span :class="getTypeClass(task.task_type)" class="px-2 py-0.5 rounded text-xs font-medium">
                {{ getTypeLabel(task.task_type) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 載入更多按鈕 -->
      <div v-if="hasMore" class="text-center pt-4">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="loading">載入中...</span>
          <span v-else>載入更多</span>
        </button>
      </div>

      <!-- 已載入全部 -->
      <div v-else-if="tasks.length > 0" class="text-center pt-4 text-gray-400 text-sm">
        已載入全部歷史記錄
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface TaskHistoryItem {
  id: string
  title: string
  task_type: string
  completed_at: string
  experience: number
}

interface TaskHistoryResponse {
  tasks: TaskHistoryItem[]
  total_count: number
  has_more: boolean
}

interface Props {
  userId: string
}

const props = defineProps<Props>()

// 任務類型選項
const taskTypes = [
  { value: 'all', label: '全部' },
  { value: 'daily', label: '每日' },
  { value: 'main', label: '主線' },
  { value: 'project', label: '專案' },
  { value: 'challenge', label: '挑戰' }
]

// 狀態
const tasks = ref<TaskHistoryItem[]>([])
const selectedType = ref('all')
const loading = ref(false)
const hasMore = ref(false)
const offset = ref(0)
const limit = 5

// 選擇類型
const selectType = (type: string) => {
  selectedType.value = type
  offset.value = 0
  tasks.value = []
  fetchTaskHistory()
}

// 載入更多
const loadMore = () => {
  offset.value += limit
  fetchTaskHistory(true)
}

// 獲取任務歷史
const fetchTaskHistory = async (append = false) => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.value.toString(),
      task_type: selectedType.value
    })

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/${props.userId}/task-history?${params}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch task history')
    }

    const result = await response.json()
    const data: TaskHistoryResponse = result.data

    if (append) {
      tasks.value = [...tasks.value, ...data.tasks]
    } else {
      tasks.value = data.tasks
    }

    hasMore.value = data.has_more
  } catch (error) {
    console.error('獲取任務歷史失敗:', error)
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } catch {
    return dateString
  }
}

// 獲取任務類型標籤文字
const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    daily: '每日',
    main: '主線',
    project: '專案',
    challenge: '挑戰'
  }
  return typeMap[type] || type
}

// 獲取任務類型樣式
const getTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    daily: 'bg-blue-100 text-blue-700',
    main: 'bg-purple-100 text-purple-700',
    project: 'bg-green-100 text-green-700',
    challenge: 'bg-red-100 text-red-700'
  }
  return classMap[type] || 'bg-gray-100 text-gray-700'
}

// 初始載入
onMounted(() => {
  fetchTaskHistory()
})
</script>

<style scoped>
.card {
  @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm;
}
</style>
