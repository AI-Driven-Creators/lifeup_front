<template>
  <div>
    <!-- 重新測驗按鈕 - 固定在頁面右上角 -->
    <div class="absolute top-6 right-6 z-10">
      <button
        @click="$emit('reset')"
        class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-lg shadow-gray-200/50 flex items-center space-x-2 transition-colors"
      >
        <span>🔄</span>
        <span>重新測驗</span>
      </button>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8 pb-20 space-y-12">
      <!-- 標題區域 -->
      <div class="text-center pt-16">
        <h1 class="text-3xl font-semibold text-gray-800 mb-4">
          你的天職分析報告
        </h1>
        <p class="text-gray-600">
          基於你的價值觀、興趣和天賦的綜合分析結果
        </p>
      </div>

      <!-- 分隔線 -->
      <div class="border-t border-gray-200"></div>

      <!-- 個人特質分析 -->
      <div>
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-blue-900 mb-2">你是誰？—— 個人特質分析</h2>
          <p class="text-sm text-blue-600">
            基於測驗結果為你描繪的個人畫像
          </p>
        </div>

        <p class="text-gray-800 leading-relaxed mb-6">
          {{ generatePersonalDescription() }}
        </p>

        <!-- 特質標籤 -->
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-3">核心標籤</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="value in topValues.slice(0, 2)"
              :key="value.value"
              class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ formatValueName(value.value) }}
            </span>
            <span
              v-for="interest in topInterests.slice(0, 2)"
              :key="interest.category"
              class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ formatInterestName(interest.category) }}
            </span>
            <span
              v-for="talent in topTalents.slice(0, 2)"
              :key="talent.talent"
              class="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ formatTalentName(talent.talent) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 分隔線 -->
      <div class="border-t border-gray-200"></div>

      <!-- 價值觀區域 -->
      <div>
        <div class="flex items-center space-x-3 mb-4">
          <span class="text-blue-600 text-xl">❤️</span>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">你的核心價值觀</h2>
            <p class="text-gray-500 text-sm">
              這些是對你最重要的人生價值和原則
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(value, index) in topValues.slice(0, 5)"
            :key="value.value"
            class="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0"
          >
            <div class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium mt-1 min-w-[24px] text-center">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-800">{{ formatValueName(value.value) }}</h3>
              <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ getValueDescription(value.value) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔線 -->
      <div class="border-t border-gray-200"></div>

      <!-- 興趣領域區域 -->
      <div>
        <div class="flex items-center space-x-3 mb-4">
          <span class="text-emerald-600 text-xl">📖</span>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">你的興趣領域</h2>
            <p class="text-gray-500 text-sm">
              這些是你感興趣且願意投入時間的領域
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(interest, index) in topInterests.slice(0, 5)"
            :key="interest.category"
            class="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0"
          >
            <div class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-sm font-medium mt-1 min-w-[24px] text-center">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-800">{{ formatInterestName(interest.category) }}</h3>
              <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ getInterestDescription(interest.category) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔線 -->
      <div class="border-t border-gray-200"></div>

      <!-- 天賦區域 -->
      <div>
        <div class="flex items-center space-x-3 mb-4">
          <span class="text-violet-600 text-xl">🧠</span>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">你的天賦特質</h2>
            <p class="text-gray-500 text-sm">這些是你天生具備的能力優勢</p>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(talent, index) in topTalents.slice(0, 5)"
            :key="talent.talent"
            class="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0"
          >
            <div class="bg-violet-100 text-violet-700 px-2 py-1 rounded text-sm font-medium mt-1 min-w-[24px] text-center">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 flex items-center justify-between">
                {{ formatTalentName(talent.talent) }}
                <span class="text-xs text-violet-600 font-normal">{{ talent.score }}</span>
              </h3>
              <p class="text-sm text-gray-600 mt-1 leading-relaxed">{{ getTalentDescription(talent.talent) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 分隔線 -->
      <div class="border-t border-gray-200"></div>

      <!-- Career Suggestions -->
      <div>
        <div class="flex items-center space-x-3 mb-4">
          <span class="text-green-600 text-xl">💼</span>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">適合你的職業建議</h2>
            <div class="text-gray-600 text-sm leading-relaxed">
              <span class="text-sm font-semibold text-gray-700">天職 = 價值觀 ∩ 興趣 ∩ 天賦</span><br/>
              基於三維測驗結果的精準職業匹配分析
            </div>
          </div>
        </div>

        <!-- 完美匹配職業 -->
        <div v-if="perfectMatches.length > 0" class="mb-10">
          <div class="flex items-center space-x-2 mb-6">
            <span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">完美匹配</span>
            <span class="text-gray-500 text-sm">— 高度推薦，值得深入探索</span>
          </div>

          <div class="space-y-6">
            <div
              v-for="career in perfectMatches.slice(0, 2)"
              :key="career.name"
              class="border-l-4 border-green-500 pl-6 py-4"
            >
              <!-- 職業標題 -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ career.name }}</h3>
                  <p class="text-gray-600 mt-1 text-sm">{{ career.description }}</p>
                </div>
                <div class="text-right ml-4">
                  <div class="text-xs text-green-600 font-medium">匹配度</div>
                  <div class="text-xl font-bold text-green-600">{{ career.matchPercentage }}%</div>
                </div>
              </div>

              <!-- 推薦理由 -->
              <div class="mb-4">
                <h4 class="text-sm font-medium text-green-700 mb-2 flex items-center">
                  <span class="mr-2">📈</span>
                  推薦理由
                </h4>
                <p class="text-sm text-gray-700 leading-relaxed pl-6">{{ career.reasonText }}</p>
              </div>

              <!-- 職業選擇按鈕 -->
              <div class="pl-6">
                <button
                  @click="selectCareer(career)"
                  class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm inline-flex items-center space-x-2"
                >
                  <span>🎯</span>
                  <span>選擇此職業並開始規劃</span>
                </button>
              </div>

              <!-- 分隔線 (除了最後一個) -->
              <div v-if="perfectMatches.indexOf(career) < perfectMatches.slice(0, 2).length - 1"
                   class="border-b border-gray-100 mt-6 -ml-6"></div>
            </div>
          </div>
        </div>

        <!-- 優秀匹配職業 -->
        <div v-if="excellentMatches.length > 0" class="mb-10">
          <div class="flex items-center space-x-2 mb-6">
            <span class="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">優秀匹配</span>
            <span class="text-gray-500 text-sm">— 很適合你，值得考慮</span>
          </div>

          <div class="space-y-6">
            <div
              v-for="career in excellentMatches.slice(0, 2)"
              :key="career.name"
              class="border-l-4 border-purple-500 pl-6 py-4"
            >
              <!-- 職業標題 -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ career.name }}</h3>
                  <p class="text-gray-600 text-sm mt-1">{{ career.description }}</p>
                </div>
                <div class="text-right ml-4">
                  <div class="text-xs text-purple-600 font-medium">匹配度</div>
                  <div class="text-xl font-bold text-purple-600">{{ career.matchPercentage }}%</div>
                </div>
              </div>

              <!-- 推薦理由 -->
              <div class="mb-4">
                <h4 class="text-sm font-medium text-purple-700 mb-2 flex items-center">
                  <span class="mr-2">📈</span>
                  推薦理由
                </h4>
                <p class="text-sm text-gray-700 leading-relaxed pl-6">{{ career.reasonText }}</p>
              </div>

              <!-- 職業選擇按鈕 -->
              <div class="pl-6">
                <button
                  @click="selectCareer(career)"
                  class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm inline-flex items-center space-x-2"
                >
                  <span>🎯</span>
                  <span>選擇此職業並開始規劃</span>
                </button>
              </div>

              <!-- 分隔線 (除了最後一個) -->
              <div v-if="excellentMatches.indexOf(career) < excellentMatches.slice(0, 2).length - 1"
                   class="border-b border-gray-100 mt-6 -ml-6"></div>
            </div>
          </div>
        </div>

        <!-- 良好匹配職業 -->
        <div v-if="goodMatches.length > 0">
          <div class="flex items-center space-x-2 mb-6">
            <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">良好匹配</span>
            <span class="text-gray-500 text-sm">— 可以考慮的選項</span>
          </div>

          <div class="space-y-4">
            <div
              v-for="career in goodMatches.slice(0, 4)"
              :key="career.name"
              class="border-l-4 border-blue-300 pl-6 py-3"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <h3 class="text-md font-semibold text-gray-900">{{ career.name }}</h3>
                  <p class="text-gray-600 text-sm mt-1">{{ career.description }}</p>
                </div>
                <div class="text-right ml-4">
                  <span class="text-blue-600 font-medium text-sm">{{ career.matchPercentage }}%</span>
                </div>
              </div>
              <div class="pl-6">
                <button
                  @click="selectCareer(career)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors text-sm inline-flex items-center space-x-1"
                >
                  <span>🎯</span>
                  <span>選擇此職業</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 探索建議 -->
        <div v-if="perfectMatches.length === 0 && excellentMatches.length === 0 && goodMatches.length === 0" class="py-6 border-t border-gray-100">
          <div class="flex items-start space-x-3">
            <span class="text-2xl">🔍</span>
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">繼續探索你的可能性</h3>
              <p class="text-gray-600 mb-4">基於目前的測驗結果，建議你：</p>
              <ul class="text-gray-600 space-y-2 text-sm">
                <li>• 多參與不同領域的活動和課程</li>
                <li>• 透過實習體驗不同工作領域</li>
                <li>• 考慮跨領域或新興職業發展</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 職業主線問卷調查界面 -->
    <CareerSurveyModal
      :show-modal="showSurveyModal"
      :selected-career="selectedCareer"
      :current-stage="currentStage"
      v-model:survey-answers="surveyAnswers"
      :loading="loading"
      :progress-message="progressMessage"
      :progress-percent="progressPercent"
      :is-timeout="isTimeout"
      :generated-tasks="generatedTasks"
      :compact-mode="true"
      @close="closeSurveyModal"
      @generate="generateTasks"
      @regenerate="handleRegenerate"
      @accept="acceptTasks"
      @go-to-tasks="goToTasks"
    />

    <!-- 說明文字 (只在結果階段顯示) -->
    <div v-if="currentStage === 'results'" class="text-center text-sm text-gray-500 py-8 max-w-4xl mx-auto px-4">
      <p>⏰ 測驗完成時間約15分鐘 | 結果供參考，建議搭配實際體驗驗證</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { CAREER_DATABASE } from '../../data/careerDatabase.js'
