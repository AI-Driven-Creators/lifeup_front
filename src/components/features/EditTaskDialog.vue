<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDialog">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <!-- 標題列 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
        <h2 class="text-lg font-bold text-gray-900">編輯任務</h2>
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

            <!-- 經驗值 - 父任務顯示總和，子任務自動計算 -->
            <div v-if="isParentTask">
              <label class="block text-sm font-medium text-gray-700 mb-2">經驗值</label>
              <div class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                {{ props.task?.experience || 0 }} EXP
                <span class="text-xs text-blue-500 ml-2">(由所有子任務計算)</span>
              </div>
            </div>
            <div v-else>
              <label class="block text-sm font-medium text-gray-700 mb-2">經驗值</label>
              <div class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                {{ calculatedExperience }} EXP
                <span class="text-xs text-gray-500 ml-2">(自動計算)</span>
              </div>
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
              {{ loading ? '更新中...' : '更新任務' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import type { Task } from '@/types'

interface Props {
  show: boolean
  task: Task | null
}

interface Emits {
  (e: 'close'): void
  (e: 'updated', task: Task): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const taskStore = useTaskStore()

// 表單數據
const form = ref({
  title: '',
  task_type: 'main',
  description: '',
  priority: 2,
  difficulty: 3,
  experience: 0,
  due_date: ''
})

// UI 狀態
const showAdvanced = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

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

// 判斷是否為父任務
const isParentTask = computed(() => {
  return props.task?.is_parent_task === true || props.task?.is_parent_task === 1
})

// 計算經驗值 (只對非父任務有效)
const calculatedExperience = computed(() => {
  if (isParentTask.value) {
    return 0 // 父任務經驗值不由此計算
  }
  return form.value.difficulty * 20 + form.value.priority * 10
})

// 表單驗證
const isFormValid = computed(() => {
  return form.value.title.trim().length >= 2 &&
         form.value.task_type &&
         !errors.value.title
})

// 監聽任務變化，初始化表單
watch(() => props.task, (newTask) => {
  if (newTask && props.show) {
    initializeForm(newTask)
  }
}, { immediate: true })

// 監聽顯示狀態，初始化表單
watch(() => props.show, (show) => {
  if (show && props.task) {
    initializeForm(props.task)
  }
})

// 監聽經驗值自動計算 (只對非父任務有效)
watch([() => form.value.difficulty, () => form.value.priority], () => {
  if (!isParentTask.value) {
    if (!form.value.experience || form.value.experience === calculatedExperience.value) {
      form.value.experience = calculatedExperience.value
    }
  }
})

// 初始化表單數據
const initializeForm = (task: Task) => {
  form.value = {
    title: task.title || '',
    task_type: task.type || 'main',
    description: task.description || '',
    priority: task.difficulty || 2,
    difficulty: task.difficulty || 3,
    experience: task.experience || calculatedExperience.value,
    due_date: task.deadline ? task.deadline.toISOString().split('T')[0] : ''
  }
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
    experience: 0,
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
  if (!validateForm() || !props.task) {
    return
  }

  loading.value = true
  errors.value = {}

  try {
    // 準備更新數據
    const updateData: any = {
      title: form.value.title.trim(),
      task_type: form.value.task_type,
      priority: form.value.priority,
      difficulty: form.value.difficulty
    }

    // 只有非父任務才更新經驗值
    if (!isParentTask.value) {
      updateData.experience = form.value.experience || calculatedExperience.value
    }

    // 只在有值時添加可選字段
    if (form.value.description?.trim()) {
      updateData.description = form.value.description.trim()
    }

    if (form.value.due_date) {
      updateData.due_date = `${form.value.due_date}T23:59:59Z`
    }

    // 使用 TaskStore 更新任務
    await taskStore.updateTask(props.task.id, updateData)

    // 轉換回前端格式
    const updatedTask: Task = {
      ...props.task,
      title: updateData.title,
      description: updateData.description,
      type: updateData.task_type as Task['type'],
      difficulty: updateData.difficulty as Task['difficulty'],
      experience: updateData.experience,
      deadline: updateData.due_date ? new Date(updateData.due_date) : undefined
    }

    emit('updated', updatedTask)
    closeDialog()
  } catch (error) {
    console.error('更新任務失敗:', error)
    errors.value.general = '更新任務失敗，請稍後再試'
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