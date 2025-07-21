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
          priority: taskData.difficulty,
          task_type: taskData.type,
          difficulty: taskData.difficulty,
          experience: this.calculateExperience(taskData.difficulty),
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

    async fetchTasksByType(taskType: Task['type']) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.getTasksByType(taskType);
        if (response.success) {
          const tasks = response.data.map(this.transformBackendTask);
          return tasks;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取任務失敗';
        console.error('Failed to fetch tasks by type:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleTaskStatus(taskId: string, currentStatus?: Task['status'], reverse: boolean = false) {
      console.log(`toggleTaskStatus called: taskId=${taskId}, currentStatus=${currentStatus}, reverse=${reverse}`);
      
      // 首先嘗試從 store 中找到任務
      let task = this.tasks.find(t => t.id === taskId);
      let taskStatus = task?.status || currentStatus;

      // 如果沒有找到任務且沒有提供當前狀態，先獲取任務信息
      if (!taskStatus) {
        try {
          const response = await apiClient.getTasks();
          if (response.success) {
            const allTasks = response.data.map(this.transformBackendTask);
            const foundTask = allTasks.find(t => t.id === taskId);
            if (foundTask) {
              taskStatus = foundTask.status;
            } else {
              throw new Error('找不到指定的任務');
            }
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          console.error('Failed to fetch task for status update:', error);
          throw error;
        }
      }

      // 計算下一個狀態
      let nextStatus: number;
      let nextStatusString: Task['status'];
      
      console.log(`Status transition logic: taskStatus=${taskStatus}, reverse=${reverse}`);
      
      if (reverse) {
        console.log('執行反向切換邏輯');
        // 反向切換：回復到前一個狀態
        if (taskStatus === 'completed') {
          nextStatus = 1; // 回復到進行中
          nextStatusString = 'in_progress';
          console.log('completed -> in_progress');
        } else if (taskStatus === 'in_progress') {
          nextStatus = 0; // 回復到待處理
          nextStatusString = 'pending';
          console.log('in_progress -> pending');
        } else {
          nextStatus = 0; // pending狀態無法再往回
          nextStatusString = 'pending';
          console.log('default -> pending');
        }
      } else {
        console.log('執行正向切換邏輯');
        // 正向切換：進入下一個狀態
        if (taskStatus === 'pending') {
          nextStatus = 1; // 進行中
          nextStatusString = 'in_progress';
        } else if (taskStatus === 'in_progress') {
          nextStatus = 2; // 已完成
          nextStatusString = 'completed';
        } else if (taskStatus === 'completed') {
          // 已完成的任務正向切換應該重置到待處理（重做）
          nextStatus = 0; // 重置到待處理
          nextStatusString = 'pending';
        } else {
          // 其他狀態（paused, cancelled等）默認到待處理
          nextStatus = 0; // 待處理
          nextStatusString = 'pending';
        }
      }

      try {
        console.log(`更新任務狀態: ${taskId} 從 ${taskStatus} 到 ${nextStatusString} (reverse: ${reverse})`);
        
        // 呼叫後端 API 更新任務狀態
        const response = await apiClient.updateTask(taskId, {
          status: nextStatus
        });

        if (response.success) {
          // 如果任務在 store 中，更新前端狀態
          if (task) {
            task.status = nextStatusString;
          }
          console.log(`Task ${taskId} status changed to ${nextStatusString}`);
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
        type: (backendTask.task_type as Task['type']) || this.mapPriorityToType(backendTask.priority),
        difficulty: Math.min(5, Math.max(1, backendTask.difficulty || backendTask.priority || 1)) as Task['difficulty'],
        experience: backendTask.experience || this.calculateExperience(backendTask.difficulty || backendTask.priority || 1),
        estimatedTime: this.estimateTime(backendTask.difficulty || backendTask.priority || 1),
        status: this.mapBackendStatus(backendTask.status),
        deadline: backendTask.due_date ? new Date(backendTask.due_date) : undefined,
        attributes: this.generateAttributes(backendTask.difficulty || backendTask.priority || 1),
        // 任務層級相關
        parent_task_id: backendTask.parent_task_id,
        is_parent_task: Boolean(backendTask.is_parent_task),
        task_order: backendTask.task_order,
        // 取消計數相關
        cancel_count: backendTask.cancel_count,
        last_cancelled_at: backendTask.last_cancelled_at,
      };
    },

    // 根據後端狀態映射前端狀態
    mapBackendStatus(backendStatus?: number): Task['status'] {
      switch (backendStatus) {
        case 0: return 'pending';
        case 1: return 'in_progress';
        case 2: return 'completed';
        case 3: return 'cancelled';
        case 4: return 'paused';
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