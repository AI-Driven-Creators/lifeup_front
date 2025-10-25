<template>
  <!-- 減去 App.vue main 的 pb-20(5rem) 以避免垂直溢出，需要時可調整 -->
  <div class="flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader
      title="小教練"
      class="border-b border-gray-200"
      :showProfileIcon="false"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-gray-900">小教練</span>
            <select
              v-if="!isTaskModeActive"
              v-model="selectedPersonality"
              @change="handlePersonalityChange"
              class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              :disabled="availablePersonalities.length === 0"
            >
              <option v-if="availablePersonalities.length === 0" value="">載入中...</option>
              <option
                v-for="personality in availablePersonalities"
                :key="personality.personality_type"
                :value="personality.personality_type"
              >
                {{ personality.emoji }} {{ personality.display_name }}
              </option>
            </select>
          </div>
          <p v-if="isTaskModeActive" class="text-xs text-orange-600">
            🎯 任務創建模式
          </p>
          <p v-else-if="currentPersonality" class="text-xs text-gray-500">
            {{ currentPersonality.description }}
          </p>
        </div>
      </template>
    </PageHeader>
    
    <!-- 聊天訊息區域 -->
    <div ref="chatContainer" class="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :userName="currentUserName"
              :isAnalyzing="isAnalyzing"
              @dismiss="handleDismissMessage"
              @generateTask="generateTaskFromExpert"
              @expertOption="handleExpertOption"
              @directionSelect="handleDirectionSelect"
            />
      <div v-if="loading" class="text-gray-400 text-sm">教練正在輸入...</div>
    </div>
    
    <!-- 快速回覆按鈕 -->
    <div v-if="quickReplies.length > 0" class="px-4 py-2">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="reply in quickReplies"
          :key="reply"
          @click="sendMessage(reply)"
          class="btn-secondary text-sm"
        >
          {{ reply }}
        </button>
      </div>
    </div>
    
    <!-- 輸入區域 -->
    <ChatInput 
      @send="handleSendMessage" 
      @taskModeChange="handleTaskModeChange"
      :disabled="loading" 
      class="shrink-0"
    />
    
    <!-- 任務預覽對話框 -->
    <TaskPreviewDialog
      v-if="showTaskPreview"
      :taskJson="previewTaskJson"
      :taskPreview="taskPreviewText"
      :validationErrors="validationErrors"
      :isConfirming="isCreatingTask"
      @confirm="confirmCreateTask"
      @cancel="cancelTaskCreation"
      @edit="editTask"
    />
    
    <!-- 全頁面 Loading 遮罩（在生成/提交期間顯示，避免與預覽對話框重疊） -->
    <div
      v-if="(isMatchingExpert || isGeneratingTaskFromExpert || isCreatingTask) && !showTaskPreview"
      class="fixed inset-0 z-40 bg-black/40 flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="bg-white rounded-xl shadow-xl px-6 py-5 flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <div class="text-gray-700 font-medium">
          {{ isCreatingTask ? '正在創建任務，請稍候…' : 
             isMatchingExpert ? '正在匹配專家，請稍候…' : 
             '正在生成任務，請稍候…' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '@/services/api'
import PageHeader from '@/components/layout/PageHeader.vue'
import ChatMessage from '@/components/features/ChatMessage.vue'
import ChatInput from '@/components/features/ChatInput.vue'
import TaskPreviewDialog from '@/components/features/TaskPreviewDialog.vue'
import type { ChatMessage as ChatMessageType } from '@/types'

// 基本狀態
const router = useRouter()
const messages = ref<ChatMessageType[]>([])
const quickReplies = ref<string[]>([])
const loading = ref(false)
const isCreatingTask = ref(false)
const showToast = inject<(text: string, duration?: number) => void>('showToast')

// 個性相關狀態
const availablePersonalities = ref<Array<{
  personality_type: string
  display_name: string
  description: string
  emoji: string
}>>([])
const selectedPersonality = ref<string>('')
const currentUserId = ref<string>(localStorage.getItem('lifeup_current_user_id') || '') // 從 localStorage 獲取用戶 ID
const currentUserName = ref<string>('') // 用戶名稱

// 計算當前個性資訊
const currentPersonality = computed(() => {
  if (!Array.isArray(availablePersonalities.value) || availablePersonalities.value.length === 0) {
    return null
  }
  return availablePersonalities.value.find(p => p.personality_type === selectedPersonality.value) || null
})
const chatContainer = ref<HTMLDivElement>()

// 子元件請求關閉暫時訊息
const handleDismissMessage = (id: string) => {
  const index = messages.value.findIndex(m => m.id === id)
  if (index !== -1) {
    messages.value.splice(index, 1)
  }
}

// 載入可用個性
const loadAvailablePersonalities = async () => {
  try {
    const response = await apiClient.getAvailablePersonalities()
    console.log('API 回應:', response) // 調試用
    if (response.success && response.data && Array.isArray(response.data.personalities)) {
      availablePersonalities.value = response.data.personalities
      // 如果後端有返回當前個性，使用它
      if (response.data.current_personality) {
        selectedPersonality.value = response.data.current_personality
      } else if (availablePersonalities.value.length > 0 && !selectedPersonality.value) {
        // 否則設置預設個性
        selectedPersonality.value = availablePersonalities.value[0].personality_type
      }
    }
  } catch (error) {
    console.error('載入個性失敗:', error)
    // 設置備用數據以防 API 失敗
    availablePersonalities.value = [
      {
        personality_type: 'emotional_support',
        display_name: '小太陽',
        description: '溫暖體貼，提供情感支持和正向鼓勵',
        emoji: '🤗'
      },
      {
        personality_type: 'harsh_critic',
        display_name: '森氣氣',
        description: '直言不諱，用嚴厲的話語督促你成長',
        emoji: '😤'
      },
      {
        personality_type: 'analytical',
        display_name: '小書蟲',
        description: '理性客觀，用數據和邏輯幫你分析問題',
        emoji: '📊'
      }
    ]
    selectedPersonality.value = 'emotional_support'
  }
}

// 載入當前個性設定
const loadCurrentPersonality = async () => {
  try {
    const response = await apiClient.getCurrentPersonality(currentUserId.value)
    if (response.success && response.data) {
      selectedPersonality.value = response.data.personality_type
    }
  } catch (error) {
    console.error('載入當前個性失敗:', error)
  }
}

// 處理個性變更
const handlePersonalityChange = async () => {
  try {
    const response = await apiClient.setCoachPersonality(currentUserId.value, selectedPersonality.value)
    if (response.success) {
      // 新增一條系統訊息
      const systemMessage: ChatMessageType = {
        id: Date.now().toString(),
        role: 'system',
        content: `已切換到「${currentPersonality.value?.display_name}」模式`,
        timestamp: new Date(),
        ephemeral: true
      }
      messages.value.push(systemMessage)
      
      // 新增教練的個性介紹訊息
      const personalityIntro = getPersonalityIntroMessage(selectedPersonality.value)
      const coachMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: personalityIntro,
        timestamp: new Date(),
        ephemeral: true
      }
      messages.value.push(coachMessage)
    }
  } catch (error) {
    console.error('設定個性失敗:', error)
  }
}
// 任務生成相關狀態
const showTaskPreview = ref(false)
const isGeneratingTask = ref(false)
const previewTaskJson = ref<any>(null)
const taskPreviewText = ref('')
const validationErrors = ref<string[]>([])
const isTaskModeActive = ref(false)

// 兩階段任務生成流程狀態
const isMatchingExpert = ref(false)
const isGeneratingTaskFromExpert = ref(false)
const matchedExpert = ref<any>(null)
const currentTaskDescription = ref('')
const currentSkillLevel = ref('')
const currentLearningDuration = ref('')

// 專家選項暫存
const selectedExpertOptions = ref<string[]>([])
const expertOptionMessages = ref<string[]>([])

type DirectionOption = {
  title: string
  description: string
}

const availableDirections = ref<DirectionOption[]>([])
const selectedDirections = ref<DirectionOption[]>([])
const expertOptionOutputs = ref<Record<string, string>>({})
const isAnalyzing = ref(false)

const currentSkillLevelLabel = ref('')
const currentLearningDurationLabel = ref('')

const skillLevelLabelMap: Record<string, string> = {
  beginner: '初學者',
  intermediate: '有基礎',
  advanced: '資深',
  expert: '專家'
}

const learningDurationLabelMap: Record<string, string> = {
  '0': '0個月',
  '1-3': '1~3個月',
  '3-6': '3~6個月',
  '6-12': '6個月到1年',
  '1-3years': '1~3年',
  '3+years': '3年以上'
}

const expertOptionLabelMap: Record<string, string> = {
  analyze: '分析加強方向',
  goals: '生成明確目標',
  resources: '建議學習資源'
}

const formatDirections = (directions: DirectionOption[]): string => {
  if (!directions || directions.length === 0) {
    return ''
  }
  return directions
    .map((direction, index) => `${index + 1}. ${direction.title} - ${direction.description}`)
    .join('\n')
}

// 載入歷史對話記錄
const loadChatHistory = async () => {
  try {
    const response = await apiClient.getChatMessages(currentUserId.value)
    if (response.success && response.data) {
      messages.value = response.data.map(msg => ({
        id: msg.id || Date.now().toString(),
        role: msg.role === 'assistant' ? 'coach' : msg.role,
        content: msg.content || '',
        timestamp: msg.created_at ? new Date(msg.created_at) : new Date()
      }))
      
      // 如果沒有歷史記錄，顯示歡迎訊息
      if (messages.value.length === 0) {
        messages.value.push({
          id: '1',
          role: 'coach',
          content: '嗨！我是你的 AI 小教練。很高興見到你！今天有什麼我可以幫助你的嗎？無論是設定目標、時間管理，還是需要一些鼓勵，我都在這裡支持你。',
          timestamp: new Date(),
          ephemeral: true
        })
      }
      
      // 滾動到底部
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('載入對話記錄失敗:', error)
    // 載入失敗時顯示預設歡迎訊息
    messages.value = [{
      id: '1',
      role: 'coach',
      content: '嗨！我是你的 AI 小教練。很高興見到你！今天有什麼我可以幫助你的嗎？',
      timestamp: new Date(),
      ephemeral: true
    }]
  }
}

// 滾動到底部
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 下載對話記錄
const downloadHistory = async () => {
  try {
    const response = await apiClient.downloadChatHistory(currentUserId.value)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `chat_history_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('下載失敗:', error)
    showToast && showToast('下載對話記錄失敗，請稍後再試。')
  }
}

// 頁面載入時獲取歷史記錄
onMounted(() => {
  loadChatHistory()
})

// const sendMessage = async (content: string) => {
//   const userMessage: ChatMessageType = {
//     id: Date.now().toString(),
//     role: 'user',
//     content,
//     timestamp: new Date()
//   }
//   messages.value.push(userMessage)
//   quickReplies.value = []
//   loading.value = true

// 獲取個性介紹訊息
const getPersonalityIntroMessage = (personalityType: string): string => {
  switch (personalityType) {
    case 'harsh_critic':
      return '好吧，我現在是你的嚴格導師。別指望我會對你溫言軟語，我只會告訴你最直接的真相。準備好接受挑戰了嗎？'
    case 'emotional_support':
      return '嗨！💕 我現在是你的情感支援小夥伴～無論你遇到什麼困難，我都會陪伴在你身邊，一起加油！有什麼想聊的嗎？'
    case 'analytical':
      return '系統已切換至分析模式。我將基於數據和邏輯為您提供客觀的建議和分析。請提供您需要分析的問題或情況。'
    default:
      return '你好！我已經準備好為你提供幫助了。'
  }
}

// 初始化
onMounted(async () => {
  console.log('CoachChatPage 初始化，當前用戶 ID:', currentUserId.value)

  // 設置任務模式為激活狀態
  isTaskModeActive.value = true

  // 先載入個性資料
  await loadAvailablePersonalities()
  await loadCurrentPersonality()

  // 獲取用戶資料
  if (currentUserId.value) {
    try {
      const userResponse = await apiClient.getUser(currentUserId.value)
      if (userResponse.success && userResponse.data) {
        currentUserName.value = userResponse.data.name || currentUserId.value
      }
    } catch (error) {
      console.warn('無法獲取用戶資料，使用 ID 作為名稱')
      currentUserName.value = currentUserId.value
    }
  }

  // 等待一個週期確保數據載入完成
  setTimeout(() => {
    // 添加歡迎訊息
    const welcomeMessage: ChatMessageType = {
      id: '1',
      role: 'coach',
      content: '你好！我是你的小教練，專門幫助你創建任務。請描述你想要創建的任務，我會為你生成詳細的任務內容！',
      timestamp: new Date(),
      ephemeral: true
    }
    messages.value.push(welcomeMessage)
  }, 100)
})

// 發送訊息
const sendMessage = async (content: string) => {
  const userMessage: ChatMessageType = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  quickReplies.value = []
  loading.value = true
  
  // 滾動到底部
  await nextTick()
  scrollToBottom()

  try {
    // 使用個性化聊天 API（如果有個性系統）或普通聊天 API
    const res = selectedPersonality.value
      ? await apiClient.sendMessageWithPersonality(content, currentUserId.value)
      : await apiClient.sendMessageToChatGPT(content, currentUserId.value);

    // 檢查響應格式
    let responseText = '';
    if (res && typeof res === 'object') {
      if ('text' in res) {
        responseText = res.text || '（沒有回覆內容）';
      } else if ('message' in res) {
        responseText = `錯誤：${res.message}`;
      } else {
        responseText = '（沒有回覆內容）';
      }
    } else {
      responseText = '（沒有回覆內容）';
    }

    const coachMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: responseText,
      timestamp: new Date()
    }
    messages.value.push(coachMessage)
    
    // 再次滾動到底部
    await nextTick()
    scrollToBottom()
  } catch (e) {
    console.error('發送訊息失敗:', e)
    messages.value.push({
      id: (Date.now() + 2).toString(),
      role: 'coach',
      content: '發生錯誤，請稍後再試。',
      timestamp: new Date(),
      ephemeral: true
    })
    
    await nextTick()
    scrollToBottom()
  } finally {
    loading.value = false
  }
}

// 處理發送訊息（現在只有任務創建模式）
const handleSendMessage = async (content: string, isTaskMode: boolean, skillLevel?: string, learningDuration?: string) => {
  // 現在只有任務創建模式
  await generateTaskFromText(content, skillLevel, learningDuration)
}

// 處理任務模式狀態變更（現在任務模式總是激活）
const handleTaskModeChange = (isActive: boolean) => {
  // 現在任務模式總是激活的，不需要處理切換
  isTaskModeActive.value = true
}

// 第一階段：媒合專家
const matchExpert = async (taskDescription: string, skillLevel?: string, learningDuration?: string) => {
  // 保存當前任務信息
  currentTaskDescription.value = taskDescription
  currentSkillLevel.value = skillLevel || 'beginner'
  currentLearningDuration.value = learningDuration || '0'
  currentSkillLevelLabel.value = skillLevelLabelMap[currentSkillLevel.value] || '初學者'
  currentLearningDurationLabel.value = learningDurationLabelMap[currentLearningDuration.value] || '0個月'
  selectedExpertOptions.value = []
  expertOptionOutputs.value = {}
  availableDirections.value = []
  selectedDirections.value = []
  
  // 構建包含技能水平信息的完整描述
  let fullDescription = taskDescription
  
  if (skillLevel && learningDuration) {
    const skillLevelText = skillLevelLabelMap[skillLevel] || '初學者'
    const durationText = learningDurationLabelMap[learningDuration] || '0個月'
    fullDescription = `${taskDescription}（我的熟悉程度：${skillLevelText}，已學習時長：${durationText}）`
  }
  
  // 先將用戶的任務描述添加到對話記錄
  const userMessage: ChatMessageType = {
    id: Date.now().toString(),
    role: 'user',
    content: fullDescription,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  
  // 滾動到底部
  await nextTick()
  scrollToBottom()
  
  isMatchingExpert.value = true
  
  try {
    // 使用專家系統匹配專家（只匹配，不生成任務）
    const expertRes = await apiClient.matchExpertOnly(fullDescription, currentUserId.value)
    
    if (expertRes.success && expertRes.data) {
      // 保存匹配到的專家信息
      matchedExpert.value = expertRes.data.expert_match
      
      // 顯示專家名稱和描述
      const expertMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: `${expertRes.data.expert_match.expert.name}\n\n${expertRes.data.expert_match.expert.description}`,
        timestamp: new Date(),
        ephemeral: true,
        showExpertOptions: true
      }
      messages.value.push(expertMessage)
      
      // 滾動到底部顯示專家訊息
      await nextTick()
      scrollToBottom()
      
    } else {
      throw new Error('專家匹配失敗')
    }
  } catch (error) {
    console.error('專家匹配失敗:', error)
    const errorResponse = '抱歉，專家匹配時發生了錯誤。請稍後再試。'
    
    const errorMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: errorResponse,
      timestamp: new Date(),
      ephemeral: true
    }
    messages.value.push(errorMessage)
    await nextTick()
    scrollToBottom()
  } finally {
    isMatchingExpert.value = false
  }
}

// 第二階段：生成任務
const generateTaskFromExpert = async () => {
  if (!matchedExpert.value) {
    console.error('沒有匹配到的專家')
    return
  }
  
  isGeneratingTaskFromExpert.value = true
  
  try {
    // 構建包含專家選項的完整描述
    const baseDescriptionParts = [
      currentTaskDescription.value
    ]

    if (currentSkillLevelLabel.value || currentLearningDurationLabel.value) {
      const skillLabel = currentSkillLevelLabel.value || '初學者'
      const durationLabel = currentLearningDurationLabel.value || '0個月'
      baseDescriptionParts.push(`（我的熟悉程度：${skillLabel}，已學習時長：${durationLabel}）`)
    }

    let fullDescription = baseDescriptionParts.join('')
    
    if (selectedExpertOptions.value.length > 0) {
      const selectedOptions = selectedExpertOptions.value
        .map(option => expertOptionLabelMap[option] || option)
        .join('、')
      fullDescription += `\n\n請特別關注以下方面：${selectedOptions}`
    }

    const selectedAnalyzeDirections = selectedDirections.value
      .filter(direction => direction && direction.title)

    if (selectedAnalyzeDirections.length > 0) {
      fullDescription += `\n\n具體的加強方向：\n${formatDirections(selectedAnalyzeDirections)}`
    }

    const expertOutputs = Object.values(expertOptionOutputs.value)
      .filter(output => output && output.trim().length > 0)

    if (expertOutputs.length > 0) {
      fullDescription += `\n\n先前分析結果彙整：\n${expertOutputs.join('\n\n')}`
    }
    
    // 使用匹配到的專家生成任務
    const expertRes = await apiClient.generateTaskWithExpert({
      description: fullDescription,
      promptDescription: currentTaskDescription.value,
      userId: currentUserId.value,
      expertMatch: matchedExpert.value,
      expertName: matchedExpert.value.expert.name,
      expertDescription: matchedExpert.value.expert.description,
      selectedOptions: selectedExpertOptions.value,
      selectedDirections: selectedAnalyzeDirections,
      expertOutputs: expertOptionOutputs.value,
      skillLevelLabel: currentSkillLevelLabel.value,
      learningDurationLabel: currentLearningDurationLabel.value
    })

    if (!expertRes.success || !expertRes.data) {
      console.error('生成任務 API 失敗:', expertRes)
      throw new Error(expertRes.message || '任務生成失敗')
    }

    // 驗證並生成預覽
    const validateRes = await apiClient.validateAndPreviewTask(expertRes.data.task_json)

    if (!validateRes.success || !validateRes.data) {
      console.error('任務驗證 API 失敗:', validateRes)
      throw new Error(validateRes.message || '任務驗證失敗')
    }

    const validationPayload = validateRes.data

    if (!validationPayload.is_valid) {
      validationErrors.value = validationPayload.validation_errors || []

      const errorMessage = validationErrors.value.length > 0
        ? `任務生成失敗，請檢查以下問題：\n${validationErrors.value.join('\n')}`
        : '任務生成失敗，請查看輸入內容是否完整。'

      console.warn('任務驗證失敗細節:', validationPayload)

      const errorCoachMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: errorMessage,
        timestamp: new Date(),
        ephemeral: true
      }
      messages.value.push(errorCoachMessage)

      await nextTick()
      scrollToBottom()
      return
    }

    // 將任務計劃包含在預覽數據中，這樣前端可以傳給子任務生成API
    previewTaskJson.value = {
      ...expertRes.data.task_json,
      task_plan: expertRes.data.task_plan // 包含子任務計劃
    }
    taskPreviewText.value = validationPayload.task_preview || ''
    validationErrors.value = []
    showTaskPreview.value = true

    const coachResponse = `我理解了你的需求！我已經為你生成了一個任務：「${expertRes.data.task_json?.title}」。請查看預覽並確認是否要創建這個任務。`

    const coachMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: coachResponse,
      timestamp: new Date(),
      ephemeral: true
    }
    messages.value.push(coachMessage)

    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('生成任務失敗:', error)
    const errorResponse = '抱歉，生成任務時發生了錯誤。請稍後再試，或者換一種方式描述你的任務。'
    
    // 添加錯誤回應到對話記錄
    const errorMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: errorResponse,
      timestamp: new Date(),
      ephemeral: true
    }
    messages.value.push(errorMessage)
    await nextTick()
    scrollToBottom()
  } finally {
    isGeneratingTaskFromExpert.value = false
  }
}

// 處理專家選項
const handleExpertOption = async (option: string) => {
  if (!selectedExpertOptions.value.includes(option)) {
    selectedExpertOptions.value.push(option)
    
    // 添加選項訊息到對話記錄
    const optionMessages = {
      'analyze': '📊 已選擇：分析加強方向',
      'goals': '🎯 已選擇：生成明確目標', 
      'resources': '📚 已選擇：建議學習資源'
    }
    
    const optionMessage: ChatMessageType = {
      id: (Date.now() + Math.random()).toString(),
      role: 'coach',
      content: optionMessages[option as keyof typeof optionMessages],
      timestamp: new Date(),
      ephemeral: true
    }
    messages.value.push(optionMessage)
    
    // 立即調用專家分析
    if (matchedExpert.value) {
      isAnalyzing.value = true
      
      // 添加分析中的訊息
      const analyzingMessage: ChatMessageType = {
        id: (Date.now() + Math.random()).toString(),
        role: 'coach',
        content: '正在分析中，請稍候...',
        timestamp: new Date(),
        ephemeral: true
      }
      messages.value.push(analyzingMessage)
      nextTick(() => scrollToBottom())
      
      try {
        const analysisRes = await apiClient.expertAnalysis(
          currentTaskDescription.value,
          matchedExpert.value.expert.name,
          matchedExpert.value.expert.description,
          option,
          currentUserId.value
        )
        
        if (analysisRes.success && analysisRes.data) {
          // 移除分析中的訊息
          const analyzingIndex = messages.value.findIndex(msg => msg.content === '正在分析中，請稍候...')
          if (analyzingIndex > -1) {
            messages.value.splice(analyzingIndex, 1)
          }
          
          if (option === 'analyze' && analysisRes.data.directions) {
        availableDirections.value = analysisRes.data.directions
            // 顯示可勾選的加強方向選項
            const directionsMessage: ChatMessageType = {
              id: (Date.now() + Math.random()).toString(),
              role: 'coach',
              content: '根據你的需求，我建議以下加強方向，請選擇你感興趣的：',
              timestamp: new Date(),
              ephemeral: true,
              showDirections: true,
              directions: analysisRes.data.directions
            }
            messages.value.push(directionsMessage)
        expertOptionOutputs.value[option] = formatDirections(analysisRes.data.directions)
          } else {
            // 其他分析類型顯示文字結果
            const analysisMessage: ChatMessageType = {
              id: (Date.now() + Math.random()).toString(),
              role: 'coach',
              content: analysisRes.data.analysis_result,
              timestamp: new Date(),
              ephemeral: true
            }
            messages.value.push(analysisMessage)
        expertOptionOutputs.value[option] = analysisRes.data.analysis_result
          }
        }
      } catch (error) {
        console.error('專家分析失敗:', error)
        
        // 移除分析中的訊息
        const analyzingIndex = messages.value.findIndex(msg => msg.content === '正在分析中，請稍候...')
        if (analyzingIndex > -1) {
          messages.value.splice(analyzingIndex, 1)
        }
        
        const errorMessage: ChatMessageType = {
          id: (Date.now() + Math.random()).toString(),
          role: 'coach',
          content: '抱歉，分析時發生了錯誤。請稍後再試。',
          timestamp: new Date(),
          ephemeral: true
        }
        messages.value.push(errorMessage)
      } finally {
        isAnalyzing.value = false
      }
    }
    
    // 添加生成任務按鈕（如果還沒有）
    const hasGenerateButton = messages.value.some(msg => msg.showGenerateButton)
    if (!hasGenerateButton) {
      const generateButtonMessage: ChatMessageType = {
        id: (Date.now() + Math.random()).toString(),
        role: 'coach',
        content: '選項已選擇完成，點擊下方按鈕生成任務：',
        timestamp: new Date(),
        ephemeral: true,
        showGenerateButton: true
      }
      messages.value.push(generateButtonMessage)
    }
    
    nextTick(() => scrollToBottom())
  }
}

// 處理加強方向選擇
const handleDirectionSelect = (title: string) => {
  const index = selectedDirections.value.findIndex(direction => direction.title === title)
  let wasSelected = index > -1
  
  if (wasSelected) {
    // 如果之前已選中，則取消選擇
    selectedDirections.value.splice(index, 1)
  } else {
    const direction = availableDirections.value.find(item => item.title === title)
    if (direction) {
      selectedDirections.value.push(direction)
    }
  }
  
  // 確認選擇狀態並添加確認訊息
  const isNowSelected = selectedDirections.value.some(direction => direction.title === title)
  const action = isNowSelected ? '已選擇' : '已取消選擇'
  
  const confirmMessage: ChatMessageType = {
    id: (Date.now() + Math.random()).toString(),
    role: 'coach',
    content: `${action}：${title}`,
    timestamp: new Date(),
    ephemeral: true
  }
  //messages.value.push(confirmMessage)
  
  // 如果有選擇的方向，顯示總計
  if (selectedDirections.value.length > 0) {
    const summaryMessage: ChatMessageType = {
      id: (Date.now() + Math.random()).toString(),
      role: 'coach',
      content: `目前已選擇 ${selectedDirections.value.length} 個加強方向：${selectedDirections.value.map(direction => direction.title).join('、')}`,
      timestamp: new Date(),
      ephemeral: true
    }
    //messages.value.push(summaryMessage)
  }
  
  expertOptionOutputs.value['analyze'] = formatDirections(selectedDirections.value)
  
  console.log('選中的方向:', selectedDirections.value)
  nextTick(() => scrollToBottom())
}

// 從文本直接生成任務（現在調用第一階段）
const generateTaskFromText = async (taskDescription: string, skillLevel?: string, learningDuration?: string) => {
  await matchExpert(taskDescription, skillLevel, learningDuration)
}

// 確認創建任務（支援選擇是否生成子任務）
const confirmCreateTask = async (includeSubtasks: boolean = false) => {
  console.log('confirmCreateTask 被調用，includeSubtasks =', includeSubtasks)
  loading.value = true
  isCreatingTask.value = true
  try {
    // 先保存任務標題、描述、計劃和專家信息，因為稍後會清空 previewTaskJson
    const taskTitle = previewTaskJson.value?.title || '新任務'
    const taskDescription = previewTaskJson.value?.description || taskTitle
    const taskPlan = previewTaskJson.value?.task_plan // 保存任務計劃（包含子任務信息）
    const expertMatch = matchedExpert.value // 保存專家信息

    // 創建主任務
    const res = await apiClient.createTaskFromJson(previewTaskJson.value, currentUserId.value)

    console.log('主任務創建響應:', res)

    if (res.success) {
      // 修正：從 res.data.task.id 獲取任務 ID
      const createdTaskId = res.data?.task?.id || res.data?.id
      let subtasksCreated = 0

      console.log('檢查是否需要生成子任務:')
      console.log('- includeSubtasks:', includeSubtasks)
      console.log('- createdTaskId:', createdTaskId)
      console.log('- 條件結果:', includeSubtasks && createdTaskId)

      // 如果用戶選擇包含子任務，則生成子任務
      if (includeSubtasks && createdTaskId) {
        try {
          // 調試：輸出要傳送的數據
          console.log('準備生成子任務，參數如下：')
          console.log('- createdTaskId:', createdTaskId)
          console.log('- taskDescription:', taskDescription)
          console.log('- taskPlan:', taskPlan)
          console.log('- expertMatch:', expertMatch)
          console.log('- userId:', currentUserId.value)

          // 檢查必要參數是否存在
          if (!createdTaskId) {
            console.error('缺少 createdTaskId')
            throw new Error('缺少任務 ID')
          }

          // 使用任務計劃中的子任務信息，避免重新生成
          const subtasksRes = await apiClient.generateSubtasksForTask(
            createdTaskId,
            taskDescription, // 使用保存的描述
            taskPlan, // 傳遞任務計劃，其中包含子任務
            expertMatch, // 傳遞專家信息
            currentUserId.value
          )

          console.log('子任務生成 API 響應：', subtasksRes)

          if (subtasksRes.success && subtasksRes.data) {
            subtasksCreated = subtasksRes.data.total_count

            // 檢查是否為背景生成模式
            if (subtasksCreated === 0 && subtasksRes.message && subtasksRes.message.includes('後台生成')) {
              showToast && showToast('任務創建成功！子任務正在背景生成中，約30秒後會自動完成')
            } else if (subtasksCreated > 0) {
              showToast && showToast(`任務創建成功，並生成了 ${subtasksCreated} 個子任務！`)
            } else {
              showToast && showToast('任務創建成功！')
            }
          } else {
            console.error('子任務生成失敗，API 返回:', subtasksRes)
            const errorMessage = subtasksRes.message || '子任務生成失敗'
            showToast && showToast(`任務創建成功，但 ${errorMessage}`)
          }
        } catch (subtaskError: any) {
          console.error('生成子任務失敗 - 詳細錯誤:', subtaskError)
          console.error('錯誤堆疊:', subtaskError?.stack)
          showToast && showToast('任務創建成功，但子任務生成失敗')
        }
      } else {
        showToast && showToast('任務創建成功！')
      }

      // 在對話中添加確認訊息
      let successMessage = ''
      if (includeSubtasks && subtasksCreated === 0) {
        // 背景生成模式
        successMessage = `太好了！我已經幫你創建了任務「${taskTitle}」。子任務正在背景生成中，約30秒後會自動完成，你可以稍後到任務列表查看。加油！💪`
      } else if (subtasksCreated > 0) {
        // 已經生成了子任務
        successMessage = `太好了！我已經幫你創建了任務「${taskTitle}」，並生成了 ${subtasksCreated} 個子任務。加油完成它們！💪`
      } else {
        // 沒有子任務的情況
        successMessage = `太好了！我已經幫你創建了任務「${taskTitle}」。加油完成它！💪`
      }

      messages.value.push({
        id: Date.now().toString(),
        role: 'coach',
        content: successMessage,
        timestamp: new Date(),
        ephemeral: true
      })

      // 清空預覽狀態
      showTaskPreview.value = false
      previewTaskJson.value = null

      // 滾動到底部以顯示新訊息
      await nextTick()
      scrollToBottom()
    } else {
      showToast && showToast('任務創建失敗：' + res.message)
    }
  } catch (error) {
    console.error('創建任務失敗:', error)
    showToast && showToast('創建任務失敗，請稍後再試。')
  } finally {
    loading.value = false
    isCreatingTask.value = false
  }
}

// 取消任務創建
const cancelTaskCreation = () => {
  showTaskPreview.value = false
  previewTaskJson.value = null
  taskPreviewText.value = ''
  validationErrors.value = []
}

// 編輯任務
const editTask = () => {
  // 將當前的任務資料存儲到 sessionStorage 以便在編輯頁面使用
  if (previewTaskJson.value) {
    sessionStorage.setItem('editTaskData', JSON.stringify(previewTaskJson.value))
  }

  // 關閉預覽對話框
  showTaskPreview.value = false

  // 跳轉到 mission 頁面並直接打開創建任務對話框
  router.push('/mission?editMode=true')
}
</script>


