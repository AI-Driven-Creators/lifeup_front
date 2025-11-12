<template>
  <div class="card h-[50vh] flex flex-col">
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
    <div v-else ref="timelineContainer" @scroll="handleScroll" class="relative flex-1 overflow-y-auto">
      <!-- 時間軸線條 -->
      <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <!-- 已載入全部提示 - 在頂端 -->
      <div v-if="!hasMore && tasks.length > 0" class="text-center py-3 text-gray-400 text-sm">
        已載入全部歷史記錄
      </div>

      <!-- 載入中提示 - 在頂端 -->
      <div v-if="loading && tasks.length > 0" class="text-center py-3">
        <div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
        <p class="text-xs text-gray-500 mt-1">載入更多...</p>
      </div>

      <!-- 任務項目 -->
      <div v-for="(task, index) in tasks" :key="task.id" class="relative pl-12 pb-3 last:pb-0">
        <!-- 時間軸圓點 -->
        <div class="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-primary-600 border-2 border-white shadow"></div>

        <!-- 任務卡片 -->
        <div class="bg-white border border-green-200 rounded-lg p-2.5 hover:shadow-md transition-shadow">
          <!-- 任務標題 -->
          <h4 class="font-semibold text-gray-900 mb-1">{{ task.title }}</h4>

          <!-- 任務資訊 -->
          <div class="flex flex-wrap gap-2 text-sm">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { apiClient } from '@/services/api'

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
const timelineContainer = ref<HTMLElement | null>(null)
const isLoadingMore = ref(false)

// 選擇類型
const selectType = async (type: string) => {
  selectedType.value = type
  offset.value = 0
  tasks.value = []
  await fetchTaskHistory()
  scrollToBottom()
}

// 滾動事件處理器 - 滾動到頂部時載入更舊的任務
const handleScroll = () => {
  if (!timelineContainer.value || isLoadingMore.value || !hasMore.value) return

  const { scrollTop } = timelineContainer.value

  // 當滾動到頂部附近時（距離頂部小於 50px），載入更多舊任務
  if (scrollTop < 50) {
    loadMoreOldTasks()
  }
}

// 載入更多舊任務（往前翻頁）
const loadMoreOldTasks = async () => {
  if (isLoadingMore.value || !hasMore.value) return

  isLoadingMore.value = true
  const previousScrollHeight = timelineContainer.value?.scrollHeight || 0

  offset.value += limit
  await fetchTaskHistory(true)

  // 保持滾動位置，避免跳動
  await nextTick()
  if (timelineContainer.value) {
    const newScrollHeight = timelineContainer.value.scrollHeight
    timelineContainer.value.scrollTop = newScrollHeight - previousScrollHeight
  }

  isLoadingMore.value = false
}

// 滾動到底部（最新任務）
const scrollToBottom = async () => {
  await nextTick()
  if (timelineContainer.value) {
    timelineContainer.value.scrollTop = timelineContainer.value.scrollHeight
  }
}

// 獲取任務歷史
const fetchTaskHistory = async (append = false) => {
  loading.value = true
  try {
    const result = await apiClient.getTaskHistory(props.userId, {
      limit: limit,
      offset: offset.value,
      task_type: selectedType.value
    })

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch task history')
    }

    const data: TaskHistoryResponse = result.data

    if (append) {
      // 載入更多舊任務時，將新任務加到陣列開頭（因為這些是更舊的任務）
      tasks.value = [...data.tasks, ...tasks.value]
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
onMounted(async () => {
  await fetchTaskHistory()
  scrollToBottom()
})
</script>

<style scoped>
.card {
  @apply bg-white border border-gray-200 rounded-lg p-6 shadow-sm;
}
</style>
