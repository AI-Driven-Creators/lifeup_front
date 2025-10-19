import { loadApiConfig, type ApiConfig } from '../config/api';

// API 客戶端配置
export class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    if (baseURL) {
      this.baseURL = baseURL;
    } else {
      const config = loadApiConfig();
      this.baseURL = config.baseURL;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');

      if (isJson) {
        const data = await response.json();
        // 對於非 2xx，也回傳後端的 JSON，交由呼叫端判斷 success 與 message
        return data as T;
      }

      // 非 JSON 回應：保留既有行為
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      // @ts-expect-error: 非 JSON 回應由呼叫端自行處理
      return (await response.text()) as T;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // 健康檢查
  async healthCheck() {
    return this.request<{ success: boolean, data: string, message: string }>('/health');
  }

  // 用戶相關 API
  async getUsers() {
    return this.request<{ success: boolean, data: any[], message: string }>('/api/users');
  }

  async getUser(id: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/users/${id}`);
  }

  async createUser(userData: { name: string, email: string, password: string }) {
    return this.request<{ success: boolean, data: any, message: string }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string, password: string }) {
    return this.request<{ success: boolean, data: { user: any, message: string }, message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request<{ success: boolean, data: null, message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getGamifiedUserData(id: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/users/${id}/gamified`);
  }

  // 任務相關 API
  async getTasks(userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/tasks?${queryString}` : '/api/tasks';
    return this.request<{ success: boolean, data: any[], message: string }>(url);
  }

  async getTask(id: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/tasks/${id}`);
  }

  async createTask(taskData: {
    title: string,
    description?: string,
    priority?: number,
    task_type?: string,
    difficulty?: number,
    experience?: number,
    user_id?: string,
    parent_task_id?: string,
    task_order?: number,
    due_date?: string,
    // 常駐目標相關參數
    is_recurring?: number,
    recurrence_pattern?: string,
    start_date?: string,
    end_date?: string,
    completion_target?: number
  }) {
    return this.request<{ success: boolean, data: any, message: string }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, updateData: {
    title?: string,
    description?: string,
    status?: number,
    priority?: number,
    task_type?: string,
    difficulty?: number,
    experience?: number,
    due_date?: string,
    task_order?: number
  }) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteTask(id: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTasksByType(taskType: string, userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/type/${taskType}?${queryString}` : `/api/tasks/type/${taskType}`;
    return this.request<{ success: boolean, data: any[], message: string }>(url);
  }

  async getHomepageTasks(userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/homepage?${queryString}` : '/api/tasks/homepage';
    return this.request<{ success: boolean, data: any[], message: string }>(url);
  }

  async startTask(id: string, generateSubtasks: boolean = false) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/tasks/${id}/start`, {
      method: 'POST',
      body: JSON.stringify({ generate_subtasks: generateSubtasks }),
    });
  }

  async pauseTask(id: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/tasks/${id}/pause`, {
      method: 'PUT',
    });
  }

  async cancelTask(id: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/tasks/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async restartTask(id: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/tasks/${id}/restart`, {
      method: 'PUT',
    });
  }

  async getSubtasks(parentTaskId: string, options?: { daily?: boolean, days?: number }) {
    const params = new URLSearchParams();
    if (options?.daily) {
      params.append('daily', 'true');
    }
    if (options?.days) {
      params.append('days', options.days.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/api/tasks/${parentTaskId}/subtasks?${queryString}` : `/api/tasks/${parentTaskId}/subtasks`;

    return this.request<{ success: boolean, data: any[], message: string }>(url);
  }

  // 技能相關 API
  async getSkills(userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/skills?${queryString}` : '/api/skills';
    return this.request<{ success: boolean, data: any[], message: string }>(url);
  }

  async createSkill(skillData: { name: string, description?: string, level?: number, user_id?: string }) {
    return this.request<{ success: boolean, data: any, message: string }>('/api/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async getTasksBySkill(skillName: string, userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/skills/${encodeURIComponent(skillName)}/tasks?${queryString}` : `/api/skills/${encodeURIComponent(skillName)}/tasks`;
    return this.request<{ success: boolean, data: any[], message: string }>(url);
  }

  async updateSkillExperience(skillId: string, experience: number, reason?: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/skills/${skillId}/experience`, {
      method: 'POST',
      body: JSON.stringify({ experience_gain: experience, reason }),
    });
  }

  async updateUserExperience(userId: string, experience: number) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/users/${userId}/experience`, {
      method: 'POST',
      body: JSON.stringify({ experience_gain: experience }),
    });
  }

  // 更新使用者屬性
  async updateUserAttributes(userId: string, attributes: Record<string, number>) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/users/${userId}/attributes`, {
      method: 'POST',
      body: JSON.stringify({ attributes }),
    });
  }

  // 聊天相關 API
  async sendMessage(message: string) {
    return this.request<{ success: boolean, data: any, message: string }>('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // 成就相關 API
  async getAchievements() {
    return this.request<{ success: boolean, data: any[], message: string }>('/api/achievements');
  }

  async getAchievementDetails(achievementId: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/achievements/${achievementId}`);
  }

  async syncAchievementStats() {
    return this.request<{ success: boolean, data: { synced_achievements: number, message: string }, message: string }>('/api/achievements/sync-stats', {
      method: 'POST',
    });
  }

  async getUserAchievements(userId: string) {
    return this.request<{ success: boolean, data: any[], message: string }>(`/api/users/${userId}/achievements`);
  }

  async getUserAchievementsStatus(userId: string) {
    return this.request<{ success: boolean, data: any[], message: string }>(`/api/users/${userId}/achievements/status`);
  }

  async unlockUserAchievement(userId: string, achievementId: string) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/users/${userId}/achievements/${achievementId}/unlock`, {
      method: 'POST',
    });
  }

  // 從用戶任務數據自動生成成就
  async generateAchievementFromTasks(userId: string) {
    return this.request<{ 
      success: boolean, 
      data: {
        achievement: any,
        is_unlocked: boolean,
        task_summary: any
      }, 
      message: string 
    }>(`/api/achievements/generate-from-tasks/${userId}`, {
      method: 'POST',
    });
  }

  // 週屬性相關 API
  async getWeeklyAttributes(userId: string, weeksAgo: number = 0) {
    return this.request<{ success: boolean, data: any, message: string }>(`/api/users/${userId}/attributes/weekly/${weeksAgo}`);
  }

  // 任務進度相關 API
  async getTaskProgress(taskId: string, userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/tasks/${taskId}/progress?${queryString}` : `/api/tasks/${taskId}/progress`;
    return this.request<{ success: boolean, data: any, message: string }>(url);
  }

  // ChatGPT - 透過後端API呼叫
  async sendMessageToChatGPT(message: string, userId?: string) {
    return this.request<any>('/api/chat/chatgpt', {
      method: 'POST',
      body: JSON.stringify({
        message,
        user_id: userId
      }),
    });
  }

  // AI 任務生成相關 API
  async generateTaskFromChat(chatHistory: string[]) {
    return this.request<{ success: boolean, data: any, message: string }>('/api/tasks/generate-from-chat', {
      method: 'POST',
      body: JSON.stringify({ chat_history: chatHistory }),
    });
  }

  // 專家系統任務生成 API
  async generateTaskWithExpert(payload: {
    description: string,
    promptDescription?: string,
    userId?: string,
    expertMatch?: any,
    expertName: string,
    expertDescription: string,
    selectedOptions?: string[],
    selectedDirections?: Array<{ title: string; description: string }>,
    expertOutputs?: Record<string, string>,
    skillLevelLabel?: string,
    learningDurationLabel?: string,
  }) {
    return this.request<{ 
      success: boolean, 
      data: {
        expert_match: {
          expert: {
            name: string,
            description: string,
            expertise_areas: string[],
            emoji: string
          },
          confidence: number,
          ai_expert_name: string,
          ai_expert_description: string
        },
        task_json: any
      }, 
      message: string 
    }>('/api/tasks/generate-with-expert', {
      method: 'POST',
      body: JSON.stringify({ 
        description: payload.description,
        prompt_description: payload.promptDescription,
        user_id: payload.userId,
        expert_name: payload.expertName,
        expert_description: payload.expertDescription,
        expert_match: payload.expertMatch,
        selected_options: payload.selectedOptions,
        selected_directions: payload.selectedDirections,
        expert_outputs: payload.expertOutputs,
        skill_level_label: payload.skillLevelLabel,
        learning_duration_label: payload.learningDurationLabel
      }),
    });
  }

  // 只匹配專家 API（不生成任務）
  async matchExpertOnly(description: string, userId?: string) {
    return this.request<{ 
      success: boolean, 
      data: {
        expert_match: {
          expert: {
            name: string,
            description: string,
            expertise_areas: string[],
            emoji: string
          },
          confidence: number
        }
      }, 
      message: string 
    }>('/api/tasks/match-expert', {
      method: 'POST',
      body: JSON.stringify({ 
        description: description,
        user_id: userId 
      }),
    });
  }

  // 專家分析 API
  async expertAnalysis(description: string, expertName: string, expertDescription: string, analysisType: string, userId?: string) {
    return this.request<{ 
      success: boolean, 
      data: {
        analysis_result: string,
        directions?: Array<{
          title: string,
          description: string
        }>
      }, 
      message: string 
    }>('/api/tasks/expert-analysis', {
      method: 'POST',
      body: JSON.stringify({ 
        description: description,
        expert_name: expertName,
        expert_description: expertDescription,
        analysis_type: analysisType,
        user_id: userId 
      }),
    });
  }

  async validateAndPreviewTask(taskJson: any) {
    return this.request<{ 
      success: boolean, 
      data: {
        is_valid: boolean,
        validation_errors: string[],
        task_preview?: string,
        task_json?: any
      }, 
      message: string 
    }>('/api/tasks/validate-preview', {
      method: 'POST',
      body: JSON.stringify({ task_json: taskJson }),
    });
  }

  async createTaskFromJson(taskJson: any, userId?: string) {
    return this.request<{ success: boolean, data: any, message: string }>('/api/tasks/create-from-json', {
      method: 'POST',
      body: JSON.stringify({
        ...taskJson,
        user_id: userId
      }),
    });
  }

  // 聊天記錄相關 API
  async getChatMessages(userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `/api/chat/messages?${queryString}` : '/api/chat/messages';
    return this.request<{success: boolean, data: any[], message: string}>(url);
  }

  // 下載所有聊天記錄
  async downloadChatHistory(userId?: string) {
    const params = new URLSearchParams();
    if (userId) {
      params.append('user_id', userId);
    }
    const queryString = params.toString();
    const url = queryString ? `${this.baseURL}/api/chat/messages/all?${queryString}` : `${this.baseURL}/api/chat/messages/all`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain',
      },
    });
    
    if (!response.ok) {
      throw new Error('下載失敗');
    }
    
    return response;
  }

  // 教練個性相關 API
  async getAvailablePersonalities() {
    return this.request<{
      success: boolean,
      data: {
        personalities: Array<{
          personality_type: string,
          display_name: string,
          description: string,
          emoji: string
        }>,
        current_personality: string | null
      },
      message: string
    }>('/api/coach/personalities');
  }

  async setCoachPersonality(userId: string, personalityType: string) {
    const requestBody: any = {
      personality_type: personalityType
    };
    
    // 只有當 userId 不為空時才加入 user_id 欄位
    if (userId && userId.trim() !== '') {
      requestBody.user_id = userId;
    }
    
    return this.request<{
      success: boolean,
      data: {
        personality_type: string,
        display_name: string,
        description: string,
        is_active: boolean
      },
      message: string
    }>('/api/coach/personality', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async getCurrentPersonality(userId: string) {
    const url = userId && userId.trim() !== '' 
      ? `/api/coach/personality/current?user_id=${userId}`
      : '/api/coach/personality/current';
      
    return this.request<{
      success: boolean,
      data: {
        personality_type: string,
        display_name: string,
        description: string,
        is_active: boolean
      } | null,
      message: string
    }>(url);
  }

  async sendMessageWithPersonality(message: string, userId?: string) {
    const payload = {
      message,
      user_id: userId
    };
    console.log('發送個性化聊天請求:', payload);
    return this.request<{ text: string }>('/api/chat/personality', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

// 創建全局 API 實例，使用懶加載方式確保配置正確載入
let _apiClient: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!_apiClient) {
    _apiClient = new ApiClient();
  }
  return _apiClient;
}

// 重置 API 客戶端（用於配置變更後）
export function resetApiClient(): void {
  _apiClient = null;
}

// 為了向後兼容，保留原來的 apiClient 導出
export const apiClient = getApiClient();