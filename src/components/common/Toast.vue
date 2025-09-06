<template>
  <div
    v-if="visible"
    class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-lg shadow bg-gray-900 text-white text-sm"
    role="status"
    aria-live="polite"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let hideTimer: number | null = null

function showToast(text: string, duration = 2200) {
  message.value = text
  visible.value = true
  if (hideTimer) {
    clearTimeout(hideTimer)
  }
  hideTimer = window.setTimeout(() => {
    visible.value = false
  }, duration)
}

// 暴露方法供父層呼叫
defineExpose({ showToast })
</script>
