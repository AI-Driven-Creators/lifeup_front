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
import { ref, computed, onMounted } from 'vue'
import type { ChatMessage } from '@/types'

interface Props {
  message: ChatMessage
  userName?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'dismiss', id: string): void
}>()

const isVisible = ref(true)

onMounted(() => {
  if (props.message.ephemeral) {
    setTimeout(() => {
      isVisible.value = false
      // 等過場動畫結束後從父層移除
      setTimeout(() => emit('dismiss', props.message.id), 800)
    }, 6000)
  }
})

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 簡單的 Markdown 格式化
const formattedContent = computed(() => {
  let content = props.message.content || ''

  // 轉義 HTML 特殊字符
  content = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 粗體 **text** 或 __text__
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  content = content.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // 斜體 *text* 或 _text_
  content = content.replace(/\*(.+?)\*/g, '<em>$1</em>')
  content = content.replace(/_(.+?)_/g, '<em>$1</em>')

  // 行內代碼 `code`
  content = content.replace(/`(.+?)`/g, '<code class="inline-code">$1</code>')

  // 代碼塊 ```code```
  content = content.replace(/```([\s\S]+?)```/g, '<pre class="code-block"><code>$1</code></pre>')

  // 換行
  content = content.replace(/\n/g, '<br>')

  // 列表項 - item
  content = content.replace(/^- (.+)$/gm, '<li>$1</li>')
  content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // 數字列表 1. item
  content = content.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  return content
})
</script>

<style scoped>
.markdown-content :deep(strong) {
  font-weight: 600;
}

.markdown-content :deep(em) {
  font-style: italic;
}

.markdown-content :deep(.inline-code) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(.code-block) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
  overflow-x: auto;
}

.markdown-content :deep(.code-block code) {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  white-space: pre;
}

.markdown-content :deep(ul) {
  margin: 8px 0;
  padding-left: 20px;
}

.markdown-content :deep(li) {
  margin: 4px 0;
}

/* 為白色背景（用戶消息）調整代碼塊顏色 */
.bg-primary-600 .markdown-content :deep(.inline-code),
.bg-primary-600 .markdown-content :deep(.code-block) {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>