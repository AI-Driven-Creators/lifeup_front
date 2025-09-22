<template>
  <div class="bg-primary-100 border-t border-primary-200 p-4">
    <!-- 對話模式選擇 -->
    <div class="mb-3 flex items-center justify-center">
      <select
        v-model="chatMode"
        @change="handleModeChange"
        class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="normal">💬 普通對話模式</option>
        <option value="task">🎯 任務創建模式</option>
      </select>
    </div>
    
    <div class="flex items-center space-x-2">
      <input
        v-model="inputMessage"
        @keypress.enter="handleSend"
        type="text"
        :placeholder="chatMode === 'task' ? '描述你想創建的任務...' : '輸入訊息'"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
      <button
        @click="handleSend"
        :disabled="!inputMessage.trim()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          !inputMessage.trim() 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : chatMode === 'task'
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
        ]"
      >
        {{ chatMode === 'task' ? '創建任務' : '發送' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  disabled?: boolean
}

interface Emits {
  (e: 'send', message: string, isTaskMode: boolean): void
  (e: 'taskModeChange', isTaskMode: boolean): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const inputMessage = ref('')
const chatMode = ref<'normal' | 'task'>('normal')

const handleModeChange = () => {
  const isTaskMode = chatMode.value === 'task'
  emit('taskModeChange', isTaskMode)
}

const handleSend = () => {
  if (inputMessage.value.trim()) {
    const isTaskMode = chatMode.value === 'task'
    emit('send', inputMessage.value.trim(), isTaskMode)
    inputMessage.value = ''
    // 移除自動切換回普通模式的邏輯，讓用戶可以連續創建任務
  }
}
</script>