<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center"
    @click.self="handleCancel"
  >
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    
    <!-- 對話框內容 -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 transform transition-all">
      <!-- 標題 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ title }}
        </h3>
      </div>
      
      <!-- 內容 -->
      <div class="px-6 py-4">
        <p class="text-gray-600 whitespace-pre-line">
          {{ message }}
        </p>
      </div>
      
      <!-- 按鈕 -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors',
            danger
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  visible: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '確認',
  message: '您確定要執行此操作嗎？',
  confirmText: '確定',
  cancelText: '取消',
  danger: false
})

const emit = defineEmits<Emits>()

const isVisible = ref(props.visible)

watch(() => props.visible, (newValue) => {
  isVisible.value = newValue
})

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

// 按 ESC 鍵關閉對話框
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isVisible.value) {
    handleCancel()
  }
}

// 監聽鍵盤事件
watch(isVisible, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>