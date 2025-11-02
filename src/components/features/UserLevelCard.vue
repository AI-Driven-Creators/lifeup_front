<template>
  <div class="card">
    <div class="flex items-center space-x-4">
      <!-- 用戶頭像 -->
      <div class="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
        <UserIcon class="w-8 h-8 text-white" :stroke-width="2" />
      </div>
      
      <div class="flex-1">
        <!-- 等級和稱號 -->
        <div class="mb-2">
          <h2 class="text-xl font-bold text-primary-900">等級 {{ user?.level || 0 }} - {{ user?.title || '載入中...' }}</h2>
        </div>
        
        <!-- 經驗值進度條 -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-primary-700">{{ user?.experience || 0 }}/{{ user?.maxExperience || 100 }} 經驗</span>
            <span class="text-primary-600 font-medium">{{ Math.round(experienceProgress) }}%</span>
          </div>
          <div class="progress-bar bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              class="progress-fill bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${experienceProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types'
import { User as UserIcon } from 'lucide-vue-next'

interface Props {
  user: User | null
}

const props = defineProps<Props>()

const experienceProgress = computed(() => {
  if (!props.user || !props.user.maxExperience) return 0
  return (props.user.experience / props.user.maxExperience) * 100
})
</script>