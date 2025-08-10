<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader 
      :title="`${skillName} - 相關任務`" 
      :show-back="true"
    />
    
    <div class="px-4 py-6">
      <!-- 加載狀態 -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="text-gray-600 mt-2">載入任務數據中...</p>
      </div>
      
      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchSkillTasks"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          重新載入
        </button>
      </div>
      
      <!-- 無任務狀態 -->
      <div v-else-if="allTasks.length === 0" class="text-center py-8">
        <div class="text-4xl mb-4">🎯</div>
        <p class="text-gray-600 mb-2">目前沒有與「{{ skillName }}」相關的任務</p>
        <p class="text-sm text-gray-500">完成任務可以提升這項技能的經驗值</p>
      </div>
      
      <!-- 任務數據 -->
      <template v-else>
        <div class="space-y-6">
          <!-- 進行中的任務 -->
          <TaskSection 
            v-if="inProgressTasks.length > 0"
            title="進行中"
            :tasks="inProgressTasks"
            :icon="'▶️'"
            :color="'text-blue-600'"
            @task-updated="handleTaskUpdated"
          />
          
          <!-- 待開始的任務 -->
          <TaskSection 
            v-if="pendingTasks.length > 0"
            title="待開始"
            :tasks="pendingTasks"
            :icon="'⏳'"
            :color="'text-gray-600'"
            @task-updated="handleTaskUpdated"
          />
          
          <!-- 已完成的任務 -->
          <TaskSection 
            v-if="completedTasks.length > 0"
            title="已完成"
            :tasks="completedTasks"
            :icon="'✅'"
            :color="'text-green-600'"
            @task-updated="handleTaskUpdated"
          />
          
          <!-- 已暫停的任務 -->
          <TaskSection 
            v-if="pausedTasks.length > 0"
            title="已暫停"
            :tasks="pausedTasks"
            :icon="'⏸️'"
            :color="'text-yellow-600'"
            @task-updated="handleTaskUpdated"
          />
          
          <!-- 已取消的任務 -->
          <TaskSection 
            v-if="cancelledTasks.length > 0"
            title="已取消"
            :tasks="cancelledTasks"
            :icon="'❌'"
            :color="'text-red-600'"
            @task-updated="handleTaskUpdated"
          />
        </div>
        
        <!-- 統計資訊 -->
        <div class="mt-8 bg-white rounded-lg p-4">
          <h3 class="font-medium text-primary-900 mb-3">任務統計</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">總任務數：</span>
              <span class="font-medium">{{ allTasks.length }}</span>
            </div>
            <div>
              <span class="text-gray-600">完成率：</span>
              <span class="font-medium text-green-600">{{ completionRate }}%</span>
            </div>
            <div>
              <span class="text-gray-600">進行中：</span>
              <span class="font-medium text-blue-600">{{ inProgressTasks.length }}</span>
            </div>
            <div>
              <span class="text-gray-600">待開始：</span>
              <span class="font-medium text-gray-600">{{ pendingTasks.length }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import TaskSection from '@/components/features/TaskSection.vue'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'

const route = useRoute()
const skillName = ref(route.params.skillName as string)
const skillId = ref(route.query.id as string)

const loading = ref(true)
const error = ref<string | null>(null)
const allTasks = ref<Task[]>([])

// 根據任務狀態分類任務
const inProgressTasks = computed(() => 
  allTasks.value.filter(task => task.status === 'in_progress')
)

const pendingTasks = computed(() => 
  allTasks.value.filter(task => task.status === 'pending')
)

const completedTasks = computed(() => 
  allTasks.value.filter(task => task.status === 'completed')
)

const pausedTasks = computed(() => 
  allTasks.value.filter(task => task.status === 'paused')
)

const cancelledTasks = computed(() => 
  allTasks.value.filter(task => task.status === 'cancelled')
)

// 完成率計算
const completionRate = computed(() => {
  if (allTasks.value.length === 0) return 0
  const completedCount = completedTasks.value.length
  return Math.round((completedCount / allTasks.value.length) * 100)
})

// 獲取技能相關任務
const fetchSkillTasks = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 這裡需要調用後端API根據技能名稱獲取任務
    const response = await apiClient.getTasksBySkill(skillName.value)
    
    if (response.success && response.data) {
      allTasks.value = response.data
      console.log(`獲取技能「${skillName.value}」相關任務成功:`, allTasks.value.length, '個任務')
    } else {
      error.value = response.message || '獲取任務數據失敗'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '網路錯誤'
    console.error('獲取技能任務失敗:', err)
  } finally {
    loading.value = false
  }
}

// 處理任務更新
const handleTaskUpdated = (updatedTask: Task) => {
  const index = allTasks.value.findIndex(task => task.id === updatedTask.id)
  if (index !== -1) {
    allTasks.value[index] = updatedTask
  }
}

// 組件掛載時獲取數據
onMounted(() => {
  fetchSkillTasks()
})
</script>