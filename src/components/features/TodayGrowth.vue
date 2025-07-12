<template>
  <div class="card">
    <h3 class="text-lg font-bold text-primary-900 mb-4">今天的成長</h3>
    
    <div class="space-y-3">
      <!-- 完成的任務 -->
      <div class="flex justify-between items-center">
        <span class="text-primary-700">完成的任務</span>
        <span class="font-medium text-primary-900">{{ progress.completedTasks }}/{{ progress.totalTasks }}</span>
      </div>
      
      <!-- 獲得的經驗 -->
      <div class="flex justify-between items-center">
        <span class="text-primary-700">獲得的經驗</span>
        <span class="font-medium text-primary-600">+{{ progress.experienceGained }} 經驗</span>
      </div>
      
      <!-- 屬性提升 -->
      <div class="flex justify-between items-center">
        <span class="text-primary-700">屬性提升</span>
        <span class="font-medium text-primary-900">
          智力 +{{ progress.attributeGains.intelligence }}，耐力 +{{ progress.attributeGains.endurance }}
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
}

defineProps<Props>()
</script>