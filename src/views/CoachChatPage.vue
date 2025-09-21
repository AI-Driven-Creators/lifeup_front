<template>
  <!-- 減去 App.vue main 的 pb-20(5rem) 以避免垂直溢出，需要時可調整 -->
  <div class="flex flex-col h-[calc(100vh-5rem)] overflow-hidden bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader
      class="border-b border-gray-200"
      :showProfileIcon="false"
    >
      <template #title>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-gray-900">小教練</span>
            <select
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
          <p v-if="currentPersonality" class="text-xs text-gray-500">
            {{ currentPersonality.description }}
          </p>
        </div>
      </template>
      <template #action>
        <button
          @click="downloadHistory"
          class="btn-secondary text-sm flex items-center gap-2"
        >
          <span>📥</span>
          <span>下載對話記錄</span>
        </button>
      </template>
    </PageHeader>
    
    <!-- 聊天訊息區域 -->
    <div ref="chatContainer" class="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
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
      @confirm="confirmCreateTask"
      @cancel="cancelTaskCreation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, inject } from 'vue'
import { apiClient } from '@/services/api'
import PageHeader from '@/components/layout/PageHeader.vue'
import ChatMessage from '@/components/features/ChatMessage.vue'
import ChatInput from '@/components/features/ChatInput.vue'
import TaskPreviewDialog from '@/components/features/TaskPreviewDialog.vue'
import type { ChatMessage as ChatMessageType } from '@/types'

// 基本狀態
const messages = ref<ChatMessageType[]>([])
const quickReplies = ref<string[]>([])
const loading = ref(false)
const showToast = inject<(text: string, duration?: number) => void>('showToast')

// 個性相關狀態
const availablePersonalities = ref<Array<{
  personality_type: string
  display_name: string
  description: string
  emoji: string
}>>([])
const selectedPersonality = ref<string>('')
const currentUserId = ref<string>('') // 空字串，讓後端使用預設邏輯

// 計算當前個性資訊
const currentPersonality = computed(() => {
  if (!Array.isArray(availablePersonalities.value) || availablePersonalities.value.length === 0) {
    return null
  }
  return availablePersonalities.value.find(p => p.personality_type === selectedPersonality.value) || null
})
const chatContainer = ref<HTMLDivElement>()

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
        timestamp: new Date()
      }
      messages.value.push(systemMessage)
      
      // 新增教練的個性介紹訊息
      const personalityIntro = getPersonalityIntroMessage(selectedPersonality.value)
      const coachMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: personalityIntro,
        timestamp: new Date()
      }
      messages.value.push(coachMessage)
    }
  } catch (error) {
    console.error('設定個性失敗:', error)
  }
}
// 任務生成相關狀態
const showTaskPreview = ref(false)
const previewTaskJson = ref<any>(null)
const taskPreviewText = ref('')
const validationErrors = ref<string[]>([])
const isTaskModeActive = ref(false)

