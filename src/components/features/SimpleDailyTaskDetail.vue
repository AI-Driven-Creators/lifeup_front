<template>
  <div class="space-y-4">
    <!-- 今日狀態卡片 -->
    <div class="bg-blue-50 border-2 rounded-lg p-5" :class="statusBorderClass">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ statusIcon }}</span>
          <h3 class="text-lg font-bold" :class="statusTextClass">今日狀態</h3>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-600">今天</div>
          <div class="text-sm font-medium text-gray-900">{{ todayDate }}</div>
        </div>
      </div>

      <!-- 狀態徽章 -->
      <div class="flex items-center justify-center mb-4">
        <div
          class="px-6 py-3 rounded-full text-lg font-bold"
          :class="statusBadgeClass"
        >
          {{ statusText }}
        </div>
      </div>

      <!-- 經驗值與難度 -->
      <div class="grid grid-cols-2 gap-3 mt-4">
        <div class="bg-white rounded-lg p-3 text-center">
          <div class="text-xs text-gray-600 mb-1">難度等級</div>
          <div class="flex items-center justify-center gap-1">
            <span v-for="i in task.difficulty" :key="i" class="text-yellow-500">⭐</span>
          </div>
        </div>
        <div class="bg-white rounded-lg p-3 text-center">
          <div class="text-xs text-gray-600 mb-1">經驗獎勵</div>
          <div class="text-xl font-bold text-green-600">{{ task.experience }} XP</div>
        </div>
      </div>
    </div>

    <!-- 今日進度卡片 -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">📈</span>
        <h3 class="text-base font-bold text-gray-900">今日進度</h3>
      </div>

      <div class="space-y-3">
        <!-- 完成狀態 -->
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-700">完成狀態</span>
          <span class="text-sm font-medium" :class="statusTextClass">
            {{ isCompleted ? '✅ 已完成' : isInProgress ? '⏳ 進行中' : '⭕ 未開始' }}
          </span>
        </div>

        <!-- 完成時間 -->
        <div v-if="completedTime" class="flex justify-between items-center">
          <span class="text-sm text-gray-700">完成時間</span>
          <span class="text-sm font-medium text-gray-900">{{ completedTime }}</span>
        </div>

        <!-- 屬性增長預覽 -->
        <div v-if="task.attributes" class="pt-3 border-t border-gray-200">
          <div class="text-xs text-gray-600 mb-2">完成後將獲得屬性提升：</div>
          <div class="grid grid-cols-3 gap-2">
            <div
              v-for="(value, key) in task.attributes"
              :key="key"
              class="bg-gradient-to-br from-blue-50 to-purple-50 rounded px-2 py-1 text-center"
            >
              <div class="text-xs text-gray-700">{{ getAttributeName(key as string) }}</div>
              <div class="text-sm font-bold text-blue-600">+{{ value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能標籤 -->
    <div v-if="task.skillTags && task.skillTags.length > 0" class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">⭐</span>
        <h3 class="text-base font-bold text-gray-900">關聯技能</h3>
      </div>
      <SkillTags :skill-tags="skillObjects" />
    </div>

    <!-- 快速操作區 -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">⚡</span>
        <h3 class="text-base font-bold text-gray-900">快速操作</h3>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <!-- 標記完成/取消完成 -->
        <button
          v-if="!isCompleted"
          @click="$emit('toggle-status')"
          :disabled="loading"
          class="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>{{ isInProgress ? '✅' : '▶️' }}</span>
          <span>{{ isInProgress ? '標記完成' : '開始任務' }}</span>
        </button>
        <button
          v-else
          @click="$emit('toggle-status', true)"
          :disabled="loading"
          class="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>↶</span>
          <span>取消完成</span>
        </button>

        <!-- 編輯任務 -->
        <button
          @click="$emit('edit')"
          :disabled="loading"
          class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>✏️</span>
          <span>編輯任務</span>
        </button>
      </div>
    </div>

    <!-- 簡易歷史記錄 -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">📜</span>
        <h3 class="text-base font-bold text-gray-900">最近記錄</h3>
      </div>

      <!-- 空狀態 -->
      <div v-if="recentSubtasks.length === 0" class="py-8 text-center">
        <div class="text-4xl mb-2">📭</div>
        <p class="text-gray-500 text-sm">尚無完成記錄</p>
        <p class="text-gray-400 text-xs mt-1">完成任務後這裡會顯示歷史記錄</p>
      </div>

      <!-- 歷史記錄列表 -->
      <div v-else class="space-y-2">
        <div
          v-for="subtask in recentSubtasks"
          :key="subtask.id"
          class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
        >
          <div class="flex items-center gap-2">
            <span>{{ getSubtaskStatusIcon(subtask) }}</span>
            <span class="text-sm text-gray-700">{{ formatSubtaskDate(subtask.task_date) }}</span>
          </div>
          <span class="text-xs" :class="getSubtaskStatusTextClass(subtask)">
            {{ getSubtaskStatusText(subtask) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'
import { useSkillStore } from '@/stores/skill'
import SkillTags from '@/components/common/SkillTags.vue'

interface Props {
  task: Task
  subtasks?: Task[]
  loading?: boolean
}

interface Emits {
  (e: 'toggle-status', reverse?: boolean): void
  (e: 'edit'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const skillStore = useSkillStore()

// 今日日期
const todayDate = computed(() => {
  const today = new Date()
  return `${today.getMonth() + 1}月${today.getDate()}日`
})

// 是否已完成
const isCompleted = computed(() => props.task.status === 'daily_completed')

// 是否進行中
const isInProgress = computed(() => props.task.status === 'daily_in_progress')

// 狀態圖示
const statusIcon = computed(() => {
  if (isCompleted.value) return '✅'
  if (isInProgress.value) return '⏳'
  return '📋'
})

// 狀態文字
const statusText = computed(() => {
  if (isCompleted.value) return '今日已完成'
  if (isInProgress.value) return '進行中'
  return '待開始'
})

// 狀態邊框樣式
const statusBorderClass = computed(() => {
  if (isCompleted.value) return 'border-green-400 bg-green-50'
  if (isInProgress.value) return 'border-blue-400 bg-blue-50'
  return 'border-gray-300 bg-gray-50'
})

// 狀態文字顏色
const statusTextClass = computed(() => {
  if (isCompleted.value) return 'text-green-700'
  if (isInProgress.value) return 'text-blue-700'
  return 'text-gray-700'
})

// 狀態徽章樣式
const statusBadgeClass = computed(() => {
  if (isCompleted.value) return 'bg-green-100 text-green-700'
  if (isInProgress.value) return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-700'
})

// 完成時間（如果有）
const completedTime = computed(() => {
  if (!isCompleted.value || !props.task.updated_at) return null
  const date = new Date(props.task.updated_at)
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
})

// 獲取技能對象
const skillObjects = computed(() => {
  if (!props.task.skillTags || props.task.skillTags.length === 0) {
    return []
  }
  if (!skillStore.skills.length) {
    return undefined
  }
  return props.task.skillTags
    .map(tagName => skillStore.skills.find(skill => skill.name === tagName))
    .filter(skill => !!skill) as { id: string; name: string }[]
})

// 最近的子任務（最多3個）
const recentSubtasks = computed(() => {
  if (!props.subtasks) return []

  // 過濾掉今天的任務，只顯示歷史記錄
  const today = new Date().toISOString().split('T')[0]
  return props.subtasks
    .filter(st => st.task_date !== today)
    .slice(0, 3)
})

// 屬性名稱映射
const getAttributeName = (key: string) => {
  const map: Record<string, string> = {
    intelligence: '智力',
    endurance: '毅力',
    creativity: '創造',
    social: '社交',
    focus: '專注',
    adaptability: '適應'
  }
  return map[key] || key
}

// 子任務狀態圖示
const getSubtaskStatusIcon = (subtask: Task) => {
  if (subtask.status === 'daily_completed') return '✅'
  if (subtask.status === 'daily_in_progress') return '⏳'
  return '❌'
}

// 子任務狀態文字
const getSubtaskStatusText = (subtask: Task) => {
  if (subtask.status === 'daily_completed') return '已完成'
  if (subtask.status === 'daily_in_progress') return '進行中'
  return '未完成'
}

// 子任務狀態文字顏色
const getSubtaskStatusTextClass = (subtask: Task) => {
  if (subtask.status === 'daily_completed') return 'text-green-600'
  if (subtask.status === 'daily_in_progress') return 'text-blue-600'
  return 'text-red-600'
}

// 格式化子任務日期
const formatSubtaskDate = (dateString?: string) => {
  if (!dateString) return '未知'

  const date = new Date(dateString + 'T00:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const dateStr = date.toISOString().split('T')[0]
  const todayStr = today.toISOString().split('T')[0]
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (dateStr === todayStr) return '今天'
  if (dateStr === yesterdayStr) return '昨天'

  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>