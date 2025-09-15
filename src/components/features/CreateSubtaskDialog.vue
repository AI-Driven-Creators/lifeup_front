<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialog">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- 標題列 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
        <h2 class="text-lg font-bold text-gray-900">創建子任務</h2>
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
              子任務名稱 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="輸入子任務名稱..."
              required
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- 任務描述 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">任務描述</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="詳細描述子任務內容..."
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

            <!-- 經驗值和任務順序 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  經驗值
                  <span class="text-xs text-gray-500">(建議: {{ calculatedExperience }})</span>
                </label>
                <input
                  v-model.number="form.experience"
                  type="number"
                  min="5"
                  max="200"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  :placeholder="calculatedExperience.toString()"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">任務順序</label>
                <input
                  v-model.number="form.task_order"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="1"
                />
              </div>
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
              {{ loading ? '創建中...' : '創建子任務' }}
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
import type { Task } from '@/types'

interface Props {
  show: boolean
  parentTaskId: string
}

interface Emits {
  (e: 'close'): void
  (e: 'created', subtask: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表單數據
const form = ref({
  title: '',
  description: '',
  priority: 2,
  difficulty: 3,
  experience: 0,
  task_order: 1,
  due_date: ''
})

// UI 狀態
const showAdvanced = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

// 計算經驗值
const calculatedExperience = computed(() => {
  return Math.floor(form.value.difficulty * 10 + form.value.priority * 5)
})

// 表單驗證
const isFormValid = computed(() => {
  return form.value.title.trim().length >= 2 &&
         props.parentTaskId &&
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
    errors.value.title = '子任務名稱為必填項'
    return false
  }

  if (form.value.title.trim().length < 2) {
    errors.value.title = '子任務名稱至少需要2個字符'
    return false
  }

  if (form.value.title.trim().length > 100) {
    errors.value.title = '子任務名稱不能超過100個字符'
    return false
  }


  return true
}

// 重置表單
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    priority: 2,
    difficulty: 3,
    experience: 0,
    task_order: 1,
    due_date: ''
  }
  showAdvanced.value = false
  errors.value = {}
}

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
    // 準備子任務數據
    const subtaskData: any = {
      title: form.value.title.trim(),
      task_type: 'main', // 子任務默認為主線任務類型
      priority: form.value.priority,
      difficulty: form.value.difficulty,
      experience: form.value.experience || calculatedExperience.value,
      parent_task_id: props.parentTaskId,
      task_order: form.value.task_order,
    }

    // 只在有值時添加可選字段
    if (form.value.description?.trim()) {
      subtaskData.description = form.value.description.trim()
    }

    if (form.value.due_date) {
      subtaskData.due_date = `${form.value.due_date}T23:59:59Z`
    }

    // 調用 API 創建子任務
    console.log('🚀 發送子任務數據:', subtaskData)
    const response = await apiClient.createTask(subtaskData)

    if (response.success) {
      emit('created', response.data)
      closeDialog()
    } else {
      errors.value.general = response.message || '創建子任務失敗'
    }
  } catch (error) {
    console.error('創建子任務失敗:', error)
    errors.value.general = '創建子任務失敗，請稍後再試'
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