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
        <!-- 已開始的技能 (經驗值 > 0) -->
        <template v-if="startedSkills.length > 0">
          <SkillSection
            title="已開始的技能"
            :skills="startedSkills"
          />
        </template>

        <!-- 未開始的技能 (經驗值 = 0) - 可收合 -->
        <template v-if="notStartedSkills.length > 0">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-primary-900">未開始的技能</h2>
              <button
                @click="toggleNotStartedSkills"
                class="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <svg
                  class="w-5 h-5 transform transition-transform duration-200"
                  :class="{ 'rotate-180': !isNotStartedCollapsed }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div
              v-show="!isNotStartedCollapsed"
              class="grid grid-cols-2 gap-3 transition-all duration-300 ease-in-out"
            >
              <SkillCard
                v-for="skill in notStartedSkills"
                :key="skill.id"
                :skill="skill"
              />
            </div>
          </div>
        </template>
      </template>
      </div>
    </div>

    <!-- 新增技能對話框 -->
    <div v-if="showCreateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="showCreateDialog = false">
      <div class="bg-white rounded-lg w-full max-w-2xl mx-auto max-h-full flex flex-col">
        <!-- 固定的標題列 -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h3 class="text-lg font-semibold text-gray-900">新增技能學習計畫</h3>
          <button @click="showCreateDialog = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 可滾動的內容區域 -->
        <div class="flex-1 overflow-y-auto p-6">
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

            <!-- 自訂任務創建界面 -->
            <div v-if="skillForm.selectedTaskOption === 'create'" class="mt-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-md font-medium text-gray-900">自訂任務清單</h4>
                <button
                  type="button"
                  @click="addNewTask"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  新增任務
                </button>
              </div>

              <!-- 任務列表 -->
              <div class="space-y-4">
                <div
                  v-for="(task, taskIndex) in skillForm.customTasks"
                  :key="task.id"
                  class="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <!-- 任務標題列 -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-medium text-gray-700">任務 {{ taskIndex + 1 }}</span>
                    <button
                      type="button"
                      @click="removeTask(task.id)"
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      刪除
                    </button>
                  </div>

                  <!-- 任務基本資訊 -->
                  <div class="grid grid-cols-1 gap-3">
                    <!-- 任務標題 -->
                    <div>
                      <label class="block text-xs font-medium text-gray-600 mb-1">任務標題 *</label>
                      <input
                        v-model="task.title"
                        type="text"
                        required
                        class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="輸入任務標題"
                      />
                    </div>

                    <!-- 任務描述 -->
                    <div>
                      <label class="block text-xs font-medium text-gray-600 mb-1">任務描述</label>
                      <textarea
                        v-model="task.description"
                        rows="2"
                        class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="任務詳細描述"
                      />
                    </div>

                    <!-- 優先度和紀錄形式 -->
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">優先度 *</label>
                        <select
                          v-model="task.priority"
                          required
                          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="">選擇優先度</option>
                          <option value="urgent">進行中/重要</option>
                          <option value="daily">日常重複</option>
                          <option value="later">有空再做</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-xs font-medium text-gray-600 mb-1">紀錄形式 *</label>
                        <select
                          v-model="task.recordType"
                          required
                          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="">選擇紀錄形式</option>
                          <option value="text">文本</option>
                          <option value="count">完成次數</option>
                          <option value="time">時間</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>

                    <!-- 重複設定 -->
                    <div>
                      <label class="flex items-center text-xs font-medium text-gray-600 mb-2">
                        <input
                          v-model="task.hasRepeat"
                          type="checkbox"
                          class="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        重複設定
                      </label>

                      <div v-if="task.hasRepeat" class="grid grid-cols-1 gap-2 ml-6 p-2 bg-white rounded border">
                        <div>
                          <label class="block text-xs text-gray-600 mb-1">重複頻率</label>
                          <select
                            v-model="task.repeatSettings.frequency"
                            class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="">選擇頻率</option>
                            <option value="everyday">每天</option>
                            <option value="weekly">每週</option>
                            <option value="bi-weekly">雙週</option>
                            <option value="monthly">每月</option>
                          </select>
                        </div>

                        <div class="grid grid-cols-2 gap-2">
                          <div>
                            <label class="block text-xs text-gray-600 mb-1">開始時間</label>
                            <input
                              v-model="task.repeatSettings.startTime"
                              type="time"
                              class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label class="block text-xs text-gray-600 mb-1">結束時間</label>
                            <input
                              v-model="task.repeatSettings.endTime"
                              type="time"
                              class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 子任務設定 -->
                    <div>
                      <label class="flex items-center text-xs font-medium text-gray-600 mb-2">
                        <input
                          v-model="task.hasSubtasks"
                          type="checkbox"
                          class="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        建立子任務
                      </label>

                      <div v-if="task.hasSubtasks" class="ml-6 p-2 bg-white rounded border">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-medium text-gray-600">子任務列表</span>
                          <button
                            type="button"
                            @click="addSubtask(task.id)"
                            class="text-xs text-primary-600 hover:text-primary-800"
                          >
                            + 新增子任務
                          </button>
                        </div>

                        <!-- 子任務列表 -->
                        <div class="space-y-2">
                          <div
                            v-for="(subtask, subtaskIndex) in task.subtasks"
                            :key="subtask.id"
                            class="p-2 bg-gray-50 rounded border border-gray-200"
                          >
                            <div class="flex items-center justify-between mb-2">
                              <span class="text-xs text-gray-600">子任務 {{ subtaskIndex + 1 }}</span>
                              <button
                                type="button"
                                @click="removeSubtask(task.id, subtask.id)"
                                class="text-xs text-red-500 hover:text-red-700"
                              >
                                刪除
                              </button>
                            </div>

                            <!-- 子任務表單 -->
                            <div class="grid grid-cols-1 gap-2">
                              <input
                                v-model="subtask.title"
                                type="text"
                                placeholder="子任務標題"
                                class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />

                              <textarea
                                v-model="subtask.description"
                                rows="1"
                                placeholder="子任務描述"
                                class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />

                              <div class="grid grid-cols-2 gap-2">
                                <select
                                  v-model="subtask.priority"
                                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                  <option value="">優先度</option>
                                  <option value="urgent">進行中/重要</option>
                                  <option value="daily">日常重複</option>
                                  <option value="later">有空再做</option>
                                </select>

                                <select
                                  v-model="subtask.recordType"
                                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                  <option value="">紀錄形式</option>
                                  <option value="text">文本</option>
                                  <option value="count">完成次數</option>
                                  <option value="time">時間</option>
                                  <option value="done">Done</option>
                                </select>
                              </div>

                              <!-- 子任務重複設定（簡化版本） -->
                              <div>
                                <label class="flex items-center text-xs text-gray-600">
                                  <input
                                    v-model="subtask.hasRepeat"
                                    type="checkbox"
                                    class="mr-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  重複
                                </label>

                                <div v-if="subtask.hasRepeat" class="mt-1 grid grid-cols-3 gap-1">
                                  <select
                                    v-model="subtask.repeatSettings.frequency"
                                    class="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                  >
                                    <option value="">頻率</option>
                                    <option value="everyday">每天</option>
                                    <option value="weekly">每週</option>
                                    <option value="bi-weekly">雙週</option>
                                    <option value="monthly">每月</option>
                                  </select>
                                  <input
                                    v-model="subtask.repeatSettings.startTime"
                                    type="time"
                                    class="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                  />
                                  <input
                                    v-model="subtask.repeatSettings.endTime"
                                    type="time"
                                    class="w-full px-1 py-1 text-xs border border-gray-300 rounded"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>

        <!-- 固定的按鈕列 -->
        <div class="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            @click="showCreateDialog = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleGenerateTasks"
            :disabled="!skillForm.skillName || !skillForm.goalDescription || !skillForm.deadline || generating"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ generating ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import SkillSection from '@/components/features/SkillSection.vue'
