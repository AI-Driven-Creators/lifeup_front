<template>
  <div class="space-y-6">
    <!-- 選擇階段 -->
    <div v-if="stage === 'selection'" class="text-center mt-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        選擇你重視的價值觀
      </h2>
      <p class="text-gray-600 mb-6">
        從以下20個價值觀中選擇3-7個對你最重要的項目
      </p>
      
      <!-- 已選數量提示 -->
      <div class="flex items-center justify-center space-x-4 mb-6">
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="selectedValues.length >= 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'"
        >
          已選 {{ selectedValues.length }} / 7 個
        </span>
        <button 
          v-if="selectedValues.length >= 3"
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
          placeholder="搜尋價值觀..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- 價值觀選項 - 改為一列兩個 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto px-1 mt-6">
        <div
          v-for="value in filteredValues"
          :key="value.id"
          class="cursor-pointer transition-all duration-200 hover:shadow-md select-none border rounded-lg"
          :class="selectedValues.includes(value.id) ? 'bg-blue-50' : 'hover:bg-gray-50'"
          @click="handleValueToggle(value.id)"
        >
          <div class="p-3">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-gray-800 mb-1">{{ value.name }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ value.description }}</p>
              </div>
              <div 
                v-if="selectedValues.includes(value.id)"
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
              @click="handleScenarioChoice(option.values)"
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
 * 價值觀測驗組件 - 兩階段設計
 * 第一階段：從20個價值觀中選擇3-7個重要的項目
 * 第二階段：透過情境題對選中的價值觀進行排序
 */
import { ref, computed } from 'vue'
import { Search, ArrowRight } from 'lucide-vue-next'
import values from '../../data/values'
import generateValuesScenarios from '../../data/valuesScenarios'

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
const selectedValues = ref<string[]>([])
const searchTerm = ref('')
const scenarios = ref<any[]>([])
const currentScenarioIndex = ref(0)
const valueScores = ref<Record<string, number>>({})

// 計算屬性 - 篩選價值觀
const filteredValues = computed(() => {
  return values.filter(value => 
    value.name.includes(searchTerm.value) || 
    value.description.includes(searchTerm.value)
  )
})

// 處理價值觀選擇
const handleValueToggle = (valueId: string) => {
  if (selectedValues.value.includes(valueId)) {
    selectedValues.value = selectedValues.value.filter(id => id !== valueId)
  } else if (selectedValues.value.length < 7) {
    selectedValues.value = [...selectedValues.value, valueId]
  }
}

// 開始排序階段
const startRanking = () => {
  const generatedScenarios = generateValuesScenarios(selectedValues.value)
  scenarios.value = generatedScenarios
  stage.value = 'ranking'
  
  // 初始化分數
  const scores: Record<string, number> = {}
  selectedValues.value.forEach(valueId => {
    scores[valueId] = 0
  })
  valueScores.value = scores
}

// 處理情境選擇
const handleScenarioChoice = (choiceValues: string[]) => {
  const newScores = { ...valueScores.value }
  choiceValues.forEach(valueId => {
    if (newScores[valueId] !== undefined) {
      newScores[valueId]++
    }
  })
  valueScores.value = newScores

  if (currentScenarioIndex.value < scenarios.value.length - 1) {
    currentScenarioIndex.value++
  } else {
    // 完成排序
    const sortedValues = selectedValues.value
      .map(valueId => {
        const value = values.find(v => v.id === valueId)
        return {
          id: valueId,
          name: value?.name || '',
          description: value?.description || '',
          score: newScores[valueId]
        }
      })
      .sort((a, b) => b.score - a.score)
    
    emit('complete', sortedValues)
  }
}

// 獲取價值觀名稱
const getValueName = (valueId: string) => {
  return values.find(v => v.id === valueId)?.name || valueId
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