<template>
  <div class="work-style-quiz">
    <!-- 進度指示器 -->
    <div class="progress-container mb-8">
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
        ></div>
      </div>
      <div class="progress-text">
        {{ currentQuestionIndex + 1 }} / {{ questions.length }}
      </div>
    </div>

    <!-- 情境背景卡片 -->
    <div v-if="showScenario && currentQuestion.scenario" class="mb-6">
      <div class="bg-blue-50 rounded-lg border border-blue-200">
        <div class="p-6 pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ currentQuestion.scenario.title || '情境背景' }}
            </h3>
            <button
              @click="showScenario = false"
              class="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm"
            >
              收起
            </button>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-gray-700">
              <strong>背景：</strong>{{ currentQuestion.scenario.context }}
            </p>
            <p class="text-sm text-gray-700">
              <strong>狀況：</strong>{{ currentQuestion.scenario.situation }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 問題內容 -->
    <div class="p-8 select-none">
        <div class="flex items-center justify-between mb-6">
          <div></div>
          <button
            v-if="!showScenario"
            @click="showScenario = true"
            class="text-blue-600 border border-blue-200 px-3 py-1 rounded text-sm flex items-center hover:bg-blue-50"
          >
            <AlertCircle :size="12" class="mr-1" />
            查看情境
          </button>
        </div>
        
        <h3 class="text-lg font-medium text-gray-800 mb-6 leading-relaxed select-none">
          {{ currentQuestion.question }}
        </h3>
        
        <div class="space-y-3">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="cursor-pointer transition-all duration-200 hover:shadow-md select-none hover:bg-gray-50 border border-gray-200 rounded-lg"
            @click="handleOptionSelect(index)"
          >
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-800 select-none">
                    {{ String.fromCharCode(65 + index) }}. {{ option.text }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 情境式工作風格測驗組件 - Jobs極簡版本
 */
import { ref, computed, watch, onMounted } from 'vue'
import { ChevronRight, AlertCircle } from 'lucide-vue-next'
import { 
  scenarioWorkStyleQuestions, 
  calculateScenarioWorkStyleResults
} from '../../data/workstyleScenario'

// Props
interface Props {
  onComplete?: (results: any) => void
  onBack?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  onComplete: () => {},
  onBack: () => {}
})

// Emits
const emit = defineEmits<{
  complete: [results: any]
  back: []
}>()

// 狀態
const currentQuestionIndex = ref(0)
const selectedOption = ref<number | null>(null)
const showScenario = ref(true)
const answers = ref<Array<{questionId: number, optionIndex: number}>>([])

// 問題列表
const questions = ref(scenarioWorkStyleQuestions)

// 當前問題
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// 處理選項選擇
const handleOptionSelect = (optionIndex: number) => {
  selectedOption.value = optionIndex
  
  // 保存答案
  const newAnswers = answers.value.filter(a => a.questionId !== currentQuestion.value.id)
  newAnswers.push({
    questionId: currentQuestion.value.id,
    optionIndex: optionIndex
  })
  answers.value = newAnswers

  // 自動跳到下一題或完成
  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      nextQuestion()
    } else {
      completeQuiz()
    }
  }, 300) // 縮短延遲讓用戶看到選中效果
}

// 下一題
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedOption.value = null
    showScenario.value = false
  }
}


// 完成測驗
const completeQuiz = () => {
  const results = calculateScenarioWorkStyleResults(answers.value)
  emit('complete', results)
}

// 監聽問題變化
watch(currentQuestionIndex, () => {
  // 檢查是否已有該題的答案
  const existingAnswer = answers.value.find(a => a.questionId === currentQuestion.value.id)
  if (existingAnswer) {
    selectedOption.value = existingAnswer.optionIndex
  } else {
    selectedOption.value = null
  }
  // 每次新題目先顯示情境
  showScenario.value = true
})

onMounted(() => {
  // 不需要初始化固定長度數組，使用動態答案數組
})
</script>

<style scoped>
.work-style-quiz {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.progress-container {
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #6b7280;
}
</style> 