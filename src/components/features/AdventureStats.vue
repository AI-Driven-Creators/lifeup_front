<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- 冒險天數 -->
    <div class="card text-center">
      <h3 class="text-lg font-bold text-primary-900 mb-1">冒險</h3>
      <p class="text-2xl font-bold text-primary-600">第 {{ user.adventureDays }} 天</p>
    </div>
    
    <!-- 連續登入 -->
    <div class="card text-center">
      <h3 class="text-lg font-bold text-primary-900 mb-1">登入連續</h3>
      <p class="text-2xl font-bold text-primary-600">{{ user.consecutiveLoginDays }} 天</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types'

interface Props {
  user: User
}

defineProps<Props>()
</script>