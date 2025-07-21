<template>
  <div class="card">
    <h3 class="text-lg font-bold text-primary-900 mb-4">成就</h3>
    
    <div class="grid grid-cols-3 gap-4">
      <!-- 成就徽章 -->
      <div 
        v-for="achievement in achievements" 
        :key="achievement.id"
        class="flex flex-col items-center space-y-2"
      >
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center"
          :class="achievement.unlocked ? 'bg-primary-100' : 'bg-gray-200'"
        >
          <span class="text-2xl">{{ achievement.icon }}</span>
        </div>
        <span 
          class="text-xs text-center"
          :class="achievement.unlocked ? 'text-primary-700' : 'text-gray-500'"
        >
          {{ achievement.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Achievement {
  id: string
  name: string
  icon: string
  unlocked: boolean
}

// 預設成就數據
const achievements: Achievement[] = [
  {
    id: '1',
    name: '新手冒險者',
    icon: '🌟',
    unlocked: true
  },
  {
    id: '2',
    name: '連續登入',
    icon: '🔥',
    unlocked: true
  },
  {
    id: '3',
    name: '任務大師',
    icon: '🎯',
    unlocked: false
  }
]
</script> 