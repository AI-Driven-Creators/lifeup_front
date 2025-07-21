<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- 冒險天數 -->
    <div class="card text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <h3 class="text-lg font-bold text-blue-900 mb-2">冒險</h3>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <p class="text-2xl font-bold text-blue-600">第 {{ user.adventureDays }} 天</p>
      </div>
    </div>
    
    <!-- 連續登入 -->
    <div class="card text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
      <h3 class="text-lg font-bold text-green-900 mb-2">登入連續</h3>
      <div class="bg-white rounded-lg p-3 shadow-sm">
        <p class="text-2xl font-bold text-green-600">{{ user.consecutiveLoginDays }} 天</p>
      </div>
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