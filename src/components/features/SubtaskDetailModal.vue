<template>
  <!-- 遮罩層 -->
  <Transition name="modal-backdrop">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
      @click="handleClose"
    ></div>
  </Transition>

  <!-- Modal 卡片 -->
  <Transition name="modal-card">
    <div
      v-if="visible"
      class="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
    >
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-stone-200" @click.stop>
        <!-- 頂部區域 -->
        <div class="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 px-6 py-5 border-b-2 border-amber-200">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h2 class="text-xl font-bold mb-2 text-stone-800">{{ task.title }}</h2>
              <div class="flex items-center flex-wrap gap-2">
                <!-- 技能標籤 -->
                <span
                  v-for="skillTag in skillObjects"
                  :key="skillTag.id"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); color: #78716c; border: 1px solid #fde68a;"
                >
                  {{ skillTag.name }}
                </span>
                <!-- 經驗值 -->
                <span class="flex items-center text-stone-600 font-semibold text-base">
                  +{{ task.experience }} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 內容區域 -->
        <div class="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <!-- 任務日期 -->
          <div v-if="task.task_date" class="flex items-center text-gray-600 text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {{ formatTaskDate(task.task_date) }}
          </div>

          <!-- 任務描述 -->
          <div v-if="task.description" class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {{ formattedDescription }}
          </div>

          <!-- 難度顯示 -->
          <div class="flex items-center text-stone-600 text-sm">
            難度 <span class="ml-1">{{ '⭐'.repeat(task.difficulty) }}</span>
          </div>

          <!-- 屬性值顯示 -->
          <div v-if="hasAttributes" class="space-y-2">
            <h3 class="text-sm font-semibold text-stone-700">屬性獎勵</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(value, attr) in task.attributes"
                :key="attr"
                class="inline-flex items-center px-3 py-1.5 text-sm border font-medium rounded-full"
                style="background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); color: #78716c; border-color: #e7e5e4;"
              >
                {{ getAttributeName(attr as string) }} +{{ value }}
              </span>
            </div>
          </div>

          <!-- 狀態顯示 -->
          <div class="flex items-center justify-between pt-2 border-t border-stone-100">
            <span class="text-sm text-stone-600 font-medium">任務狀態</span>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusBadgeClass(task.status)"
              style="background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%); border: 1px solid #e7e5e4;"
            >
              {{ getStatusLabel(task.status) }}
            </span>
          </div>
        </div>

        <!-- 底部按鈕區域 -->
        <div class="px-6 py-4 bg-white">
          <!-- 待處理：開始任務 -->
          <button
            v-if="task.status === 'pending'"
            @click="handleToggleStatus"
            :disabled="loading"
            class="w-full px-4 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); color: #78716c; border: 2px solid #fde68a; box-shadow: 0 2px 4px rgba(120, 113, 108, 0.1);"
          >
            {{ loading ? '處理中...' : '開始任務' }}
          </button>

          <!-- 進行中：標記完成 -->
          <button
            v-else-if="['in_progress', 'daily_in_progress', 'daily_not_completed'].includes(task.status)"
            @click="handleToggleStatus"
            :disabled="loading"
            class="w-full px-4 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #78716c; border: 2px solid #fcd34d; box-shadow: 0 2px 4px rgba(120, 113, 108, 0.15);"
          >
            {{ loading ? '處理中...' : '標記完成' }}
          </button>

          <!-- 已完成：回復按鈕 -->
          <button
            v-else-if="['completed', 'daily_completed'].includes(task.status)"
            @click="handleRevert"
            :disabled="loading"
            class="w-full px-4 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:bg-stone-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '處理中...' : '↶ 回復到進行中' }}
          </button>

          <!-- 其他狀態：通用操作按鈕 -->
          <button
            v-else
            @click="handleToggleStatus"
            :disabled="loading"
            :class="getActionButtonClass(task.status)"
            class="w-full px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ loading ? '處理中...' : getActionButtonText(task.status) }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task } from '@/types'
import SkillTags from '@/components/common/SkillTags.vue'
import { useSkillStore } from '@/stores/skill'
import { useTaskStore } from '@/stores/task'

