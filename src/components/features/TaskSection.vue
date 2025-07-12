<template>
  <div class="space-y-3">
    <h2 class="text-lg font-bold text-primary-900">{{ title }}</h2>
    
    <div class="space-y-3">
      <MissionTaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="(taskId) => $emit('toggle', taskId)"
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
}

interface Emits {
  (e: 'toggle', taskId: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>