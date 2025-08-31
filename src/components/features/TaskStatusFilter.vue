<template>
  <div class="bg-white rounded-lg mb-4 shadow-sm">
    <!-- 摺疊標題列 -->
    <div 
      class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      @click="toggleExpanded"
    >
      <div class="flex items-center space-x-2">
        <h3 class="text-sm font-medium text-gray-700">狀態篩選</h3>
        <span 
          v-if="hasActiveFilters" 
          class="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full"
        >
          {{ activeFilters.length }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          v-if="hasActiveFilters"
          @click.stop="clearAllFilters"
          class="text-xs text-primary-600 hover:text-primary-700 transition-colors"
        >
          清除全部
        </button>
        <div 
          class="text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isExpanded }"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4H4z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 摺疊內容 -->
    <div 
      v-show="isExpanded"
      class="px-4 pb-4 space-y-3 border-t border-gray-100"
    >
      <div class="flex flex-wrap gap-2 pt-3">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          @click="toggleFilter(filter.value)"
          :class="[
            'flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
            isActive(filter.value) 
              ? 'bg-primary-600 text-white shadow-sm' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <span>{{ filter.icon }}</span>
          <span>{{ filter.label }}</span>
          <span 
            v-if="filter.count !== undefined" 
            :class="[
              'ml-1 px-1.5 py-0.5 rounded-full text-xs',
              isActive(filter.value) 
                ? 'bg-white bg-opacity-20 text-white' 
                : 'bg-gray-200 text-gray-600'
            ]"
          >
            {{ filter.count }}
          </span>
        </button>
      </div>
      
      <!-- 進度總覽 -->
      <div v-if="showProgress" class="pt-3 border-t border-gray-100">
        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>完成進度</span>
          <span>{{ completionRate }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-green-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: completionRate + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
  showProgress?: boolean
}

interface Emits {
  (e: 'filter-change', filters: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true
})

const emit = defineEmits<Emits>()

// 選中的篩選器
const activeFilters = ref<string[]>([])

// 摺疊狀態
const isExpanded = ref(false)

// 狀態篩選器配置
const statusFilters = computed(() => [
  {
    value: 'pending',
    label: '待辦',
    icon: '📋',
    count: props.tasks.filter(t => t.status === 'pending').length
  },
  {
    value: 'in_progress',
    label: '進行中',
    icon: '🚀',
    count: props.tasks.filter(t => t.status === 'in_progress').length
  },
  {
    value: 'completed',
    label: '已完成',
    icon: '✅',
    count: props.tasks.filter(t => t.status === 'completed').length
  },
  {
    value: 'paused',
    label: '暫停',
    icon: '⏸️',
    count: props.tasks.filter(t => t.status === 'paused').length
  },
  {
    value: 'cancelled',
    label: '已取消',
    icon: '❌',
    count: props.tasks.filter(t => t.status === 'cancelled').length
  }
].filter(filter => filter.count > 0)) // 只顯示有任務的狀態

// 是否有活躍的篩選器
const hasActiveFilters = computed(() => activeFilters.value.length > 0)

// 完成率計算
const completionRate = computed(() => {
  if (props.tasks.length === 0) return 0
  const completedCount = props.tasks.filter(task => 
    task.status === 'completed'
  ).length
  return Math.round((completedCount / props.tasks.length) * 100)
})

// 切換篩選器
const toggleFilter = (status: string) => {
  const index = activeFilters.value.indexOf(status)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(status)
  }
}

// 檢查篩選器是否活躍
const isActive = (status: string) => {
  return activeFilters.value.includes(status)
}

// 切換展開/收合狀態
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// 清除所有篩選器
const clearAllFilters = () => {
  activeFilters.value = []
}

// 監聽篩選器變化並發出事件
watch(activeFilters, (newFilters) => {
  emit('filter-change', [...newFilters])
}, { deep: true })
</script>