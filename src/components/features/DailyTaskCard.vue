<template>
  <div class="task-card bg-white rounded-lg p-4 mx-4 mb-4 shadow-sm">
    <div class="flex items-center justify-between">
      <!-- 左側：圖標和任務信息 -->
      <div class="flex items-center space-x-3">
        <!-- 任務圖標 -->
        <div class="task-icon w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Target v-if="task.type === 'main'" class="w-6 h-6 text-gray-600" />
          <ClipboardList v-else-if="task.type === 'side'" class="w-6 h-6 text-gray-600" />
          <Zap v-else-if="task.type === 'challenge'" class="w-6 h-6 text-gray-600" />
          <Calendar v-else-if="task.type === 'daily'" class="w-6 h-6 text-gray-600" />
          <FileText v-else class="w-6 h-6 text-gray-600" />
        </div>
        
        <!-- 任務信息 -->
        <div class="task-info flex-1">
          <!-- 父任務名稱（如果存在） -->
          <p v-if="task.parent_task_title" class="parent-task-title text-xs text-warm-gray-500 mb-1">
            {{ task.parent_task_title }}
          </p>
          <h3 class="task-title text-base font-medium text-warm-gray-900 mb-1 leading-tight">
            {{ task.title }}
          </h3>
          <div class="flex items-center space-x-2">
            <!-- 任務日期（每日任務顯示日期，其他任務顯示時間） -->
            <p v-if="task.task_date" class="task-date text-sm text-warm-gray-600">
              {{ formatTaskDate(task.task_date) }}
            </p>
            <p v-else class="task-time text-sm text-warm-gray-600">
              {{ formatTime(task.scheduled_time) }}
            </p>
            <span class="status-badge text-xs px-2 py-1 rounded-full" :class="getStatusBadgeClass(task.status)">
              {{ getStatusText(task.status) }}
            </span>
          </div>
          
          <!-- 技能標籤 -->
          <SkillTags :skill-tags="skillObjects" class="mt-1" />
        </div>
      </div>
      
      <!-- 右側：完成狀態按鈕 -->
      <button 
        class="status-button w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
        :class="getStatusButtonClass(task.status)"
        @click="handleTaskClick"
      >
        <Check 
          v-if="task.status === 'completed' || task.status === 'daily_completed'"
          class="w-4 h-4"
        />
        <div 
          v-else-if="task.status === 'paused'"
          class="w-5 h-5 bg-current rounded flex items-center justify-center"
        >
          <span class="text-white text-xs">⏸</span>
        </div>
      </button>
    </div>
    
    <!-- 任務進度條 -->
    <div v-if="shouldShowProgress" class="mt-3">
      <TaskProgressBar 
        :progress="taskProgress" 
        :showDailyStats="task.parent_task_id !== undefined || task.status === 'daily_in_progress' || task.status === 'daily_completed'"
      />
    </div>
    
    <!-- 確認對話框 -->
    <ConfirmDialog
      v-model:visible="showConfirmDialog"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      confirm-text="是"
      cancel-text="否"
      @confirm="handleConfirmToggle"
      @cancel="handleCancelToggle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Task } from '@/types'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import TaskProgressBar from '@/components/common/TaskProgressBar.vue'
import SkillTags from '@/components/common/SkillTags.vue'
import { useSkillStore } from '@/stores/skill'
import { Check, Target, ClipboardList, Zap, Calendar, FileText } from 'lucide-vue-next'

interface Props {
  task: Task
}

