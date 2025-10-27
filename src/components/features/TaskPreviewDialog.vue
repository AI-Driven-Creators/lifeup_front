<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl relative flex flex-col">
      <!-- 標題 -->
      <div class="bg-primary-500 text-white p-4">
        <h2 class="text-xl font-bold">✨ 任務預覽</h2>
      </div>

      <!-- 內容 -->
      <div class="p-6 space-y-4 overflow-y-auto flex-1">
        <!-- 錯誤訊息 -->
        <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600 font-semibold mb-2">⚠️ 驗證錯誤：</p>
          <ul class="list-disc list-inside text-red-500 text-sm">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
        
        <!-- 任務預覽（支援 Markdown） -->
        <div v-if="taskPreview" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="text-blue-800 prose prose-sm max-w-none markdown-preview" v-html="renderedPreview"></div>
        </div>
        
        <!-- 任務詳細資訊 -->
        <div class="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 class="font-semibold text-gray-700 mb-3">📋 任務詳情</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500">標題：</span>
              <span class="font-medium">{{ taskJson?.title }}</span>
            </div>
            
            <div v-if="taskJson?.description" class="md:col-span-2">
              <span class="text-gray-500 block mb-1">描述：</span>
              <div class="font-medium text-gray-700 prose prose-sm max-w-none task-description-markdown" v-html="renderedDescription"></div>
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

        <!-- 包含子任務的選項 -->
        <div class="bg-blue-50 rounded-lg p-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="includeSubtasks"
              type="checkbox"
              class="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <div>
              <span class="text-base font-medium text-gray-700">包含子任務</span>
              <p class="text-sm text-gray-500">
                自動生成並創建相關的子任務，讓任務更具體易執行
              </p>
              <p v-if="taskJson?.task_plan?.subtasks?.length" class="text-xs text-blue-600 mt-1">
                將生成 {{ taskJson.task_plan.subtasks.length }} 個子任務
              </p>
            </div>
          </label>
        </div>

        <!-- 生成為每日任務的選項 -->
        <div class="bg-amber-50 rounded-lg p-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="includeDailyTask"
              type="checkbox"
              class="w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
            />
            <div>
              <span class="text-base font-medium text-gray-700">生成為每日任務</span>
              <p class="text-sm text-gray-500">
                將此任務轉換為每日習慣任務，適合每天重複執行
              </p>
            </div>
          </label>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
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
          @click="handleConfirm"
          class="px-6 py-2 text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="validationErrors.length > 0 || isConfirming"
        >
          <span v-if="isConfirming" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ getConfirmButtonText() }}</span>
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
import { ref, watch, computed } from 'vue'
import { marked } from 'marked'

interface Props {
  taskJson: any
  taskPreview: string
  validationErrors: string[]
  isConfirming?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isConfirming: false
})

const emit = defineEmits(['confirm', 'cancel', 'edit'])

// 渲染 Markdown 格式的預覽文字
const renderedPreview = computed(() => {
  if (!props.taskPreview) return ''
  return marked(props.taskPreview) as string
})

// 渲染任務描述的 Markdown
const renderedDescription = computed(() => {
  if (!props.taskJson?.description) return ''
  return marked(props.taskJson.description) as string
})

// 是否包含子任務
const includeSubtasks = ref(false)
// 是否生成為每日任務
const includeDailyTask = ref(false)

// 監聽複選框變化
watch(includeSubtasks, (newValue) => {
  console.log('[TaskPreviewDialog] includeSubtasks 變更為:', newValue)
})

watch(includeDailyTask, (newValue) => {
  console.log('[TaskPreviewDialog] includeDailyTask 變更為:', newValue)
})

// 處理確認
const handleConfirm = () => {
  console.log('[TaskPreviewDialog] handleConfirm 被調用')
  console.log('[TaskPreviewDialog] includeSubtasks.value =', includeSubtasks.value)
  console.log('[TaskPreviewDialog] includeDailyTask.value =', includeDailyTask.value)
  emit('confirm', includeSubtasks.value, includeDailyTask.value)
}

// 獲取確認按鈕文字
const getConfirmButtonText = () => {
  if (props.isConfirming) {
    if (includeSubtasks.value && includeDailyTask.value) {
      return '創建每日任務並生成子任務中...'
    } else if (includeDailyTask.value) {
      return '創建每日任務中...'
    } else if (includeSubtasks.value) {
      return '創建任務並生成子任務中...'
    }
    return '創建任務中...'
  }

  if (includeSubtasks.value && includeDailyTask.value) {
    return '創建每日任務並生成子任務'
  } else if (includeDailyTask.value) {
    return '創建每日任務'
  } else if (includeSubtasks.value) {
    return '創建並生成子任務'
  }
  return '確認創建'
}

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
    'challenge': '挑戰任務',
    'career_mainline': '職業主線',
    'career_subtask': '職業學習任務'
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

/* Markdown 預覽樣式 */
.markdown-preview :deep(h2) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #1e40af;
}

.markdown-preview :deep(h3) {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #1e40af;
}

.markdown-preview :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.markdown-preview :deep(ul) {
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  list-style-type: none;
}

.markdown-preview :deep(li) {
  margin-bottom: 0.25rem;
  line-height: 1.6;
}

.markdown-preview :deep(strong) {
  font-weight: 600;
  color: #1e3a8a;
}

.markdown-preview :deep(em) {
  font-style: italic;
}

.markdown-preview :deep(code) {
  background-color: rgba(59, 130, 246, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: monospace;
}

/* 任務描述 Markdown 樣式 */
.task-description-markdown :deep(h1),
.task-description-markdown :deep(h2),
.task-description-markdown :deep(h3),
.task-description-markdown :deep(h4) {
  font-weight: 600;
  margin: 0.5em 0 0.3em 0;
  line-height: 1.3;
  color: #374151;
}

.task-description-markdown :deep(h1) {
  font-size: 1.2em;
}

.task-description-markdown :deep(h2) {
  font-size: 1.1em;
}

.task-description-markdown :deep(h3) {
  font-size: 1em;
}

.task-description-markdown :deep(h4) {
  font-size: 0.95em;
}

.task-description-markdown :deep(p) {
  margin: 0.4em 0;
  line-height: 1.6;
}

.task-description-markdown :deep(ul),
.task-description-markdown :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.task-description-markdown :deep(li) {
  margin: 0.2em 0;
  line-height: 1.6;
}

.task-description-markdown :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.task-description-markdown :deep(em) {
  font-style: italic;
}

.task-description-markdown :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
  font-family: 'Courier New', monospace;
  color: #1f2937;
}

.task-description-markdown :deep(pre) {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin: 0.5em 0;
  overflow-x: auto;
}

.task-description-markdown :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.task-description-markdown :deep(blockquote) {
  border-left: 3px solid #d1d5db;
  padding-left: 1em;
  margin: 0.5em 0;
  color: #6b7280;
}

.task-description-markdown :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1em 0;
}
</style>