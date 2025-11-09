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

          <!-- 優先級和難度 -->
          <div class="grid grid-cols-2 gap-4 mb-4">
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
          <div v-if="isParentTask" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">經驗值</label>
            <div class="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
              {{ props.task?.experience || 0 }} EXP
              <span class="text-xs text-blue-500 ml-2">(由所有子任務計算)</span>
            </div>
          </div>
          <div v-else class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">經驗值</label>
            <div class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
              {{ calculatedExperience }} EXP
              <span class="text-xs text-gray-500 ml-2">(自動計算)</span>
            </div>
          </div>

          <!-- 常駐目標的重複規則設置 -->
          <div v-if="isRecurringTask" class="mb-4">
            <!-- 重複模式 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">重複頻率</label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="pattern in recurrencePatterns" :key="pattern.value"
                       class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                       :class="{ 'border-primary-500 bg-primary-50': form.recurrence_pattern === pattern.value }">
                  <input v-model="form.recurrence_pattern" :value="pattern.value" type="radio" class="sr-only">
                  <div class="flex items-center w-full">
                    <span class="text-xl mr-2">{{ pattern.icon }}</span>
                    <div>
                      <div class="font-medium text-xs">{{ pattern.label }}</div>
                      <div class="text-xs text-gray-500">{{ pattern.description }}</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- 執行期間設定 -->
            <div class="bg-gray-50 p-3 rounded-lg mb-4">
              <h4 class="font-medium text-gray-800 mb-3 text-sm">📅 執行期間</h4>

              <!-- 快速選擇 -->
              <div class="mb-3">
                <label class="block text-xs font-medium text-gray-700 mb-2">快速選擇</label>
                <div class="grid grid-cols-3 gap-2">
                  <button @click="setQuickDuration(21)" type="button"
                          class="px-2 py-2 text-xs border rounded-lg hover:bg-white transition-colors"
                          :class="{ 'border-primary-500 bg-white': isQuickDuration(21) }">
                    21天習慣
                  </button>
                  <button @click="setQuickDuration(30)" type="button"
                          class="px-2 py-2 text-xs border rounded-lg hover:bg-white transition-colors"
                          :class="{ 'border-primary-500 bg-white': isQuickDuration(30) }">
                    30天挑戰
                  </button>
                  <button @click="setQuickDuration(90)" type="button"
                          class="px-2 py-2 text-xs border rounded-lg hover:bg-white transition-colors"
                          :class="{ 'border-primary-500 bg-white': isQuickDuration(90) }">
                    90天養成
                  </button>
                </div>
              </div>

              <!-- 自訂日期 -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">開始日期</label>
                  <input v-model="form.start_date" type="date"
                         class="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">結束日期</label>
                  <input v-model="form.end_date" type="date"
                         class="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg bg-white">
                </div>
              </div>

              <!-- 期間顯示 -->
              <div v-if="totalDays > 0" class="mt-2 text-xs text-gray-600">
                總計：<span class="font-medium text-primary-600">{{ totalDays }}</span> 天
              </div>
              <div v-if="form.start_date && form.end_date && totalDays <= 0" class="mt-2 text-xs text-red-600">
                ⚠️ 結束日期必須晚於開始日期
              </div>
            </div>

            <!-- 完成率目標 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                完成率目標：<span class="text-base font-bold text-primary-600">{{ Math.round(form.target_completion_rate * 100) }}%</span>
              </label>
              <div class="px-3 py-2 bg-white border border-gray-200 rounded-lg">
                <input v-model.number="form.target_completion_rate" type="range"
                       min="0.1" max="1" step="0.05"
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>50%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>
              </div>
              <p v-if="totalDays > 0" class="text-xs text-gray-600 mt-1">
                在 {{ totalDays }} 天內，預期完成 <strong>{{ Math.round(totalDays * form.target_completion_rate) }}</strong> 天
              </p>
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
              @click="handleDelete"
              class="px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              :disabled="loading"
            >
              刪除
            </button>
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
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const taskStore = useTaskStore()

