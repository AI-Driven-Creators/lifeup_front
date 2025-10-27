<template>
  <nav class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-primary-100 border-t border-primary-200">
    <div class="flex justify-around py-2">
      <template v-for="item in navItems" :key="item.name">
        <!-- 技能按鈕特殊處理 -->
        <div
          v-if="item.name === 'skills'"
          class="relative"
          @mouseenter="showSkillActions = true"
          @mouseleave="showSkillActions = false"
        >
          <router-link
            :to="item.path"
            class="flex flex-col items-center py-2 px-3 text-primary-700 hover:text-primary-600 transition-colors"
            :class="{ 'text-primary-600': $route.name === item.name }"
          >
            <div class="flex items-center justify-center w-6 h-6 mb-1">
              <component :is="item.icon" class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium">{{ item.label }}</span>
          </router-link>

          <!-- hover時顯示的增加技能按鈕 - 暫時隱藏，功能尚未完成 -->
          <!-- <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <button
              v-if="showSkillActions"
              @click="handleAddSkill"
              class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg whitespace-nowrap"
            >
              + 新增技能
            </button>
          </Transition> -->
        </div>

        <!-- 其他導航按鈕 -->
        <router-link
          v-else
          :to="item.path"
          class="flex flex-col items-center py-2 px-3 text-primary-700 hover:text-primary-600 transition-colors"
          :class="{ 'text-primary-600': $route.name === item.name }"
        >
          <div class="flex items-center justify-center w-6 h-6 mb-1">
            <component :is="item.icon" class="w-5 h-5" />
          </div>
          <span class="text-xs font-medium">{{ item.label }}</span>
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 簡化的圖標元件
const HomeIcon = () => '🏠'
const MissionIcon = () => '📋'
const SkillIcon = () => '🌳'
const CoachIcon = () => '🤖'
const PersonalIcon = () => '👤'

const route = useRoute()
const router = useRouter()

// 控制技能按鈕hover狀態
const showSkillActions = ref(false)

const navItems = [
  { name: 'home', path: '/', label: '首頁', icon: HomeIcon },
  { name: 'mission', path: '/mission', label: '任務', icon: MissionIcon },
  { name: 'skills', path: '/skills', label: '技能', icon: SkillIcon },
  { name: 'coach', path: '/coach', label: '小教練', icon: CoachIcon }
]

// 處理新增技能按鈕點擊
const handleAddSkill = () => {
  // 先導航到技能頁面（如果不在技能頁面）
  if (route.name !== 'skills') {
    router.push('/skills')
  }

  // 觸發自定義事件通知父組件或技能頁面
  // 這裡我們可以使用 event bus 或其他方式來通信
  const event = new CustomEvent('add-skill-requested')
  window.dispatchEvent(event)

  // 隱藏hover按鈕
  showSkillActions.value = false
}
</script>