interface Emits {
  (e: 'toggle', taskId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const skillStore = useSkillStore()

onMounted(() => {
  if (skillStore.skills.length === 0 && !skillStore.loading) {
    skillStore.fetchSkills()
  }
})

const skillObjects = computed(() => {
  if (!props.task.skillTags || !skillStore.skills.length) {
    return []
  }
  return props.task.skillTags
    .map(tagName => skillStore.skills.find(skill => skill.name === tagName))
    .filter(skill => !!skill) as { id: string; name: string }[]
})

// 是否應該顯示進度條
const shouldShowProgress = computed(() => {
  // 如果有進度數據，總是顯示
  if (props.task.progress) {
    return true
  }
  // 如果是子任務（有父任務ID），顯示簡單進度
  if (props.task.parent_task_id) {
    return true
  }
  // 如果是每日任務類型，顯示進度
  if (props.task.status?.includes('daily_')) {
    return true
  }
  return false
})

// 任務進度數據
const taskProgress = computed(() => {
  // Debug log to track changes
  console.log('DailyTaskCard taskProgress computed, task status:', props.task.status, 'task ID:', props.task.id)
  
  // 如果有現有的進度數據，使用它
  if (props.task.progress) {
    console.log('Using existing progress data:', props.task.progress)
    return props.task.progress
  }
  
  // 為子任務或每日任務創建簡單進度
  const isCompleted = props.task.status === 'completed' || props.task.status === 'daily_completed'
  
  const progress = {
    task_id: props.task.id,
    total_days: 1,
    completed_days: isCompleted ? 1 : 0,
    missed_days: 0,
    completion_rate: isCompleted ? 1.0 : 0.0,
    target_rate: 1.0,
    is_daily_completed: isCompleted,
    remaining_days: isCompleted ? 0 : 1
  }
  
  console.log('Generated progress data:', progress)
  return progress
})

// 確認對話框狀態
const showConfirmDialog = ref(false)

// 確認對話框標題和訊息
const confirmDialogTitle = computed(() => {
  if (props.task.status === 'completed' || props.task.status === 'daily_completed') {
    return props.task.status === 'daily_completed' ? '取消今日任務完成' : '取消完成任務'
  } else {
    if (props.task.status === 'daily_in_progress' || props.task.status === 'daily_not_completed') {
      return '完成今日任務'
    } else {
      return '完成任務'
    }
  }
})

const confirmDialogMessage = computed(() => {
  if (props.task.status === 'completed' || props.task.status === 'daily_completed') {
    const taskType = props.task.status === 'daily_completed' ? '今日任務' : '任務'
    return `確定要將「${props.task.title}」設為未完成嗎？`
  } else {
    if (props.task.status === 'daily_in_progress' || props.task.status === 'daily_not_completed') {
      return `確定要完成「${props.task.title}」嗎？`
    } else {
      return `確定要完成「${props.task.title}」嗎？`
    }
  }
})

// 處理任務點擊
const handleTaskClick = () => {
  showConfirmDialog.value = true
}

// 確認切換任務狀態
const handleConfirmToggle = () => {
  emit('toggle', props.task.id)
}

// 取消切換
const handleCancelToggle = () => {
  // 不執行任何操作，對話框會自動關閉
}

// 根據任務類型獲取圖標
const getTaskIcon = (type: Task['type']) => {
  const icons = {
    main: 'Target',
    side: 'ClipboardList', 
    challenge: 'Zap',
    daily: 'Calendar',
    subtask: 'FileText'
  }
  return icons[type] || 'FileText'
}

// 根據任務類型獲取圖標樣式
const getIconClass = (type: Task['type']) => {
  return '' // 保持統一的深色背景
}

// 根據狀態獲取按鈕樣式
const getStatusButtonClass = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-warm-gray-800 border-warm-gray-800'
    case 'daily_completed':
      return 'bg-gray-100 border-primary-400 text-primary-600' // 每日任務完成
    case 'in_progress':
      return 'bg-warm-gray-200 border-warm-gray-400'
    case 'daily_in_progress':
      return 'bg-blue-200 border-blue-400' // 每日任務進行中用藍色區分
    case 'daily_not_completed':
      return 'bg-gray-100 border-primary-400' // 每日任務未完成
    case 'paused':
      return 'bg-warm-gray-400 border-warm-gray-400'
    default:
      return 'bg-gray-100 border-primary-400 hover:border-primary-500'
  }
}

// 獲取狀態文本
const getStatusText = (status: Task['status']) => {
  switch (status) {
    case 'pending':
      return '待處理'
    case 'in_progress':
      return '進行中'
    case 'completed':
      return '已完成'
    case 'daily_in_progress':
      return '今日任務進行中'
    case 'daily_completed':
      return '今日任務完成'
    case 'daily_not_completed':
      return '今日任務未完成'
    case 'paused':
      return '已暫停'
    case 'cancelled':
      return '已取消'
    default:
      return '未知狀態'
  }
}