import CareerSurveyModal from './CareerSurveyModal.vue'

// 簡化版職業資料庫
const CAREER_DATABASE_SIMPLE = {
  'frontend_developer': {
    name: '前端工程師',
    description: '負責網站和應用程式的使用者介面開發，讓網頁變得美觀好用',
    matchInterests: ['technology', 'creative'],
    matchTalents: ['technical', 'creative', 'problem_solving'],
    matchValues: ['creativity', 'learning_growth', 'achievement'],
    salary: '50,000 - 80,000',
    growth: '★★★★★',
    nextSteps: [
      '學習 HTML、CSS、JavaScript 基礎',
      '熟悉 React 或 Vue.js 框架',
      '建立個人作品集網站',
      '參與開源專案或實習'
    ]
  },
  'ui_designer': {
    name: 'UI/UX 設計師',
    description: '設計網站和 App 的介面，讓使用者有良好的使用體驗',
    matchInterests: ['creative', 'technology'],
    matchTalents: ['creative', 'detail_oriented', 'analytical'],
    matchValues: ['creativity', 'achievement', 'helping_others'],
    salary: '45,000 - 70,000',
    growth: '★★★★☆',
    nextSteps: [
      '學習 Figma、Sketch 設計軟體',
      '了解使用者體驗設計原則',
      '建立設計作品集',
      '練習使用者研究方法'
    ]
  },
  'marketing_specialist': {
    name: '行銷企劃',
    description: '規劃宣傳活動，讓更多人知道產品和服務',
    matchInterests: ['business', 'creative'],
    matchTalents: ['interpersonal', 'creative', 'analytical'],
    matchValues: ['achievement', 'creativity', 'helping_others'],
    salary: '40,000 - 65,000',
    growth: '★★★★☆',
    nextSteps: [
      '學習社群媒體行銷',
      '了解市場分析方法',
      '練習文案寫作技巧',
      '參與行銷活動企劃'
    ]
  },
  'social_worker': {
    name: '社工師',
    description: '幫助需要協助的人和家庭，解決生活中的困難',
    matchInterests: ['social_service', 'healthcare'],
    matchTalents: ['interpersonal', 'helping_others', 'problem_solving'],
    matchValues: ['helping_others', 'teamwork', 'security'],
    salary: '35,000 - 55,000',
    growth: '★★★☆☆',
    nextSteps: [
      '考取社工師證照',
      '了解社會福利制度',
      '學習諮商技巧',
      '到相關機構實習'
    ]
  },
  'teacher': {
    name: '老師',
    description: '教導學生知識，幫助他們成長學習',
    matchInterests: ['education', 'social_service'],
    matchTalents: ['interpersonal', 'leadership', 'learning'],
    matchValues: ['helping_others', 'learning_growth', 'security'],
    salary: '45,000 - 70,000',
    growth: '★★★☆☆',
    nextSteps: [
      '考取教師證',
      '準備教師甄試',
      '學習教學技巧',
      '到學校實習'
    ]
  },
  'data_analyst': {
    name: '資料分析師',
    description: '分析數據找出有用的資訊，幫助公司做決策',
    matchInterests: ['technology', 'research'],
    matchTalents: ['analytical', 'detail_oriented', 'problem_solving'],
    matchValues: ['learning_growth', 'achievement', 'autonomy'],
    salary: '50,000 - 85,000',
    growth: '★★★★★',
    nextSteps: [
      '學習 Excel、SQL 資料處理',
      '熟悉 Python 或 R 程式語言',
      '了解統計分析方法',
      '建立資料分析作品集'
    ]
  }
}

