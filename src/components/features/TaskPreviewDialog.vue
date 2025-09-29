<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative">
      <!-- 標題 -->
      <div class="bg-primary-500 text-white p-4 rounded-t-lg">
        <h2 class="text-xl font-bold">✨ 任務預覽</h2>
      </div>
      
      <!-- 內容 -->
      <div class="p-6 space-y-4">
        <!-- 錯誤訊息 -->
        <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600 font-semibold mb-2">⚠️ 驗證錯誤：</p>
          <ul class="list-disc list-inside text-red-500 text-sm">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
        
        <!-- AI 生成的任務介紹 -->
        <div v-if="taskPreview" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-blue-800 whitespace-pre-wrap">{{ taskPreview }}</p>
        </div>
        
        <!-- 任務詳細資訊 -->
        <div class="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 class="font-semibold text-gray-700 mb-3">📋 任務詳情</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500">標題：</span>
              <span class="font-medium">{{ taskJson?.title }}</span>
            </div>
            
            <div v-if="taskJson?.description">
              <span class="text-gray-500">描述：</span>
              <span class="font-medium">{{ taskJson.description }}</span>
            </div>
            
            <div>
              <span class="text-gray-500">類型：</span>
              <span class="font-medium">{{ getTaskTypeLabel(taskJson?.task_type) }}</span>
            </div>
            
            <div>
              <span class="text-gray-500">優先級：</span>
              <span class="font-medium">{{ getPriorityStars(taskJson?.priority) }}</span>
            </div>
            
            <div>
              <span class="text-gray-500">難度：</span>
              <span class="font-medium">{{ getDifficultyLabel(taskJson?.difficulty) }}</span>
            </div>
            
            <div>
              <span class="text-gray-500">經驗值：</span>
              <span class="font-medium text-green-600">+{{ taskJson?.experience || 10 }} EXP</span>
            </div>
            
            <div v-if="taskJson?.due_date">
              <span class="text-gray-500">截止日期：</span>
              <span class="font-medium">{{ formatDate(taskJson.due_date) }}</span>
            </div>
            
            <div v-if="taskJson?.is_recurring" class="md:col-span-2">
              <span class="text-gray-500">重複模式：</span>
              <span class="font-medium">{{ getRecurrenceLabel(taskJson?.recurrence_pattern) }}</span>
              <div v-if="taskJson?.start_date" class="mt-1">
                <span class="text-gray-500">開始日期：</span>
                <span class="font-medium">{{ formatDate(taskJson.start_date) }}</span>
              </div>
              <div v-if="taskJson?.end_date" class="mt-1">
                <span class="text-gray-500">結束日期：</span>
                <span class="font-medium">{{ formatDate(taskJson.end_date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 操作按鈕 -->
      <div class="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-lg">
        <button
          @click="$emit('cancel')"
          class="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="isConfirming"
        >
          取消
        </button>
        <button
          @click="$emit('edit')"
          class="px-6 py-2 text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="isConfirming"
        >
          編輯任務
        </button>
        <button
          @click="$emit('confirm')"
          class="px-6 py-2 text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="validationErrors.length > 0 || isConfirming"
        >
          <span v-if="isConfirming" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ isConfirming ? '創建中...' : '確認創建' }}</span>
        </button>
      </div>

      <!-- 提交時的遮罩與轉圈動畫 -->
      <div v-if="isConfirming" class="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
        <div class="inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  taskJson: any
  taskPreview: string
  validationErrors: string[]
  isConfirming?: boolean
}

withDefaults(defineProps<Props>(), {
  isConfirming: false
})
defineEmits(['confirm', 'cancel', 'edit'])

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

// 取得任務類型標籤
const getTaskTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'main': '主線任務',
    'side': '副線任務',
    'daily': '日常任務',
    'challenge': '挑戰任務'
  }
  return labels[type] || type || '一般任務'
}

// 取得優先級星星
const getPriorityStars = (priority: number) => {
  const p = priority || 1
  return '⭐'.repeat(Math.min(p + 1, 5))
}

// 取得難度標籤
const getDifficultyLabel = (difficulty: number) => {
  const labels = ['非常簡單', '簡單', '中等', '困難', '非常困難']
  return labels[Math.min(Math.max((difficulty || 1) - 1, 0), 4)]
}

// 取得重複模式標籤
const getRecurrenceLabel = (pattern: string) => {
  const labels: Record<string, string> = {
    'daily': '每天',
    'weekdays': '工作日',
    'weekends': '週末',
    'weekly': '每週'
  }
  return labels[pattern] || pattern || '無'
}
</script>

<style scoped>
/* 為了更好的滾動體驗 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>