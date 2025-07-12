<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="任務" />
    
    <div class="px-4 py-6 space-y-6">
      <!-- 主線任務 -->
      <TaskSection
        title="主線任務"
        :tasks="mainTasks"
        @toggle="toggleTask"
      />
      
      <!-- 支線任務 -->
      <TaskSection
        title="支線任務"
        :tasks="sideTasks"
        @toggle="toggleTask"
      />
      
      <!-- 挑戰任務 -->
      <TaskSection
        title="挑戰任務"
        :tasks="challengeTasks"
        @toggle="toggleTask"
      />
      
      <!-- 每日任務 -->
      <TaskSection
        title="每日任務"
        :tasks="dailyTasks"
        @toggle="toggleTask"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import TaskSection from '@/components/features/TaskSection.vue'
import type { Task } from '@/types'

// 模擬任務資料
const mainTasks = ref<Task[]>([
  {
    id: 'main-1',
    title: '展開新的職場生涯',
    description: '制定職業發展計劃，提升專業技能',
    type: 'main',
    difficulty: 3,
    experience: 150,
    status: 'pending'
  }
])

const sideTasks = ref<Task[]>([
  {
    id: 'side-1',
    title: '學習一門新語言',
    description: '掌握基本對話能力',
    type: 'side',
    difficulty: 2,
    experience: 100,
    status: 'pending'
  },
  {
    id: 'side-2',
    title: '精通一項新技能',
    description: '深入學習並實踐',
    type: 'side',
    difficulty: 1,
    experience: 50,
    status: 'pending'
  }
])

const challengeTasks = ref<Task[]>([
  {
    id: 'challenge-1',
    title: '完成一個馬拉松',
    description: '準備並完成42公里長跑',
    type: 'challenge',
    difficulty: 5,
    experience: 500,
    status: 'pending'
  }
])

const dailyTasks = ref<Task[]>([
  {
    id: 'daily-1',
    title: '靜心入定 15 分鐘',
    description: '專注呼吸，放鬆身心',
    type: 'daily',
    difficulty: 1,
    experience: 20,
    status: 'pending'
  }
])

const toggleTask = (taskId: string) => {
  const allTasks = [...mainTasks.value, ...sideTasks.value, ...challengeTasks.value, ...dailyTasks.value]
  const task = allTasks.find(t => t.id === taskId)
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed'
  }
}
</script>