// Props
interface Props {
  results: {
    interests?: any
    talents?: any
    'values-workstyle'?: any
  }
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  reset: []
}>()

const router = useRouter()
const userStore = useUserStore()

// 響應式數據
const recommendedCareers = ref<any[]>([])
const perfectMatches = ref<any[]>([])
const excellentMatches = ref<any[]>([])
const goodMatches = ref<any[]>([])

// 職業主線相關狀態
const currentStage = ref<'results' | 'survey' | 'generating' | 'completed'>('results')
const selectedCareer = ref('')
const quizResultId = ref('')
const showSurveyModal = ref(false)
const surveyAnswers = ref({
  current_level: '',
  available_time: '',
  timeline: '',
  learning_styles: [] as string[],
  motivation: '',
  special_requirements: ''
})

// 學習動機快速選項
const motivationOptions = ref([
  '轉換職業跑道',
  '追求個人興趣',
  '提升工作技能',
  '增加職場競爭力',
  '探索新領域',
  '實現人生夢想'
])

const generatedTasks = ref([])
const previewData = ref(null) // 儲存預覽數據
const loading = ref(false)
const progressMessage = ref('初始化任務生成系統...')
const progressPercent = ref(0)

// 超時檢測相關狀態
const generationStartTime = ref<number | null>(null)
const isTimeout = ref(false)
const TIMEOUT_DURATION = 5 * 60 * 1000 // 5 分鐘（毫秒）

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

