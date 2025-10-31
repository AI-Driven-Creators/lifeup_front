<template>
  <!-- Modal 職業主線問卷調查界面 -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-6"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col mx-auto">
      <div class="overflow-y-auto flex-1 px-4 py-6 md:px-6 md:py-6 lg:px-8 lg:py-8">

        <!-- 問卷階段 -->
        <div v-if="currentStage === 'survey'">
          <!-- Modal Header with Close Button -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-3">
              <span class="text-blue-600 text-xl">💼</span>
              <h2 class="text-xl font-semibold text-gray-900">職業主線規劃調查</h2>
            </div>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div class="mb-8">
            <p class="text-gray-600">
              你已選擇：<strong class="text-blue-600">{{ selectedCareer }}</strong>
            </p>
            <p class="text-gray-500 text-sm mt-2">
              請填寫以下問卷，AI 將根據你的測驗結果和個人需求為你生成專屬的學習任務。
            </p>
          </div>

          <div class="space-y-8">
            <!-- 當前水平 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                你在此領域的當前水平？
              </h3>
              <div class="space-y-2">
                <label v-for="level in ['完全新手', '有基礎了解', '有一定經驗', '已具專業水準']" :key="level"
                       class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors w-full"
                       :class="surveyAnswers.current_level === level ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="radio"
                         v-model="surveyAnswers.current_level"
                         :value="level"
                         class="sr-only">
                  <span class="text-sm text-gray-700">{{ level }}</span>
                </label>
              </div>
            </div>

            <!-- 可用時間 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                每週可投入多少時間學習？
              </h3>
              <div class="space-y-2">
                <label v-for="time in ['1-3小時', '4-7小時', '8-15小時', '16小時以上']" :key="time"
                       class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors w-full"
                       :class="surveyAnswers.available_time === time ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="radio"
                         v-model="surveyAnswers.available_time"
                         :value="time"
                         class="sr-only">
                  <span class="text-sm text-gray-700">{{ time }}</span>
                </label>
              </div>
            </div>

            <!-- 目標時程 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                你希望在多長時間內達到職業目標？
              </h3>
              <div class="space-y-2">
                <label v-for="timeline in ['3-6個月', '6-12個月', '1-2年', '2年以上']" :key="timeline"
                       class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors w-full"
                       :class="surveyAnswers.timeline === timeline ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="radio"
                         v-model="surveyAnswers.timeline"
                         :value="timeline"
                         class="sr-only">
                  <span class="text-sm text-gray-700">{{ timeline }}</span>
                </label>
              </div>
            </div>

            <!-- 學習方式偏好 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                你偏好的學習方式？（可多選）
              </h3>
              <div class="space-y-2">
                <label v-for="style in ['理論學習', '實作練習', '專案導向', '案例研究', '同儕討論', '導師指導']" :key="style"
                       class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors w-full"
                       :class="surveyAnswers.learning_styles.includes(style) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'">
                  <input type="checkbox"
                         :value="style"
                         @change="toggleLearningStyle(style)"
                         class="sr-only">
                  <span class="text-sm text-gray-700">{{ style }}</span>
                  <span v-if="surveyAnswers.learning_styles.includes(style)" class="ml-auto text-blue-500">✓</span>
                </label>
              </div>
            </div>

            <!-- 學習動機 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                你的主要學習動機是？
              </h3>

              <!-- 快速選項按鈕 -->
              <div class="flex flex-wrap gap-2 mb-3">
                <button
                  v-for="option in motivationOptions"
                  :key="option"
                  type="button"
                  @click="selectMotivationOption(option)"
                  class="px-3 py-1.5 text-sm border border-blue-300 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                >
                  {{ option }}
                </button>
              </div>

              <textarea
                v-model="surveyAnswers.motivation"
                placeholder="點擊上方快速選項或自行輸入..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="4"
              ></textarea>
            </div>

            <!-- 操作按鈕 -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                @click="$emit('close')"
                class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                @click="$emit('generate')"
                :disabled="!isFormValid || loading"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <PhSparkle :size="20" weight="fill" />
                <span v-if="loading">生成中...</span>
                <span v-else>生成專屬主線任務</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 任務生成中階段 -->
        <div v-if="currentStage === 'generating'" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-6"></div>

          <h3 class="text-xl font-semibold text-gray-900 mb-4">AI 正在為你量身打造學習路徑</h3>

          <p class="text-blue-600 font-medium mb-4">
            {{ progressMessage }}
          </p>

          <div class="max-w-md mx-auto mb-4">
            <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                class="bg-blue-600 h-full transition-all duration-500 ease-out rounded-full"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>
            <p class="text-gray-500 text-sm mt-2">{{ progressPercent }}%</p>
          </div>

          <p class="text-gray-600 text-sm mt-6">
            基於你的測驗結果和學習需求，正在生成專屬的職業主線任務...<br/>
            <span class="text-xs text-gray-500">這可能需要 1-2 分鐘，請耐心等候</span>
          </p>

          <div v-if="isTimeout" class="mt-6">
            <button
              @click="$emit('regenerate')"
              class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>生成失敗，點擊重新生成</span>
            </button>
          </div>
        </div>

        <!-- 任務預覽/完成階段 -->
        <div v-if="currentStage === 'preview' || currentStage === 'completed'">
          <div class="mb-8">
            <div class="mb-4">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ currentStage === 'preview' ? '任務預覽' : '職業主線任務已生成' }}
              </h2>
            </div>
            <p class="text-gray-600">
              {{ currentStage === 'preview'
                ? `AI 已根據你的 ${selectedCareer} 職業選擇和個人特質，生成了專屬的學習路徑。請確認後保存到你的任務列表。`
                : `恭喜！你的 ${selectedCareer} 職業主線任務已成功保存。`
              }}
            </p>
          </div>

          <!-- 生成的任務列表 -->
          <div v-if="generatedTasks.length > 0" class="space-y-5 mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">你的專屬任務清單</h3>
              <span class="text-sm text-gray-500">共 {{ generatedTasks.length }} 個任務</span>
            </div>

            <div
              v-for="(task, index) in generatedTasks"
              :key="index"
              class="shadow-sm hover:shadow-md transition-all duration-200 bg-white border border-gray-200 rounded-lg"
            >
              <div class="p-4">
                <!-- 任務標題區 -->
                <div class="flex items-start space-x-3 mb-3">
                  <div class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                       :class="getTaskIconBgColor(task.type)">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ task.title }}</h4>
                  </div>
                </div>

                <!-- 任務內容區 -->
                <div class="ml-10 space-y-3">
                  <!-- 任務描述 -->
                  <div class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {{ cleanText(task.description) }}
                  </div>

                  <!-- 任務統計標籤 -->
                  <div class="flex items-center gap-2 flex-wrap text-xs text-gray-700">
                    <span>{{ getDifficultyStars(task.difficulty) }}</span>
                    <span v-if="task.skill_tags && task.skill_tags.length > 0">
                      {{ getPrimarySkillName(task) }} +{{ task.experience || 0 }}EXP
                    </span>
                    <span v-else>
                      +{{ task.experience || 0 }}EXP
                    </span>
                  </div>

                  <!-- 個性化說明 -->
                  <div v-if="parseTaskDescription(task.description).personality"
                       :class="compactMode
                         ? 'border border-gray-300 p-2.5 rounded text-xs'
                         : 'bg-amber-50 border-l-2 border-amber-400 p-2.5 rounded text-xs'">
                    <div class="flex gap-2">
                      <span v-if="!compactMode" class="text-amber-600">💡</span>
                      <div class="flex-1">
                        <p :class="compactMode ? 'font-medium text-gray-800 mb-0.5' : 'font-medium text-amber-800 mb-0.5'">個性化建議</p>
                        <p :class="compactMode ? 'text-gray-700 leading-relaxed' : 'text-amber-700 leading-relaxed'">
                          {{ parseTaskDescription(task.description).personality }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 推薦資源 -->
                  <div v-if="task.resources && task.resources.length > 0" class="text-xs">
                    <p class="font-medium text-gray-800 mb-1.5">學習資源</p>
                    <div class="space-y-1">
                      <div v-for="(resource, rIdx) in task.resources.slice(0, 3)" :key="rIdx"
                           class="flex gap-1.5">
                        <span class="text-gray-400">•</span>
                        <div class="flex-1">
                          <a v-if="resource.url"
                             :href="ensureProtocol(resource.url)"
                             target="_blank"
                             rel="noopener noreferrer"
                             class="text-blue-600 hover:text-blue-800 hover:underline">
                            {{ resource.title }}
                            <span v-if="resource.platform" class="text-gray-500">({{ resource.platform }})</span>
                          </a>
                          <p v-else class="text-gray-700">{{ resource.title || resource }}</p>
                          <p v-if="resource.description" class="text-gray-600 mt-0.5">
                            {{ resource.description }}
                          </p>
                        </div>
                      </div>
                      <p v-if="task.resources.length > 3" class="text-gray-500 italic ml-3.5">
                        還有 {{ task.resources.length - 3 }} 個資源...
                      </p>
                    </div>
                  </div>

                  <!-- 屬性加成 -->
                  <div v-if="task.attributes && Object.keys(task.attributes).length > 0"
                       class="flex flex-wrap gap-1.5">
                    <div v-for="(value, attr) in task.attributes" :key="attr"
                         class="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      <component :is="getAttributeIcon(attr)" :size="16" class="inline-block flex-shrink-0" v-if="!compactMode" />
                      <span>{{ getAttributeName(attr) }} +{{ value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作按鈕 -->
          <div v-if="currentStage === 'preview'" class="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              @click="console.log('🔘 重新生成按鈕被點擊', { loading, currentStage }); $emit('regenerate')"
              :disabled="loading"
              class="bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              重新生成
            </button>
            <button
              :disabled="loading"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              @click="$emit('accept')"
            >
              <span v-if="loading">保存中...</span>
              <span v-else>創建任務</span>
            </button>
          </div>

          <div v-if="currentStage === 'completed'" class="flex items-center justify-center pt-6 border-t border-gray-200">
            <button
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              @click="$emit('go-to-tasks')"
            >
              開始執行任務
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PhBrain,
  PhFlame,
  PhPalette,
  PhUsers,
  PhCrosshair,
  PhArrowsClockwise,
  PhSparkle
} from '@phosphor-icons/vue'

// Props
interface Props {
  showModal: boolean
  selectedCareer: string
  currentStage: 'survey' | 'generating' | 'preview' | 'completed'
  surveyAnswers: {
    current_level: string
    available_time: string
    timeline: string
    learning_styles: string[]
    motivation: string
  }
  loading: boolean
  progressMessage: string
  progressPercent: number
  isTimeout: boolean
  generatedTasks: any[]
  compactMode?: boolean  // 簡潔模式：移除表情符號、彩色背景和邊框
}

const props = withDefaults(defineProps<Props>(), {
  compactMode: false
})

// Emits
const emit = defineEmits<{
  close: []
  generate: []
  regenerate: []
  accept: []
  'go-to-tasks': []
  'update:surveyAnswers': [value: typeof props.surveyAnswers]
}>()

// 學習動機快速選項
const motivationOptions = [
  '轉換職業跑道',
  '追求個人興趣',
  '提升工作技能',
  '增加職場競爭力',
  '探索新領域',
  '實現人生夢想'
]

// 切換學習方式
const toggleLearningStyle = (style: string) => {
  const styles = [...props.surveyAnswers.learning_styles]
  const index = styles.indexOf(style)
  if (index > -1) {
    styles.splice(index, 1)
  } else {
    styles.push(style)
  }
  emit('update:surveyAnswers', {
    ...props.surveyAnswers,
    learning_styles: styles
  })
}

// 選擇學習動機快速選項
const selectMotivationOption = (option: string) => {
  const currentMotivation = props.surveyAnswers.motivation.trim()
  const newMotivation = currentMotivation ? `${currentMotivation}；${option}` : option
  emit('update:surveyAnswers', {
    ...props.surveyAnswers,
    motivation: newMotivation
  })
}

// 問卷表單驗證
const isFormValid = computed(() => {
  return props.surveyAnswers.current_level &&
         props.surveyAnswers.available_time &&
         props.surveyAnswers.timeline &&
         props.surveyAnswers.learning_styles.length > 0 &&
         props.surveyAnswers.motivation.trim().length > 0
})

// 從簡化版複製的輔助函數
// 解析任務描述的輔助函數
const parseTaskDescription = (description: string) => {
  if (!description) return { main: '', personality: null, resources: [] }

  const parts = description.split(/\n\n/)
  let main = ''
  let personality = null
  let resources: string[] = []

  for (const part of parts) {
    if (part.includes('💡 個性化說明：') || part.includes('個性化說明：')) {
      personality = part.replace(/💡\s*個性化說明：/g, '').trim()
    } else if (part.includes('📚 推薦資源：') || part.includes('推薦資源：')) {
      const resourceText = part.replace(/📚\s*推薦資源：/g, '').trim()
      resources = resourceText.split('\n').filter(r => r.trim())
    } else if (!part.includes('💡') && !part.includes('📚') && part.trim()) {
      main = part.trim()
    }
  }

  return { main, personality, resources }
}

// 獲取屬性的中文名稱
const getAttributeName = (attr: string) => {
  const attributeNames: Record<string, string> = {
    intelligence: '智力',
    endurance: '毅力',
    creativity: '創造力',
    social: '社交力',
    focus: '專注力',
    adaptability: '適應力'
  }
  return attributeNames[attr] || attr
}

// 獲取任務類型標籤
const getTaskTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    main: '主線',
    daily: '每日',
    project: '專案'
  }
  return labels[type] || '任務'
}

