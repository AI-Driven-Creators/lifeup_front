import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import type { Task } from '@/types'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    pendingTasks: (state) => state.tasks.filter(task => task.status === 'pending'),
    completedTasks: (state) => state.tasks.filter(task => task.status === 'completed'),
    inProgressTasks: (state) => state.tasks.filter(task => task.status === 'in_progress'),
    
    tasksByType: (state) => (type: Task['type']) => 
      state.tasks.filter(task => task.type === type),
    
    totalExperience: (state) => 
      state.tasks
        .filter(task => task.status === 'completed')
        .reduce((total, task) => total + task.experience, 0),
  },

  actions: {
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.getTasks();
        if (response.success) {
          // 將後端數據轉換為前端格式
          this.tasks = response.data.map(this.transformBackendTask);
        } else {
          this.error = response.message;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取任務失敗';
        console.error('Failed to fetch tasks:', error);
      } finally {
        this.loading = false;
      }
    },

    async createTask(taskData: {
      title: string;
      description?: string;
      type: Task['type'];
      difficulty: Task['difficulty'];
    }) {
      this.loading = true;
      this.error = null;

      try {
        // 將前端數據轉換為後端格式
        const backendTaskData = {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.difficulty, // 後端用 priority，前端用 difficulty
          user_id: 'd487f83e-dadd-4616-aeb2-959d6af9963b', // 使用實際用戶ID
        };

        const response = await apiClient.createTask(backendTaskData);
        if (response.success) {
          const newTask = this.transformBackendTask(response.data);
          this.tasks.push(newTask);
          return newTask;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '創建任務失敗';
        console.error('Failed to create task:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleTaskStatus(taskId: string) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) return;

      // 計算下一個狀態
      let nextStatus: number;
      let nextStatusString: Task['status'];
      
      if (task.status === 'pending') {
        nextStatus = 1; // 進行中
        nextStatusString = 'in_progress';
      } else if (task.status === 'in_progress') {
        nextStatus = 2; // 已完成
        nextStatusString = 'completed';
      } else {
        nextStatus = 0; // 待完成
        nextStatusString = 'pending';
      }

      try {
        // 呼叫後端 API 更新任務狀態
        const response = await apiClient.updateTask(taskId, {
          status: nextStatus
        });

        if (response.success) {
          // 更新前端狀態
          task.status = nextStatusString;
          console.log(`Task ${taskId} status changed to ${task.status}`);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('Failed to update task status:', error);
        throw error;
      }
    },

    // 將後端任務數據轉換為前端格式
    transformBackendTask(backendTask: any): Task {
      return {
        id: backendTask.id || '',
        title: backendTask.title || '',
        description: backendTask.description,
        type: this.mapPriorityToType(backendTask.priority), // 根據優先級映射任務類型
        difficulty: Math.min(5, Math.max(1, backendTask.priority || 1)) as Task['difficulty'],
        experience: this.calculateExperience(backendTask.priority || 1),
        estimatedTime: this.estimateTime(backendTask.priority || 1),
        status: this.mapBackendStatus(backendTask.status),
        deadline: backendTask.due_date ? new Date(backendTask.due_date) : undefined,
        attributes: this.generateAttributes(backendTask.priority || 1),
      };
    },

    // 根據後端狀態映射前端狀態
    mapBackendStatus(backendStatus?: number): Task['status'] {
      switch (backendStatus) {
        case 0: return 'pending';
        case 1: return 'in_progress';
        case 2: return 'completed';
        default: return 'pending';
      }
    },

    // 根據優先級映射任務類型
    mapPriorityToType(priority?: number): Task['type'] {
      if (!priority) return 'daily';
      if (priority >= 3) return 'main';
      if (priority === 2) return 'daily';
      return 'side';
    },

    // 根據難度計算經驗值
    calculateExperience(difficulty: number): number {
      return difficulty * 10 + 5; // 簡單的經驗值計算
    },

    // 根據難度估算時間
    estimateTime(difficulty: number): string {
      const baseTime = difficulty * 15; // 每個難度點 15 分鐘
      return `${baseTime}分鐘`;
    },

    // 根據難度生成屬性獎勵
    generateAttributes(difficulty: number): Partial<Task['attributes']> {
      return {
        intelligence: Math.floor(difficulty / 2),
        focus: Math.floor(difficulty / 2),
      };
    },

    // 清空所有任務（開發用）
    clearTasks() {
      this.tasks = [];
    },

    // 添加一些示例任務（開發用）
    async addSampleTasks() {
      const sampleTasks = [
        {
          title: '完成今日學習計劃',
          description: '專注學習30分鐘',
          type: 'daily' as const,
          difficulty: 2 as const,
        },
        {
          title: '練習程式設計',
          description: '完成一個小專案',
          type: 'main' as const,
          difficulty: 4 as const,
        },
        {
          title: '閱讀技術文章',
          description: '學習新技術知識',
          type: 'side' as const,
          difficulty: 3 as const,
        },
      ];

      for (const task of sampleTasks) {
        try {
          await this.createTask(task);
        } catch (error) {
          console.error('Failed to create sample task:', error);
        }
      }
    },
  },
});