// 計算屬性
const topInterests = computed(() => {
  return props.results.interests?.interests?.slice(0, 3) || []
})

const topTalents = computed(() => {
  return props.results.talents?.talents?.slice(0, 3) || []
})

const topValues = computed(() => {
  return props.results['values-workstyle']?.values?.slice(0, 3) || []
})

const maxInterestScore = computed(() => {
  const max = Math.max(...(props.results.interests?.interests?.map((i: any) => i.score) || [1]))
  return max > 0 ? max : 1
})

const maxTalentScore = computed(() => {
  const max = Math.max(...(props.results.talents?.talents?.map((t: any) => t.score) || [1]))
  return max > 0 ? max : 1
})

const maxValueScore = computed(() => {
  const max = Math.max(...(props.results['values-workstyle']?.values?.map((v: any) => v.score) || [1]))
  return max > 0 ? max : 1
})

// 個人描述生成
const generatePersonalDescription = () => {
  const topInterest = topInterests.value[0]?.category
  const topTalent = topTalents.value[0]?.talent
  const topValue = topValues.value[0]?.value

  let description = '根據你的測驗結果分析，'

  if (topValue) {
    description += `你是一個重視${formatValueName(topValue)}的人，`
  }

  if (topInterest) {
    description += `對${formatInterestName(topInterest)}領域特別有興趣，`
  }

  if (topTalent) {
    description += `具備出色的${formatTalentName(topTalent)}能力。`
  }

  description += '這樣的特質組合讓你在追求有意義的工作時，能夠發揮自己的優勢，創造獨特的價值。'

  return description
}

// 描述函數
const getValueDescription = (value: string) => {
  const descriptions: Record<string, string> = {
    achievement: '追求卓越成果，渴望在工作中獲得成就感',
    autonomy: '重視獨立自主，希望能自由決定工作方式',
    security: '追求穩定保障，偏好可預測的工作環境',
    helping_others: '熱衷助人服務，希望工作能對他人產生正面影響',
    creativity: '重視創意表達，喜歡在工作中發揮創造力',
    work_life_balance: '追求工作與生活的平衡，重視個人時間',
    leadership: '具備領導潛質，希望能影響和帶領他人',
    learning_growth: '渴望持續學習成長，追求自我提升',
    teamwork: '重視團隊合作，享受與他人協作的過程',
    flexibility: '喜歡彈性自由，適應變化和多元挑戰'
  }
  return descriptions[value] || '這是你重視的價值觀之一'
}

const getInterestDescription = (interest: string) => {
  const descriptions: Record<string, string> = {
    technology: '對科技創新充滿熱忱，喜歡探索新技術',
    creative: '具有藝術天分，喜歡創意表達和美學追求',
    business: '對商業經營有興趣，關注市場動態和商機',
    healthcare: '關心健康照護，希望能幫助他人維持健康',
    education: '熱愛教育培訓，享受知識傳遞的過程',
    social_service: '關心社會議題，希望為社會做出貢獻',
    research: '喜歡深入研究，對知識探索充滿好奇',
    manual_skills: '擅長實際操作，喜歡動手解決問題'
  }
  return descriptions[interest] || '這是你感興趣的領域之一'
}

const getTalentDescription = (talent: string) => {
  const descriptions: Record<string, string> = {
    analytical: '具備優秀的邏輯分析能力，能深入思考複雜問題',
    creative: '擁有創新思維，能提出獨特的解決方案',
    interpersonal: '具備良好的人際溝通技巧，容易與他人建立關係',
    leadership: '天生的領導特質，能有效影響和激勵他人',
    detail_oriented: '注重細節完美，確保工作品質的準確性',
    technical: '技術操作能力強，能熟練掌握各種工具',
    learning: '學習能力出眾，能快速掌握新知識和技能',
    problem_solving: '問題解決能力強，能有效應對各種挑戰'
  }
  return descriptions[talent] || '這是你的天賦能力之一'
}

