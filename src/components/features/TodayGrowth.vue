<template>
  <div class="card">
    <h3 class="text-lg font-bold text-primary-900 mb-4">今天的成長</h3>
    
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
    
    <div v-else class="space-y-4">
      <!-- 完成的任務 -->
      <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
        <span class="text-primary-700 font-medium">完成的任務</span>
        <span class="font-bold text-green-600 text-lg">{{ progress.completedTasks || 0 }}/{{ progress.totalTasks || 0 }}</span>
      </div>
      
      <!-- 獲得的經驗 -->
      <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
        <span class="text-primary-700 font-medium">獲得的經驗</span>
        <span class="font-bold text-blue-600 text-lg">+{{ progress.experienceGained || 0 }} 經驗</span>
      </div>
      
      <!-- 屬性提升 -->
      <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
        <span class="text-primary-700 font-medium">屬性提升</span>
        <span class="font-bold text-purple-600 text-sm">
          智力 +{{ (progress.attributeGains && progress.attributeGains.intelligence) || 0 }}，耐力 +{{ (progress.attributeGains && progress.attributeGains.endurance) || 0 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TodayProgress {
  completedTasks: number
  totalTasks: number
  experienceGained: number
  attributeGains: {
    intelligence: number
    endurance: number
  }
}

interface Props {
  progress: TodayProgress
  loading?: boolean
}

defineProps<Props>()
</script>