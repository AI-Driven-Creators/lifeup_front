<template>
  <div class="card">
    <h3 class="text-lg font-bold text-primary-900 mb-4">屬性雷達</h3>
    
    <!-- 簡化的屬性顯示 -->
    <div class="space-y-4">
      <!-- 加載狀態 -->
      <div v-if="loading && activeTab === 'previous'" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <p class="text-sm text-gray-600 mt-2">載入上週數據中...</p>
      </div>
      
      <!-- 屬性列表 -->
      <div v-else>
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
import { computed, ref, watch, onMounted } from 'vue'
import type { UserAttributes } from '@/types'
import { apiClient } from '@/services/api'
import { useUserStore } from '@/stores/user'

interface Props {
  attributes: UserAttributes
}

const props = defineProps<Props>()
const userStore = useUserStore()
const activeTab = ref<'current' | 'previous'>('current')
const loading = ref(false)
const previousWeekAttributes = ref<UserAttributes | null>(null)

// 當前顯示的屬性（根據選中的標籤）
const displayAttributes = computed(() => {
  if (activeTab.value === 'current') {
    return props.attributes
  } else {
    return previousWeekAttributes.value || props.attributes
  }
})

const attributeList = computed(() => [
  { key: 'intelligence', label: '智力', value: displayAttributes.value.intelligence },
  { key: 'focus', label: '專注', value: displayAttributes.value.focus },
  { key: 'creativity', label: '創意', value: displayAttributes.value.creativity },
  { key: 'social', label: '社交', value: displayAttributes.value.social },
  { key: 'adaptability', label: '適應', value: displayAttributes.value.adaptability },
  { key: 'endurance', label: '耐力', value: displayAttributes.value.endurance }
])

const getAttributeColor = (value: number) => {
  if (value >= 80) return 'bg-green-500'
  if (value >= 60) return 'bg-blue-500'
  if (value >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

// 獲取上週屬性數據
const fetchPreviousWeekAttributes = async () => {
  const userId = userStore.user?.id
  if (!userId) return
  
  loading.value = true
  try {
    const response = await apiClient.getWeeklyAttributes(userId, 1) // 1 週前
    if (response.success && response.data) {
      previousWeekAttributes.value = {
        intelligence: response.data.intelligence || 0,
        endurance: response.data.endurance || 0,
        creativity: response.data.creativity || 0,
        social: response.data.social || 0,
        focus: response.data.focus || 0,
        adaptability: response.data.adaptability || 0
      }
      console.log('獲取上週屬性數據:', previousWeekAttributes.value)
    }
  } catch (error) {
    console.error('獲取上週屬性數據失敗:', error)
  } finally {
    loading.value = false
  }
}

// 監聽標籤切換，當切換到上週時獲取數據
watch(activeTab, (newTab) => {
  if (newTab === 'previous' && !previousWeekAttributes.value) {
    fetchPreviousWeekAttributes()
  }
})

// 組件掛載時如果當前標籤是上週，則獲取數據
onMounted(() => {
  if (activeTab.value === 'previous') {
    fetchPreviousWeekAttributes()
  }
})
</script>