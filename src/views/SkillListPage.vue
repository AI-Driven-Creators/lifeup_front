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

    <!-- 新增技能對話框 -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showCreateDialog = false">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">新增技能學習計畫</h3>
          <button @click="showCreateDialog = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleGenerateTasks">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">我想學習的技能</label>
              <input
                v-model="skillForm.skillName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="例如：Vue.js前端開發、英語口說、設計思維"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">目標描述</label>
              <textarea
                v-model="skillForm.goalDescription"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="描述你想達到的具體目標，例如：能夠獨立開發一個完整的前端專案、能夠流利地進行英語會議、掌握設計思維的核心方法"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">目標期限</label>
              <input
                v-model="skillForm.deadline"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">相關任務</label>
              <div class="space-y-3">
                <button
                  type="button"
                  @click="handleTaskOption('bucket')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <span class="mr-3 text-lg">📋</span>
                    <div>
                      <div class="font-medium text-gray-900">從任務bucket中選擇</div>
                      <div class="text-sm text-gray-500">從現有任務中選擇相關的任務</div>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  @click="handleTaskOption('create')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <span class="mr-3 text-lg">✏️</span>
                    <div>
                      <div class="font-medium text-gray-900">自己創建任務</div>
                      <div class="text-sm text-gray-500">手動創建專屬的學習任務</div>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  @click="handleTaskOption('ai')"
                  class="w-full px-4 py-3 border border-primary-300 bg-primary-50 rounded-md text-left hover:bg-primary-100 transition-colors flex items-center justify-between"
                >
                  <div class="flex items-center">
                    <span class="mr-3 text-lg">🤖</span>
                    <div>
                      <div class="font-medium text-primary-900">AI生成任務</div>
                      <div class="text-sm text-primary-600">讓AI為你規劃個人化學習路徑</div>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="button"
              @click="showCreateDialog = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="!skillForm.skillName || !skillForm.goalDescription || !skillForm.deadline || generating"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ generating ? '保存中...' : '保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import SkillSection from '@/components/features/SkillSection.vue'
import { apiClient } from '@/services/api'
import type { Skill } from '@/types'

const loading = ref(true)
const error = ref<string | null>(null)
const allSkills = ref<Skill[]>([])

// 新增技能對話框相關狀態
const showCreateDialog = ref(false)
const generating = ref(false)
const skillForm = ref({
  skillName: '',
  goalDescription: '',
  deadline: '',
  selectedTaskOption: null // 'bucket', 'create', 'ai'
})

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

// 處理任務選項選擇
const handleTaskOption = (option: string) => {
  skillForm.value.selectedTaskOption = option
  console.log('選擇任務選項:', option)

  // 暫時顯示選擇的選項
  const optionNames = {
    bucket: '從任務bucket中選擇',
    create: '自己創建任務',
    ai: 'AI生成任務'
  }

  alert(`已選擇: ${optionNames[option as keyof typeof optionNames]}\n功能開發中...`)
}

// 處理保存技能（目前只做UI反饋）
const handleGenerateTasks = async () => {
  generating.value = true

  // 模擬處理時間
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 暫時只在控制台顯示表單數據
  console.log('準備保存技能學習計畫:', {
    ...skillForm.value,
    taskOption: skillForm.value.selectedTaskOption
  })

  // 關閉對話框並重置表單
  showCreateDialog.value = false
  skillForm.value = {
    skillName: '',
    goalDescription: '',
    deadline: '',
    selectedTaskOption: null
  }

  generating.value = false

  // 顯示成功提示（暫時）
  alert('技能學習計畫保存功能開發中...')
}

// 監聽來自底部導航的新增技能事件
const handleAddSkillEvent = () => {
  showCreateDialog.value = true
}

// 組件掛載時獲取數據並監聽事件
onMounted(() => {
  fetchSkills()
  window.addEventListener('add-skill-requested', handleAddSkillEvent)
})

// 組件卸載時移除事件監聽
onUnmounted(() => {
  window.removeEventListener('add-skill-requested', handleAddSkillEvent)
})
</script>