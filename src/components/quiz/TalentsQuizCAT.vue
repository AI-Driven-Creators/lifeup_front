<template>
  <div class="space-y-6">
    <!-- 載入中狀態 -->
    <div v-if="!currentItem" class="flex items-center justify-center min-h-64">
      <div class="text-center">
        <p class="text-gray-600">正在分析你的回答...</p>
      </div>
    </div>

    <!-- 測驗內容 -->
    <div v-else>
      <!-- 測驗說明 -->
      <div class="text-center mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          適性天賦測驗
        </h2>
        <p class="text-gray-600 mb-4">
          透過情境化題目深度分析你的天賦特質
        </p>
        
        <!-- 進度條 -->
        <div class="max-w-2xl mx-auto mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              :class="progressColor"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
        <p class="text-sm text-gray-500">
          第 {{ questionCount }} 題，共70題
        </p>
      </div>

      <!-- 當前題目 -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-8">
          <h3 class="text-lg font-medium text-gray-800 mb-6">
            {{ currentItem.question }}
          </h3>
          
          <div class="space-y-3">
            <button
              v-for="(option, index) in currentItem.options"
              :key="index"
              @click="handleAnswer(option)"
              class="w-full text-left justify-start h-auto p-4 hover:bg-gray-50 hover:border-gray-300 bg-transparent select-none border border-gray-200 rounded-lg transition-colors"
            >
              <span class="text-gray-800 leading-relaxed">
                {{ String.fromCharCode(65 + index) }}. {{ option.text }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 蓋洛普天賦測驗 - CAT版本
 * 基於電腦化適性測驗(Computerized Adaptive Testing)理論
 * 參考Gallup StrengthsFinder的專業設計
 */
import { ref, computed, onMounted } from 'vue'
import { CATEngine, ACTUAL_QUESTIONS, talentItemBank } from '../../data/talentsCAT'

interface QuizItem {
  id: number
  targetTalent: string
  difficulty: number
  discrimination: number
  question: string
  options: { text: string; weight: number }[]
}

// Props
interface Props {
  onComplete?: (results: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  onComplete: () => {}
})

// Emits
const emit = defineEmits<{
  complete: [results: any]
}>()

// 響應式數據
const catEngine = ref(new CATEngine())
const currentItem = ref<QuizItem | null>(null)
const questionCount = ref(0)

// 計算屬性
const progress = computed(() => {
  return (questionCount.value / 70) * 100 // 固定70題
})

const progressColor = computed(() => {
  return 'bg-blue-500'
})

// 載入下一題
const loadNextQuestion = () => {
  const nextItem = catEngine.value.selectNextItem()
  
  if (!nextItem || catEngine.value.canTerminate()) {
    // 測驗結束
    const results = catEngine.value.calculateFinalResults()
    emit('complete', results)
    return
  }

  currentItem.value = nextItem
  questionCount.value++
}

// 處理回答
const handleAnswer = (selectedOption: any) => {
  if (!currentItem.value) return
  
  // 記錄回答
  catEngine.value.recordResponse(currentItem.value, selectedOption)
  
  // 載入下一題
  setTimeout(() => {
    loadNextQuestion()
  }, 300)
}

// 組件掛載時初始化
onMounted(() => {
  // 實際題目統計（開發時用於調試）
  const talentStats = {
    實際測驗題數: 70,
    題目池總數: talentItemBank.length,
    涵蓋天賦: [...new Set(talentItemBank.map(item => item.targetTalent))].length,
    題目分佈: [...new Set(talentItemBank.map(item => item.targetTalent))].reduce((acc: Record<string, number>, talent) => {
      acc[talent] = talentItemBank.filter(item => item.targetTalent === talent).length
      return acc
    }, {})
  }
  
  loadNextQuestion()
})
</script>

<style scoped>
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>