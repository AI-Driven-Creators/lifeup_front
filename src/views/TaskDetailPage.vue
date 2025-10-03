<template>
  <div class="h-screen bg-primary-50 flex flex-col overflow-hidden">
    <!-- 頂部導航區域 -->
    <div class="bg-gray-100 px-4 py-4 flex items-center">
      <!-- 返回按鈕 -->
      <button 
        @click="goBack"
        class="w-6 h-6 flex items-center justify-center mr-4"
      >
        <svg class="w-4 h-4 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <!-- 任務標題 -->
      <h1 class="flex-1 text-lg font-bold text-primary-900 text-center">
        {{ task?.title || '任務詳情' }}
      </h1>

      <!-- 操作菜單 -->
      <div v-if="task?.is_parent_task" class="flex items-center space-x-2">
        <!-- 編輯按鈕 -->
        <button
          @click="showEditDialog = true"
          class="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="編輯任務"
        >
          ✏️
        </button>

        <!-- 刪除按鈕 -->
        <button
          @click="showDeleteDialog = true"
          class="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="刪除任務"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- 載入狀態 -->
    <div v-if="loading" class="px-4 py-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">載入任務詳情中...</p>
    </div>
    
    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="px-4 py-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="text-red-600 mr-3">⚠️</div>
          <div>
            <h3 class="text-red-800 font-medium">載入失敗</h3>
            <p class="text-red-600 text-sm mt-1">{{ error }}</p>
          </div>
        </div>
        <button 
          @click="loadTaskDetail"
          class="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          重試
        </button>
      </div>
    </div>

    <!-- 任務詳情內容 -->
    <div v-else-if="task" class="flex-1 flex flex-col" :class="task.is_parent_task ? 'overflow-y-auto' : ''">
      <!-- 如果不是父任務，顯示為單個任務卡片 -->
      <div v-if="!task.is_parent_task" class="bg-white px-6 py-6 flex-1 overflow-hidden">
        <MissionTaskCard
          :task="task"
          @toggle="handleToggleTask"
          @taskUpdated="handleTaskUpdated"
        />
      </div>

      <!-- 如果是父任務，顯示原本的任務信息區域 -->
      <div v-else>
        <!-- 任務信息區域 -->
        <div class="bg-gray-100 px-4 py-5">
          <h2 class="text-2xl font-bold text-primary-900 mb-2">
            {{ task.title }}
          </h2>
          <p class="text-primary-700 text-base">
            等級：{{ task.difficulty }} | 成長：{{ task.experience }} XP
          </p>

          <!-- 任務日期顯示 -->
          <p v-if="(task as any).task_date" class="text-primary-600 text-sm mt-1">
            📅 {{ formatTaskDate((task as any).task_date) }}
          </p>

          <!-- 任務描述 -->
          <div v-if="task.description" class="text-sm mt-3 space-y-2">
            <p class="text-primary-700">{{ parseTaskDescription(task.description).main }}</p>

            <p v-if="parseTaskDescription(task.description).personality" class="text-primary-700">
              💡 <span class="font-medium">個性化說明：</span>{{ parseTaskDescription(task.description).personality }}
            </p>

            <div v-if="parseTaskDescription(task.description).resources.length > 0">
              <p class="text-primary-700 font-medium">📚 推薦資源：</p>
              <ul class="text-primary-700 pl-4 mt-0.5">
                <li v-for="(resource, rIdx) in parseTaskDescription(task.description).resources" :key="rIdx">• {{ resource }}</li>
              </ul>
            </div>
          </div>

          <!-- 任務狀態標籤 -->
          <div class="mt-3 flex items-center space-x-2">
            <span class="status-badge text-xs px-2 py-1 rounded-full" :class="getStatusBadgeClass(task.status)">
              {{ getStatusDisplayText(task.status) }}
            </span>
            <!-- 每日任務子類型標記 -->
            <span v-if="task.dailyTaskSubtype === 'recurring'" class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">常駐目標</span>
            <span v-else-if="task.dailyTaskSubtype === 'simple'" class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">今日行動</span>
          </div>

          <!-- 任務進度條 -->
          <div v-if="task.progress || task.is_parent_task" class="mt-4">
            <TaskProgressBar
              :progress="taskProgress"
              :showDailyStats="task.isRecurring || task.status === 'daily_in_progress' || task.status === 'daily_completed'"
            />
          </div>
        </div>
      </div>

      <!-- 完成任務區域 -->
      <div v-if="task.is_parent_task && subtasks.length > 0" class="bg-white px-4 py-5">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-primary-900">完成任務</h3>
          <div class="flex items-center space-x-3">
            <!-- 每日任務提示 -->
            <div v-if="isDailyTask" class="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
              📅 顯示最近3天（包含今天）
            </div>
            <!-- 添加子任務按鈕 -->
            <button
              v-if="!isDailyTask"
              @click="showCreateSubtaskDialog = true"
              class="inline-flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              title="添加子任務"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="space-y-3 mb-12">
          <MissionTaskCard
            v-for="subtask in sortedSubtasks"
            :key="subtask.id"
            :task="subtask"
            @toggle="handleToggleSubtask"
            @taskUpdated="handleSubtaskUpdated"
          />
        </div>
      </div>

      <!-- 如果沒有子任務 -->
      <div v-else-if="task.is_parent_task" class="bg-white px-4 py-5">
        <div class="text-center py-8">
          <div class="text-gray-400 text-4xl mb-3">📝</div>
          <p class="text-gray-600 text-sm mb-4">還沒有子任務</p>
          <button
            @click="showCreateSubtaskDialog = true"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            創建子任務
          </button>
        </div>
      </div>

    </div>

    <!-- 創建子任務對話框 -->
    <CreateSubtaskDialog
      v-if="task?.id"
      :show="showCreateSubtaskDialog"
      :parentTaskId="task.id"
      @close="showCreateSubtaskDialog = false"
      @created="handleSubtaskCreated"
    />

    <!-- 編輯子任務對話框 -->
    <EditSubtaskDialog
      :show="showEditSubtaskDialog"
      :subtask="editingSubtask"
      @close="showEditSubtaskDialog = false"
      @updated="handleSubtaskUpdated"
      @deleted="handleSubtaskDeleted"
    />

    <!-- 編輯任務對話框 -->
    <EditTaskDialog
      :show="showEditDialog"
      :task="task"
      @close="showEditDialog = false"
      @updated="handleTaskUpdated"
    />

    <!-- 刪除任務確認對話框 -->
    <ConfirmDialog
      v-model:visible="showDeleteDialog"
      title="⚠️ 刪除任務"
      :message="`確定要永久刪除「${task?.title}」嗎？\n\n此操作將會：\n• 刪除此任務的所有子任務\n• 無法復原\n• 不會影響已獲得的經驗值`"
      confirmText="確認刪除"
      cancelText="取消"
      @confirm="handleDeleteTask"
      danger
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { useSkillStore } from '@/stores/skill'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'
import TaskProgressBar from '@/components/common/TaskProgressBar.vue'
import SkillTags from '@/components/common/SkillTags.vue'
import CreateSubtaskDialog from '@/components/features/CreateSubtaskDialog.vue'
import EditSubtaskDialog from '@/components/features/EditSubtaskDialog.vue'
import EditTaskDialog from '@/components/features/EditTaskDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import MissionTaskCard from '@/components/features/MissionTaskCard.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const skillStore = useSkillStore()

