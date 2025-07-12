<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="我的進度" />
    
    <div class="px-4 py-6 space-y-6">
      <!-- 用戶等級卡片 -->
      <UserLevelCard :user="userStore.user" />
      
      <!-- 冒險統計 -->
      <AdventureStats :user="userStore.user" />
      
      <!-- 今天的成長 -->
      <TodayGrowth :progress="userStore.todayProgress" />
      
      <!-- 屬性雷達圖 -->
      <AttributesRadar :attributes="userStore.user.attributes" />
      
      <!-- 平衡提醒和建議 -->
      <GrowthAdvice :attributes="userStore.user.attributes" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/layout/PageHeader.vue'
import UserLevelCard from '@/components/features/UserLevelCard.vue'
import AdventureStats from '@/components/features/AdventureStats.vue'
import TodayGrowth from '@/components/features/TodayGrowth.vue'
import AttributesRadar from '@/components/features/AttributesRadar.vue'
import GrowthAdvice from '@/components/features/GrowthAdvice.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>