// 職業匹配算法 (按照原版邏輯)
const generateCareerRecommendations = () => {
  const userInterests = topInterests.value.map(i => i.category)
  const userTalents = topTalents.value.map(t => t.talent)
  const userValues = topValues.value.map(v => v.value)

  // 新版測驗已經直接使用資料庫格式，不需要映射
  // 直接使用用戶的興趣領域 ID
  const mappedInterests = userInterests

  const suggestions = Object.entries(CAREER_DATABASE).map(([careerKey, career]) => {
    if (!career || !career.matchValues || !career.matchInterests) {
      return null
    }

    let totalMatches = 0
    let matchType = 'partial'
    const reasons: string[] = []

    // 價值觀匹配 (40% 權重)
    const valueMatches = career.matchValues.filter(value =>
      userValues.includes(value)
    ).length
    if (valueMatches > 0) {
      totalMatches += valueMatches * 40
      reasons.push(`價值觀契合 ${valueMatches} 項`)
    }

    // 興趣匹配 (35% 權重)
    const interestMatches = career.matchInterests.filter(interest =>
      mappedInterests.includes(interest)
    ).length
    if (interestMatches > 0) {
      totalMatches += interestMatches * 35
      reasons.push(`興趣相符 ${interestMatches} 項`)
    }

    // 天賦匹配 (25% 權重) - 目前簡化版暫不支援原版天賦匹配
    // 使用簡單的匹配邏輯
    let talentMatches = 0
    if (userTalents.includes('analytical') && career.matchTalents?.includes('分析')) talentMatches++
    if (userTalents.includes('creative') && career.matchTalents?.includes('理念')) talentMatches++
    if (userTalents.includes('interpersonal') && career.matchTalents?.includes('體諒')) talentMatches++
    if (userTalents.includes('leadership') && career.matchTalents?.includes('統籌')) talentMatches++

    if (talentMatches > 0) {
      totalMatches += talentMatches * 25
      reasons.push(`天賦匹配 ${talentMatches} 項`)
    }

    // 確定匹配等級
    const dimensionCount = (valueMatches > 0 ? 1 : 0) +
                          (interestMatches > 0 ? 1 : 0) +
                          (talentMatches > 0 ? 1 : 0)

    if (dimensionCount >= 3 && totalMatches >= 180) {
      matchType = 'perfect'
    } else if (dimensionCount >= 2 && totalMatches >= 120) {
      matchType = 'excellent'
    } else if (dimensionCount >= 1 && totalMatches >= 60) {
      matchType = 'good'
    }

    // 生成推薦理由文字
    let reasonText = ''
    if (valueMatches > 0 && interestMatches > 0 && talentMatches > 0) {
      reasonText = `你重視的價值觀、感興趣的領域和天賦能力都與此職業高度匹配，這是一個值得深入考慮的方向。`
    } else if (valueMatches > 0 && interestMatches > 0) {
      reasonText = `你的核心價值觀和興趣領域都與此職業相符，具有很好的發展潛力。`
    } else if (valueMatches > 0 && talentMatches > 0) {
      reasonText = `你的價值觀和天賦能力與此職業匹配，能在工作中發揮優勢。`
    } else if (interestMatches > 0 && talentMatches > 0) {
      reasonText = `你的興趣和天賦都適合這個職業方向，值得進一步探索。`
    } else {
      reasonText = `基於你的測驗結果，這個職業與你的特質有一定契合度。`
    }

    return {
      career: careerKey,
      name: career.name,
      description: career.description,
      requirements: career.requirements,
      nextSteps: career.nextSteps || [],
      matchScore: totalMatches,
      matchType,
      reasons,
      reasonText,
      matchPercentage: Math.min(Math.round((totalMatches / 300) * 100), 100)
    }
  })
  .filter(suggestion => suggestion !== null && suggestion.matchScore > 0)
  .sort((a, b) => b.matchScore - a.matchScore)

  return suggestions
}

// 更新職業建議分類
const updateCareerSuggestions = () => {
  console.log('🔍 開始更新職業建議...')
  console.log('📊 測驗結果:', props.results)
  console.log('🎯 興趣:', topInterests.value)
  console.log('💎 天賦:', topTalents.value)
  console.log('⭐ 價值觀:', topValues.value)

  const suggestions = generateCareerRecommendations()
  console.log('💼 生成的職業建議:', suggestions)
  console.log('📈 職業資料庫大小:', Object.keys(CAREER_DATABASE).length)

  // 確保多樣性：嚴格平衡每個興趣領域的推薦
  const diversifySuggestions = (matches: any[], maxCount: number) => {
    const diversified: any[] = []
    const interestCoverage = new Map<string, number>()
    const userTopInterests = topInterests.value.slice(0, 3).map(i => i.category)

    // 計算每個興趣領域可以有多少個職業（平均分配）
    const maxPerInterest = Math.ceil(maxCount / userTopInterests.length)

    // 輪流為每個興趣領域添加職業，確保平衡
    let currentRound = 0
    const maxRounds = maxPerInterest

    while (diversified.length < maxCount && currentRound < maxRounds) {
      for (const userInterest of userTopInterests) {
        if (diversified.length >= maxCount) break

        const currentCount = interestCoverage.get(userInterest) || 0
        if (currentCount >= maxRounds) continue // 該領域已達上限

        // 找到該興趣領域還沒被選中的職業
        const matchForInterest = matches.find(match => {
          if (diversified.find(m => m.career === match.career)) return false
          const career = CAREER_DATABASE[match.career]
          return career?.matchInterests?.includes(userInterest)
        })

        if (matchForInterest) {
          diversified.push(matchForInterest)
          interestCoverage.set(userInterest, currentCount + 1)
        }
      }
      currentRound++
    }

    console.log('📊 興趣領域分佈:', Object.fromEntries(interestCoverage))

    return diversified
  }

  const perfectCandidates = suggestions.filter(c => c.matchType === 'perfect')
  const excellentCandidates = suggestions.filter(c => c.matchType === 'excellent')
  const goodCandidates = suggestions.filter(c => c.matchType === 'good')

  perfectMatches.value = diversifySuggestions(perfectCandidates, 2)
  excellentMatches.value = diversifySuggestions(excellentCandidates, 2)
  goodMatches.value = diversifySuggestions(goodCandidates, 4)

  console.log('✨ 完美匹配:', perfectMatches.value.length)
  console.log('👍 優秀匹配:', excellentMatches.value.length)
  console.log('👌 良好匹配:', goodMatches.value.length)
}

