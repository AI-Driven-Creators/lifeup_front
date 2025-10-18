<template>
  <div class="bg-primary-100 border-t border-primary-200 p-4">
    <div class="flex items-center space-x-2">
      <input
        v-model="inputMessage"
        @keypress.enter="handleSend"
        type="text"
        placeholder="描述你想創建的任務..."
        :disabled="props.disabled"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
      <button
        @click="handleSend"
        :disabled="props.disabled || !inputMessage.trim()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          (props.disabled || !inputMessage.trim())
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
      >
        創建任務
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

const props = withDefaults(defineProps<Props>(), { disabled: false })
const emit = defineEmits<Emits>()

const inputMessage = ref('')

const handleSend = () => {
  if (inputMessage.value.trim()) {
    // 現在只有任務創建模式
    emit('send', inputMessage.value.trim(), true)
    inputMessage.value = ''
  }
}
</script>