// 響應式數據
const task = ref<Task | null>(null)
const subtasks = ref<Task[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const isDailyTask = ref(false)

// 對話框狀態
const showCreateSubtaskDialog = ref(false)
const showEditSubtaskDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const editingSubtask = ref<Task | null>(null)

// 排序後的子任務
const sortedSubtasks = computed(() => {
  if (!subtasks.value) return []
  
  return [...subtasks.value].sort((a, b) => {
    // 對於每日任務，簡化排序邏輯
    if (isDailyTask.value) {
      // 每日任務：未完成的在前，已完成的在後
      const getDailyStatusPriority = (status: string) => {
        switch (status) {
          case 'daily_not_completed': return 0
          case 'daily_completed': return 1
          default: return 2
        }
      }
      
      const priorityA = getDailyStatusPriority(a.status)
      const priorityB = getDailyStatusPriority(b.status)
      
      if (priorityA === priorityB) {
        return (a.task_order || 0) - (b.task_order || 0)
      }
      return priorityA - priorityB
    } else {
      // 檢查父任務是否為職業主線任務
      const isCareerMainline = task.value?.task_category === 'career_mainline' ||
                              task.value?.career_mainline_id

      // 檢查當前兩個子任務是否都是職業相關
      const aIsCareer = a.task_category === 'career_subtask' || a.career_mainline_id
      const bIsCareer = b.task_category === 'career_subtask' || b.career_mainline_id

      // 調試信息
      console.log('排序調試:', {
        parentTask: {
          task_category: task.value?.task_category,
          career_mainline_id: task.value?.career_mainline_id,
          isCareerMainline
        },
        taskA: {
          title: a.title,
          task_category: a.task_category,
          career_mainline_id: a.career_mainline_id,
          task_order: a.task_order,
          status: a.status,
          isCareer: aIsCareer
        },
        taskB: {
          title: b.title,
          task_category: b.task_category,
          career_mainline_id: b.career_mainline_id,
          task_order: b.task_order,
          status: b.status,
          isCareer: bIsCareer
        }
      })

      // 如果是職業主線任務，且兩個子任務都是職業相關的，使用順序排序
      if (isCareerMainline && aIsCareer && bIsCareer) {
        console.log('使用職業主線排序:', (a.task_order || 0) - (b.task_order || 0))
        return (a.task_order || 0) - (b.task_order || 0)
      } else {
        // 普通任務：保持原有排序邏輯
        const getStatusPriority = (status: string) => {
          switch (status) {
            case 'pending': return 0
            case 'in_progress':
            case 'daily_in_progress': return 1
            case 'completed':
            case 'daily_completed': return 2
            case 'daily_not_completed': return 3
            default: return 4 // paused, cancelled 等其他狀態
          }
        }

        const priorityA = getStatusPriority(a.status)
        const priorityB = getStatusPriority(b.status)

        if (priorityA === priorityB) {
          return (a.task_order || 0) - (b.task_order || 0)
        }
        return priorityA - priorityB
      }
    }
  })
})

// 獲取任務的技能對象
const getSkillObjectsForTask = (task: Task) => {
  if (!task.skillTags || task.skillTags.length === 0) {
    return []
  }
  if (!skillStore.skills.length) {
    // 技能列表還在載入中，返回 undefined 表示載入中狀態
    return undefined
  }
  return task.skillTags
    .map(tagName => skillStore.skills.find(skill => skill.name === tagName))
    .filter(skill => !!skill) as { id: string; name: string }[]
}

// 任務進度數據
const taskProgress = computed(() => {
  // 如果是父任務，優先根據子任務計算進度（即時計算，不依賴舊的progress數據）
  if (task.value?.is_parent_task && subtasks.value.length > 0) {
    const totalSubtasks = subtasks.value.length
    const completedSubtasks = subtasks.value.filter(subtask => 
      subtask.status === 'completed' || subtask.status === 'daily_completed'
    ).length
    
    return {
      task_id: task.value.id,
      total_days: totalSubtasks,
      completed_days: completedSubtasks,
      missed_days: 0,
      completion_rate: totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) : 0,
      target_rate: 1.0,
      is_daily_completed: completedSubtasks === totalSubtasks,
      remaining_days: totalSubtasks - completedSubtasks
    }
  }
  
  // 如果有現有的進度數據且不是父任務，使用它
  if (task.value?.progress) {
    return task.value.progress
  }
  
  // 為單個任務創建基本進度數據
  const isCompleted = task.value?.status === 'completed' || task.value?.status === 'daily_completed'
  
  return {
    task_id: task.value?.id || '',
    total_days: 1,
    completed_days: isCompleted ? 1 : 0,
    missed_days: 0,
    completion_rate: isCompleted ? 1.0 : 0.0,
    target_rate: 1.0,
    is_daily_completed: isCompleted,
    remaining_days: isCompleted ? 0 : 1
  }
})

