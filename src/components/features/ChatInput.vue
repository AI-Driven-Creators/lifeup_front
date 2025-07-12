<template>
  <div class="bg-primary-100 border-t border-primary-200 p-4">
    <div class="flex items-center space-x-2">
      <input
        v-model="inputMessage"
        @keypress.enter="handleSend"
        type="text"
        placeholder="輸入訊息"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
      <button
        @click="handleSend"
        :disabled="!inputMessage.trim()"
        class="btn-primary"
        :class="{ 'opacity-50 cursor-not-allowed': !inputMessage.trim() }"
      >
        發送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Emits {
  (e: 'send', message: string): void
}

const emit = defineEmits<Emits>()
const inputMessage = ref('')

const handleSend = () => {
  if (inputMessage.value.trim()) {
    emit('send', inputMessage.value.trim())
    inputMessage.value = ''
  }
}
</script>