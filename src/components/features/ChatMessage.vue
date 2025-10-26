<template>
  <div 
    class="flex items-start space-x-3 transition-opacity duration-700"
    :class="[
      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : '',
      isVisible ? 'opacity-100' : 'opacity-0'
    ]"
  >
    <!-- 頭像 -->
    <div 
      class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      :class="message.role === 'coach' ? 'bg-primary-100' : 'bg-gray-100'"
    >
      <span class="text-sm">{{ message.role === 'coach' ? '🤖' : '👤' }}</span>
    </div>
    
    <!-- 訊息內容 -->
    <div class="flex-1 max-w-xs">
      <!-- 發送者名稱 -->
      <div
        class="text-xs text-gray-500 mb-1"
        :class="message.role === 'user' ? 'text-right' : 'text-left'"
      >
        {{ message.role === 'coach' ? '小教練' : message.role === 'system' ? '系統' : (userName || '我') }}
      </div>
      
      <!-- 訊息氣泡 -->
      <div
        class="rounded-lg px-3 py-2 text-sm markdown-content"
        :class="message.role === 'coach'
          ? 'bg-primary-200 text-primary-900'
          : message.role === 'system'
            ? 'bg-gray-200 text-gray-800'
            : 'bg-primary-600 text-white'"
        v-html="formattedContent"
      ></div>
      
      <!-- 專家選項按鈕 -->
      <div v-if="message.showExpertOptions" class="mt-3 space-y-2">
        <div class="text-sm text-gray-600 mb-2">選擇你需要的幫助：</div>
        <div class="flex flex-wrap gap-2">
                  <button
                    @click="handleExpertOption('analyze')"
                    :disabled="props.isAnalyzing"
                    :class="[
                      'px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                      props.isAnalyzing 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    ]"
                  >
                    📊 分析加強方向
                  </button>
                  <button
                    @click="handleExpertOption('goals')"
                    :disabled="props.isAnalyzing"
                    :class="[
                      'px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                      props.isAnalyzing 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    ]"
                  >
                    🎯 生成明確目標
                  </button>
                  <button
                    @click="handleExpertOption('resources')"
                    :disabled="props.isAnalyzing"
                    :class="[
                      'px-3 py-2 rounded-lg transition-colors text-sm font-medium',
                      props.isAnalyzing 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    ]"
                  >
                    📚 建議學習資源
                  </button>
        </div>
      </div>
      
      <!-- 加強方向選項 -->
      <div v-if="message.showDirections && message.directions" class="mt-3 space-y-2">
        <div class="space-y-2">
          <div
            v-for="(direction, index) in message.directions"
            :key="index"
            class="flex items-start space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            @click="handleDirectionSelect(direction.title)"
          >
            <input
              type="checkbox"
              :id="`direction-${index}`"
              class="mt-1"
              :checked="isDirectionSelected(direction.title)"
            >
            <label :for="`direction-${index}`" class="flex-1 cursor-pointer">
              <div class="font-medium text-gray-900">{{ direction.title }}</div>
              <div class="text-sm text-gray-600">{{ direction.description }}</div>
            </label>
          </div>
        </div>
      </div>

      <!-- 目標選項 -->
      <div v-if="message.showGoals && message.goals" class="mt-3 space-y-2">
        <div class="space-y-2">
          <div
            v-for="(goal, index) in message.goals"
            :key="index"
            class="flex items-start space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            @click="handleGoalSelect(goal.title)"
          >
            <input
              type="checkbox"
              :id="`goal-${index}`"
              class="mt-1"
              :checked="isGoalSelected(goal.title)"
            >
            <label :for="`goal-${index}`" class="flex-1 cursor-pointer">
              <div class="font-medium text-gray-900">{{ goal.title }}</div>
              <div class="text-sm text-gray-600">{{ goal.description }}</div>
            </label>
          </div>
        </div>
      </div>

      <!-- 資源選項 -->
      <div v-if="message.showResources && message.resources" class="mt-3 space-y-2">
        <div class="space-y-2">
          <div
            v-for="(resource, index) in message.resources"
            :key="index"
            class="flex items-start space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            @click="handleResourceSelect(resource.title)"
          >
            <input
              type="checkbox"
              :id="`resource-${index}`"
              class="mt-1"
              :checked="isResourceSelected(resource.title)"
            >
            <label :for="`resource-${index}`" class="flex-1 cursor-pointer">
              <div class="font-medium text-gray-900">{{ resource.title }}</div>
              <div class="text-sm text-gray-600">{{ resource.description }}</div>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 生成任務按鈕 -->
      <div v-if="message.showGenerateButton" class="mt-2">
        <button
          @click="handleGenerateTask"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          🎯 生成任務
        </button>
      </div>
      
      <!-- 時間戳記 -->
      <div 
        class="text-xs text-gray-400 mt-1"
        :class="message.role === 'user' ? 'text-right' : 'text-left'"
      >
        {{ formatTime(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { marked } from 'marked'
import type { ChatMessage } from '@/types'

interface Props {
  message: ChatMessage
  userName?: string
  isAnalyzing?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'dismiss', id: string): void
  (e: 'generateTask'): void
  (e: 'expertOption', option: string): void
  (e: 'directionSelect', title: string): void
  (e: 'goalSelect', title: string): void
  (e: 'resourceSelect', title: string): void
}>()

const isVisible = ref(true)

const handleGenerateTask = () => {
  emit('generateTask')
}

const handleExpertOption = (option: string) => {
  emit('expertOption', option)
}

const handleDirectionSelect = (title: string) => {
  // 先更新本地狀態
  const index = localSelectedDirections.value.indexOf(title)
  if (index > -1) {
    localSelectedDirections.value.splice(index, 1)
  } else {
    localSelectedDirections.value.push(title)
  }
  
  // 然後發送事件給父組件
  emit('directionSelect', title)
}

// 添加本地狀態來追蹤選中的方向、目標和資源
const localSelectedDirections = ref<string[]>([])
const localSelectedGoals = ref<string[]>([])
const localSelectedResources = ref<string[]>([])

const isDirectionSelected = (title: string) => {
  return localSelectedDirections.value.includes(title)
}

const isGoalSelected = (title: string) => {
  return localSelectedGoals.value.includes(title)
}

const isResourceSelected = (title: string) => {
  return localSelectedResources.value.includes(title)
}

const handleGoalSelect = (title: string) => {
  // 先更新本地狀態
  const index = localSelectedGoals.value.indexOf(title)
  if (index > -1) {
    localSelectedGoals.value.splice(index, 1)
  } else {
    localSelectedGoals.value.push(title)
  }

  // 然後發送事件給父組件
  emit('goalSelect', title)
}

const handleResourceSelect = (title: string) => {
  // 先更新本地狀態
  const index = localSelectedResources.value.indexOf(title)
  if (index > -1) {
    localSelectedResources.value.splice(index, 1)
  } else {
    localSelectedResources.value.push(title)
  }

  // 然後發送事件給父組件
  emit('resourceSelect', title)
}

// 監聽父組件傳入的選中狀態
watch(() => props.message.directions, (newDirections) => {
  if (newDirections) {
    // 重置本地狀態
    localSelectedDirections.value = []
  }
}, { immediate: true })

watch(() => props.message.goals, (newGoals) => {
  if (newGoals) {
    // 重置本地狀態
    localSelectedGoals.value = []
  }
}, { immediate: true })

watch(() => props.message.resources, (newResources) => {
  if (newResources) {
    // 重置本地狀態
    localSelectedResources.value = []
  }
}, { immediate: true })

onMounted(() => {
  // 移除自動移除訊息的功能，所有訊息都會保持顯示
})

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 使用 marked 進行 Markdown 格式化
const formattedContent = computed(() => {
  if (!props.message.content) return ''
  return marked(props.message.content) as string
})
</script>

<style scoped>
/* Markdown 標題樣式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  font-weight: 600;
  margin: 0.5em 0 0.3em 0;
  line-height: 1.3;
}

.markdown-content :deep(h1) {
  font-size: 1.3em;
}

.markdown-content :deep(h2) {
  font-size: 1.15em;
}

.markdown-content :deep(h3) {
  font-size: 1.05em;
}

.markdown-content :deep(h4) {
  font-size: 1em;
}

/* 段落樣式 */
.markdown-content :deep(p) {
  margin: 0.5em 0;
  line-height: 1.5;
}

/* 粗體和斜體 */
.markdown-content :deep(strong) {
  font-weight: 600;
}

.markdown-content :deep(em) {
  font-style: italic;
}

/* 列表樣式 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.markdown-content :deep(li) {
  margin: 0.25em 0;
  line-height: 1.5;
}

/* 行內代碼 */
.markdown-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* 代碼塊 */
.markdown-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
  overflow-x: auto;
}

.markdown-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  white-space: pre;
}

/* 引用塊 */
.markdown-content :deep(blockquote) {
  border-left: 3px solid rgba(0, 0, 0, 0.2);
  padding-left: 1em;
  margin: 0.5em 0;
  color: rgba(0, 0, 0, 0.7);
}

/* 水平線 */
.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 1em 0;
}

/* 為白色背景（用戶消息）調整顏色 */
.bg-primary-600 .markdown-content :deep(code),
.bg-primary-600 .markdown-content :deep(pre) {
  background-color: rgba(255, 255, 255, 0.2);
}

.bg-primary-600 .markdown-content :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
}

.bg-primary-600 .markdown-content :deep(hr) {
  border-top-color: rgba(255, 255, 255, 0.2);
}
</style>