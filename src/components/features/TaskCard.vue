<template>
  <div class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleToggle">
    <div class="flex items-center space-x-3">
      <!-- 任務狀態圓圈 -->
      <div class="flex-shrink-0">
        <div
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
          :class="{
            'bg-green-500 border-green-500': task.status === 'completed',
            'bg-blue-500 border-blue-500': task.status === 'in_progress',
            'bg-gray-500 border-gray-500': task.status === 'paused',
            'border-gray-300 hover:border-primary-400': task.status === 'pending'
          }"
        >
          <span v-if="task.status === 'completed'" class="text-white text-sm">✓</span>
          <span v-else-if="task.status === 'in_progress'" class="text-white text-xs">▶</span>
          <span v-else-if="task.status === 'paused'" class="text-white text-xs">⏸</span>
        </div>
      </div>
      
      <!-- 任務內容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 
            class="font-medium text-primary-900 truncate"
            :class="{ 'line-through text-primary-700': task.status === 'completed' }"
          >
            {{ task.title }}
          </h3>
          <button 
            class="text-sm px-3 py-1 rounded-lg transition-colors"
            :class="{
              'bg-green-100 text-green-700 hover:bg-green-200': task.status === 'completed',
              'bg-blue-100 text-blue-700 hover:bg-blue-200': task.status === 'in_progress',
              'bg-orange-100 text-orange-700 hover:bg-orange-200': task.status === 'paused',
              'bg-gray-100 text-gray-700 hover:bg-gray-200': task.status === 'pending'
            }"
          >
            {{ 
              task.status === 'completed' ? '已完成' : 
              task.status === 'in_progress' ? '進行中' : 
              task.status === 'paused' ? '已暫停' : 
              '開始' 
            }}
          </button>
        </div>
        
        <div class="flex items-center justify-between mt-1">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-primary-700">{{ task.estimatedTime }}</span>
            <span v-if="task.status === 'in_progress'" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              進行中
            </span>
            <span v-else-if="task.status === 'paused'" class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              已暫停
            </span>
          </div>
          <span class="text-sm text-primary-600 font-medium">+{{ task.experience }} XP</span>
        </div>
        
        <!-- 技能標籤 -->
        <SkillTags :skill-tags="skillObjects" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Task } from '@/types'
import SkillTags from '@/components/common/SkillTags.vue'
import { useSkillStore } from '@/stores/skill'

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
  if (!props.task.skillTags || props.task.skillTags.length === 0) {
    return []
  }
  if (!skillStore.skills.length) {
    // 技能列表還在載入中，返回 undefined 表示載入中狀態
    return undefined
  }
  return props.task.skillTags
    .map(tagName => skillStore.skills.find(skill => skill.name === tagName))
    .filter(skill => !!skill) as { id: string; name: string }[]
})

const handleToggle = () => {
  emit('toggle', props.task.id)
}
</script>