// 返回上一頁
const goBack = () => {
  router.back()
}

// 載入任務詳情
const loadTaskDetail = async () => {
  const taskId = route.params.id as string
  if (!taskId) {
    error.value = '任務ID無效'
    return
  }

  loading.value = true
  error.value = null

  try {
    // 載入任務詳情
    const taskResponse = await apiClient.getTask(taskId)
    if (taskResponse.success) {
      const foundTask = taskStore.transformBackendTask(taskResponse.data)
      
      if (!foundTask) {
        error.value = '找不到指定的任務'
        return
      }
      
      task.value = foundTask

      // 載入任務進度數據
      if (foundTask.is_parent_task || (foundTask as any).is_recurring) {
        try {
          const progressResponse = await apiClient.getTaskProgress(taskId)
          if (progressResponse.success) {
            task.value.progress = progressResponse.data
          } else {
            console.warn(`進度API失敗 (${foundTask.title}):`, progressResponse.message)
          }
        } catch (err) {
          console.warn('Failed to load task progress:', err)
          // 進度載入失敗不影響任務顯示
        }
      }

      // 如果是大任務，載入子任務
      if (foundTask.is_parent_task) {
        // 判斷是否為每日任務（重複性任務或任務類型為 daily）
        isDailyTask.value = foundTask.isRecurring || foundTask.type === 'daily'
        
        const subtaskResponse = await apiClient.getSubtasks(taskId, {
          daily: isDailyTask.value,
          days: isDailyTask.value ? 3 : undefined // 每日任務只查詢最近3天
        })
        
        if (subtaskResponse.success) {
          subtasks.value = subtaskResponse.data
            .map(taskStore.transformBackendTask)
            .sort((a, b) => (a.task_order || 0) - (b.task_order || 0))
        }
      }
    } else {
      error.value = taskResponse.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '載入任務詳情失敗'
    console.error('Failed to load task detail:', err)
  } finally {
    loading.value = false
  }
}


// MissionTaskCard 的 toggle 事件處理（針對主任務本身）
const handleToggleTask = async (taskId: string) => {
  if (!task.value) return
  await handleToggleStatus()
}

// 切換任務狀態（針對非大任務）
const handleToggleStatus = async () => {
  if (!task.value) return

  isLoading.value = true
  try {
    await taskStore.toggleTaskStatus(task.value.id, task.value.status)
    // 重新載入任務詳情
    await loadTaskDetail()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新任務狀態失敗'
    console.error('Failed to toggle task status:', err)
  } finally {
    isLoading.value = false
  }
}

// MissionTaskCard 的 toggle 事件處理
const handleToggleSubtask = async (subtaskId: string) => {
  const subtask = subtasks.value.find(t => t.id === subtaskId)
  if (subtask) {
    await toggleSubtaskStatus(subtask)
  }
}

// 切換子任務狀態
const toggleSubtaskStatus = async (subtask: Task) => {
  // 如果父任務暫停，則不允許操作子任務
  if (subtask.status === 'paused' && task.value?.status === 'paused') {
    console.log('父任務暫停中，無法操作子任務')
    return
  }

  // 防止重複點擊
  if (isLoading.value) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await taskStore.toggleTaskStatus(subtask.id, subtask.status)

    // 重新載入任務詳情以確保數據一致性
    await loadTaskDetail()

    console.log('子任務狀態更新成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新子任務狀態失敗'
    console.error('Failed to toggle subtask status:', err)

    // 顯示錯誤提示
    setTimeout(() => {
      error.value = null
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// 回復子任務狀態到上一個階段
const revertSubtaskStatus = async (subtask: Task) => {
  // 如果父任務暫停，則不允許操作子任務
  if (subtask.status === 'paused' && task.value?.status === 'paused') {
    console.log('父任務暫停中，無法操作子任務')
    return
  }
  
  // 防止重複點擊
  if (isLoading.value) {
    return
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    console.log('嘗試回復子任務狀態:', subtask.id, '當前狀態:', subtask.status, 'reverse: true')
    
    await taskStore.toggleTaskStatus(subtask.id, subtask.status, true) // reverse = true
    
    // 重新載入任務詳情以確保數據一致性
    await loadTaskDetail()
    
    console.log('子任務狀態回復成功')
  } catch (err) {
    error.value = err instanceof Error ? err.message : '回復子任務狀態失敗'
    console.error('Failed to revert subtask status:', err)
    
    // 顯示錯誤提示
    setTimeout(() => {
      error.value = null
    }, 3000)
  } finally {
    isLoading.value = false
  }
}

// 獲取狀態邊框樣式
const getStatusBorderClass = (status: string) => {
  switch (status) {
    case 'pending': return 'border-orange-400'
    case 'in_progress': return 'border-blue-400'
    case 'completed': return 'border-green-400'
    case 'daily_in_progress': return 'border-blue-500'
    case 'daily_completed': return 'border-green-500'
    case 'daily_not_completed': return 'border-red-500'
    case 'paused': return 'border-gray-400'
    case 'cancelled': return 'border-red-400'
    default: return 'border-gray-200'
  }
}

// 獲取狀態按鈕樣式
const getStatusButtonClass = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    case 'in_progress': return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'daily_in_progress': return 'bg-blue-200 text-blue-800 hover:bg-blue-300'
    case 'daily_completed': return 'bg-green-200 text-green-800 hover:bg-green-300'
    case 'daily_not_completed': return 'bg-red-200 text-red-800 hover:bg-red-300'
    case 'paused': 
      // 如果是因為父任務暫停而暫停，使用不可點擊的樣式
      return task.value?.status === 'paused'
        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200'
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
}

// 獲取狀態文字 (用於按鈕)
const getStatusText = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return '開始'
    case 'in_progress': return '完成'
    case 'daily_in_progress': return '完成'
    case 'completed': return '已完成'
    case 'daily_completed': return '今日已完成'
    case 'daily_not_completed': return '標記完成'
    case 'paused': 
      // 判斷是否因為父任務暫停而暫停
      return task.value?.status === 'paused' ? '主任務暫停中' : '繼續'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 獲取狀態文字 (用於顯示)
const getStatusDisplayText = (status: string) => {
  switch (status) {
    case 'pending': return '待處理'
    case 'in_progress': return '進行中'
    case 'completed': return '已完成'
    case 'daily_in_progress': return '今日任務進行中'
    case 'daily_completed': return '今日任務完成'
    case 'daily_not_completed': return '今日任務未完成'
    case 'paused': return '已暫停'
    case 'cancelled': return '已取消'
    default: return '未知狀態'
  }
}

// 獲取狀態標籤文字
const getStatusLabel = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return '待處理'
    case 'in_progress': return '進行中'
    case 'completed': return '已完成'
    case 'daily_in_progress': return '今日進行中'
    case 'daily_completed': return '每日已完成'
    case 'daily_not_completed': return '每日未完成'
    case 'paused': return '已暫停'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

// 獲取狀態標籤樣式
const getStatusLabelClass = (subtask: Task) => {
  switch (subtask.status) {
    case 'pending': return 'bg-orange-100 text-orange-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'
    case 'completed': return 'bg-green-100 text-green-800'
    case 'daily_in_progress': return 'bg-blue-100 text-blue-700'
    case 'daily_completed': return 'bg-green-100 text-green-700'
    case 'daily_not_completed': return 'bg-red-100 text-red-700'
    case 'paused': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// 獲取狀態標籤樣式 (用於父任務)
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-gray-100 text-gray-700'
    case 'daily_completed': return 'bg-green-100 text-green-700'
    case 'daily_not_completed': return 'bg-red-100 text-red-700'
    case 'in_progress': return 'bg-orange-100 text-orange-700'
    case 'daily_in_progress': return 'bg-blue-100 text-blue-700'
    case 'paused': return 'bg-yellow-100 text-yellow-700'
    case 'cancelled': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-500'
  }
}

// 獲取回復按鈕的提示文字
const getRevertButtonTitle = (subtask: Task) => {
  switch (subtask.status) {
    case 'completed': return '回復到進行中'
    case 'daily_completed': return '回復到今日進行中'
    case 'daily_not_completed': return '回復到今日進行中'
    case 'in_progress': return '回復到待處理'
    case 'daily_in_progress': return '回復到待處理'
    default: return '回復'
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

// 解析任務描述
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

// 編輯子任務
const editSubtask = (subtask: Task) => {
  editingSubtask.value = subtask
  showEditSubtaskDialog.value = true
}

// 處理子任務創建
const handleSubtaskCreated = async (newSubtask: Task) => {
  await loadTaskDetail() // 重新載入任務詳情
}

// 處理子任務更新
const handleSubtaskUpdated = async (updatedSubtask: Task) => {
  await loadTaskDetail() // 重新載入任務詳情
}

// 處理子任務刪除
const handleSubtaskDeleted = async (deletedSubtaskId: string) => {
  await loadTaskDetail() // 重新載入任務詳情
}

// 處理任務更新
const handleTaskUpdated = async (updatedTask: Task) => {
  // 更新本地任務資料
  task.value = { ...task.value, ...updatedTask }

  // 重新載入任務詳情以確保數據同步
  await loadTaskDetail()
}

// 處理任務刪除
const handleDeleteTask = async () => {
  if (!task.value) return

  showDeleteDialog.value = false
  loading.value = true

  try {
    await taskStore.deleteTask(task.value.id)
    // 刪除成功後返回上一頁
    router.go(-1)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '刪除任務失敗'
    console.error('Failed to delete task:', err)
  } finally {
    loading.value = false
  }
}

// 頁面載入時獲取任務詳情
onMounted(() => {
  loadTaskDetail()
  // 載入技能數據
  if (skillStore.skills.length === 0 && !skillStore.loading) {
    skillStore.fetchSkills()
  }
})
</script>