import SkillCard from '@/components/features/SkillCard.vue'
import { apiClient } from '@/services/api'
import type { Skill } from '@/types'

const loading = ref(true)
const error = ref<string | null>(null)
const allSkills = ref<Skill[]>([])
const isNotStartedCollapsed = ref(true) // 預設收合未開始的技能

// 新增技能對話框相關狀態
const showCreateDialog = ref(false)
const generating = ref(false)
const skillForm = ref({
  skillName: '',
  goalDescription: '',
  deadline: '',
  selectedTaskOption: null, // 'bucket', 'create', 'ai'
  customTasks: [] // 自訂任務列表
})

// 任務模板
const createTaskTemplate = () => ({
  id: Date.now() + Math.random(), // 臨時ID
  title: '',
  description: '',
  priority: '', // '進行中/重要', '日常重複', '有空再做'
  recordType: '', // '文本', '完成次數', '時間', 'Done'
  hasRepeat: false,
  repeatSettings: {
    frequency: '', // 'everyday', 'weekly', 'bi-weekly', 'monthly'
    startTime: '',
    endTime: ''
  },
  hasSubtasks: false,
  subtasks: []
})

// 子任務模板
const createSubtaskTemplate = () => ({
  id: Date.now() + Math.random(),
  title: '',
  description: '',
  priority: '',
  recordType: '',
  hasRepeat: false,
  repeatSettings: {
    frequency: '',
    startTime: '',
    endTime: ''
  }
})

