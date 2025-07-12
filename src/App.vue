<template>
  <div id="app" class="min-h-screen bg-primary-50">
    <div class="max-w-sm mx-auto bg-primary-50 min-h-screen relative">
      <!-- 主要內容區域 -->
      <main class="pb-20">
        <RouterView />
      </main>
      
      <!-- 底部導航 -->
      <BottomNavigation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNavigation from '@/components/layout/BottomNavigation.vue'
</script>