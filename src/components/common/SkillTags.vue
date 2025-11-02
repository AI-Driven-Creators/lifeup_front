<template>
  <div v-if="skillTags === undefined" class="text-xs text-gray-500">載入技能中...</div>
  <div v-else-if="skillTags.length === 0"></div>
  <div v-else class="skill-tags flex gap-1 mt-2 overflow-x-auto">
    <span
      v-for="skillTag in displayedSkills"
      :key="skillTag.id"
      class="skill-tag inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer"
      style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); color: #78716c; border: 1px solid #fde68a;"
      :title="skillTag.name"
      @click.stop="handleSkillClick(skillTag)"
    >
      <Target class="w-3 h-3 mr-1" />
      {{ skillTag.name }}
    </span>
    <!-- 顯示剩餘技能數量 -->
    <span
      v-if="hasMoreSkills"
      class="skill-tag inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
      :title="`還有 ${remainingCount} 個技能`"
    >
      +{{ remainingCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Target } from 'lucide-vue-next'

interface Skill {
  id: number | string;
  name: string;
}

interface Props {
  skillTags?: Skill[] | undefined
  maxDisplay?: number // 最大顯示數量，undefined表示顯示全部
}

const props = defineProps<Props>()
const router = useRouter()

// 計算顯示的技能
const displayedSkills = computed(() => {
  if (!props.skillTags || props.maxDisplay === undefined) {
    return props.skillTags || []
  }
  return props.skillTags.slice(0, props.maxDisplay)
})

// 是否有更多技能
const hasMoreSkills = computed(() => {
  if (!props.skillTags || props.maxDisplay === undefined) {
    return false
  }
  return props.skillTags.length > props.maxDisplay
})

// 剩餘技能數量
const remainingCount = computed(() => {
  if (!props.skillTags || props.maxDisplay === undefined) {
    return 0
  }
  return Math.max(0, props.skillTags.length - props.maxDisplay)
})

const handleSkillClick = (skill: Skill) => {
  router.push({
    name: 'skill-tasks',
    params: { skillName: skill.name },
  })
}
</script>

<style scoped>
.skill-tag {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.skill-icon {
  font-size: 10px;
  opacity: 0.8;
}
</style>