// 表單數據
const form = ref({
  title: '',
  task_type: 'main',
  description: '',
  priority: 1,
  difficulty: 1,
  experience: 0,
  due_date: '',
  recurrence_pattern: 'daily',
  start_date: '',
  end_date: '',
  target_completion_rate: 0.8
})

// UI 狀態
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
  return props.task?.is_parent_task === true
})

// 判斷是否為常駐目標
const isRecurringTask = computed(() => {
  return props.task?.type === 'daily' && props.task?.isRecurring === true
})

// 重複模式選項
const recurrencePatterns = [
  {
    value: 'daily',
    label: '每日',
    description: '每天都要完成',
    icon: '📅'
  },
  {
    value: 'weekdays',
    label: '工作日',
    description: '週一至週五',
    icon: '💼'
  },
  {
    value: 'weekends',
    label: '週末',
    description: '週六和週日',
    icon: '🎉'
  },
  {
    value: 'weekly',
    label: '每週',
    description: '每週完成一次',
    icon: '📆'
  }
]

// 計算總天數
const totalDays = computed(() => {
  if (!form.value.start_date || !form.value.end_date) return 0

  const start = new Date(form.value.start_date)
  const end = new Date(form.value.end_date)
  const pattern = form.value.recurrence_pattern || 'daily'

  // 計算總天數（不含重複模式）
  const totalCalendarDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  if (totalCalendarDays <= 0) return 0

  // 根據重複模式計算實際任務天數
  if (pattern === 'daily') {
    return totalCalendarDays
  } else if (pattern === 'weekdays') {
    // 工作日：只算週一到週五
    let count = 0
    const current = new Date(start)
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  } else if (pattern === 'weekends') {
    // 週末：只算週六和週日
    let count = 0
    const current = new Date(start)
    while (current <= end) {
      const dayOfWeek = current.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }
    return count
  } else if (pattern === 'weekly') {
    return Math.ceil(totalCalendarDays / 7)
  }

  return totalCalendarDays
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
    priority: task.priority || 1,
    difficulty: task.difficulty || 1,
    experience: task.experience || calculatedExperience.value,
    due_date: task.deadline ? task.deadline.toISOString().split('T')[0] : '',
    recurrence_pattern: task.recurrence_pattern || 'daily',
    start_date: typeof task.start_date === 'string' ? task.start_date : (task.start_date instanceof Date ? task.start_date.toISOString().split('T')[0] : ''),
    end_date: typeof task.end_date === 'string' ? task.end_date : (task.end_date instanceof Date ? task.end_date.toISOString().split('T')[0] : ''),
    target_completion_rate: task.completion_target || 0.8
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
    due_date: '',
    recurrence_pattern: 'daily',
    start_date: '',
    end_date: '',
    target_completion_rate: 0.8
  }
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

    // 常駐目標的重複規則
    if (isRecurringTask.value) {
      updateData.recurrence_pattern = form.value.recurrence_pattern
      updateData.start_date = form.value.start_date
      updateData.end_date = form.value.end_date
      updateData.target_completion_rate = form.value.target_completion_rate
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

// 快速設定期間
const setQuickDuration = (days: number) => {
  const today = new Date()
  const endDate = new Date(today)
  endDate.setDate(today.getDate() + days - 1) // 減1因為包含今天

  form.value.start_date = today.toISOString().split('T')[0]
  form.value.end_date = endDate.toISOString().split('T')[0]
}

// 檢查是否為快速選擇的期間
const isQuickDuration = (days: number) => {
  if (!form.value.start_date || !form.value.end_date) return false

  const start = new Date(form.value.start_date)
  const end = new Date(form.value.end_date)
  const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return diffDays === days
}

// 處理刪除
const handleDelete = () => {
  emit('delete')
  closeDialog()
}
</script>