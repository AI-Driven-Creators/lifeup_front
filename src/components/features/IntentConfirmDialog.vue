<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="$emit('cancel')">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
      <!-- 標題區域 -->
      <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <h2 class="text-xl font-bold text-white">🎯 檢測到您的任務意圖</h2>
      </div>

      <!-- 內容區域 -->
      <div class="p-6 space-y-4">
        <!-- AI 分析結果 -->
        <div class="bg-primary-100 border border-primary-300 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 text-2xl">
              {{ intentType === 'detailed_task' ? '📋' : '🎨' }}
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900 mb-1">
                {{ intentType === 'detailed_task' ? '詳細任務描述' : '模糊目標' }}
              </p>
              <p class="text-sm text-gray-600">{{ reasoning }}</p>
              <div class="mt-2 flex items-center gap-2">
                <span class="text-xs text-gray-500">信心度:</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary-600 transition-all duration-500"
                    :style="{ width: `${confidence * 100}%` }"
                  ></div>
                </div>
                <span class="text-xs font-medium text-gray-700">{{ Math.round(confidence * 100) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 詳細任務路徑選項 -->
        <div v-if="intentType === 'detailed_task'" class="space-y-3">
          <p class="text-sm text-gray-700">
            我們檢測到您已經有明確的計劃,您希望:
          </p>
          <button
            @click="$emit('direct-generate')"
            class="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-left flex items-center justify-between group"
          >
            <span class="flex items-center gap-2">
              <span class="text-xl">⚡</span>
              <span>直接生成任務</span>
            </span>
            <span class="text-sm opacity-75">推薦</span>
          </button>
          <button
            @click="$emit('expert-analyze')"
            class="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-left flex items-center gap-2"
          >
            <span class="text-xl">🔍</span>
            <span>讓專家協助分析優化</span>
          </button>
        </div>

        <!-- 模糊目標路徑提示 -->
        <div v-else class="space-y-3">
          <p class="text-sm text-gray-700">
            我們將為您匹配專業領域專家,協助您規劃詳細的學習路徑和任務安排。
          </p>
          <button
            @click="$emit('expert-analyze')"
            class="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all text-left flex items-center gap-2"
          >
            <span class="text-xl">🚀</span>
            <span>開始專家規劃</span>
          </button>
        </div>
      </div>

      <!-- 底部取消按鈕 -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          @click="$emit('cancel')"
          class="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  intentType: 'detailed_task' | 'vague_goal'
  confidence: number
  reasoning: string
  suggestedTaskType?: string | null
}

const props = defineProps<Props>()

interface Emits {
  (e: 'direct-generate'): void
  (e: 'expert-analyze'): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()
</script>