// 根據經驗值分組技能
const startedSkills = computed(() =>
  allSkills.value.filter(skill => skill.experience > 0)
)

const notStartedSkills = computed(() =>
  allSkills.value.filter(skill => skill.experience === 0)
)

// 切換未開始技能的顯示狀態
const toggleNotStartedSkills = () => {
  isNotStartedCollapsed.value = !isNotStartedCollapsed.value
}

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

  // 如果選擇自己創建任務，初始化一個空任務
  if (option === 'create' && skillForm.value.customTasks.length === 0) {
    addNewTask()
  }
}

// 添加新任務
const addNewTask = () => {
  skillForm.value.customTasks.push(createTaskTemplate())
}

// 刪除任務
const removeTask = (taskId: number) => {
  const index = skillForm.value.customTasks.findIndex(task => task.id === taskId)
  if (index > -1) {
    skillForm.value.customTasks.splice(index, 1)
  }
}

// 添加子任務
const addSubtask = (taskId: number) => {
  const task = skillForm.value.customTasks.find(t => t.id === taskId)
  if (task) {
    task.subtasks.push(createSubtaskTemplate())
  }
}

// 刪除子任務
const removeSubtask = (taskId: number, subtaskId: number) => {
  const task = skillForm.value.customTasks.find(t => t.id === taskId)
  if (task) {
    const index = task.subtasks.findIndex(st => st.id === subtaskId)
    if (index > -1) {
      task.subtasks.splice(index, 1)
    }
  }
}

// 處理保存技能（目前只做UI反饋）
const handleGenerateTasks = async () => {
  generating.value = true

  // 驗證表單數據
  if (!skillForm.value.skillName || !skillForm.value.goalDescription || !skillForm.value.deadline) {
    alert('請填寫所有必填欄位')
    generating.value = false
    return
  }

  // 如果選擇自訂任務，驗證任務數據
  if (skillForm.value.selectedTaskOption === 'create') {
    if (skillForm.value.customTasks.length === 0) {
      alert('請至少建立一個任務')
      generating.value = false
      return
    }

    // 驗證每個任務的必填欄位
    for (let i = 0; i < skillForm.value.customTasks.length; i++) {
      const task = skillForm.value.customTasks[i]
      if (!task.title || !task.priority || !task.recordType) {
        alert(`任務 ${i + 1} 有未填寫的必填欄位`)
        generating.value = false
        return
      }
    }
  }

  // 模擬處理時間
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 準備保存的數據
  const saveData = {
    skillName: skillForm.value.skillName,
    goalDescription: skillForm.value.goalDescription,
    deadline: skillForm.value.deadline,
    taskOption: skillForm.value.selectedTaskOption,
    ...(skillForm.value.selectedTaskOption === 'create' && {
      customTasks: skillForm.value.customTasks.map(task => ({
        title: task.title,
        description: task.description,
        priority: task.priority,
        recordType: task.recordType,
        hasRepeat: task.hasRepeat,
        repeatSettings: task.hasRepeat ? task.repeatSettings : null,
        subtasks: task.hasSubtasks ? task.subtasks.map(subtask => ({
          title: subtask.title,
          description: subtask.description,
          priority: subtask.priority,
          recordType: subtask.recordType,
          hasRepeat: subtask.hasRepeat,
          repeatSettings: subtask.hasRepeat ? subtask.repeatSettings : null
        })) : []
      }))
    })
  }

  console.log('準備保存技能學習計畫:', saveData)

  // 關閉對話框並重置表單
  showCreateDialog.value = false
  skillForm.value = {
    skillName: '',
    goalDescription: '',
    deadline: '',
    selectedTaskOption: null,
    customTasks: []
  }

  generating.value = false

  // 顯示成功提示（暫時）
  alert('技能學習計畫保存功能開發中...\n數據已輸出到控制台')
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