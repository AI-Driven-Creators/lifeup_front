<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialog">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- 標題列 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
        <h2 class="text-lg font-bold text-gray-900">創建新任務</h2>
        <button @click="closeDialog" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 表單內容 -->
      <div class="p-4">
        <form @submit.prevent="submitForm">
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
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  v-model="dailyTaskSubtype"
                  type="radio"
                  value="recurring"
                  class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 focus:ring-2 mr-3"
                />
                <div class="flex items-center gap-2">
                  <span class="text-lg">🔄</span>
                  <div>
                    <div class="font-medium text-sm">常駐目標</div>
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

            <!-- 經驗值 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                經驗值 
                <span class="text-xs text-gray-500">(建議: {{ calculatedExperience }})</span>
              </label>
              <input
                v-model.number="form.experience"
                type="number"
                min="10"
                max="500"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                :placeholder="calculatedExperience.toString()"
              />
            </div>

            <!-- 截止日期 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">截止日期</label>
              <input
                v-model="form.due_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

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
              {{ 
                loading 
                  ? (form.generate_subtasks ? '創建並生成子任務中...' : '創建中...') 
                  : (form.generate_subtasks ? '創建並生成子任務' : '創建任務')
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { apiClient } from '@/services/api'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created', task: any): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// 表單數據
const form = ref({
  title: '',
  task_type: 'main',
  description: '',
  priority: 2,
  difficulty: 3,
  experience: 0,
  due_date: '',
  generate_subtasks: false
})

// UI 狀態
const showAdvanced = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

// 每日任務子類型
const dailyTaskSubtype = ref<'simple' | 'recurring'>('simple')

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

// 計算經驗值
const calculatedExperience = computed(() => {
  return form.value.difficulty * 20 + form.value.priority * 10
})

// 表單驗證
const isFormValid = computed(() => {
  return form.value.title.trim().length >= 2 && 
         form.value.task_type && 
         !errors.value.title
})

// 監聽經驗值自動計算
watch([() => form.value.difficulty, () => form.value.priority], () => {
  if (!form.value.experience || form.value.experience === calculatedExperience.value) {
    form.value.experience = calculatedExperience.value
  }
})

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
    experience: 0,
    due_date: '',
    generate_subtasks: false
  }
  dailyTaskSubtype.value = 'simple'
  showAdvanced.value = false
  errors.value = {}
}

// 監聽任務類型變化，重置每日任務子類型
watch(() => form.value.task_type, (newType) => {
  if (newType !== 'daily') {
    dailyTaskSubtype.value = 'simple'
  }
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
  
  loading.value = true
  errors.value = {}
  
  try {
    // 準備任務數據，只包含非空值
    const taskData: any = {
      title: form.value.title.trim(),
      task_type: form.value.task_type,
      priority: form.value.priority,
      difficulty: form.value.difficulty,
      experience: form.value.experience || calculatedExperience.value
    }

    // 處理每日任務的重複性屬性
    if (form.value.task_type === 'daily') {
      taskData.is_recurring = dailyTaskSubtype.value === 'recurring' ? 1 : 0
      if (dailyTaskSubtype.value === 'recurring') {
        taskData.recurrence_pattern = 'daily'
        taskData.completion_target = 0.8 // 預設完成率目標
      }
    }
    
    // 只在有值時添加可選字段
    if (form.value.description?.trim()) {
      taskData.description = form.value.description.trim()
    }
    
    if (form.value.due_date) {
      taskData.due_date = `${form.value.due_date}T23:59:59Z`
    }
    
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

// 監聽標題變化進行驗證
watch(() => form.value.title, () => {
  if (errors.value.title) {
    validateForm()
  }
})
</script>