<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialog">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- 標題列 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
        <h2 class="text-lg font-bold text-gray-900">
          {{ getDialogTitle() }}
        </h2>
        <button @click="closeDialog" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 表單內容 -->
      <div class="p-4">
        <!-- 一般任務創建 -->
        <form v-if="!isRecurringTaskFlow" @submit.prevent="submitForm">
          <!-- 任務名稱 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              任務名稱 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="輸入任務名稱..."
              required
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- 任務類型 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              任務類型 <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="type in taskTypes"
                :key="type.value"
                type="button"
                @click="form.task_type = type.value"
                :class="[
                  'p-3 rounded-lg border-2 transition-all text-left',
                  form.task_type === type.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ type.icon }}</span>
                  <div>
                    <div class="font-medium text-sm">{{ type.label }}</div>
                    <div class="text-xs text-gray-500">{{ type.desc }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- 每日任務子類型選擇 -->
          <div v-if="form.task_type === 'daily'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-3">每日任務類型</label>
            <div class="grid grid-cols-1 gap-3">
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  v-model="dailyTaskSubtype"
                  type="radio"
                  value="simple"
                  class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2 mr-3"
                />
                <div class="flex items-center gap-2">
                  <span class="text-lg">📅</span>
                  <div>
                    <div class="font-medium text-sm">今日行動</div>
                    <div class="text-xs text-gray-500">今天要完成的特定目標，完成後不會重複</div>
                  </div>
                </div>
              </label>
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     :class="{ 'border-primary-500 bg-primary-50': dailyTaskSubtype === 'recurring' }">
                <input
                  v-model="dailyTaskSubtype"
                  type="radio"
                  value="recurring"
                  class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2 mr-3"
                />
                <div class="flex items-center gap-2">
                  <span class="text-lg">🔄</span>
                  <div>
                    <div class="font-medium text-sm">常駐目標
                      <span class="text-xs text-primary-600 font-normal">（分步驟設定）</span>
                    </div>
                    <div class="text-xs text-gray-500">習慣養成類任務，每天都會重置並可重複完成</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- 任務描述 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">任務描述</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="詳細描述任務內容..."
            ></textarea>
          </div>

          <!-- 進階選項切換 -->
          <div class="mb-4">
            <button
              type="button"
              @click="showAdvanced = !showAdvanced"
              class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': showAdvanced }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              進階選項
            </button>
          </div>

          <!-- 進階選項 -->
          <div v-if="showAdvanced" class="space-y-4 mb-6">
            <!-- 優先級和難度 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">優先級</label>
                <select
                  v-model="form.priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option :value="1">低 (1)</option>
                  <option :value="2">中 (2)</option>
                  <option :value="3">高 (3)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">難度</label>
                <select
                  v-model="form.difficulty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option :value="1">很簡單 (1)</option>
                  <option :value="2">簡單 (2)</option>
                  <option :value="3">普通 (3)</option>
                  <option :value="4">困難 (4)</option>
                  <option :value="5">很困難 (5)</option>
                </select>
              </div>
            </div>

            <!-- 技能標籤選擇 -->
            <!-- 暫時註解：技能標籤選取功能
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                關聯技能標籤
                <span class="text-xs text-gray-500 ml-1">(選填，可多選)</span>
              </label>

              <!-- 已選擇的技能標籤 -->
              <!-- <div v-if="form.skill_tags && form.skill_tags.length > 0" class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(tag, index) in form.skill_tags"
                  :key="index"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeSkillTag(index)"
                    class="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div> -->

              <!-- 技能選擇器 -->
              <!-- <div class="relative">
                <input
                  v-model="skillSearchQuery"
                  @focus="showSkillDropdown = true"
                  @input="showSkillDropdown = true"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="搜尋或輸入新技能標籤..."
                />

                <!-- 技能下拉選單 -->
                <!-- <div
                  v-if="showSkillDropdown && (filteredSkills.length > 0 || skillSearchQuery.trim())"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  <!-- 從現有技能選擇 -->
                  <!-- <button
                    v-for="skill in filteredSkills"
                    :key="skill.id"
                    type="button"
                    @click="addSkillTag(skill.name)"
                    class="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <span class="text-lg">🎯</span>
                    <span>{{ skill.name }}</span>
                    <span class="ml-auto text-xs text-gray-500">{{ skill.category === 'technical' ? '技術' : '軟實力' }}</span>
                  </button> -->

                  <!-- 創建新技能標籤 -->
                  <!-- <button
                    v-if="skillSearchQuery.trim() && !isExistingSkill(skillSearchQuery.trim())"
                    type="button"
                    @click="addSkillTag(skillSearchQuery.trim())"
                    class="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 border-t border-gray-200 bg-blue-50"
                  >
                    <span class="text-lg">➕</span>
                    <span class="text-blue-600">創建新標籤: "{{ skillSearchQuery.trim() }}"</span>
                  </button>
                </div>
              </div> -->

              <!-- <p class="text-xs text-gray-500 mt-1">
                選擇技能標籤可以追蹤相關技能的成長，也可以輸入自訂標籤
              </p>
            </div> -->



            <!-- 生成子任務選項 -->
            <div class="border-t border-gray-200 pt-4">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  v-model="form.generate_subtasks"
                  type="checkbox"
                  class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <div>
                  <span class="text-sm font-medium text-gray-700">自動生成子任務</span>
                  <p class="text-xs text-gray-500">
                    創建任務後立即開始並生成相關的子任務，讓任務更具體易執行
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ errors.general }}</p>
          </div>

          <!-- 按鈕區 -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeDialog"
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              :disabled="loading"
            >
              取消
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              :disabled="loading || !isFormValid"
            >
              {{ getSubmitButtonText() }}
            </button>
          </div>
        </form>

        <!-- 常駐目標重複設定 -->
        <div v-else>
          <!-- 重複設定界面 -->
          <div class="space-y-6">
            <!-- 已設定的基本資訊預覽 -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-green-600">✓</span>
                <h4 class="font-medium text-green-800">已設定基本資訊</h4>
              </div>
              <div class="text-sm text-green-700">
                <div><strong>目標名稱：</strong>{{ formData.title }}</div>
                <div v-if="formData.description" class="mt-1"><strong>描述：</strong>{{ formData.description }}</div>
                <div class="mt-1"><strong>難度：</strong>{{ '⭐'.repeat(formData.difficulty) }} ({{ formData.difficulty }})</div>
                <div class="mt-1"><strong>優先級：</strong>{{ formData.priority === 1 ? '低' : formData.priority === 2 ? '中' : '高' }} ({{ formData.priority }})</div>
                <div><strong>每日經驗值：</strong>{{ suggestedExp }}</div>
              </div>
            </div>

            <!-- 重複模式 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">重複頻率</label>
              <div class="grid grid-cols-2 gap-3">
                <label v-for="pattern in recurrencePatterns" :key="pattern.value"
                       class="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       :class="{ 'border-primary-500 bg-primary-50': recurringData.pattern === pattern.value }">
                  <input v-model="recurringData.pattern" :value="pattern.value" type="radio" class="sr-only">
                  <div class="flex items-center w-full">
                    <span class="text-2xl mr-3">{{ pattern.icon }}</span>
                    <div>
                      <div class="font-medium text-sm">{{ pattern.label }}</div>
                      <div class="text-xs text-gray-500">{{ pattern.description }}</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- 執行期間設定 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-4">📅 執行期間</h4>

              <!-- 快速選擇 -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">快速選擇</label>
                <div class="grid grid-cols-3 gap-2">
                  <button @click="setQuickDuration(21)" type="button"
                          class="px-3 py-2 text-sm border rounded-lg hover:bg-white transition-colors"
                          :class="{ 'border-primary-500 bg-white': isQuickDuration(21) }">
                    21天習慣
                  </button>
                  <button @click="setQuickDuration(30)" type="button"
                          class="px-3 py-2 text-sm border rounded-lg hover:bg-white transition-colors"
                          :class="{ 'border-primary-500 bg-white': isQuickDuration(30) }">
                    30天挑戰
                  </button>
                  <button @click="setQuickDuration(90)" type="button"
                          class="px-3 py-2 text-sm border rounded-lg hover:bg-white transition-colors"
                          :class="{ 'border-primary-500 bg-white': isQuickDuration(90) }">
                    90天養成
                  </button>
                </div>
              </div>

              <!-- 自訂日期 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">開始日期</label>
                  <input v-model="recurringData.startDate" type="date"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">結束日期</label>
                  <input v-model="recurringData.endDate" type="date"
                         class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                </div>
              </div>

              <!-- 期間顯示 -->
              <div class="mt-3 text-sm text-gray-600">
                總計：<span class="font-medium text-primary-600">{{ totalDays }}</span> 天
              </div>
            </div>

            <!-- 完成率目標 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                完成率目標：<span class="text-lg font-bold text-primary-600">{{ Math.round(recurringData.target * 100) }}%</span>
              </label>
              <div class="px-4 py-3 bg-white border border-gray-200 rounded-lg">
                <input v-model.number="recurringData.target" type="range"
                       min="0.1" max="1" step="0.05"
                       class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-gradient">
                <div class="flex justify-between text-xs text-gray-500 mt-2">
                  <span>10% 入門</span>
                  <span>50% 一般</span>
                  <span>80% 良好</span>
                  <span>100% 完美</span>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                在 {{ totalDays }} 天內，預期完成 <strong>{{ Math.round(totalDays * recurringData.target) }}</strong> 天
              </p>
            </div>

            <!-- 錯誤提示 -->
            <div v-if="errors.general" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errors.general }}</p>
            </div>

            <!-- 期間驗證錯誤 -->
            <div v-if="!isValidRecurringSetting && recurringData.startDate && recurringData.endDate"
                 class="text-sm text-red-600 text-center">
              結束日期必須晚於開始日期
            </div>

            <!-- 操作按鈕 -->
            <div class="flex justify-between pt-4">
              <button @click="backToBasicForm"
                      :disabled="loading"
                      class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 transition-all">
                ← 返回修改基本資訊
              </button>
              <button @click="createRecurringTask"
                      :disabled="!isValidRecurringSetting || loading"
                      class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center gap-2">
                <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ loading ? '創建中...' : '🎯 創建常駐目標' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject, onMounted } from 'vue'