// 獲取任務邊框顏色
const getTaskBorderColor = (type: string) => {
  const colors: Record<string, string> = {
    main: 'border-blue-500',
    daily: 'border-green-500',
    project: 'border-purple-500'
  }
  return colors[type] || 'border-gray-300'
}

// 獲取任務圖標背景色
const getTaskIconBgColor = (type: string) => {
  const colors: Record<string, string> = {
    main: 'bg-blue-100 text-blue-700',
    daily: 'bg-green-100 text-green-700',
    project: 'bg-purple-100 text-purple-700'
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

// 獲取任務類型徽章顏色
const getTaskTypeBadgeColor = (type: string) => {
  const colors: Record<string, string> = {
    main: 'bg-blue-100 text-blue-700',
    daily: 'bg-green-100 text-green-700',
    project: 'bg-purple-100 text-purple-700'
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

// 獲取屬性圖標組件
const getAttributeIcon = (attr: string) => {
  const icons: Record<string, any> = {
    intelligence: PhBrain,
    endurance: PhFlame,
    creativity: PhPalette,
    social: PhUsers,
    focus: PhCrosshair,
    adaptability: PhArrowsClockwise
  }
  return icons[attr] || PhBrain
}

// 確保 URL 包含協議前綴
const ensureProtocol = (url: string | null | undefined): string => {
  if (!url) return ''
  // 如果已經有協議前綴，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 否則添加 https:// 前綴
  return `https://${url}`
}

// 根據難度生成星星字串
const getDifficultyStars = (difficulty: number): string => {
  const level = Math.min(Math.max(difficulty || 1, 1), 5)
  return '⭐'.repeat(level)
}

// 獲取主要技能名稱
const getPrimarySkillName = (task: any): string => {
  if (!task.skill_tags || task.skill_tags.length === 0) {
    return '技能'
  }
  // 如果 skill_tags 是物件陣列，取第一個的 name
  if (typeof task.skill_tags[0] === 'object' && task.skill_tags[0].name) {
    return task.skill_tags[0].name
  }
  // 如果是字串陣列，直接取第一個
  return task.skill_tags[0]
}

// 清理文字中的異常字符和亂碼
const cleanText = (text: string): string => {
  if (!text) return ''
  return text
    // 移除錯誤的反斜線加日文字符組合
    .replace(/\\ン/g, '')
    .replace(/\\【/g, '【')
    // 移除單獨的反斜線（但保留正常的換行符）
    .replace(/\\(?![nrt])/g, '')
    .trim()
}
</script>
