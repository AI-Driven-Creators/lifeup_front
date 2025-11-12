<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50">
      <!-- 半透明遮罩 -->
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>

      <!-- 高亮區域 (挖空效果) -->
      <div
        v-if="targetElement"
        class="absolute border-4 border-primary-500 rounded-lg shadow-2xl"
        :style="highlightStyle"
      ></div>

      <!-- 提示氣泡 -->
      <div
        class="absolute bg-white rounded-xl shadow-2xl p-5 max-w-sm"
        :style="tooltipStyle"
      >
        <!-- 箭頭 -->
        <div
          class="absolute w-4 h-4 bg-white transform rotate-45"
          :style="arrowStyle"
        ></div>

        <!-- 內容 -->
        <div class="relative z-10">
          <!-- 圖標和標題 -->
          <div class="flex items-center gap-3 mb-3">
            <span class="text-3xl">{{ icon }}</span>
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
          </div>

          <!-- 描述 -->
          <p class="text-gray-700 text-sm mb-4 leading-relaxed">
            {{ description }}
          </p>

          <!-- 進度指示器 -->
          <div class="flex items-center gap-1 mb-4">
            <div
              v-for="i in totalSteps"
              :key="i"
              class="h-1.5 rounded-full flex-1 transition-all"
              :class="i === currentStep ? 'bg-primary-600' : 'bg-gray-200'"
            ></div>
          </div>

          <!-- 按鈕 -->
          <div class="flex gap-2">
            <button
              v-if="currentStep > 1"
              @click="$emit('prev')"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← 上一步
            </button>
            <div class="flex-1"></div>
            <button
              @click="$emit('skip')"
              class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              跳過
            </button>
            <button
              @click="$emit('next')"
              class="px-6 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {{ currentStep === totalSteps ? '完成' : '下一步' }} →
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  show: boolean
  targetSelector: string // CSS 選擇器，用於定位目標元素
  title: string
  description: string
  icon?: string
  currentStep: number
  totalSteps: number
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

interface Emits {
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'skip'): void
}

const props = withDefaults(defineProps<Props>(), {
  icon: '💡',
  placement: 'bottom'
})

const emit = defineEmits<Emits>()

const targetElement = ref<HTMLElement | null>(null)
const highlightStyle = ref({})
const tooltipStyle = ref({})
const arrowStyle = ref({})

// 更新元素位置
const updatePosition = () => {
  if (!props.show || !props.targetSelector) return

  // 查找目標元素
  targetElement.value = document.querySelector(props.targetSelector)
  if (!targetElement.value) return

  const rect = targetElement.value.getBoundingClientRect()
  const padding = 8 // 高亮框的內邊距

  // 高亮框樣式
  highlightStyle.value = {
    top: `${rect.top - padding}px`,
    left: `${rect.left - padding}px`,
    width: `${rect.width + padding * 2}px`,
    height: `${rect.height + padding * 2}px`,
  }

  // 計算提示框位置
  const tooltipWidth = 384 + 40 // max-w-sm = 24rem = 384px + p-5 左右各 20px
  const tooltipHeight = 200 // 估計高度
  const gap = 20 // 提示框與目標的間距

  let top = 0
  let left = 0
  let arrowTop = '0px'
  let arrowLeft = '0px'

  switch (props.placement) {
    case 'bottom':
      top = rect.bottom + gap
      left = rect.left + rect.width / 2 - tooltipWidth / 2
      arrowTop = '-8px'
      arrowLeft = `${tooltipWidth / 2 - 8}px`
      break
    case 'top':
      top = rect.top - tooltipHeight - gap
      left = rect.left + rect.width / 2 - tooltipWidth / 2
      arrowTop = `${tooltipHeight - 8}px`
      arrowLeft = `${tooltipWidth / 2 - 8}px`
      break
    case 'right':
      top = rect.top + rect.height / 2 - tooltipHeight / 2
      left = rect.right + gap
      arrowTop = `${tooltipHeight / 2 - 8}px`
      arrowLeft = '-8px'
      break
    case 'left':
      top = rect.top + rect.height / 2 - tooltipHeight / 2
      left = rect.left - tooltipWidth - gap
      arrowTop = `${tooltipHeight / 2 - 8}px`
      arrowLeft = `${tooltipWidth - 8}px`
      break
  }

  // 確保提示框不超出視窗
  const margin = 10 // 視窗邊緣留白
  if (left < margin) left = margin
  if (left + tooltipWidth > window.innerWidth - margin) {
    left = Math.max(margin, window.innerWidth - tooltipWidth - margin)
  }
  if (top < margin) top = margin
  if (top + tooltipHeight > window.innerHeight - margin) {
    top = Math.max(margin, window.innerHeight - tooltipHeight - margin)
  }

  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  }

  arrowStyle.value = {
    top: arrowTop,
    left: arrowLeft,
  }
}

// 監聽 show 變化
watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(updatePosition, 100) // 延遲以確保 DOM 已渲染
  }
})

// 監聽目標選擇器變化
watch(() => props.targetSelector, () => {
  if (props.show) {
    setTimeout(updatePosition, 100)
  }
})

// 視窗大小改變時重新計算位置
const handleResize = () => {
  if (props.show) {
    updatePosition()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize)
})
</script>