// 載入歷史對話記錄
const loadChatHistory = async () => {
  try {
    const response = await apiClient.getChatMessages()
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
          timestamp: new Date()
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
      timestamp: new Date()
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
    const response = await apiClient.downloadChatHistory()
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
  // 先載入個性資料
  await loadAvailablePersonalities()
  await loadCurrentPersonality()
  
  // 等待一個週期確保數據載入完成
  setTimeout(() => {
    // 添加歡迎訊息
    const welcomeMessage: ChatMessageType = {
      id: '1',
      role: 'coach',
      content: selectedPersonality.value 
        ? getPersonalityIntroMessage(selectedPersonality.value) 
        : '你好！我是你的小教練，準備好開始我們的對話了嗎？',
      timestamp: new Date()
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
      : await apiClient.sendMessageToChatGPT(content);

    const coachMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: res.text || '（沒有回覆內容）',
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
      timestamp: new Date()
    })
    
    await nextTick()
    scrollToBottom()
  } finally {
    loading.value = false
  }
}

// 處理發送訊息（同時處理任務模式）
const handleSendMessage = async (content: string, isTaskMode: boolean) => {
  if (isTaskMode) {
    // 任務模式：直接生成任務
    await generateTaskFromText(content)
  } else {
    // 普通模式：發送聊天訊息
    await sendMessage(content)
  }
}

// 處理任務模式狀態變更
const handleTaskModeChange = (isActive: boolean) => {
  isTaskModeActive.value = isActive
}

// 從文本直接生成任務
const generateTaskFromText = async (taskDescription: string) => {
  // 先將用戶的任務描述添加到對話記錄
  const userMessage: ChatMessageType = {
    id: Date.now().toString(),
    role: 'user',
    content: taskDescription,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  
  // 滾動到底部
  await nextTick()
  scrollToBottom()
  
  loading.value = true
  
  try {
    // 使用 generateTaskFromChat API，但只傳送用戶的任務描述
    const generateRes = await apiClient.generateTaskFromChat([`用戶: ${taskDescription}`])
    
    if (generateRes.success && generateRes.data) {
      // 驗證並生成預覽
      const validateRes = await apiClient.validateAndPreviewTask(generateRes.data)
      
      if (validateRes.success && validateRes.data) {
        if (validateRes.data.is_valid) {
          previewTaskJson.value = validateRes.data.task_json
          taskPreviewText.value = validateRes.data.task_preview || ''
          validationErrors.value = []
          showTaskPreview.value = true
          
          const coachResponse = `我理解了你的需求！我已經為你生成了一個任務：「${validateRes.data.task_json?.title}」。請查看預覽並確認是否要創建這個任務。`
          
          // 通過 ChatGPT API 保存對話到數據庫（使用任務模式的特殊格式）
          try {
            await apiClient.sendMessageToChatGPT(`[任務模式] ${taskDescription}`)
          } catch (saveError) {
            console.warn('保存任務模式對話失敗:', saveError)
          }
          
          // 添加 AI 教練的回應到對話記錄
          const coachMessage: ChatMessageType = {
            id: (Date.now() + 1).toString(),
            role: 'coach',
            content: coachResponse,
            timestamp: new Date()
          }
          messages.value.push(coachMessage)
          
          // 再次滾動到底部
          await nextTick()
          scrollToBottom()
        } else {
          validationErrors.value = validateRes.data.validation_errors
          const errorResponse = `抱歉，生成的任務格式有問題：${validationErrors.value.join(', ')}。請重新描述你的任務需求。`
          
          // 保存對話到數據庫
          try {
            await apiClient.sendMessageToChatGPT(`[任務模式] ${taskDescription}`)
          } catch (saveError) {
            console.warn('保存任務模式對話失敗:', saveError)
          }
          
          // 添加錯誤回應到對話記錄
          const errorMessage: ChatMessageType = {
            id: (Date.now() + 1).toString(),
            role: 'coach',
            content: errorResponse,
            timestamp: new Date()
          }
          messages.value.push(errorMessage)
          await nextTick()
          scrollToBottom()
        }
      }
    } else {
      const failResponse = '無法生成任務，請確保描述清楚且包含足夠的任務資訊。可以試著更詳細地描述你想要的任務。'
      
      // 保存對話到數據庫
      try {
        await apiClient.sendMessageToChatGPT(`[任務模式] ${taskDescription}`)
      } catch (saveError) {
        console.warn('保存任務模式對話失敗:', saveError)
      }
      
      // 添加失敗回應到對話記錄
      const failMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'coach',
        content: failResponse,
        timestamp: new Date()
      }
      messages.value.push(failMessage)
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('生成任務失敗:', error)
    const errorResponse = '抱歉，生成任務時發生了錯誤。請稍後再試，或者換一種方式描述你的任務。'
    
    // 保存對話到數據庫
    try {
      await apiClient.sendMessageToChatGPT(`[任務模式] ${taskDescription}`)
    } catch (saveError) {
      console.warn('保存任務模式對話失敗:', saveError)
    }
    
    // 添加錯誤回應到對話記錄
    const errorMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: errorResponse,
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
    await nextTick()
    scrollToBottom()
  } finally {
    loading.value = false
  }
}

// 確認創建任務
const confirmCreateTask = async () => {
  loading.value = true
  try {
    // 先保存任務標題，因為稍後會清空 previewTaskJson
    const taskTitle = previewTaskJson.value?.title || '新任務'
    
    const res = await apiClient.createTaskFromJson(previewTaskJson.value)
    
    if (res.success) {
      showToast && showToast('任務創建成功！')
      
      // 在對話中添加確認訊息（在清空 previewTaskJson 之前）
      messages.value.push({
        id: Date.now().toString(),
        role: 'coach',
        content: `太好了！我已經幫你創建了任務「${taskTitle}」。加油完成它！💪`,
        timestamp: new Date()
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
  }
}

// 取消任務創建
const cancelTaskCreation = () => {
  showTaskPreview.value = false
  previewTaskJson.value = null
  taskPreviewText.value = ''
  validationErrors.value = []
}
</script>

