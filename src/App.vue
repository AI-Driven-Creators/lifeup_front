<template>
  <div id="app" class="min-h-screen bg-primary-50">
    <div class="max-w-sm mx-auto bg-primary-50 min-h-screen relative">
      <!-- 主要內容區域 -->
      <main class="pb-20">
        <RouterView />
      </main>
      
      <!-- 底部導航 -->
      <BottomNavigation />
      
      <!-- 獎勵通知系統 -->
      <RewardNotifications />
      
      <!-- 飛出的經驗值動畫 -->
      <ExperienceFloating ref="experienceFloating" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'
import RewardNotifications from '@/components/rewards/RewardNotifications.vue'
import ExperienceFloating from '@/components/rewards/ExperienceFloating.vue'

// 提供全域的飛出動畫方法
const experienceFloating = ref()

const triggerFloatingExperience = (
  experience: number, 
  targetElement: HTMLElement, 
  type: 'experience' | 'skill' | 'levelup' = 'experience'
) => {
  if (experienceFloating.value) {
    experienceFloating.value.addFloatingExperience(experience, targetElement, type)
  }
}

// 提供給所有子組件使用
provide('triggerFloatingExperience', triggerFloatingExperience)
</script>