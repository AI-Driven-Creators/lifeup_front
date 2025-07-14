// API 客戶端配置
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8080') {
    this.baseURL = baseURL;
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
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // 健康檢查
  async healthCheck() {
    return this.request<{success: boolean, data: string, message: string}>('/health');
  }

  // 用戶相關 API
  async getUsers() {
    return this.request<{success: boolean, data: any[], message: string}>('/api/users');
  }

  async getUser(id: string) {
    return this.request<{success: boolean, data: any, message: string}>(`/api/users/${id}`);
  }

  async createUser(userData: {name: string, email: string}) {
    return this.request<{success: boolean, data: any, message: string}>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 任務相關 API
  async getTasks() {
    return this.request<{success: boolean, data: any[], message: string}>('/api/tasks');
  }

  async createTask(taskData: {
    title: string, 
    description?: string, 
    priority?: number, 
    task_type?: string,
    difficulty?: number,
    experience?: number,
    user_id?: string
  }) {
    return this.request<{success: boolean, data: any, message: string}>('/api/tasks', {
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
    due_date?: string
  }) {
    return this.request<{success: boolean, data: any, message: string}>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async getTasksByType(taskType: string) {
    return this.request<{success: boolean, data: any[], message: string}>(`/api/tasks/type/${taskType}`);
  }

  async getHomepageTasks() {
    return this.request<{success: boolean, data: any[], message: string}>('/api/tasks/homepage');
  }

  async startTask(id: string, generateSubtasks: boolean = true) {
    return this.request<{success: boolean, data: any, message: string}>(`/api/tasks/${id}/start`, {
      method: 'POST',
      body: JSON.stringify({ generate_subtasks: generateSubtasks }),
    });
  }

  async pauseTask(id: string) {
    return this.request<{success: boolean, data: any, message: string}>(`/api/tasks/${id}/pause`, {
      method: 'PUT',
    });
  }

  async cancelTask(id: string) {
    return this.request<{success: boolean, data: any, message: string}>(`/api/tasks/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async restartTask(id: string) {
    return this.request<{success: boolean, data: any, message: string}>(`/api/tasks/${id}/restart`, {
      method: 'PUT',
    });
  }

  async getSubtasks(parentTaskId: string) {
    return this.request<{success: boolean, data: any[], message: string}>(`/api/tasks/${parentTaskId}/subtasks`);
  }

  // 技能相關 API
  async getSkills() {
    return this.request<{success: boolean, data: any[], message: string}>('/api/skills');
  }

  async createSkill(skillData: {name: string, description?: string, level?: number}) {
    return this.request<{success: boolean, data: any, message: string}>('/api/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  // 聊天相關 API
  async getChatMessages() {
    return this.request<{success: boolean, data: any[], message: string}>('/api/chat/messages');
  }

  async sendMessage(message: string) {
    return this.request<{success: boolean, data: any, message: string}>('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

// 創建全局 API 實例
export const apiClient = new ApiClient();