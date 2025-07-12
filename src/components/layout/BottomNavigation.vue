<template>
  <nav class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-primary-100 border-t border-primary-200">
    <div class="flex justify-around py-2">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center py-2 px-3 text-primary-700 hover:text-primary-600 transition-colors"
        :class="{ 'text-primary-600': $route.name === item.name }"
      >
        <div class="flex items-center justify-center w-6 h-6 mb-1">
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-xs font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 簡化的圖標元件
const HomeIcon = () => '🏠'
const MissionIcon = () => '📋'
const SkillIcon = () => '🌳'
const CoachIcon = () => '🤖'
const PersonalIcon = () => '👤'

const route = useRoute()

const navItems = [
  { name: 'home', path: '/', label: '首頁', icon: HomeIcon },
  { name: 'mission', path: '/mission', label: '任務', icon: MissionIcon },
  { name: 'skills', path: '/skills', label: '技能', icon: SkillIcon },
  { name: 'coach', path: '/coach', label: '小教練', icon: CoachIcon },
  { name: 'personal', path: '/personal', label: '個人資訊', icon: PersonalIcon }
]
</script>