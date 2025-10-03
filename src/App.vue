<template>
  <div id="app" class="min-h-screen bg-primary-50">
    <div class="max-w-sm mx-auto bg-primary-50 min-h-screen relative">
      <!-- 主要內容區域 -->
      <main>
        <RouterView />
      </main>
      
      <!-- 底部導航 -->
      <BottomNavigation />
      
      <!-- 獎勵通知系統 -->
      <RewardNotifications />
      
      <!-- 飛出的經驗值動畫 -->
      <ExperienceFloating ref="experienceFloating" />

      <!-- 全域 Toast 提示 -->
      <Toast ref="globalToast" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'
import RewardNotifications from '@/components/rewards/RewardNotifications.vue'
import ExperienceFloating from '@/components/rewards/ExperienceFloating.vue'
import Toast from '@/components/common/Toast.vue'

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

// 全域 Toast 方法
const globalToast = ref()
const showToast = (text: string, duration?: number) => {
  if (globalToast.value) {
    globalToast.value.showToast(text, duration)
  }
}
provide('showToast', showToast)
</script>