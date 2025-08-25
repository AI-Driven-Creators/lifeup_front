<template>
  <div class="flex flex-col h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="小教練" />
    
    <!-- 個性選擇器 -->
    <div class="px-4 py-2 bg-white border-b border-gray-200">
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-gray-700">教練個性：</span>
        <select 
          v-model="selectedPersonality" 
          @change="handlePersonalityChange"
          class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          :disabled="availablePersonalities.length === 0"
        >
          <option v-if="availablePersonalities.length === 0" value="">載入中...</option>
          <option v-for="personality in availablePersonalities" 
                  :key="personality.personality_type" 
                  :value="personality.personality_type">
            {{ personality.emoji }} {{ personality.display_name }}
          </option>
        </select>
        <div v-if="currentPersonality" class="text-xs text-gray-500">
          {{ currentPersonality.description }}
        </div>
      </div>
    </div>
    
    <!-- 聊天訊息區域 -->
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
    <ChatInput @send="sendMessage" :disabled="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '@/services/api'
import PageHeader from '@/components/layout/PageHeader.vue'
import ChatMessage from '@/components/features/ChatMessage.vue'
import ChatInput from '@/components/features/ChatInput.vue'
import type { ChatMessage as ChatMessageType } from '@/types'

// 基本狀態
const messages = ref<ChatMessageType[]>([])
const quickReplies = ref<string[]>(['開始聊天', '需要幫助'])
const loading = ref(false)

// 個性相關狀態
const availablePersonalities = ref<Array<{
  personality_type: string
  display_name: string
  description: string
  emoji: string
}>>([])
const selectedPersonality = ref<string>('')
const currentUserId = ref<string>('fccc3935-74ae-4cde-814c-3679116aaad3') // 預設用戶ID

// 計算當前個性資訊
const currentPersonality = computed(() => {
  if (!Array.isArray(availablePersonalities.value) || availablePersonalities.value.length === 0) {
    return null
  }
  return availablePersonalities.value.find(p => p.personality_type === selectedPersonality.value) || null
})

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
        display_name: '暖心陪伴',
        description: '溫暖體貼，提供情感支持和正向鼓勵',
        emoji: '🤗'
      },
      {
        personality_type: 'harsh_critic',
        display_name: '嚴厲導師',
        description: '直言不諱，用嚴厲的話語督促你成長',
        emoji: '😤'
      },
      {
        personality_type: 'analytical',
        display_name: '數據分析師',
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

  try {
    // 使用個性化聊天 API
    const res = await apiClient.sendMessageWithPersonality(content, currentUserId.value);

    const coachMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: res.text || '（沒有回覆內容）',
      timestamp: new Date()
    }
    messages.value.push(coachMessage)
  } catch (e) {
    console.error('發送訊息失敗:', e)
    messages.value.push({
      id: (Date.now() + 2).toString(),
      role: 'coach',
      content: '發生錯誤，請稍後再試。',
      timestamp: new Date()
    })
  } finally {
    loading.value = false
  }
}
</script>