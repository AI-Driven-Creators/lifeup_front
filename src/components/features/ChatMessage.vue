<template>
  <div 
    class="flex items-start space-x-3"
    :class="message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''"
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
        {{ message.role === 'coach' ? '小教練' : '小雅' }}
      </div>
      
      <!-- 訊息氣泡 -->
      <div 
        class="rounded-lg px-3 py-2 text-sm"
        :class="message.role === 'coach' 
          ? 'bg-primary-200 text-primary-900' 
          : 'bg-primary-600 text-white'"
      >
        {{ message.content }}
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
import type { ChatMessage } from '@/types'

interface Props {
  message: ChatMessage
}

defineProps<Props>()

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>