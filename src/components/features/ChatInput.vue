<template>
  <div class="bg-primary-100 border-t border-primary-200 p-4">
    <!-- 任務模式開關 -->
    <div class="mb-3 flex items-center justify-center">
      <label class="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          v-model="isTaskMode"
          @change="$emit('taskModeChange', isTaskMode)"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        >
        <span :class="{ 'text-blue-600 font-medium': isTaskMode, 'text-gray-600': !isTaskMode }">
          {{ isTaskMode ? '🎯 任務創建模式' : '💬 普通對話模式' }}
        </span>
      </label>
    </div>
    
    <div class="flex items-center space-x-2">
      <input
        v-model="inputMessage"
        @keypress.enter="handleSend"
        type="text"
        :placeholder="isTaskMode ? '描述你想創建的任務...' : '輸入訊息'"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
      <button
        @click="handleSend"
        :disabled="!inputMessage.trim()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          !inputMessage.trim() 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : isTaskMode 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
        ]"
      >
        {{ isTaskMode ? '創建任務' : '發送' }}
      </button>
    </div>
    
    <!-- 任務模式提示 -->
    <div v-if="isTaskMode" class="mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
      💡 任務模式：發送後會自動生成任務並顯示預覽，讓你確認是否創建
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
const isTaskMode = ref(false)

const handleSend = () => {
  if (inputMessage.value.trim()) {
    emit('send', inputMessage.value.trim(), isTaskMode.value)
    inputMessage.value = ''
    // 任務模式下發送後自動關閉任務模式
    if (isTaskMode.value) {
      isTaskMode.value = false
      emit('taskModeChange', false)
    }
  }
}
</script>