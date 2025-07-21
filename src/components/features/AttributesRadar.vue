<template>
  <div class="card">
    <h3 class="text-lg font-bold text-primary-900 mb-4">屬性雷達</h3>
    
    <!-- 簡化的屬性顯示 -->
    <div class="space-y-4">
      <div
        v-for="(attribute, key) in attributeList"
        :key="key"
        class="flex items-center justify-between"
      >
        <div class="flex items-center space-x-3">
          <span class="text-sm font-medium text-primary-800 w-12">{{ attribute.label }}</span>
          <div class="flex-1 bg-gray-200 rounded-full h-3 w-32 overflow-hidden">
            <div
              class="h-3 rounded-full transition-all duration-500 ease-out"
              :class="getAttributeColor(attribute.value)"
              :style="{ width: `${attribute.value}%` }"
            ></div>
          </div>
        </div>
        <span class="text-sm font-bold text-primary-900 w-8 text-right">{{ attribute.value }}</span>
      </div>
    </div>
    
    <!-- 週比較按鈕 -->
    <div class="flex space-x-2 mt-6">
      <button 
        class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
        :class="activeTab === 'current' 
          ? 'bg-primary-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        @click="activeTab = 'current'"
      >
        本週
      </button>
      <button 
        class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
        :class="activeTab === 'previous' 
          ? 'bg-primary-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        @click="activeTab = 'previous'"
      >
        上週
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { UserAttributes } from '@/types'

interface Props {
  attributes: UserAttributes
}

const props = defineProps<Props>()
const activeTab = ref<'current' | 'previous'>('current')

const attributeList = computed(() => [
  { key: 'intelligence', label: '智力', value: props.attributes.intelligence },
  { key: 'focus', label: '專注', value: props.attributes.focus },
  { key: 'creativity', label: '創意', value: props.attributes.creativity },
  { key: 'social', label: '社交', value: props.attributes.social },
  { key: 'adaptability', label: '適應', value: props.attributes.adaptability },
  { key: 'endurance', label: '耐力', value: props.attributes.endurance }
])

const getAttributeColor = (value: number) => {
  if (value >= 80) return 'bg-green-500'
  if (value >= 60) return 'bg-blue-500'
  if (value >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script>