// 格式化名稱函數
const formatInterestName = (category: string) => {
  const names: Record<string, string> = {
    technology: 'IT科技',
    art_design: '藝術設計',
    business: '商業經營',
    engineering: '工程技術',
    science: '科學研究',
    healthcare: '醫療健康',
    education: '教育培訓',
    law: '法律政治',
    hospitality: '服務款待',
    writing: '寫作出版',
    social_work: '社會服務',
    psychology: '心理諮商',
    media: '媒體傳播',
    marketing: '行銷銷售',
    sports: '體育運動',
    food: '餐飲美食'
  }
  return names[category] || category
}

const formatTalentName = (talent: string) => {
  const names: Record<string, string> = {
    analytical: '邏輯分析',
    creative: '創意思維',
    interpersonal: '人際溝通',
    leadership: '領導統御',
    detail_oriented: '細心執行',
    technical: '技術操作',
    learning: '快速學習',
    problem_solving: '問題解決'
  }
  return names[talent] || talent
}

const formatValueName = (value: string) => {
  const names: Record<string, string> = {
    achievement: '追求成就',
    autonomy: '自主獨立',
    security: '穩定安全',
    helping_others: '助人服務',
    creativity: '創意表達',
    work_life_balance: '工作平衡',
    leadership: '領導影響',
    learning_growth: '學習成長',
    teamwork: '團隊合作',
    flexibility: '彈性自由'
  }
  return names[value] || value
}


// 職業選擇和問卷相關函數
const selectCareer = (career: any) => {
  selectedCareer.value = career.name
  showSurveyModal.value = true
  currentStage.value = 'survey' // 設定為問卷階段
  console.log('選擇職業:', selectedCareer.value)
}

const toggleLearningStyle = (style: string) => {
  const index = surveyAnswers.value.learning_styles.indexOf(style)
  if (index > -1) {
    surveyAnswers.value.learning_styles.splice(index, 1)
  } else {
    surveyAnswers.value.learning_styles.push(style)
  }
}

// 選擇學習動機快速選項
const selectMotivationOption = (option: string) => {
  // 如果 textarea 已經有內容，添加分號分隔；否則直接設置
  if (surveyAnswers.value.motivation.trim()) {
    surveyAnswers.value.motivation += '；' + option
  } else {
    surveyAnswers.value.motivation = option
  }
}

