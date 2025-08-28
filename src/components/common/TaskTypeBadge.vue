<template>
  <div class="task-type-badge inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all"
       :class="getBadgeStyle(type)">
    <component :is="getTypeIcon(type)" class="w-3 h-3" />
    <span>{{ getTypeName(type) }}</span>
  </div>
</template>

<script setup lang="ts">
import { Target, ClipboardList, Zap, Calendar, FileText, Trophy } from 'lucide-vue-next'
import type { Task } from '@/types'

interface Props {
  type: Task['type']
}

const props = defineProps<Props>()

const getBadgeStyle = (type: Task['type']) => {
  const styles = {
    'main': 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-200',
    'side': 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-200',
    'challenge': 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border border-orange-200',
    'daily': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200',
    'subtask': 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200'
  }
  return styles[type] || styles.subtask
}

const getTypeIcon = (type: Task['type']) => {
  const icons = {
    'main': Target,
    'side': ClipboardList,
    'challenge': Zap,
    'daily': Calendar,
    'subtask': FileText
  }
  return icons[type] || FileText
}

const getTypeName = (type: Task['type']) => {
  const names = {
    'main': '主線',
    'side': '支線', 
    'challenge': '挑戰',
    'daily': '每日',
    'subtask': '子任務'
  }
  return names[type] || '任務'
}
</script>

<style scoped>
.task-type-badge {
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.task-type-badge:hover {
  transform: translateY(-0.5px);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
}
</style>