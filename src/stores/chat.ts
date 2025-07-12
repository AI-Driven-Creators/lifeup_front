import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import type { ChatMessage, CoachStyle } from '@/types'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    loading: false,
    error: null as string | null,
    coachStyle: 'gentle' as CoachStyle['type'],
  }),

  getters: {
    lastMessage: (state) => state.messages[state.messages.length - 1],
    userMessages: (state) => state.messages.filter(msg => msg.role === 'user'),
    coachMessages: (state) => state.messages.filter(msg => msg.role === 'coach'),
    conversationCount: (state) => state.messages.length,
  },

  actions: {
    async fetchChatHistory() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.getChatMessages();
        if (response.success) {
          this.messages = response.data.map(this.transformBackendMessage);
        } else {
          this.error = response.message;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取聊天記錄失敗';
        console.error('Failed to fetch chat history:', error);
      } finally {
        this.loading = false;
      }
    },

    async sendMessage(content: string) {
      if (!content.trim()) return;

      this.loading = true;
      this.error = null;

      // 先添加用戶訊息到本地狀態
      const userMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };
      this.messages.push(userMessage);

      try {
        const response = await apiClient.sendMessage(content);
        if (response.success) {
          // 添加 AI 回覆到本地狀態
          const coachMessage = this.transformBackendMessage(response.data);
          this.messages.push(coachMessage);
          return coachMessage;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '發送訊息失敗';
        console.error('Failed to send message:', error);
        
        // 添加錯誤訊息
        const errorMessage: ChatMessage = {
          id: this.generateMessageId(),
          role: 'coach',
          content: '抱歉，我現在無法回應。請稍後再試。',
          timestamp: new Date(),
        };
        this.messages.push(errorMessage);
        
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 設定教練風格
    setCoachStyle(style: CoachStyle['type']) {
      this.coachStyle = style;
      // TODO: 當後端支援教練風格設定時，在這裡調用 API
    },

    // 清空聊天記錄
    clearMessages() {
      this.messages = [];
    },

    // 將後端訊息數據轉換為前端格式
    transformBackendMessage(backendMessage: any): ChatMessage {
      return {
        id: backendMessage.id || this.generateMessageId(),
        role: this.mapBackendRole(backendMessage.role),
        content: backendMessage.content || '',
        timestamp: backendMessage.created_at ? new Date(backendMessage.created_at) : new Date(),
      };
    },

    // 映射後端角色到前端格式
    mapBackendRole(backendRole: string): ChatMessage['role'] {
      switch (backendRole) {
        case 'user': return 'user';
        case 'assistant': return 'coach';
        default: return 'coach';
      }
    },

    // 生成訊息 ID
    generateMessageId(): string {
      return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // 獲取教練問候語
    getGreetingMessage(): ChatMessage {
      const greetings = {
        gentle: '你好！我是你的成長夥伴，有什麼可以幫助你的嗎？',
        challenging: '準備好迎接挑戰了嗎？讓我們一起突破極限！',
        creative: '嗨！讓我們用創意的方式探索你的潛能吧！',
      };

      return {
        id: this.generateMessageId(),
        role: 'coach',
        content: greetings[this.coachStyle],
        timestamp: new Date(),
      };
    },

    // 添加系統訊息
    addSystemMessage(content: string) {
      const systemMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'coach',
        content,
        timestamp: new Date(),
      };
      this.messages.push(systemMessage);
    },

    // 初始化聊天（添加問候語）
    async initializeChat() {
      if (this.messages.length === 0) {
        await this.fetchChatHistory();
        
        // 如果沒有歷史記錄，添加問候語
        if (this.messages.length === 0) {
          const greeting = this.getGreetingMessage();
          this.messages.push(greeting);
        }
      }
    },

    // 獲取建議問題
    getSuggestedQuestions(): string[] {
      return [
        '我該如何開始學習新技能？',
        '如何提升我的專注力？',
        '給我一些今天的任務建議',
        '我感到有點迷茫，該怎麼辦？',
        '如何平衡工作和學習？',
      ];
    },
  },
});