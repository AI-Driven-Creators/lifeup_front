<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="每日任務" />
    
    <!-- 每日任務列表 -->
    <div class="px-4 py-4 space-y-4">
      <TaskCard
        v-for="task in dailyTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import TaskCard from '@/components/features/TaskCard.vue'
import type { Task } from '@/types'

const dailyTasks = ref<Task[]>([
  {
    id: '1',
    title: '早晨靜思',
    type: 'daily',
    difficulty: 1,
    experience: 20,
    estimatedTime: '上午 10:00',
    status: 'pending'
  },
  {
    id: '2', 
    title: '午餐休息',
    type: 'daily',
    difficulty: 1,
    experience: 15,
    estimatedTime: '中午 12:00',
    status: 'pending'
  },
  {
    id: '3',
    title: '項目 X 工作',
    type: 'daily', 
    difficulty: 3,
    experience: 50,
    estimatedTime: '下午 2:00',
    status: 'pending'
  },
  {
    id: '4',
    title: '運動',
    type: 'daily',
    difficulty: 2,
    experience: 30,
    estimatedTime: '下午 4:00', 
    status: 'pending'
  },
  {
    id: '5',
    title: '晚餐',
    type: 'daily',
    difficulty: 1,
    experience: 15,
    estimatedTime: '下午 6:00',
    status: 'pending'
  },
  {
    id: '6',
    title: '閱讀書籍',
    type: 'daily',
    difficulty: 2,
    experience: 25,
    estimatedTime: '晚上 8:00',
    status: 'pending'
  }
])

const toggleTask = (taskId: string) => {
  const task = dailyTasks.value.find(t => t.id === taskId)
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed'
  }
}
</script>