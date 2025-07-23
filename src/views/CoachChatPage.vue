<template>
  <div class="flex flex-col h-screen bg-primary-50">
    <!-- 頁面標題 -->
    <PageHeader title="小教練" />
    
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
import { ref } from 'vue'
import { apiClient } from '@/services/api'
import PageHeader from '@/components/layout/PageHeader.vue'
import ChatMessage from '@/components/features/ChatMessage.vue'
import ChatInput from '@/components/features/ChatInput.vue'
import type { ChatMessage as ChatMessageType } from '@/types'

const messages = ref<ChatMessageType[]>([
  {
    id: '1',
    role: 'coach',
    content: '唔，小雅！看到你回來真是太棒了。今天感覺如何？記住，每個小小的進步都是一個勝利。',
    timestamp: new Date()
  },
  {
    id: '2',
    role: 'user',
    content: '老實說，我感覺有點受不了。當事情變得困難時，很難保持對我的目標的專注。',
    timestamp: new Date()
  },
  {
    id: '3',
    role: 'coach',
    content: '我明白。感覺這樣完全正常。我們一起了解一下。最近最大的挑戰是什麼？',
    timestamp: new Date()
  },
  {
    id: '4',
    role: 'user',
    content: '很難在工作和個人生活之間取得平衡。我感覺自己像在不斷地忙碌。',
    timestamp: new Date()
  },
  {
    id: '5',
    role: 'coach',
    content: '很多人也有這個困擾。我們一起探索一些策略，幫助你找到更好的平衡。我們先從一個快速的自我反思練習開始如何？',
    timestamp: new Date()
  }
])

const quickReplies = ref<string[]>([
  '自我反思',
  '設定目標'
])

const loading = ref(false)

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

//   try {
//     const res = await apiClient.sendMessage(content)
//     const coachMessage: ChatMessageType = {
//       id: (Date.now() + 1).toString(),
//       role: 'coach',
//       content: res.data.reply || res.data.content || '（沒有回覆內容）',
//       timestamp: new Date()
//     }
//     messages.value.push(coachMessage)
//   } catch (e) {
//     messages.value.push({
//       id: (Date.now() + 2).toString(),
//       role: 'coach',
//       content: '發生錯誤，請稍後再試。',
//       timestamp: new Date()
//     })
//   } finally {
//     loading.value = false
//   }
// }
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
    // 使用 sendMessageToChatGPT，而不是 sendMessage
    const res = await apiClient.sendMessageToChatGPT(content);

    // 更新這裡：正確解析 ChatGPT 的回覆
    const coachMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      content: res.output[0].content[0].text || '（沒有回覆內容）',
      timestamp: new Date()
    }
    messages.value.push(coachMessage)
  } catch (e) {
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