<template>
  <div class="space-y-4">
    <!-- 任務概覽卡片 -->
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-2xl">🔄</span>
        <h3 class="text-lg font-bold text-purple-900">常駐目標概覽</h3>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-purple-700">重複模式：</span>
          <span class="font-medium text-purple-900">{{ getRecurrencePatternText(task.recurrence_pattern) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-purple-700">開始日期：</span>
          <span class="font-medium text-purple-900">{{ formatDate(task.start_date) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-purple-700">結束日期：</span>
          <span class="font-medium text-purple-900">{{ formatDate(task.end_date) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-purple-700">總天數：</span>
          <span class="font-medium text-purple-900">{{ totalDays }} 天</span>
        </div>
        <div class="flex justify-between">
          <span class="text-purple-700">剩餘天數：</span>
          <span class="font-medium text-purple-900">{{ remainingDays }} 天</span>
        </div>
      </div>
    </div>

    <!-- 今日快速操作 -->
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">⚡</span>
        <h3 class="text-base font-bold text-gray-900">今日操作</h3>
      </div>

      <!-- 今日狀態 -->
      <div class="mb-3 p-3 rounded-lg" :class="todayStatusBgClass">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ todayStatusIcon }}</span>
            <div>
              <p class="font-medium" :class="todayStatusTextClass">{{ todayStatusText }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ formatDate(new Date()) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作按鈕 -->
      <div class="flex gap-2">
        <button
          v-if="!isTodayCompleted"
          @click="$emit('toggle-status', todaySubtask?.id)"
          :disabled="loading"
          class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>✅</span>
          <span>{{ todaySubtask ? '標記完成' : '開始並完成' }}</span>
        </button>
        <button
          v-else
          @click="$emit('toggle-status', todaySubtask?.id, true)"
          :disabled="loading"
          class="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>↩️</span>
          <span>取消完成</span>
        </button>
      </div>
    </div>

    <!-- 進度統計儀表板 -->
    <StatsDashboard :task="task" :progress="progress" />

    <!-- 本月完成情況 -->
    <MonthlyCalendar :task="task" :subtasks="subtasks" />

    <!-- 技能成長追蹤 -->
    <div v-if="task.skillTags && task.skillTags.length > 0" class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">⭐</span>
        <h3 class="text-base font-bold text-gray-900">技能成長追蹤</h3>
      </div>
      <SkillTags :skill-tags="skillObjects" />
      <p class="text-xs text-gray-500 mt-2">
        完成此目標可持續提升相關技能經驗值
      </p>
    </div>

    <!-- 取消次數警告 -->
    <div v-if="task.cancel_count && task.cancel_count > 3" class="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xl">⚠️</span>
        <h3 class="text-base font-bold text-amber-900">提醒</h3>
      </div>
      <p class="text-sm text-amber-800">
        此目標已取消 <strong>{{ task.cancel_count }}</strong> 次
      </p>
      <p v-if="task.last_cancelled_at" class="text-xs text-amber-700 mt-1">
        最後取消時間：{{ formatDateTime(task.last_cancelled_at) }}
      </p>
      <p class="text-xs text-amber-600 mt-2">
        💡 建議調整目標難度或完成率，讓目標更容易堅持
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskProgress } from '@/types'
import { useSkillStore } from '@/stores/skill'
import StatsDashboard from './StatsDashboard.vue'
import MonthlyCalendar from './MonthlyCalendar.vue'
import SkillTags from '@/components/common/SkillTags.vue'

interface Props {
  task: Task
  progress?: TaskProgress
  subtasks: Task[]
  loading?: boolean
}

const props = defineProps<Props>()
const skillStore = useSkillStore()

// 今日子任務
const todaySubtask = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.subtasks.find(st => st.task_date === today)
})

// 今日是否完成
const isTodayCompleted = computed(() => {
  return todaySubtask.value?.status === 'daily_completed'
})

// 今日狀態圖示
const todayStatusIcon = computed(() => {
  if (isTodayCompleted.value) return '✅'
  if (todaySubtask.value?.status === 'daily_in_progress') return '⏳'
  return '📋'
})

// 今日狀態文字
const todayStatusText = computed(() => {
  if (isTodayCompleted.value) return '今日已完成'
  if (todaySubtask.value?.status === 'daily_in_progress') return '今日進行中'
  return '今日待完成'
})

// 今日狀態背景色
const todayStatusBgClass = computed(() => {
  if (isTodayCompleted.value) return 'bg-green-100'
  if (todaySubtask.value?.status === 'daily_in_progress') return 'bg-blue-100'
  return 'bg-gray-100'
})

// 今日狀態文字顏色
const todayStatusTextClass = computed(() => {
  if (isTodayCompleted.value) return 'text-green-700'
  if (todaySubtask.value?.status === 'daily_in_progress') return 'text-blue-700'
  return 'text-gray-700'
})

// 計算總天數（根據重複模式）
const totalDays = computed(() => {
  if (!props.task.start_date || !props.task.end_date) return 0

  const start = new Date(props.task.start_date)
  const end = new Date(props.task.end_date)
  const pattern = props.task.recurrence_pattern || 'daily'

  // 計算總天數（不含重複模式）
  const totalCalendarDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // 根據重複模式計算實際任務天數
  if (pattern === 'daily') {
    // 每日：所有天數都算
    return totalCalendarDays
  } else if (pattern === 'weekdays') {
    // 工作日：只算週一到週五
    let count = 0
    const current = new Date(start)
    while (current <= end) {
      const dayOfWeek = current.getDay() // 0=週日, 1=週一, ..., 6=週六
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  } else if (pattern === 'weekends') {
    // 週末：只算週六和週日
    let count = 0
    const current = new Date(start)
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  } else if (pattern === 'weekly') {
    // 每週：計算有多少個完整週
    return Math.ceil(totalCalendarDays / 7)
  }

  return totalCalendarDays
})

// 計算剩餘天數（根據重複模式）
const remainingDays = computed(() => {
  if (!props.task.end_date) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0) // 重置為當天0點
  const end = new Date(props.task.end_date)
  const pattern = props.task.recurrence_pattern || 'daily'

  // 如果已經過了結束日期
  if (today > end) return 0

  // 計算日曆上的剩餘天數
  const remainingCalendarDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // 根據重複模式計算實際剩餘任務天數
  if (pattern === 'daily') {
    return remainingCalendarDays
  } else if (pattern === 'weekdays') {
    // 工作日：只算週一到週五
    let count = 0
    const current = new Date(today)
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  } else if (pattern === 'weekends') {
    // 週末：只算週六和週日
    let count = 0
    const current = new Date(today)
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  } else if (pattern === 'weekly') {
    // 每週：計算剩餘週數
    return Math.ceil(remainingCalendarDays / 7)
  }

  return remainingCalendarDays
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

// 重複模式文字映射
const getRecurrencePatternText = (pattern?: string) => {
  const map: Record<string, string> = {
    'daily': '每日',
    'weekdays': '工作日（週一至週五）',
    'weekends': '週末（週六至週日）',
    'weekly': '每週'
  }
  return pattern ? (map[pattern] || pattern) : '未設定'
}

// 格式化日期
const formatDate = (date?: Date | string) => {
  if (!date) return '未設定'
  const d = new Date(date)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

// 格式化日期時間
const formatDateTime = (datetime?: Date | string) => {
  if (!datetime) return '未知'
  const d = new Date(datetime)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>