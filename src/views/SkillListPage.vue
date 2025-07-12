<template>
  <div class="min-h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="技能" />
    
    <div class="px-4 py-6 space-y-6">
      <!-- 技術技能 -->
      <SkillSection
        title="技術技能"
        :skills="technicalSkills"
      />
      
      <!-- 軟性技能 -->
      <SkillSection
        title="軟性技能"
        :skills="softSkills"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import SkillSection from '@/components/features/SkillSection.vue'
import type { Skill } from '@/types'

const technicalSkills = ref<Skill[]>([
  {
    id: 'tech-1',
    name: '編程',
    category: 'technical',
    level: 3,
    experience: 1250,
    maxExperience: 1500,
    icon: '💻'
  },
  {
    id: 'tech-2',
    name: '資料分析',
    category: 'technical',
    level: 4,
    experience: 1250,
    maxExperience: 1500,
    icon: '📊'
  },
  {
    id: 'tech-3',
    name: '機器學習',
    category: 'technical',
    level: 2,
    experience: 1250,
    maxExperience: 1500,
    icon: '🤖'
  },
  {
    id: 'tech-4',
    name: '雲端運算',
    category: 'technical',
    level: 5,
    experience: 1250,
    maxExperience: 1500,
    icon: '☁️'
  },
  {
    id: 'tech-5',
    name: '網路安全',
    category: 'technical',
    level: 3,
    experience: 1250,
    maxExperience: 1500,
    icon: '🔒'
  },
  {
    id: 'tech-6',
    name: 'UI/UX 設計',
    category: 'technical',
    level: 4,
    experience: 1250,
    maxExperience: 1500,
    icon: '🎨'
  }
])

const softSkills = ref<Skill[]>([
  {
    id: 'soft-1',
    name: '溝通',
    category: 'soft',
    level: 4,
    experience: 1250,
    maxExperience: 1500,
    icon: '💬'
  },
  {
    id: 'soft-2',
    name: '領導力',
    category: 'soft',
    level: 3,
    experience: 1250,
    maxExperience: 1500,
    icon: '👑'
  },
  {
    id: 'soft-3',
    name: '問題解決',
    category: 'soft',
    level: 5,
    experience: 1250,
    maxExperience: 1500,
    icon: '🧩'
  },
  {
    id: 'soft-4',
    name: '時間管理',
    category: 'soft',
    level: 2,
    experience: 1250,
    maxExperience: 1500,
    icon: '⏰'
  },
  {
    id: 'soft-5',
    name: '團隊合作',
    category: 'soft',
    level: 4,
    experience: 1250,
    maxExperience: 1500,
    icon: '🤝'
  },
  {
    id: 'soft-6',
    name: '適應力',
    category: 'soft',
    level: 3,
    experience: 1250,
    maxExperience: 1500,
    icon: '🔄'
  }
])
</script>