import { apiClient } from '@/services/api'
import { useSkillStore } from '@/stores/skill'
import { useUserStore } from '@/stores/user'

interface Props {
  show: boolean
  editTaskData?: any
}

interface Emits {
  (e: 'close'): void
  (e: 'created', task: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// inject 必須在 setup 頂層調用
const showToast = inject<(text: string, duration?: number) => void>('showToast')

// 技能 store
const skillStore = useSkillStore()
const userStore = useUserStore()

// 表單數據
const form = ref({
  title: '',
  task_type: 'main',
  description: '',
  priority: 2,
  difficulty: 3,
  generate_subtasks: false,
  skill_tags: [] as string[]
})

// 常駐目標數據
const formData = ref({
  title: '',
  description: '',
  difficulty: 3,
  priority: 2
})

const recurringData = ref({
  pattern: 'daily',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  target: 0.8
})

// UI 狀態
const showAdvanced = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

// 每日任務子類型
const dailyTaskSubtype = ref<'simple' | 'recurring'>('simple')

// 是否進入常駐目標流程
const isRecurringTaskFlow = ref(false)

// 技能標籤相關狀態
const skillSearchQuery = ref('')
const showSkillDropdown = ref(false)

// 點擊外部關閉下拉選單
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showSkillDropdown.value = false
    }
  })
}