const generateTasks = async () => {
  console.log('🚀 開始生成任務...')

  // 防止重複調用
  if (loading.value) {
    console.log('⚠️ 任務生成中，忽略重複請求')
    return
  }

  if (!quizResultId.value) {
    console.log('⚠️ 沒有測驗結果ID，先保存測驗結果')
    await saveQuizResults()
  }

  if (!quizResultId.value) {
    console.error('❌ 保存測驗結果後仍然沒有ID')
    alert('保存測驗結果失敗，請重試')
    return
  }

  loading.value = true
  currentStage.value = 'generating'
  progressMessage.value = '初始化任務生成系統...'
  progressPercent.value = 0
  console.log('📝 當前狀態:', currentStage.value)

  // 啟動超時檢測計時器
  generationStartTime.value = Date.now()
  isTimeout.value = false

  const timeoutChecker = setInterval(() => {
    if (generationStartTime.value && Date.now() - generationStartTime.value > TIMEOUT_DURATION) {
      isTimeout.value = true
      console.warn('⏰ 任務生成超時（超過 5 分鐘）')
      clearInterval(timeoutChecker)
    }
  }, 1000) // 每秒檢查一次

  // 臨時存儲各階段數據
  let outlineData = null
  let tasksData = null
  let resourcesData = null

  try {
    const payload = {
      quiz_result_id: quizResultId.value,
      selected_career: selectedCareer.value,
      survey_answers: surveyAnswers.value,
      user_id: userStore.user.id
    }

    console.log('📤 發送 SSE 漸進式生成請求:', payload)

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/career/generate-tasks-progressive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(payload),
    })

    console.log('📥 收到 SSE 響應:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    // 使用 ReadableStream 處理 SSE
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        console.log('✅ SSE 串流結束')
        break
      }

      // 解碼數據塊
      buffer += decoder.decode(value, { stream: true })

      // 處理完整的 SSE 事件（以 \n\n 分隔）
      const events = buffer.split('\n\n')
      buffer = events.pop() || '' // 保留未完成的部分

      for (const event of events) {
        if (!event.trim() || !event.startsWith('data: ')) continue

        try {
          const jsonStr = event.replace(/^data: /, '').trim()
          const eventData = JSON.parse(jsonStr)

          console.log('📨 收到 SSE 事件:', eventData.type, eventData)

          // 處理不同類型的事件
          switch (eventData.type) {
            case 'status':
              console.log(`[${eventData.stage}] ${eventData.message} - ${eventData.progress}%`)
              // 更新 UI 進度顯示
              progressMessage.value = eventData.message
              progressPercent.value = eventData.progress
              break

            case 'outline_complete':
              console.log('✅ 大綱生成完成')
              outlineData = eventData.content
              break

            case 'details_complete':
              console.log('✅ 細節擴展完成')
              tasksData = eventData.content
              break

            case 'resources_complete':
              console.log('✅ 資源推薦完成')
              resourcesData = eventData.content
              break

            case 'complete':
              console.log('🎉 任務生成全部完成！')

              // 儲存完整的預覽數據
              previewData.value = eventData.final_data

              // 提取任務列表
              let allTasks = []
              if (eventData.final_data.preview_mode) {
                allTasks = [
                  ...(eventData.final_data.main_tasks || []),
                  ...(eventData.final_data.daily_tasks || []),
                  ...(eventData.final_data.project_tasks || [])
                ]
                console.log('📊 main_tasks 數量:', eventData.final_data.main_tasks?.length || 0)
                console.log('📊 daily_tasks 數量:', eventData.final_data.daily_tasks?.length || 0)
                console.log('📊 project_tasks 數量:', eventData.final_data.project_tasks?.length || 0)
              }

              // ===== 🔥 整合 Perplexity 資源到每個任務 =====
              const perplexityResources = eventData.final_data.resources?.resources || []
              console.log('🔍 Perplexity 資源數量:', perplexityResources.length)

              // 建立任務標題到資源的映射
              const taskResourceMap = new Map()
              perplexityResources.forEach(resourceGroup => {
                if (resourceGroup.task_title && resourceGroup.recommendations) {
                  taskResourceMap.set(resourceGroup.task_title, resourceGroup.recommendations)
                }
              })

              console.log('📚 資源映射表大小:', taskResourceMap.size)
              console.log('📚 映射的任務標題:', Array.from(taskResourceMap.keys()))

              // 處理任務描述格式並整合資源
              allTasks = allTasks.map(task => {
                // 尋找匹配的資源 - 先嘗試精確匹配
                let matchedResources = taskResourceMap.get(task.title)

                // 如果精確匹配失敗，嘗試模糊匹配（去除括號內容後比對）
                if (!matchedResources) {
                  const taskTitleCore = task.title.replace(/（.*?）/g, '').trim()

                  for (const [perplexityTitle, resources] of taskResourceMap.entries()) {
                    const perplexityTitleCore = perplexityTitle.replace(/（.*?）/g, '').trim()

                    // 如果核心標題相似度高（包含關係或編輯距離小）
                    if (taskTitleCore.includes(perplexityTitleCore) ||
                        perplexityTitleCore.includes(taskTitleCore) ||
                        taskTitleCore === perplexityTitleCore) {
                      matchedResources = resources
                      console.log(`🔄 模糊匹配成功: 「${task.title}」 ➜ 「${perplexityTitle}」`)
                      break
                    }
                  }
                }

                // 如果找到 Perplexity 資源，轉換為結構化格式
                const finalResources = matchedResources
                  ? matchedResources.map(r => ({
                      title: r.title || '',
                      url: r.url || null,
                      platform: r.platform || null,
                      price: r.price || null,
                      description: r.description || null
                    }))
                  : (task.resources || []).map(r => {
                      // 保留原有資源為純文字格式
                      return typeof r === 'string' ? { title: r, url: null } : r
                    })

                console.log(`📖 任務「${task.title}」資源: ${matchedResources ? '✅ 使用 Perplexity' : '⚠️ 使用原有'}`)

                return {
                  ...task,
                  description: task.description ? task.description.replace(/\\n/g, '\n') : '',
                  resources: finalResources
                }
              })

              generatedTasks.value = allTasks

              // 進入預覽階段
              currentStage.value = 'preview'
              console.log('✅ 任務預覽生成成功')
              console.log('📋 預覽任務數量:', generatedTasks.value.length)
              break

            case 'error':
              console.error(`❌ 生成錯誤 [${eventData.stage}]:`, eventData.message)
              // 設置超時狀態以顯示重新生成按鈕
              isTimeout.value = true
              progressMessage.value = `生成失敗: ${eventData.message}`
              // 不拋出錯誤,保持在生成階段顯示重新生成按鈕
              break
          }
        } catch (parseError) {
          console.error('❌ 解析 SSE 事件失敗:', parseError, 'Event:', event)
        }
      }
    }

  } catch (error) {
    console.error('❌ SSE 任務生成失敗:', error)
    alert(`任務生成失敗: ${error instanceof Error ? error.message : '未知錯誤'}`)
    currentStage.value = 'survey' // 回到問卷階段
  }

  // 清理計時器
  if (timeoutChecker) {
    clearInterval(timeoutChecker)
  }

  loading.value = false
  console.log('🏁 生成流程結束，loading:', loading.value)
}

