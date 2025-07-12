<template>
  <div class="card">
    <div class="flex items-center space-x-4">
      <!-- 用戶頭像 -->
      <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
        <span class="text-2xl">👤</span>
      </div>
      
      <div class="flex-1">
        <!-- 等級和稱號 -->
        <div class="flex items-center space-x-2 mb-2">
          <h2 class="text-xl font-bold text-primary-900">等級 {{ user.level }} - {{ user.title }}</h2>
        </div>
        
        <!-- 經驗值進度條 -->
        <div class="space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-primary-700">{{ user.experience }}/{{ user.maxExperience }} 經驗</span>
            <span class="text-primary-600">{{ Math.round(experienceProgress) }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill"
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

interface Props {
  user: User
}

const props = defineProps<Props>()

const experienceProgress = computed(() => {
  return (props.user.experience / props.user.maxExperience) * 100
})
</script>