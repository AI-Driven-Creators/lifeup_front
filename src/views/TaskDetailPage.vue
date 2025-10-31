<template>
  <div class="min-h-screen bg-primary-50 pb-20">
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
      <div v-if="task?.is_parent_task || task?.type === 'daily'" class="flex items-center space-x-2">
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
    <div v-else-if="task" class="flex flex-col">
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
        <p v-if="task.description" class="text-primary-700 text-sm mt-3">
          {{ task.description }}
        </p>
        
        <!-- 任務狀態標籤 -->
        <div class="mt-3 flex items-center space-x-2">
          <span class="status-badge text-xs px-2 py-1 rounded-full" :class="getStatusBadgeClass(task.status)">
            {{ getStatusDisplayText(task.status) }}
          </span>
          <!-- 每日任務子類型標記 -->
          <span v-if="task.dailyTaskSubtype === 'recurring'" class="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">常駐目標</span>
          <span v-else-if="task.dailyTaskSubtype === 'simple'" class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">今日行動</span>
        </div>

        <!-- 子任務生成中提示 -->
        <div v-if="isGeneratingSubtasks" class="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <div class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span class="text-sm text-blue-600 font-medium">子任務生成中，請稍候...</span>
        </div>

        <!-- 任務進度條（非每日任務顯示） -->
        <div v-if="!isDailyTask && (task.progress || task.is_parent_task)" class="mt-4">
          <TaskProgressBar
            :progress="taskProgress"
            :showDailyStats="task.isRecurring || task.status === 'daily_in_progress' || task.status === 'daily_completed'"
          />
        </div>
      </div>

      <!-- 常駐目標專用顯示 -->
      <div v-if="task.type === 'daily' && task.isRecurring" class="px-4 py-5">
        <RecurringTaskDetail
          :task="task"
          :progress="task.progress"
          :subtasks="subtasks"
          :loading="loading"
          @toggle-status="handleToggleStatus"
        />
      </div>

      <!-- 今日行動專用顯示 -->
      <div v-else-if="task.type === 'daily' && !task.isRecurring" class="px-4 py-5">
        <SimpleDailyTaskDetail
          :task="task"
          :subtasks="subtasks"
          :loading="isLoading"
          @toggle-status="(reverse) => handleToggleStatus(reverse)"
          @edit="showEditDialog = true"
        />
      </div>

      <!-- 其他類型任務的子任務列表區域 -->
      <div v-else-if="task.is_parent_task && subtasks.length > 0" class="bg-white px-4 py-5">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-primary-900">完成任務</h3>
          <div class="flex items-center space-x-3">
            <!-- 重新生成按鈕（僅職業主線任務顯示） -->
            <button
              v-if="task.task_category === 'career_mainline'"
              @click="showRegenerateDialog = true"
              :disabled="isLoading"
              class="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="重新生成子任務"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>重新生成</span>
            </button>
            <!-- 添加子任務按鈕 -->
            <button
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
        
        <div class="space-y-3">
          <div
            v-for="subtask in sortedSubtasks"
            :key="subtask.id"
            class="bg-white rounded-lg p-4 shadow-sm border-l-4"
            :class="getStatusBorderClass(subtask.status)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="font-medium text-gray-900">{{ subtask.title }}</h4>
                  <!-- 編輯按鈕 -->
                  <button
                    @click="editSubtask(subtask)"
                    :disabled="isLoading"
                    class="p-1 rounded text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="編輯子任務"
                  >
                    ✏️
                  </button>
                </div>
                <p v-if="subtask.description" class="text-gray-600 text-sm mt-1 whitespace-pre-line">{{ subtask.description }}</p>
                
                <!-- 任務日期顯示 -->
                <p v-if="(subtask as any).task_date" class="text-xs text-gray-500 mt-1">
                  📅 {{ formatTaskDate((subtask as any).task_date) }}
                </p>
                
                <!-- 任務屬性 -->
                <div class="flex items-center flex-wrap gap-4 mt-3 text-xs text-gray-500">
                  <span class="flex items-center">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                    難度 {{ subtask.difficulty }}/5
                  </span>
                  <span class="flex items-center">
                    <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                    {{ subtask.experience }} EXP
                  </span>
                  <span v-if="subtask.task_order" class="flex items-center">
                    <span class="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                    順序 {{ subtask.task_order }}
                  </span>
                  <!-- 顯示屬性值 -->
                  <template v-if="subtask.attributes && typeof subtask.attributes === 'object' && Object.keys(subtask.attributes).length > 0">
                    <span
                      v-for="(value, attr) in subtask.attributes"
                      :key="attr"
                      class="flex items-center"
                    >
                      <span class="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                      {{ getAttributeName(attr as string) }} +{{ value }}
                    </span>
                  </template>
                </div>

                <!-- 技能標籤 -->
                <SkillTags
                  :skill-tags="getSkillObjectsForTask(subtask)"
                  class="mt-2"
                />
              </div>
              
              <!-- 狀態控制 -->
              <div class="ml-4 flex flex-col items-end space-y-2">
                <!-- 狀態標籤 -->
                <div 
                  :class="getStatusLabelClass(subtask)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ getStatusLabel(subtask) }}
                </div>
                
                <!-- 操作按鈕組 -->
                <div class="flex space-x-2">
                  <!-- 主要操作按鈕 -->
                  <button
                    v-if="!['completed', 'daily_completed'].includes(subtask.status)"
                    @click="toggleSubtaskStatus(subtask)"
                    :disabled="isLoading || (subtask.status === 'paused' && task?.status === 'paused')"
                    :class="[
                      getStatusButtonClass(subtask),
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                    class="px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    {{ isLoading ? '處理中...' : getStatusText(subtask) }}
                  </button>

                  <!-- 回復按鈕 (僅在已完成時顯示，每日任務不顯示回復按鈕) -->
                  <button
                    v-if="!isDailyTask && ['in_progress', 'completed', 'daily_in_progress', 'daily_completed'].includes(subtask.status)"
                    @click="revertSubtaskStatus(subtask)"
                    :disabled="isLoading"
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium transition-colors border',
                      'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400',
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                    :title="getRevertButtonTitle(subtask)"
                  >
                    {{ isLoading ? '...' : '↶' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 如果沒有子任務（非每日任務） -->
      <div v-else-if="task.is_parent_task && task.type !== 'daily'" class="bg-white px-4 py-5">
        <div class="text-center py-8">
          <div class="text-gray-400 text-4xl mb-3">📝</div>
          <p class="text-gray-600 text-sm mb-4">還沒有子任務</p>
          <div class="flex gap-3 justify-center">
            <button
              @click="showCreateSubtaskDialog = true"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              手動創建子任務
            </button>
            <button
              @click="generateSubtasksWithAI"
              class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              AI 生成子任務
            </button>
          </div>
        </div>
      </div>

      <!-- 如果不是大任務且不是每日任務 -->
      <div v-else-if="!task.is_parent_task && task.type !== 'daily'" class="bg-white px-4 py-5">
        <div class="text-center py-8">
          <p class="text-gray-600 mb-4">這是一個單獨的任務</p>
          <div class="flex justify-center">
            <button
              v-if="task.status === 'pending'"
              @click="handleToggleStatus"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              :disabled="isLoading"
            >
              {{ isLoading ? '處理中...' : '標記為完成' }}
            </button>
            <span
              v-else-if="task.status === 'completed'"
              class="px-6 py-2 bg-green-100 text-green-800 rounded-lg"
            >
              已完成
            </span>
          </div>
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

    <!-- 重新生成子任務確認對話框 -->
    <ConfirmDialog
      v-model:visible="showRegenerateDialog"
      title="🔄 重新生成子任務"
      :message="`確定要重新生成「${task?.title}」的子任務嗎？\n\n此操作將會：\n• 刪除所有現有子任務\n• 使用 AI 重新生成新的子任務\n• 已完成的子任務進度將會遺失`"
      confirmText="確認重新生成"
      cancelText="取消"
      @confirm="handleRegenerateSubtasks"
      danger
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { useSkillStore } from '@/stores/skill'
import { useUserStore } from '@/stores/user'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'
import TaskProgressBar from '@/components/common/TaskProgressBar.vue'
import SkillTags from '@/components/common/SkillTags.vue'
import CreateSubtaskDialog from '@/components/features/CreateSubtaskDialog.vue'
import EditSubtaskDialog from '@/components/features/EditSubtaskDialog.vue'
import EditTaskDialog from '@/components/features/EditTaskDialog.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import RecurringTaskDetail from '@/components/features/RecurringTaskDetail.vue'
import SimpleDailyTaskDetail from '@/components/features/SimpleDailyTaskDetail.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const skillStore = useSkillStore()
const userStore = useUserStore()

// 響應式數據
const task = ref<Task | null>(null)
const subtasks = ref<Task[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const isLoading = ref(false)
const isDailyTask = ref(false)
const pollingTimer = ref<number | null>(null) // 輪詢定時器

// 對話框狀態
const showCreateSubtaskDialog = ref(false)
const showEditSubtaskDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const showRegenerateDialog = ref(false)
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
  console.log('🏷️ getSkillObjectsForTask 調用:', {
    taskTitle: task.title,
    skillTags: task.skillTags,
    hasSkillTags: !!task.skillTags,
    skillTagsLength: task.skillTags?.length,
    skillStoreLength: skillStore.skills.length
  })

  if (!task.skillTags || task.skillTags.length === 0) {
    console.log('❌ 沒有技能標籤或長度為0')
    return []
  }
  if (!skillStore.skills.length) {
    // 技能列表還在載入中，返回 undefined 表示載入中狀態
    console.log('⏳ 技能列表載入中')
    return undefined
  }

  const result = task.skillTags
    .map(tagName => skillStore.skills.find(skill => skill.name === tagName))
    .filter(skill => !!skill) as { id: string; name: string }[]

  console.log('✅ 技能對象結果:', result)
  return result
}

// 判斷是否正在生成子任務
const isGeneratingSubtasks = computed(() => {
  const isGenerating = task.value?.task_category === 'coach_generating_subtasks' &&
         task.value?.is_parent_task

  // 調試日誌
  if (task.value) {
    console.log('[TaskDetailPage] 任務:', task.value.title)
    console.log('[TaskDetailPage] task_category:', task.value.task_category)
    console.log('[TaskDetailPage] is_parent_task:', task.value.is_parent_task)
    console.log('[TaskDetailPage] isGenerating:', isGenerating)
  }

  return isGenerating
})

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
      consecutive_days: 0,
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
      
      // 處理子任務描述的換行符號
      if (foundTask.subtasks && foundTask.subtasks.length > 0) {
        console.log('🔍 處理前的第一個子任務描述:', foundTask.subtasks[0]?.description)
        foundTask.subtasks = foundTask.subtasks.map(subtask => {
          const originalDesc = subtask.description || ''
          // 同時處理 \\n 和 \n
          const processedDesc = originalDesc.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n')
          console.log('🔍 原始描述長度:', originalDesc.length, '處理後長度:', processedDesc.length)
          return {
            ...subtask,
            description: processedDesc
          }
        })
        console.log('🔍 處理後的第一個子任務描述:', foundTask.subtasks[0]?.description)
      }

      task.value = foundTask

      // 載入任務進度數據
      if (foundTask.is_parent_task || foundTask.isRecurring) {
        try {
          console.log('📊 開始載入任務進度:', { taskId, title: foundTask.title, isRecurring: foundTask.isRecurring })
          const progressResponse = await apiClient.getTaskProgress(taskId, userStore.user.id)
          console.log('📊 進度API回應:', progressResponse)
          if (progressResponse.success) {
            task.value.progress = progressResponse.data
            console.log('✅ 進度數據已設置:', task.value.progress)
          } else {
            console.warn(`進度API失敗 (${foundTask.title}):`, progressResponse.message)
          }
        } catch (err) {
          console.warn('Failed to load task progress:', err)
          // 進度載入失敗不影響任務顯示
        }
      }

      // 如果是大任務或常駐目標，載入子任務
      if (foundTask.is_parent_task || foundTask.isRecurring) {
        // 判斷是否為每日任務（重複性任務或任務類型為 daily）
        isDailyTask.value = foundTask.isRecurring || foundTask.type === 'daily'

        const subtaskResponse = await apiClient.getSubtasks(taskId, {
          daily: isDailyTask.value,
          days: isDailyTask.value ? 60 : undefined // 每日任務查詢最近60天（涵蓋兩個月）
        })

        console.log('📋 子任務API回應:', subtaskResponse)

        if (subtaskResponse.success) {
          console.log('📋 原始 API 回應:', subtaskResponse.data.map(t => ({
            title: t.title,
            skill_tags: t.skill_tags
          })))

          subtasks.value = subtaskResponse.data
            .map(taskStore.transformBackendTask)
            .map(subtask => ({
              ...subtask,
              description: subtask.description ? subtask.description.replace(/\\n/g, '\n') : ''
            }))
            .sort((a, b) => (a.task_order || 0) - (b.task_order || 0))

          console.log('📋 已載入子任務:', subtasks.value.length, '個')
          console.log('📋 轉換後的子任務:', subtasks.value.map(t => ({
            title: t.title,
            skillTags: t.skillTags
          })))
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


// 切換任務狀態（針對每日任務和常駐目標）
const handleToggleStatus = async (subtaskIdOrReverse?: string | boolean, reverse: boolean = false) => {
  if (!task.value) return

  console.log('🎯 handleToggleStatus 被調用:', {
    subtaskIdOrReverse,
    reverse,
    isRecurring: task.value.isRecurring,
    taskType: task.value.type,
    typeof: typeof subtaskIdOrReverse
  })

  isLoading.value = true
  try {
    // 檢查是否為常駐目標
    const isRecurring = task.value.isRecurring === true

    // 如果是常駐目標且沒有傳入 subtaskId（undefined）
    if (isRecurring && subtaskIdOrReverse === undefined) {
      // 創建今日子任務並自動完成
      console.log('📝 常駐目標：創建今日子任務')
      const today = new Date().toISOString().split('T')[0]

      const createResponse = await apiClient.createTask({
        parent_task_id: task.value.id,
        title: `${task.value.title} - ${today}`,
        task_type: 'daily',
        difficulty: task.value.difficulty,
        experience: task.value.experience,
        user_id: userStore.user.id,
        ...{ task_date: today } // 添加 task_date（繞過 TypeScript 類型檢查）
      } as any)

      if (createResponse.success) {
        const newSubtaskId = createResponse.data.id
        console.log('✅ 今日子任務已創建:', newSubtaskId)

        // 將子任務標記為完成
        await apiClient.updateTask(newSubtaskId, {
          status: 6 // daily_completed
        })

        console.log('✅ 今日子任務已完成')
        await loadTaskDetail()
      } else {
        throw new Error(createResponse.message || '創建子任務失敗')
      }
    }
    // 如果第一個參數是字符串，說明是子任務ID
    else if (typeof subtaskIdOrReverse === 'string') {
      const subtaskId = subtaskIdOrReverse
      const subtask = subtasks.value.find(st => st.id === subtaskId)

      if (subtask) {
        // 切換子任務狀態
        console.log('🔄 切換子任務狀態:', { subtaskId, currentStatus: subtask.status, reverse })
        await taskStore.toggleTaskStatus(subtask.id, subtask.status, reverse)
        await loadTaskDetail()
      }
    } else {
      // 第一個參數是 boolean 或 undefined（今日行動）
      const isReverse = subtaskIdOrReverse === true || reverse === true
      console.log('🔄 切換任務狀態:', { taskId: task.value.id, currentStatus: task.value.status, reverse: isReverse })
      await taskStore.toggleTaskStatus(task.value.id, task.value.status, isReverse)
      await loadTaskDetail()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '更新任務狀態失敗'
    console.error('Failed to toggle task status:', err)
  } finally {
    isLoading.value = false
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

// AI生成子任務
const generateSubtasksWithAI = async () => {
  if (!task.value) return

  isLoading.value = true
  try {
    console.log('🤖 開始 AI 生成子任務:', task.value.id)

    // 調用 API 生成子任務
    const response = await apiClient.generateSubtasksForTask(
      task.value.id,
      task.value.description || task.value.title,
      undefined, // task_plan
      undefined, // expert_match
      userStore.user.id
    )

    if (response.success) {
      console.log('✅ 子任務生成請求已發送')
      // 顯示成功提示
      const messageDiv = document.createElement('div')
      messageDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50'
      messageDiv.textContent = '子任務正在後台生成中，請稍後刷新查看'
      document.body.appendChild(messageDiv)

      // 3秒後移除提示
      setTimeout(() => {
        messageDiv.remove()
      }, 3000)

      // 5秒後重新加載任務詳情
      setTimeout(async () => {
        await loadTaskDetail()
      }, 5000)
    } else {
      console.error('❌ 生成子任務失敗:', response.message)
      // 顯示錯誤提示
      const errorDiv = document.createElement('div')
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50'
      errorDiv.textContent = '生成子任務失敗：' + (response.message || '未知錯誤')
      document.body.appendChild(errorDiv)

      setTimeout(() => {
        errorDiv.remove()
      }, 3000)
    }
  } catch (error) {
    console.error('❌ AI 生成子任務出錯:', error)
    // 顯示錯誤提示
    const errorDiv = document.createElement('div')
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50'
    errorDiv.textContent = '生成子任務失敗，請稍後重試'
    document.body.appendChild(errorDiv)

    setTimeout(() => {
      errorDiv.remove()
    }, 3000)
  } finally {
    isLoading.value = false
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

// 處理重新生成子任務
const handleRegenerateSubtasks = async () => {
  if (!task.value) return

  showRegenerateDialog.value = false
  isLoading.value = true

  try {
    console.log('🔄 開始重新生成子任務:', task.value.id)

    // 1. 刪除所有現有子任務
    if (subtasks.value.length > 0) {
      console.log('🗑️ 刪除現有子任務:', subtasks.value.length, '個')
      await Promise.all(
        subtasks.value.map(subtask => apiClient.deleteTask(subtask.id))
      )
      console.log('✅ 現有子任務已刪除')
    }

    // 2. 調用 AI 生成新的子任務
    console.log('🤖 開始 AI 生成新子任務')
    const response = await apiClient.generateSubtasksForTask(
      task.value.id,
      task.value.description || task.value.title,
      undefined, // task_plan
      undefined, // expert_match
      userStore.user.id
    )

    if (response.success) {
      console.log('✅ 子任務重新生成請求已發送')

      // 顯示成功提示
      const messageDiv = document.createElement('div')
      messageDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50'
      messageDiv.textContent = '子任務正在重新生成中，請稍候...'
      document.body.appendChild(messageDiv)

      // 3秒後移除提示
      setTimeout(() => {
        messageDiv.remove()
      }, 3000)

      // 立即重新載入任務詳情，顯示生成中狀態
      await loadTaskDetail()
    } else {
      console.error('❌ 生成子任務失敗:', response.message)
      error.value = '重新生成子任務失敗：' + (response.message || '未知錯誤')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '重新生成子任務失敗'
    console.error('Failed to regenerate subtasks:', err)
  } finally {
    isLoading.value = false
  }
}

// 啟動輪詢檢查子任務生成狀態
const startPollingForSubtasks = () => {
  // 先清除已有的定時器
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
  }

  // 每3秒檢查一次
  pollingTimer.value = window.setInterval(async () => {
    // 只在正在生成子任務時進行輪詢
    if (isGeneratingSubtasks.value) {
      console.log('[TaskDetailPage] 輪詢檢查子任務生成狀態...')

      try {
        const taskId = route.params.id as string
        const taskResponse = await apiClient.getTask(taskId)

        if (taskResponse.success) {
          const updatedTask = taskStore.transformBackendTask(taskResponse.data)
          const newCategory = updatedTask?.task_category

          console.log('[TaskDetailPage] 當前 task_category:', newCategory)

          // 如果不再是生成中狀態，說明完成了
          if (newCategory !== 'coach_generating_subtasks') {
            console.log('[TaskDetailPage] 子任務生成完成！重新載入頁面數據...')

            // 停止輪詢
            if (pollingTimer.value) {
              clearInterval(pollingTimer.value)
              pollingTimer.value = null
            }

            // 重新載入完整的任務詳情（包括子任務）
            await loadTaskDetail()
          }
        }
      } catch (err) {
        console.error('[TaskDetailPage] 輪詢檢查失敗:', err)
      }
    }
  }, 3000) // 3秒一次
}

// 停止輪詢
const stopPolling = () => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
    console.log('[TaskDetailPage] 輪詢已停止')
  }
}

// 頁面載入時獲取任務詳情
onMounted(() => {
  loadTaskDetail()
  // 載入技能數據
  if (skillStore.skills.length === 0 && !skillStore.loading) {
    skillStore.fetchSkills()
  }
  // 啟動輪詢
  startPollingForSubtasks()
})

// 頁面卸載時清理定時器
onUnmounted(() => {
  stopPolling()
})
</script>