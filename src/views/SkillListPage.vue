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

      <!-- 技能數據 - 按屬性分類 -->
      <template v-else>
        <!-- 提示資訊 - 當沒有任何技能時 -->
        <div v-if="allSkills.length === 0" class="text-center py-12">
          <div class="inline-block bg-white border border-primary-200 rounded-lg p-6 shadow-sm">
            <div class="text-6xl mb-4">🎯</div>
            <p class="text-lg font-medium text-primary-900 mb-2">尚未解鎖任何技能</p>
            <p class="text-sm text-gray-600 mb-4">創建任務時，系統會自動推薦相關技能標籤</p>
            <p class="text-sm text-gray-600">選擇技能標籤後即可解鎖對應技能！</p>
          </div>
        </div>

        <!-- 按屬性分類展示已解鎖的技能（顯示所有屬性） -->
        <div v-else class="space-y-6">
          <div
            v-for="attribute in attributes"
            :key="attribute.key"
          >
            <!-- 屬性標題 -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span class="text-2xl">{{ attribute.icon }}</span>
                <h2 class="text-lg font-bold text-primary-900">{{ attribute.label }}</h2>
                <span class="text-sm text-gray-500">
                  ({{ getSkillsByAttribute(attribute.key).length }})
                </span>
              </div>
              <button
                @click="toggleAttribute(attribute.key)"
                class="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <svg
                  class="w-5 h-5 transform transition-transform duration-200"
                  :class="{ 'rotate-180': !collapsedAttributes[attribute.key] }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- 技能卡片網格或空狀態 -->
            <div v-show="!collapsedAttributes[attribute.key]">
              <div v-if="getSkillsByAttribute(attribute.key).length > 0">
                <div class="grid grid-cols-2 gap-3 transition-all duration-300 ease-in-out">
                  <SkillCard
                    v-for="skill in getSkillsByAttribute(attribute.key)"
                    :key="skill.id"
                    :skill="skill"
                  />
                </div>
              </div>
              <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-500">尚未解鎖此屬性的技能</p>
                <p class="text-xs text-gray-400 mt-1">完成相關任務即可解鎖</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import SkillCard from '@/components/features/SkillCard.vue'
import { apiClient } from '@/services/api'
import { useUserStore } from '@/stores/user'
import { ATTRIBUTES, getSkillTemplateByName } from '@/config/skillPool'
import type { Skill } from '@/types'

const userStore = useUserStore()
const loading = ref(true)
const error = ref<string | null>(null)
const allSkills = ref<Skill[]>([])

// 屬性列表
const attributes = ATTRIBUTES

// 各屬性的收合狀態
const collapsedAttributes = reactive<Record<string, boolean>>({
  intelligence: false,
  endurance: false,
  creativity: false,
  social: false,
  focus: false,
  adaptability: false
})

// 切換屬性展開/收合狀態
const toggleAttribute = (attributeKey: string) => {
  collapsedAttributes[attributeKey] = !collapsedAttributes[attributeKey]
}

// 根據屬性篩選已解鎖的技能
const getSkillsByAttribute = (attributeKey: string): Skill[] => {
  return allSkills.value.filter((skill: any) => skill.attribute === attributeKey)
}

// 獲取技能數據
const fetchSkills = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiClient.getSkills(userStore.user.id)
    if (response.success && response.data) {
      // 轉換後端數據格式以匹配前端類型
      allSkills.value = response.data.map((skill: any) => {
        // 從技能池獲取技能模板以取得 icon
        const skillTemplate = getSkillTemplateByName(skill.name)

        return {
          id: skill.id || '',
          name: skill.name || '',
          category: skill.category || 'technical',
          attribute: skill.attribute || 'intelligence',
          level: skill.level || 1,
          experience: skill.experience || 0,
          maxExperience: skill.max_experience || 100,
          icon: skillTemplate?.icon || '⭐', // 從技能池獲取 icon
          description: skill.description
        }
      })
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