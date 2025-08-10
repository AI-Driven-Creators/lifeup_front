<template>
  <div class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleSkillClick">
    <div class="text-center space-y-3">
      <!-- 技能圖標 -->
      <div class="text-2xl">{{ skill.icon }}</div>
      
      <!-- 技能名稱和等級 -->
      <div>
        <h3 class="font-medium text-primary-900 text-sm">{{ skill.name }} Lv.{{ skill.level }}</h3>
        
        <!-- 星級顯示 -->
        <div class="flex justify-center space-x-1 mt-1">
          <span
            v-for="n in 5"
            :key="n"
            class="text-xs"
            :class="n <= skill.level ? 'text-yellow-400' : 'text-gray-300'"
          >
            ★
          </span>
        </div>
      </div>
      
      <!-- 經驗值進度條 -->
      <div class="space-y-1">
        <div class="text-xs text-primary-700">
          {{ skill.experience }}/{{ skill.maxExperience }} XP
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ width: `${experienceProgress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Skill } from '@/types'

interface Props {
  skill: Skill
}

const props = defineProps<Props>()
const router = useRouter()

const experienceProgress = computed(() => {
  return (props.skill.experience / props.skill.maxExperience) * 100
})

const handleSkillClick = () => {
  // 跳轉到技能相關任務頁面
  router.push({
    name: 'skill-tasks',
    params: { skillName: props.skill.name },
    query: { id: props.skill.id }
  })
}
</script>