// 獲取狀態標籤樣式
const getStatusBadgeClass = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-gray-100 text-gray-700'
    case 'daily_completed':
      return 'bg-green-100 text-green-700'
    case 'daily_not_completed':
      return 'bg-red-100 text-red-700'
    case 'in_progress':
      return 'bg-orange-100 text-orange-700'
    case 'daily_in_progress':
      return 'bg-blue-100 text-blue-700'
    case 'paused':
      return 'bg-yellow-100 text-yellow-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

// 格式化任務日期顯示
const formatTaskDate = (dateString: string) => {
  try {
    const date = new Date(dateString + 'T00:00:00') // 確保正確解析日期
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const dayBeforeYesterday = new Date(today)
    dayBeforeYesterday.setDate(today.getDate() - 2)
    
    // 格式化為 YYYY-MM-DD 進行比較
    const dateStr = date.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const dayBeforeYesterdayStr = dayBeforeYesterday.toISOString().split('T')[0]
    
    if (dateStr === todayStr) {
      return '今天'
    } else {
      // 其他日期顯示月/日格式
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  } catch {
    return dateString
  }
}

// 格式化時間顯示
const formatTime = (timeString?: string) => {
  if (!timeString) {
    // 如果沒有設定時間，根據任務類型提供預設時間
    const now = new Date()
    const hour = now.getHours()
    
    switch (props.task.type) {
      case 'daily':
        return '上午 8:00'
      case 'main':
        return '上午 10:00'
      case 'side':
        return '下午 2:00'
      case 'challenge':
        return '下午 4:00'
      default:
        return `${hour < 12 ? '上午' : '下午'} ${hour % 12 || 12}:00`
    }
  }
  
  try {
    const date = new Date(timeString)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const period = hour < 12 ? '上午' : '下午'
    const displayHour = hour % 12 || 12
    
    return `${period} ${displayHour}:${minute.toString().padStart(2, '0')}`
  } catch {
    return timeString
  }
}
</script>

<style scoped>
.task-card {
  /* 基於 Figma 設計的卡片樣式 */
  background: rgba(255, 255, 255, 1);
  padding: 8px 16px;
  margin: 0 16px 16px 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border-radius: 0; /* 移除圓角以匹配 Figma */
}

.task-icon {
  /* 48x48 圓角矩形背景 */
  width: 48px;
  height: 48px;
  background: rgba(244, 242, 239, 1);
  border-radius: 8px;
}

.task-title {
  /* 符合 Figma 的字體設置 */
  font-family: 'Lexend', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: rgba(22, 22, 17, 1);
}

.task-time {
  /* 符合 Figma 的時間樣式 */
  font-family: 'Lexend', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: rgba(140, 127, 94, 1);
}

.parent-task-title {
  /* 父任務標題樣式 */
  font-family: 'Lexend', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: rgba(168, 162, 158, 1);
}

.status-button {
  /* 28x28 圓形按鈕 */
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* Warm gray color utilities */
.bg-warm-gray-100 { background-color: rgba(244, 242, 239, 1); }
.bg-warm-gray-200 { background-color: rgba(231, 229, 228, 1); }
.bg-warm-gray-300 { background-color: rgba(214, 211, 209, 1); }
.bg-warm-gray-400 { background-color: rgba(168, 162, 158, 1); }
.bg-warm-gray-600 { background-color: rgba(120, 113, 108, 1); }
.bg-warm-gray-800 { background-color: rgba(22, 22, 17, 1); }
.bg-warm-gray-900 { background-color: rgba(22, 22, 17, 1); }

.text-warm-gray-600 { color: rgba(140, 127, 94, 1); }
.text-warm-gray-800 { color: rgba(22, 22, 17, 1); }
.text-warm-gray-900 { color: rgba(22, 22, 17, 1); }

.border-warm-gray-300 { border-color: rgba(214, 211, 209, 1); }
.border-warm-gray-400 { border-color: rgba(168, 162, 158, 1); }
.border-warm-gray-800 { border-color: rgba(22, 22, 17, 1); }

.hover\:border-warm-gray-400:hover { border-color: rgba(168, 162, 158, 1); }
</style>