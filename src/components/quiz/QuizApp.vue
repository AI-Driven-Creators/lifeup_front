<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="jobs-container pt-2 pb-4 flex-1">
              <!-- 點狀進度指示器 - 只在測驗階段顯示 -->
        <div v-if="currentStep < steps.length" class="mt-3 mb-6">
          <div class="flex justify-center items-center max-w-2xl mx-auto">
            <div v-for="(step, index) in steps" :key="index" class="flex items-center">
              <!-- 進度點 -->
              <div class="flex flex-col items-center">
                <div 
                  class="w-4 h-4 rounded-full transition-all duration-300"
                  :class="index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'"
                />
                <span class="text-xs text-gray-500 mt-2 text-center hidden sm:block">
                  {{ step.name.replace('測驗', '').replace('報告', '') }}
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
        <!-- 價值觀測驗 -->
        <ValuesQuizTwoStage 
          v-if="currentStep === 0"
          @complete="handleStepComplete"
        />
        
        <!-- 興趣測驗 -->
        <InterestsQuizTwoStage 
          v-if="currentStep === 1"
          @complete="handleStepComplete"
        />
        
        <!-- 天賦測驗 -->
        <TalentsQuizCAT 
          v-if="currentStep === 2"
          @complete="handleStepComplete"
        />
        
        <!-- 工作風格測驗 -->
        <WorkStyleQuizScenarioFixed 
          v-if="currentStep === 3"
          @complete="handleStepComplete"
        />
      </div>
      
      <!-- 結果頁面 - 不使用 jobs-card 容器以獲得更寬的顯示空間 -->
      <ResultsPage 
        v-if="currentStep === steps.length"
        :results="results"
        @reset="resetQuiz"
        class="jobs-fade-in"
      />
    </div>
    
    <!-- Footer -->
    <div v-if="currentStep < steps.length" class="text-center py-4 mt-auto">
      <p class="text-sm text-gray-500">
        請根據真實想法回答，測驗結果僅供參考
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 測驗主應用組件 - CAT增強版
 * 管理整個測驗流程的核心組件，整合CAT適應性測驗技術
 */
import { ref, reactive } from 'vue'
import ValuesQuizTwoStage from './ValuesQuizTwoStage.vue'
import InterestsQuizTwoStage from './InterestsQuizTwoStage.vue'
import TalentsQuizCAT from './TalentsQuizCAT.vue'
import WorkStyleQuizScenarioFixed from './WorkStyleQuizScenarioFixed.vue'
import ResultsPage from './ResultsPage.vue'

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
const workStyleVersion = ref<'scenario' | 'enhanced' | 'basic'>('scenario')

// 測驗步驟配置
const steps = [
  { name: '價值觀測驗', component: 'values' },
  { name: '興趣領域測驗', component: 'interests' },
  { name: '天賦特質測驗', component: 'talents' },
  { name: '工作風格測驗', component: 'workstyle' }
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

// 返回上一步
const handlePrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<style scoped>
.jobs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.jobs-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.jobs-fade-in {
  animation: fade-in 0.5s ease-in-out;
}
</style>