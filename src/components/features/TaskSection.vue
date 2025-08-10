<template>
  <div v-if="tasks.length > 0" class="space-y-3">
    <div class="flex items-center space-x-2">
      <span v-if="icon" class="text-lg">{{ icon }}</span>
      <h3 class="text-lg font-bold" :class="color || 'text-primary-900'">{{ title }}</h3>
      <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        {{ tasks.length }}
      </span>
    </div>
    
    <div class="space-y-3">
      <MissionTaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="(taskId) => $emit('toggle', taskId)"
        @task-updated="(updatedTask) => $emit('task-updated', updatedTask)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MissionTaskCard from './MissionTaskCard.vue'
import type { Task } from '@/types'

interface Props {
  title: string
  tasks: Task[]
  icon?: string
  color?: string
}

interface Emits {
  (e: 'toggle', taskId: string): void
  (e: 'task-updated', task: Task): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>