// 任務類型選項
const taskTypes = [
  {
    value: 'daily',
    label: '每日任務',
    desc: '日常習慣',
    icon: '📅'
  },
  {
    value: 'main',
    label: '主線任務',
    desc: '重要目標',
    icon: '🎯'
  },
  {
    value: 'side',
    label: '支線任務',
    desc: '輔助成長',
    icon: '🌟'
  },
  {
    value: 'challenge',
    label: '挑戰任務',
    desc: '突破極限',
    icon: '🔥'
  }
]

// 重複模式選項
const recurrencePatterns = [
  { value: 'daily', label: '每日', icon: '📅', description: '每天都要完成' },
  { value: 'weekdays', label: '工作日', icon: '💼', description: '週一到週五' },
  { value: 'weekends', label: '週末', icon: '🏖️', description: '週六和週日' },
  { value: 'weekly', label: '每週', icon: '📊', description: '每週完成一次' }
]

// 計算經驗值
const calculatedExperience = computed(() => {
  return form.value.difficulty * 20 + form.value.priority * 10
})

// 常駐目標建議經驗值（根據難度和優先級計算）
const suggestedExp = computed(() => {
  return formData.value.difficulty * 20 + formData.value.priority * 10
})

// 總天數計算
const totalDays = computed(() => {
  if (!recurringData.value.startDate || !recurringData.value.endDate) return 0
  const start = new Date(recurringData.value.startDate)
  const end = new Date(recurringData.value.endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
})

// 驗證常駐設定
const isValidRecurringSetting = computed(() => {
  return recurringData.value.startDate &&
         recurringData.value.endDate &&
         new Date(recurringData.value.endDate) > new Date(recurringData.value.startDate)
})

// 表單驗證
const isFormValid = computed(() => {
  return form.value.title.trim().length >= 2 &&
         form.value.task_type &&
         !errors.value.title
})

// 過濾的技能列表（根據搜尋關鍵字）
const filteredSkills = computed(() => {
  const query = skillSearchQuery.value.toLowerCase().trim()
  if (!query) {
    return skillStore.skills
  }
  return skillStore.skills.filter(skill =>
    skill.name.toLowerCase().includes(query)
  )
})

// 檢查技能是否已存在
const isExistingSkill = (skillName: string) => {
  return skillStore.skills.some(skill =>
    skill.name.toLowerCase() === skillName.toLowerCase()
  )
}

// 添加技能標籤
const addSkillTag = (skillName: string) => {
  const trimmedName = skillName.trim()
  if (!trimmedName) return

  // 檢查是否已添加
  if (form.value.skill_tags.includes(trimmedName)) {
    if (showToast) {
      showToast('此技能標籤已添加', 2000)
    }
    return
  }

  // 添加到列表
  form.value.skill_tags.push(trimmedName)

  // 清空搜尋框並關閉下拉選單
  skillSearchQuery.value = ''
  showSkillDropdown.value = false
}

// 移除技能標籤
const removeSkillTag = (index: number) => {
  form.value.skill_tags.splice(index, 1)
}


// 驗證表單
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = '任務名稱為必填項'
    return false
  }
  
  if (form.value.title.trim().length < 2) {
    errors.value.title = '任務名稱至少需要2個字符'
    return false
  }
  
  if (form.value.title.trim().length > 100) {
    errors.value.title = '任務名稱不能超過100個字符'
    return false
  }
  
  return true
}

