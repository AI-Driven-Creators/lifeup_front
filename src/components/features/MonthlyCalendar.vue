<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="text-xl">📅</span>
        <h3 class="text-base font-bold text-gray-900">{{ currentMonthText }}</h3>
      </div>
      <!-- 月份切換按鈕 -->
      <div class="flex gap-2">
        <button
          @click="previousMonth"
          :disabled="!canGoPrevious"
          class="px-2 py-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :class="canGoPrevious ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400'"
          title="上個月"
        >
          ◀
        </button>
        <button
          @click="currentMonth"
          class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          本月
        </button>
        <button
          @click="nextMonth"
          :disabled="!canGoNext"
          class="px-2 py-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :class="canGoNext ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400'"
          title="下個月"
        >
          ▶
        </button>
      </div>
    </div>

    <!-- 星期標題 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="dayName in dayNames"
        :key="dayName"
        class="text-center text-xs font-medium text-gray-500 py-1"
      >
        {{ dayName }}
      </div>
    </div>

    <!-- 月視圖格子 -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="day in monthDays"
        :key="day.date"
        class="aspect-square rounded-lg border-2 flex items-center justify-center transition-all cursor-default text-sm"
        :class="getDayClass(day)"
        :title="getDayTooltip(day)"
      >
        <!-- 日期 -->
        <div class="font-medium" :class="getDayTextClass(day)">
          {{ day.dayNumber }}
        </div>
      </div>
    </div>

    <!-- 圖例說明 -->
    <div class="mt-4 flex flex-wrap gap-3 text-xs">
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
        <span class="text-gray-600">已完成</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
        <span class="text-gray-600">未完成</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
        <span class="text-gray-600">今天</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
        <span class="text-gray-600">未到日期</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Task } from '@/types'

interface Props {
  task: Task
  subtasks: Task[]
}

const props = defineProps<Props>()

interface MonthDay {
  date: string
  dayNumber: number
  isToday: boolean
  isPast: boolean
  isFuture: boolean
  isCurrentMonth: boolean // 是否屬於當前顯示的月份
  isRelevant: boolean // 根據 recurrence_pattern 判斷是否為相關日期
  subtask?: Task
}

const dayNames = ['日', '一', '二', '三', '四', '五', '六']

// 獲取任務的開始和結束日期
const taskStartDate = computed(() => {
  if (!props.task.start_date) return new Date()
  return new Date(props.task.start_date)
})

const taskEndDate = computed(() => {
  if (!props.task.end_date) return new Date()
  return new Date(props.task.end_date)
})

// 當前顯示的月份（預設為任務開始月份）
const displayYear = ref(taskStartDate.value.getFullYear())
const displayMonth = ref(taskStartDate.value.getMonth())

// 當前月份文字
const currentMonthText = computed(() => {
  return `${displayYear.value} 年 ${displayMonth.value + 1} 月`
})

// 檢查是否可以切換到上個月（不能早於任務開始月份）
const canGoPrevious = computed(() => {
  const currentDisplay = new Date(displayYear.value, displayMonth.value, 1)
  const taskStart = new Date(taskStartDate.value.getFullYear(), taskStartDate.value.getMonth(), 1)
  return currentDisplay > taskStart
})

// 檢查是否可以切換到下個月（不能晚於任務結束月份）
const canGoNext = computed(() => {
  const currentDisplay = new Date(displayYear.value, displayMonth.value, 1)
  const taskEnd = new Date(taskEndDate.value.getFullYear(), taskEndDate.value.getMonth(), 1)
  return currentDisplay < taskEnd
})

// 切換到上個月
const previousMonth = () => {
  if (!canGoPrevious.value) return

  if (displayMonth.value === 0) {
    displayMonth.value = 11
    displayYear.value--
  } else {
    displayMonth.value--
  }
}

// 切換到下個月
const nextMonth = () => {
  if (!canGoNext.value) return

  if (displayMonth.value === 11) {
    displayMonth.value = 0
    displayYear.value++
  } else {
    displayMonth.value++
  }
}

// 回到本月（如果本月在任務區間內）
const currentMonth = () => {
  const now = new Date()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()

  // 檢查當前月份是否在任務區間內
  const currentDate = new Date(nowYear, nowMonth, 1)
  const taskStart = new Date(taskStartDate.value.getFullYear(), taskStartDate.value.getMonth(), 1)
  const taskEnd = new Date(taskEndDate.value.getFullYear(), taskEndDate.value.getMonth(), 1)

  if (currentDate >= taskStart && currentDate <= taskEnd) {
    displayYear.value = nowYear
    displayMonth.value = nowMonth
  } else {
    // 如果當前月份不在任務區間內，跳到任務開始月份
    displayYear.value = taskStartDate.value.getFullYear()
    displayMonth.value = taskStartDate.value.getMonth()
  }
}

