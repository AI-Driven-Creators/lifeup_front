<template>
  <!-- 調整高度避免被底部導航影響，並確保內容區域可滾動 -->
  <div class="flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-primary-50">
    <!-- 頁面標題 -->
    <div class="shrink-0">
      <PageHeader title="技能" />
    </div>

    <!-- 可滾動內容區域 -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="px-4 py-6 space-y-6">
      <!-- 加載狀態 -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="text-gray-600 mt-2">載入技能數據中...</p>
      </div>
      
      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchSkills"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          重新載入
        </button>
      </div>
      
      <!-- 技能數據 -->
      <template v-else>
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
      </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import SkillSection from '@/components/features/SkillSection.vue'
import { apiClient } from '@/services/api'
import type { Skill } from '@/types'

const loading = ref(true)
const error = ref<string | null>(null)
const allSkills = ref<Skill[]>([])

// 從後端獲取的技能數據按類別分組
const technicalSkills = computed(() => 
  allSkills.value.filter(skill => skill.category === 'technical')
)

const softSkills = computed(() => 
  allSkills.value.filter(skill => skill.category === 'soft')
)

// 獲取技能數據
const fetchSkills = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiClient.getSkills()
    if (response.success && response.data) {
      // 轉換後端數據格式以匹配前端類型
      allSkills.value = response.data.map((skill: any) => ({
        id: skill.id || '',
        name: skill.name || '',
        category: skill.category || 'technical',
        level: skill.level || 1,
        experience: skill.experience || 0,
        maxExperience: skill.max_experience || 100,
        icon: skill.icon || '⭐',
        description: skill.description
      }))
      console.log('獲取技能數據成功:', allSkills.value)
    } else {
      error.value = response.message || '獲取技能數據失敗'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '網路錯誤'
    console.error('獲取技能數據失敗:', err)
  } finally {
    loading.value = false
  }
}

// 組件掛載時獲取數據
onMounted(() => {
  fetchSkills()
})
</script>