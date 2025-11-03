<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- 半透明背景 -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="handleSkip"
        ></div>

        <!-- 歡迎卡片 -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
          <!-- 關閉按鈕 -->
          <button
            @click="handleSkip"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="關閉"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- 圖標 -->
          <div class="flex justify-center mb-4">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span class="text-5xl">{{ icon }}</span>
            </div>
          </div>

          <!-- 標題 -->
          <h2 class="text-2xl font-bold text-gray-900 text-center mb-3">
            {{ title }}
          </h2>

          <!-- 描述 -->
          <p class="text-gray-700 text-center mb-6 leading-relaxed">
            {{ description }}
          </p>

          <!-- 功能亮點 -->
          <div v-if="features && features.length > 0" class="space-y-2 mb-6">
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p class="text-sm text-gray-700">{{ feature }}</p>
            </div>
          </div>

          <!-- 按鈕組 -->
          <div class="flex gap-3">
            <button
              @click="handleSkip"
              class="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium rounded-lg hover:bg-gray-100"
            >
              稍後再看
            </button>
            <button
              @click="handleStartTutorial"
              class="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md"
            >
              開始教學 →
            </button>
          </div>

          <!-- 不再顯示選項 -->
          <div class="mt-4 text-center">
            <label class="inline-flex items-center cursor-pointer">
              <input
                v-model="dontShowAgain"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              >
              <span class="ml-2 text-sm text-gray-600">不再顯示此提示</span>
            </label>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  show: boolean
  title: string
  description: string
  icon?: string
  features?: string[]
}

interface Emits {
  (e: 'start-tutorial'): void
  (e: 'skip'): void
}

const props = withDefaults(defineProps<Props>(), {
  icon: '👋',
  features: () => []
})

const emit = defineEmits<Emits>()

const dontShowAgain = ref(false)

const handleStartTutorial = () => {
  if (dontShowAgain.value) {
    emit('skip')
  }
  emit('start-tutorial')
}

const handleSkip = () => {
  emit('skip')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>
