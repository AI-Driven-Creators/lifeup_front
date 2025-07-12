<template>
  <div class="space-y-3">
    <h2 class="text-lg font-bold text-primary-900">{{ title }}</h2>
    
    <div class="grid grid-cols-2 gap-3">
      <SkillCard
        v-for="skill in skills"
        :key="skill.id"
        :skill="skill"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SkillCard from './SkillCard.vue'
import type { Skill } from '@/types'

interface Props {
  title: string
  skills: Skill[]
}

defineProps<Props>()
</script>