interface Props {
  visible: boolean
  task: Task | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
  (e: 'updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const skillStore = useSkillStore()
const taskStore = useTaskStore()
const loading = ref(false)

// 計算技能對象 - 直接使用技能標籤名稱，不依賴 skill store
const skillObjects = computed(() => {
  if (!props.task?.skillTags || props.task.skillTags.length === 0) {
    return []
  }

  // 直接將技能標籤名稱轉換為顯示對象
  return props.task.skillTags.map((tagName, index) => ({
    id: `skill-${index}`,
    name: tagName
  }))
})

// 檢查是否有屬性
const hasAttributes = computed(() => {
  return props.task?.attributes &&
         typeof props.task.attributes === 'object' &&
         Object.keys(props.task.attributes).length > 0
})

// 格式化描述，處理換行符號
const formattedDescription = computed(() => {
  if (!props.task?.description) return ''
  // 將 \\n 和 \n 都轉換為真正的換行符號
  return props.task.description
    .replace(/\\\\n/g, '\n')  // 處理 \\n
    .replace(/\\n/g, '\n')    // 處理 \n
})

// 屬性名稱轉換
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

// 格式化任務日期
const formatTaskDate = (dateString: string) => {
  try {
    const date = new Date(dateString + 'T00:00:00')
    const today = new Date()
    const dateStr = date.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]

    if (dateStr === todayStr) {
      return '今天'
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  } catch {
    return dateString
  }
}

// 獲取狀態標籤文字
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return '待處理'
    case 'in_progress': return '進行中'
    case 'completed': return '已完成'
    case 'daily_in_progress': return '今日進行中'
    case 'daily_completed': return '今日已完成'
    case 'daily_not_completed': return '今日未完成'
    case 'paused': return '已暫停'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 獲取狀態標籤樣式
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending': return 'text-stone-700'
    case 'in_progress': return 'text-stone-700'
    case 'completed': return 'text-stone-700'
    case 'daily_in_progress': return 'text-stone-700'
    case 'daily_completed': return 'text-stone-700'
    case 'daily_not_completed': return 'text-stone-700'
    case 'paused': return 'text-stone-700'
    case 'cancelled': return 'text-stone-700'
    default: return 'text-stone-700'
  }
}

// 獲取操作按鈕文字
const getActionButtonText = (status: string) => {
  switch (status) {
    case 'pending': return '開始任務'
    case 'in_progress': return '標記完成'
    case 'daily_in_progress': return '標記完成'
    case 'daily_not_completed': return '標記完成'
    case 'paused': return '繼續'
    default: return '操作'
  }
}

// 獲取操作按鈕樣式
const getActionButtonClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg'
    case 'in_progress': return 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
    case 'daily_in_progress': return 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
    case 'daily_not_completed': return 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
    case 'paused': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg'
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg'
  }
}

// 關閉 Modal
const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

// 切換任務狀態
const handleToggleStatus = async () => {
  if (!props.task || loading.value) return

  loading.value = true
  try {
    await taskStore.toggleTaskStatus(props.task.id, props.task.status)
    emit('updated')
    // 不自動關閉，讓用戶看到完成狀態
  } catch (error) {
    console.error('Failed to toggle task status:', error)
  } finally {
    loading.value = false
  }
}

// 回復任務狀態
const handleRevert = async () => {
  if (!props.task || loading.value) return

  loading.value = true
  try {
    await taskStore.toggleTaskStatus(props.task.id, props.task.status, true)
    emit('updated')
  } catch (error) {
    console.error('Failed to revert task status:', error)
  } finally {
    loading.value = false
  }
}

// 監聽 visible 變化，載入技能數據
watch(() => props.visible, (newVisible) => {
  if (newVisible && skillStore.skills.length === 0 && !skillStore.loading) {
    skillStore.fetchSkills()
  }
})
</script>

<style scoped>
/* Modal 背景淡入淡出動畫 */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* Modal 卡片彈出動畫 */
.modal-card-enter-active {
  transition: all 0.3s ease-out;
}

.modal-card-leave-active {
  transition: all 0.2s ease-in;
}

.modal-card-enter-from {
  opacity: 0;
  transform: translateY(-50%) scale(0.9);
}

.modal-card-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.95);
}
</style>
