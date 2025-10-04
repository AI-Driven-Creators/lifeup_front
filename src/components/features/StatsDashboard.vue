<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-xl">📊</span>
      <h3 class="text-base font-bold text-gray-900">進度統計</h3>
    </div>

    <!-- 載入狀態 -->
    <div v-if="!progress" class="py-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
      <p class="text-gray-500 text-sm">載入統計數據中...</p>
    </div>

    <!-- 空狀態 -->
    <div v-else-if="progress.total_days === 0" class="py-8 text-center">
      <div class="text-4xl mb-2">📭</div>
      <p class="text-gray-500 text-sm">暫無統計數據</p>
    </div>

    <!-- 正常顯示 -->
    <template v-else>
      <!-- 完成率環形圖 -->
    <div class="flex items-center justify-center mb-6">
      <div class="relative">
        <!-- SVG 環形圖 -->
        <svg width="160" height="160" class="transform -rotate-90">
          <!-- 背景圓環 -->
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="12"
          />
          <!-- 目標完成率圓環（淡色） -->
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#ddd6fe"
            stroke-width="12"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="targetOffset"
            stroke-linecap="round"
          />
          <!-- 當前完成率圓環 -->
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            :stroke="completionRateColor"
            stroke-width="12"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="currentOffset"
            stroke-linecap="round"
            class="transition-all duration-500"
          />
        </svg>
        <!-- 中心文字 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <div class="text-3xl font-bold" :class="completionRateTextColor">
            {{ Math.round(currentCompletionRate * 100) }}%
          </div>
          <div class="text-xs text-gray-500 mt-1">
            目標 {{ Math.round((progress?.target_rate || 0) * 100) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 統計指標網格 -->
    <div class="grid grid-cols-2 gap-3">
      <!-- 完成天數 -->
      <div class="bg-green-50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-green-700">
          {{ progress?.completed_days || 0 }}
        </div>
        <div class="text-xs text-green-600 mt-1">完成天數</div>
      </div>

      <!-- 缺席天數 -->
      <div class="bg-red-50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-red-700">
          {{ progress?.missed_days || 0 }}
        </div>
        <div class="text-xs text-red-600 mt-1">缺席天數</div>
      </div>

      <!-- 連續完成天數 -->
      <div class="bg-blue-50 rounded-lg p-3 text-center relative">
        <div v-if="consecutiveDays > 0" class="absolute -top-1 -right-1 text-lg">🔥</div>
        <div class="text-2xl font-bold text-blue-700">
          {{ consecutiveDays }}
        </div>
        <div class="text-xs text-blue-600 mt-1">連續天數</div>
      </div>

      <!-- 總天數 -->
      <div class="bg-purple-50 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-purple-700">
          {{ progress?.total_days || 0 }}
        </div>
        <div class="text-xs text-purple-600 mt-1">總天數</div>
      </div>
    </div>

    <!-- 進度提示 -->
    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-700">
        <span class="font-medium">{{ getProgressMessage() }}</span>
      </p>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskProgress } from '@/types'

interface Props {
  task: Task
  progress?: TaskProgress
}

const props = defineProps<Props>()

// 圓環周長
const circumference = computed(() => 2 * Math.PI * 70)

// 當前完成率
const currentCompletionRate = computed(() => props.progress?.completion_rate || 0)

// 目標完成率偏移量
const targetOffset = computed(() => {
  const targetRate = props.progress?.target_rate || 0.8
  return circumference.value * (1 - targetRate)
})

// 當前完成率偏移量
const currentOffset = computed(() => {
  return circumference.value * (1 - currentCompletionRate.value)
})

// 完成率顏色
const completionRateColor = computed(() => {
  const rate = currentCompletionRate.value
  const target = props.progress?.target_rate || 0.8

  if (rate >= target) return '#10b981' // green-500
  if (rate >= target * 0.7) return '#f59e0b' // amber-500
  return '#ef4444' // red-500
})

// 完成率文字顏色
const completionRateTextColor = computed(() => {
  const rate = currentCompletionRate.value
  const target = props.progress?.target_rate || 0.8

  if (rate >= target) return 'text-green-600'
  if (rate >= target * 0.7) return 'text-amber-600'
  return 'text-red-600'
})

// 連續完成天數（從後端獲取）
const consecutiveDays = computed(() => {
  return props.progress?.consecutive_days || 0
})

// 進度提示訊息
const getProgressMessage = () => {
  const rate = currentCompletionRate.value
  const target = props.progress?.target_rate || 0.8
  const completed = props.progress?.completed_days || 0
  const total = props.progress?.total_days || 0
  const remaining = total - completed

  if (rate >= target) {
    return `🎉 太棒了！你已達成目標完成率，繼續保持！`
  } else if (rate >= target * 0.7) {
    return `💪 不錯的進度！再完成 ${Math.ceil((target * total) - completed)} 天即可達標`
  } else if (remaining > 0) {
    return `⚡ 加油！還有 ${remaining} 天可以努力，每一天都很重要`
  } else {
    return `📅 此目標已結束，可以查看最終成果`
  }
}
</script>