// 重置表單
const resetForm = () => {
  form.value = {
    title: '',
    task_type: 'main',
    description: '',
    priority: 2,
    difficulty: 3,
    generate_subtasks: false,
    skill_tags: []
  }
  dailyTaskSubtype.value = 'simple'
  showAdvanced.value = false
  errors.value = {}
  skillSearchQuery.value = ''
  showSkillDropdown.value = false

  // 重置常駐目標數據
  isRecurringTaskFlow.value = false
  formData.value = {
    title: '',
    description: '',
    difficulty: 3,
    priority: 2
  }
  recurringData.value = {
    pattern: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    target: 0.8
  }
}

// 監聽任務類型變化，重置每日任務子類型
watch(() => form.value.task_type, (newType) => {
  if (newType !== 'daily') {
    dailyTaskSubtype.value = 'simple'
  }
})

// 監聽每日任務子類型變化（暫時移除自動跳轉）
watch(() => dailyTaskSubtype.value, (newSubtype) => {
  // 不再自動跳轉，讓用戶完成表單填寫
})

// 關閉對話框
const closeDialog = () => {
  resetForm()
  emit('close')
}

// 提交表單
const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  // 如果是每日任務且選擇常駐目標，跳轉到重複設定
  if (form.value.task_type === 'daily' && dailyTaskSubtype.value === 'recurring') {
    // 同步表單數據到常駐目標數據
    formData.value.title = form.value.title
    formData.value.description = form.value.description
    formData.value.difficulty = form.value.difficulty
    formData.value.priority = form.value.priority

    isRecurringTaskFlow.value = true
    return  // 跳轉到重複設定，不直接創建任務
  }

  loading.value = true
  errors.value = {}

  try {
    // 準備任務數據，只包含非空值
    const taskData: any = {
      title: form.value.title.trim(),
      task_type: form.value.task_type,
      priority: form.value.priority,
      difficulty: form.value.difficulty,
      user_id: userStore.user.id
    }

    // 只有每日任務才傳遞經驗值，其他任務由子任務決定經驗值
    if (form.value.task_type === 'daily') {
      taskData.experience = calculatedExperience.value
    }

    // 處理每日任務的重複性屬性（這裡只處理simple類型）
    if (form.value.task_type === 'daily') {
      taskData.is_recurring = 0  // simple 類型都是非重複性
    }

    // 只在有值時添加可選字段
    if (form.value.description?.trim()) {
      taskData.description = form.value.description.trim()
    }

    // 添加技能標籤
    // 暫時註解：技能標籤功能
    // if (form.value.skill_tags && form.value.skill_tags.length > 0) {
    //   taskData.skill_tags = form.value.skill_tags
    // }
    
    // 調用 API 創建任務
    const response = await apiClient.createTask(taskData)
    
    if (response.success) {
      let finalTask = response.data
      
      // 如果用戶選擇生成子任務，立即開始任務
      if (form.value.generate_subtasks && response.data?.id) {
        try {
          const startResponse = await apiClient.startTask(response.data.id, true)
          if (startResponse.success) {
            finalTask = startResponse.data
          }
        } catch (startError) {
          // 繼續創建流程，不影響主要功能
          console.warn('自動開始任務失敗，但任務已創建成功')
        }
      }
      
      loading.value = false
      emit('created', finalTask)
      closeDialog()
      return
    } else {
      errors.value.general = response.message || '創建任務失敗'
    }
  } catch (error) {
    console.error('創建任務失敗:', error)
    errors.value.general = '創建任務失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 對話框標題
const getDialogTitle = () => {
  if (isRecurringTaskFlow.value) {
    return '創建常駐目標 - 重複設定'
  }
  return '創建新任務'
}

// 提交按鈕文字
const getSubmitButtonText = () => {
  if (loading.value) {
    if (form.value.generate_subtasks) {
      return '創建並生成子任務中...'
    }
    return '創建中...'
  }

  // 如果是每日任務且選擇常駐目標
  if (form.value.task_type === 'daily' && dailyTaskSubtype.value === 'recurring') {
    return '設定重複規則 →'
  }

  // 一般任務
  if (form.value.generate_subtasks) {
    return '創建並生成子任務'
  }
  return '創建任務'
}

// 返回基本表單
const backToBasicForm = () => {
  // 同步常駐目標數據回原表單
  form.value.title = formData.value.title
  form.value.description = formData.value.description
  form.value.difficulty = formData.value.difficulty
  form.value.priority = formData.value.priority

  isRecurringTaskFlow.value = false
  dailyTaskSubtype.value = 'simple'  // 暫時重置為simple，讓用戶重新選擇
}

// 快速期間設定
const setQuickDuration = (days: number) => {
  const today = new Date()
  const endDate = new Date(today.getTime() + (days - 1) * 24 * 60 * 60 * 1000)

  recurringData.value.startDate = today.toISOString().split('T')[0]
  recurringData.value.endDate = endDate.toISOString().split('T')[0]
}

const isQuickDuration = (days: number) => {
  return totalDays.value === days
}

// 創建常駐目標
const createRecurringTask = async () => {
  if (!isValidRecurringSetting.value) return

  loading.value = true

  try {
    // 構建請求数據
    const taskData = {
      title: formData.value.title,
      description: formData.value.description || undefined,
      task_type: 'daily',
      priority: formData.value.priority,
      difficulty: formData.value.difficulty,
      experience: suggestedExp.value,
      is_recurring: 1,
      recurrence_pattern: recurringData.value.pattern,
      start_date: `${recurringData.value.startDate}T00:00:00Z`,
      end_date: `${recurringData.value.endDate}T23:59:59Z`,
      completion_target: recurringData.value.target,
      user_id: userStore.user.id
    }

    // 調用後端 API
    const response = await apiClient.createTask(taskData)

    if (response.success) {
      loading.value = false

      // 顯示成功提示
      if (showToast) {
        showToast('🎉 常駐目標創建成功！', 3000)
      }

      emit('created', response.data)
      closeDialog()
    } else {
      throw new Error(response.message || '創建失敗')
    }
  } catch (error) {
    console.error('創建常駐目標失敗:', error)
    errors.value.general = '創建失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

// 監聽標題變化進行驗證
watch(() => form.value.title, () => {
  if (errors.value.title) {
    validateForm()
  }
})

// 組件掛載時載入技能數據
onMounted(() => {
  if (skillStore.skills.length === 0 && !skillStore.loading) {
    skillStore.fetchSkills()
  }
})

// 監聽對話框顯示狀態和編輯資料，檢查是否有預填資料
watch([() => props.show, () => props.editTaskData], ([isShow, editData]) => {
  if (isShow && editData) {
    try {
      console.log('載入編輯資料:', editData)

      // 預填表單資料
      form.value.title = editData.title || ''
      form.value.task_type = editData.task_type || 'main'
      form.value.description = editData.description || ''
      form.value.priority = editData.priority || 2
      form.value.difficulty = editData.difficulty || 3
      // 暫時註解：技能標籤功能
      // form.value.skill_tags = editData.skill_tags || []

      // 處理截止日期格式（如果需要，但目前表單中沒有這個欄位，所以先註釋掉）
      // const possibleDateFields = [editData.due_date, editData.deadline, editData.end_date, editData.target_date]
      // const dateValue = possibleDateFields.find(date => date != null)

      // if (dateValue) {
      //   console.log('找到截止日期:', dateValue)
      //   try {
      //     const dueDate = new Date(dateValue)
      //     if (!isNaN(dueDate.getTime())) {
      //       form.value.due_date = dueDate.toISOString().split('T')[0]
      //       console.log('格式化後的截止日期:', form.value.due_date)
      //     } else {
      //       console.warn('無效的截止日期格式:', dateValue)
      //     }
      //   } catch (error) {
      //     console.error('截止日期格式轉換失敗:', error)
      //   }
      // }

      // 處理每日任務類型
      if (editData.task_type === 'daily') {
        dailyTaskSubtype.value = editData.is_recurring ? 'recurring' : 'simple'
      }

      // 預設展開進階選項
      showAdvanced.value = true

    } catch (error) {
      console.error('載入預填資料失敗:', error)
    }
  }
}, { immediate: true })

</script>

<style scoped>
/* 滑動條樣式 */
.slider-gradient::-webkit-slider-track {
  background: linear-gradient(to right, #fecaca, #fef3c7, #d1fae5);
  border-radius: 0.375rem;
  height: 0.75rem;
}

.slider-gradient::-webkit-slider-thumb {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.slider-gradient::-moz-range-track {
  background: linear-gradient(to right, #fecaca, #fef3c7, #d1fae5);
  border-radius: 0.375rem;
  height: 0.75rem;
  border: none;
}

.slider-gradient::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

/* 移除 Firefox 的 focus 輪廓 */
.slider-gradient::-moz-focus-outer {
  border: 0;
}
</style>