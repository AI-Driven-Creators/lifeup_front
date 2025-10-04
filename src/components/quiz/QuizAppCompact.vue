<template>
  <div class="min-h-screen bg-gray-50 flex flex-col" :class="isMobile ? 'pb-[5.5rem]' : 'pb-10'">
    <div class="jobs-container pt-2 pb-4 flex-1">
      <!-- 點狀進度指示器 -->
      <div v-if="currentStep < steps.length" class="mt-5 mb-6">
        <div class="flex justify-center items-center max-w-2xl mx-auto">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center">
            <!-- 進度點 -->
            <div class="flex flex-col items-center">
              <div
                class="w-4 h-4 rounded-full transition-all duration-300"
                :class="index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'"
              />
              <span class="text-xs text-gray-500 mt-2 text-center hidden sm:block">
                {{ step.name }}
              </span>
            </div>

            <!-- 連接線 -->
            <div
              v-if="index < steps.length - 1"
              class="w-8 h-0.5 mx-2 transition-all duration-300"
              :class="index < currentStep ? 'bg-blue-500' : 'bg-gray-200'"
            />
          </div>
        </div>

        <!-- 手機版簡化顯示 -->
        <div class="text-center mt-4 sm:hidden">
          <span class="text-sm text-gray-600">
            {{ currentStep + 1 }} / {{ steps.length }} - {{ steps[currentStep].name }}
          </span>
        </div>
      </div>

      <!-- Quiz Content -->
      <div v-if="currentStep < steps.length" class="jobs-fade-in">
        <!-- 興趣領域測驗 -->
        <InterestsQuizCompact
          v-if="currentStep === 0"
          @complete="handleStepComplete"
        />

        <!-- 天賦特質測驗 -->
        <TalentsQuizCompact
          v-if="currentStep === 1"
          @complete="handleStepComplete"
        />

        <!-- 價值觀+工作風格測驗 -->
        <ValuesWorkstyleQuizCompact
          v-if="currentStep === 2"
          @complete="handleStepComplete"
        />
      </div>

      <!-- 結果頁面 -->
      <ResultsPageCompact
        v-if="currentStep === steps.length"
        :results="results"
        @reset="resetQuiz"
        class="jobs-fade-in"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
/**
 * 簡化版測驗主應用組件 - 15分鐘版本
 * 保留原版準確性，濃縮為3個核心維度
 */
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import InterestsQuizCompact from './InterestsQuizCompact.vue'
import TalentsQuizCompact from './TalentsQuizCompact.vue'
import ValuesWorkstyleQuizCompact from './ValuesWorkstyleQuizCompact.vue'
import ResultsPageCompact from './ResultsPageCompact.vue'

// Props
interface Props {
  onBack?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  onBack: () => {}
})

// 響應式數據
const currentStep = ref(0)
const results = reactive<Record<string, any>>({})

// 檢測是否為手機版
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640 // sm breakpoint
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 測驗步驟配置 - 簡化為3個步驟
const steps = [
  { name: '興趣探索', component: 'interests' },
  { name: '天賦發現', component: 'talents' },
  { name: '價值匹配', component: 'values-workstyle' }
]

// 處理步驟完成
const handleStepComplete = (stepData: any) => {
  const stepName = steps[currentStep.value].component
  results[stepName] = stepData
  console.log(`Step ${stepName} completed:`, stepData)
  console.log('Current results:', results)

  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  } else {
    // 完成所有測驗，進入結果頁面
    console.log('All steps completed, showing results page')
    console.log('Final results:', results)
    currentStep.value = steps.length
  }
}

// 重置測驗
const resetQuiz = () => {
  currentStep.value = 0
  Object.keys(results).forEach(key => delete results[key])
}
</script>

<style scoped>
.jobs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.jobs-fade-in {
  animation: fade-in 0.5s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>