// 重新生成函數
const handleRegenerate = () => {
  console.log('🔄 用戶請求重新生成任務')

  // 重置狀態
  generationStartTime.value = null
  isTimeout.value = false
  generatedTasks.value = []
  previewData.value = null
  progressMessage.value = '初始化任務生成系統...'
  progressPercent.value = 0

  // 重新調用生成函數
  generateTasks()
}

// 接受並保存任務到資料庫
const acceptTasks = async () => {
  console.log('✅ 用戶確認接受任務，開始保存到資料庫...')

  // 防止重複點擊
  if (loading.value) {
    console.log('⚠️ 正在保存中，忽略重複請求')
    return
  }

  if (!previewData.value) {
    console.error('❌ 沒有預覽數據')
    alert('沒有可保存的任務數據')
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/career/accept-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(previewData.value),
    })

    console.log('📥 保存任務響應:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('📋 保存任務響應數據:', data)

    if (data.success) {
      // 保存成功，關閉 Modal 並導向主線任務頁面
      console.log('✅ 任務保存成功，導向主線任務頁面')
      showSurveyModal.value = false
      router.push('/mission/main')
    } else {
      throw new Error(data.message || '保存任務失敗')
    }
  } catch (error) {
    console.error('❌ 保存任務失敗:', error)
    alert(`保存任務失敗: ${error instanceof Error ? error.message : '未知錯誤'}`)
  }

  loading.value = false
}

const saveQuizResults = async () => {
  try {
    console.log('💾 開始保存測驗結果...')
    console.log('📊 原始測驗結果:', props.results)

    // 將 Proxy 物件轉換為純 JSON
    const payload = {
      values_results: JSON.parse(JSON.stringify(props.results['values-workstyle'] || {})),
      interests_results: JSON.parse(JSON.stringify(props.results.interests || {})),
      talents_results: JSON.parse(JSON.stringify(props.results.talents || {})),
      workstyle_results: JSON.parse(JSON.stringify(props.results['values-workstyle']?.workstyle || {}))
    }

    console.log('📤 保存測驗結果請求:', payload)
    console.log('📤 JSON 字串:', JSON.stringify(payload))

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/save-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('📥 保存測驗結果響應:', response.status, response.statusText)

    // 先讀取響應文字
    const responseText = await response.text()
    console.log('📥 響應內容:', responseText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`)
    }

    // 解析 JSON
    const data = JSON.parse(responseText)
    console.log('📋 保存測驗結果數據:', data)

    if (data.success) {
      quizResultId.value = data.data.quiz_result_id
      console.log('✅ 測驗結果保存成功，ID:', quizResultId.value)
    } else {
      throw new Error(data.message || '保存失敗')
    }
  } catch (error) {
    console.error('❌ 測驗結果保存失敗:', error)
    alert(`保存測驗結果失敗: ${error instanceof Error ? error.message : '未知錯誤'}`)
  }
}

const backToResults = () => {
  showSurveyModal.value = false
  currentStage.value = 'results'
  selectedCareer.value = ''
  surveyAnswers.value = {
    current_level: '',
    available_time: '',
    timeline: '',
    learning_styles: [],
    motivation: '',
    special_requirements: ''
  }
}

// 關閉問卷 Modal
const closeSurveyModal = () => {
  showSurveyModal.value = false
  currentStage.value = 'results'
}

// 跳轉到主線任務頁面
const goToTasks = () => {
  showSurveyModal.value = false
  router.push('/mission/main')
}

// 問卷表單驗證
const isFormValid = computed(() => {
  return surveyAnswers.value.current_level &&
         surveyAnswers.value.available_time &&
         surveyAnswers.value.timeline &&
         surveyAnswers.value.learning_styles.length > 0 &&
         surveyAnswers.value.motivation.trim().length > 0
})

// 生成職業計畫 (舊版保持向後兼容)
const generateCareerPlan = (career?: any) => {
  if (career) {
    selectCareer(career)
  } else {
    alert('請先選擇一個職業')
  }
}

// 初始化職業推薦
onMounted(() => {
  updateCareerSuggestions()
  // 自動保存測驗結果
  saveQuizResults()
})
</script>

<style scoped>
.prose {
  color: inherit;
}

.prose strong {
  font-weight: 600;
}
</style>