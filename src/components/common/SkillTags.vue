<template>
  <div v-if="skillTags === undefined" class="text-xs text-gray-500">載入技能中...</div>
  <div v-else-if="skillTags.length === 0"></div>
  <div v-else ref="containerRef" class="skill-tags flex gap-1 mt-2 overflow-hidden">
    <span
      v-for="skillTag in displayedSkills"
      :key="skillTag.id"
      :ref="el => { if (el) skillRefs[skillTag.id] = el as HTMLElement }"
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
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Target } from 'lucide-vue-next'

interface Skill {
  id: number | string;
  name: string;
}

interface Props {
  skillTags?: Skill[] | undefined
  maxDisplay?: number // 最大顯示數量，undefined表示顯示全部
  dynamicDisplay?: boolean // 是否啟用動態顯示（根據寬度自動計算）
}

const props = withDefaults(defineProps<Props>(), {
  dynamicDisplay: false
})

const router = useRouter()
const containerRef = ref<HTMLElement>()
const skillRefs = ref<Record<string | number, HTMLElement>>({})
const calculatedMaxDisplay = ref<number | undefined>(undefined)

// 計算顯示的技能
const displayedSkills = computed(() => {
  if (!props.skillTags) {
    return []
  }

  const effectiveMaxDisplay = props.dynamicDisplay ? calculatedMaxDisplay.value : props.maxDisplay

  if (effectiveMaxDisplay === undefined) {
    return props.skillTags
  }

  return props.skillTags.slice(0, effectiveMaxDisplay)
})

// 是否有更多技能
const hasMoreSkills = computed(() => {
  if (!props.skillTags) {
    return false
  }

  const effectiveMaxDisplay = props.dynamicDisplay ? calculatedMaxDisplay.value : props.maxDisplay

  if (effectiveMaxDisplay === undefined) {
    return false
  }

  return props.skillTags.length > effectiveMaxDisplay
})

// 剩餘技能數量
const remainingCount = computed(() => {
  if (!props.skillTags) {
    return 0
  }

  const effectiveMaxDisplay = props.dynamicDisplay ? calculatedMaxDisplay.value : props.maxDisplay

  if (effectiveMaxDisplay === undefined) {
    return 0
  }

  return Math.max(0, props.skillTags.length - effectiveMaxDisplay)
})

// 動態計算可顯示的技能數量
const calculateMaxDisplay = async () => {
  if (!props.dynamicDisplay || !props.skillTags || !containerRef.value) {
    return
  }

  await nextTick()

  const containerWidth = containerRef.value.offsetWidth
  const gap = 4 // gap-1 = 4px
  const moreTagWidth = 50 // +N 標籤的大致寬度

  let totalWidth = 0
  let count = 0

  // 暫時設為全部顯示以測量寬度
  calculatedMaxDisplay.value = props.skillTags.length
  await nextTick()

  for (let i = 0; i < props.skillTags.length; i++) {
    const skill = props.skillTags[i]
    const element = skillRefs.value[skill.id]

    if (!element) continue

    const skillWidth = element.offsetWidth
    const neededWidth = totalWidth + skillWidth + (count > 0 ? gap : 0)

    // 如果不是最後一個標籤，預留 +N 標籤的空間
    const hasMore = i < props.skillTags.length - 1
    const finalWidth = hasMore ? neededWidth + gap + moreTagWidth : neededWidth

    if (finalWidth > containerWidth && count > 0) {
      break
    }

    totalWidth = neededWidth
    count++
  }

  calculatedMaxDisplay.value = Math.max(1, count) // 至少顯示1個
}

const handleSkillClick = (skill: Skill) => {
  router.push({
    name: 'skill-tasks',
    params: { skillName: skill.name },
  })
}

onMounted(() => {
  if (props.dynamicDisplay) {
    calculateMaxDisplay()
  }
})

watch(() => props.skillTags, () => {
  if (props.dynamicDisplay) {
    calculateMaxDisplay()
  }
}, { deep: true })
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