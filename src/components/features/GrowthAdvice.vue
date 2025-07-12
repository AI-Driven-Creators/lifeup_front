<template>
  <div class="space-y-4">
    <!-- 平衡提醒 -->
    <div class="card">
      <h3 class="text-lg font-bold text-primary-900 mb-2">平衡提醒</h3>
      <p class="text-primary-700 text-sm">
        專注於發展所有屬性，以實現和諧發展。
      </p>
    </div>
    
    <!-- 改進建議 -->
    <div class="card">
      <h3 class="text-lg font-bold text-primary-900 mb-2">改進建議</h3>
      <p class="text-primary-700 text-sm">
        {{ improvementSuggestion }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserAttributes } from '@/types'

interface Props {
  attributes: UserAttributes
}

const props = defineProps<Props>()

const improvementSuggestion = computed(() => {
  const attrs = props.attributes
  const lowest = Math.min(...Object.values(attrs))
  
  // 找到最低的屬性
  const weakAreas = Object.entries(attrs)
    .filter(([_, value]) => value === lowest)
    .map(([key, _]) => {
      const nameMap: Record<string, string> = {
        intelligence: '智力',
        focus: '專注力',
        creativity: '創造力',
        social: '社交力',
        adaptability: '適應力',
        endurance: '耐力'
      }
      return nameMap[key]
    })
  
  if (weakAreas.length > 0) {
    return `考慮可以提升您的${weakAreas.join('和')}的活動，以增強您的整體能力。`
  }
  
  return '您的各項屬性發展均衡，繼續保持這種良好的成長節奏！'
})
</script>