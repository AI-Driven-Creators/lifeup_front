<template>
  <div class="space-y-6">
    <!-- 選擇階段 -->
    <div v-if="stage === 'selection'" class="text-center mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        選擇你感興趣的領域
      </h2>
      <p class="text-gray-600 mb-6">
        從以下興趣領域中選擇3-7個你最感興趣的項目
      </p>
      
      <!-- 已選數量提示 -->
      <div class="flex items-center justify-center space-x-4 mb-6">
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="selectedInterests.length >= 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'"
        >
          已選 {{ selectedInterests.length }} / 7 個
        </span>
        <button 
          v-if="selectedInterests.length >= 3"
          @click="startRanking"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          開始排序
          <ArrowRight class="ml-2 h-4 w-4" />
        </button>
      </div>

      <!-- 搜尋框 -->
      <div class="relative max-w-2xl mx-auto">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          v-model="searchTerm"
          placeholder="搜尋興趣領域..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- 興趣領域選項 - 改為一列兩個 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto px-1 mt-6">
        <div
          v-for="interest in filteredInterests"
          :key="interest.id"
          class="cursor-pointer transition-all duration-200 hover:shadow-md select-none border rounded-lg"
          :class="selectedInterests.includes(interest.id) ? 'bg-blue-50' : 'hover:bg-gray-50'"
          @click="handleInterestToggle(interest.id)"
        >
          <div class="p-3">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-gray-800 mb-1">{{ interest.name }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ interest.description }}</p>
              </div>
              <div 
                v-if="selectedInterests.includes(interest.id)"
                class="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ml-2 flex-shrink-0 mt-1"
              >
                <div class="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 排序階段 -->
    <div v-if="stage === 'ranking'">
      <div class="text-center mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          情境選擇
        </h2>
        <p class="text-gray-600 mb-4">
          請根據以下情境，選擇你會做出的選擇
        </p>
        
        <!-- 進度條 -->
        <div class="max-w-2xl mx-auto mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%` }"
            />
          </div>
        </div>
        <p class="text-sm text-gray-500">
          第 {{ currentScenarioIndex + 1 }} 題，共 {{ scenarios.length }} 題
        </p>
      </div>

      <!-- 情境題 -->
      <div v-if="scenarios[currentScenarioIndex]" class="bg-white rounded-lg shadow-sm border">
        <div class="p-8">
          <h3 class="text-lg font-medium text-gray-800 mb-6">
            {{ scenarios[currentScenarioIndex].question }}
          </h3>
          
          <div class="space-y-3">
            <button
              v-for="(option, index) in scenarios[currentScenarioIndex].options"
              :key="index"
              @click="handleScenarioChoice(option.interests)"
              class="w-full text-left justify-start h-auto p-4 hover:bg-gray-50 hover:border-gray-300 bg-transparent select-none border border-gray-200 rounded-lg transition-colors"
            >
              <div class="font-medium text-gray-800">
                {{ option.text }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 興趣領域測驗組件 - 兩階段設計
 * 第一階段：從興趣領域中選擇3-7個感興趣的項目
 * 第二階段：透過情境題對選中的興趣領域進行排序
 */
import { ref, computed } from 'vue'
import { Search, ArrowRight } from 'lucide-vue-next'
import { interests } from '../../data/interests'
import { generateInterestsScenarios } from '../../data/interestsScenarios'

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
const stage = ref<'selection' | 'ranking'>('selection')
const selectedInterests = ref<string[]>([])
const searchTerm = ref('')
const scenarios = ref<any[]>([])
const currentScenarioIndex = ref(0)
const interestScores = ref<Record<string, number>>({})

// 計算屬性 - 篩選興趣領域
const filteredInterests = computed(() => {
  return interests.filter(interest => 
    interest.name.includes(searchTerm.value) || 
    interest.description.includes(searchTerm.value)
  )
})

// 處理興趣領域選擇
const handleInterestToggle = (interestId: string) => {
  if (selectedInterests.value.includes(interestId)) {
    selectedInterests.value = selectedInterests.value.filter(id => id !== interestId)
  } else if (selectedInterests.value.length < 7) {
    selectedInterests.value = [...selectedInterests.value, interestId]
  }
}

// 開始排序階段
const startRanking = () => {
  const generatedScenarios = generateInterestsScenarios(selectedInterests.value)
  scenarios.value = generatedScenarios
  stage.value = 'ranking'
  
  // 初始化分數
  const scores: Record<string, number> = {}
  selectedInterests.value.forEach(interestId => {
    scores[interestId] = 0
  })
  interestScores.value = scores
}

// 處理情境選擇
const handleScenarioChoice = (choiceInterests: string[]) => {
  const newScores = { ...interestScores.value }
  choiceInterests.forEach(interestId => {
    if (newScores[interestId] !== undefined) {
      newScores[interestId]++
    }
  })
  interestScores.value = newScores

  if (currentScenarioIndex.value < scenarios.value.length - 1) {
    currentScenarioIndex.value++
  } else {
    // 完成排序
    const sortedInterests = selectedInterests.value
      .map(interestId => {
        const interest = interests.find(i => i.id === interestId)
        return {
          id: interestId,
          name: interest?.name || '',
          description: interest?.description || '',
          score: newScores[interestId]
        }
      })
      .sort((a, b) => b.score - a.score)
    
    emit('complete', sortedInterests)
  }
}

// 獲取興趣領域名稱
const getInterestName = (interestId: string) => {
  return interests.find(i => i.id === interestId)?.name || interestId
}
</script>

<style scoped>
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 