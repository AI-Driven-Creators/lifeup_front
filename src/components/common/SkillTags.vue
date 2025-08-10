<template>
  <div v-if="skillTags && skillTags.length > 0" class="skill-tags flex flex-wrap gap-1 mt-2">
    <span 
      v-for="skillTag in skillTags" 
      :key="skillTag"
      class="skill-tag inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
      :title="skillTag"
    >
      <span class="skill-icon mr-1">🎯</span>
      {{ skillTag }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  skillTags?: string[]
}

const props = defineProps<Props>()
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