// 判斷日期是否在重複模式範圍內
const isDateRelevant = (date: Date): boolean => {
  const pattern = props.task.recurrence_pattern
  const dayOfWeek = date.getDay()

  if (!pattern || pattern === 'daily') {
    return true // 每日模式，所有日期都相關
  }

  if (pattern === 'weekdays') {
    // 工作日：週一到週五
    return dayOfWeek >= 1 && dayOfWeek <= 5
  }

  if (pattern === 'weekends') {
    // 週末：週六和週日
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  if (pattern === 'weekly') {
    // 每週一次，這裡簡化處理，只顯示所有日期但標記相關性
    return true
  }

  return true
}

// 計算月視圖的日期數據
const monthDays = computed(() => {
  const days: MonthDay[] = []
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  // 獲取當月第一天和最後一天
  const firstDay = new Date(displayYear.value, displayMonth.value, 1)
  const lastDay = new Date(displayYear.value, displayMonth.value + 1, 0)

  // 獲取當月第一天是星期幾（0 = 週日）
  const firstDayOfWeek = firstDay.getDay()

  // 獲取當月天數
  const daysInMonth = lastDay.getDate()

  // 補充上個月的日期（填滿第一週）
  const prevMonthLastDay = new Date(displayYear.value, displayMonth.value, 0)
  const prevMonthDays = prevMonthLastDay.getDate()

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNumber = prevMonthDays - i
    const date = new Date(displayYear.value, displayMonth.value - 1, dayNumber)
    const dateString = date.toISOString().split('T')[0]

    days.push({
      date: dateString,
      dayNumber,
      isToday: dateString === todayString,
      isPast: date < today && dateString !== todayString,
      isFuture: date > today,
      isCurrentMonth: false,
      isRelevant: isDateRelevant(date),
      subtask: props.subtasks.find(st => st.task_date === dateString)
    })
  }

  // 當月的所有日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(displayYear.value, displayMonth.value, day)
    const dateString = date.toISOString().split('T')[0]

    days.push({
      date: dateString,
      dayNumber: day,
      isToday: dateString === todayString,
      isPast: date < today && dateString !== todayString,
      isFuture: date > today,
      isCurrentMonth: true,
      isRelevant: isDateRelevant(date),
      subtask: props.subtasks.find(st => st.task_date === dateString)
    })
  }

  // 補充下個月的日期（填滿最後一週）
  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(displayYear.value, displayMonth.value + 1, day)
      const dateString = date.toISOString().split('T')[0]

      days.push({
        date: dateString,
        dayNumber: day,
        isToday: dateString === todayString,
        isPast: date < today && dateString !== todayString,
        isFuture: date > today,
        isCurrentMonth: false,
        isRelevant: isDateRelevant(date),
        subtask: props.subtasks.find(st => st.task_date === dateString)
      })
    }
  }

  return days
})

// 獲取日期格子的樣式類別
const getDayClass = (day: MonthDay) => {
  // 不是當前月份的日期，淡化顯示
  if (!day.isCurrentMonth) {
    return 'bg-gray-50 border-gray-200 opacity-30'
  }

  // 不相關的日期，顯示為灰色淡化
  if (!day.isRelevant) {
    return 'bg-gray-50 border-gray-200 opacity-40'
  }

  if (day.isToday) {
    if (day.subtask?.status === 'daily_completed') {
      return 'bg-green-100 border-green-500'
    } else if (day.subtask?.status === 'daily_in_progress') {
      return 'bg-blue-100 border-blue-500'
    } else {
      return 'bg-blue-50 border-blue-400 border-dashed'
    }
  }

  if (day.isFuture) {
    return 'bg-gray-50 border-gray-300'
  }

  if (day.subtask?.status === 'daily_completed') {
    return 'bg-green-100 border-green-500'
  } else if (day.isPast) {
    return 'bg-red-50 border-red-400'
  }

  return 'bg-gray-100 border-gray-300'
}

// 獲取日期文字顏色
const getDayTextClass = (day: MonthDay) => {
  if (!day.isCurrentMonth) return 'text-gray-400'
  if (day.isToday) return 'text-blue-700 font-bold'
  if (day.subtask?.status === 'daily_completed') return 'text-green-700'
  if (day.isPast && !day.subtask && day.isRelevant) return 'text-red-600'
  return 'text-gray-600'
}

// 獲取提示文字
const getDayTooltip = (day: MonthDay) => {
  const dateStr = `${displayMonth.value + 1}/${day.dayNumber}`

  if (!day.isCurrentMonth) {
    return `${dateStr} - 其他月份`
  }

  if (!day.isRelevant) {
    return `${dateStr} - 非任務日`
  }

  if (day.isToday) {
    if (day.subtask?.status === 'daily_completed') {
      return `${dateStr} - 今天已完成`
    } else if (day.subtask?.status === 'daily_in_progress') {
      return `${dateStr} - 今天進行中`
    } else {
      return `${dateStr} - 今天`
    }
  }

  if (day.subtask?.status === 'daily_completed') {
    return `${dateStr} - 已完成`
  } else if (day.isPast) {
    return `${dateStr} - 未完成`
  } else if (day.isFuture) {
    return `${dateStr} - 未到日期`
  }

  return dateStr
}
</script>
