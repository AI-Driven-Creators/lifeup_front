import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import { useSkillStore } from './skill'
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
      skillTags?: string[];
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
          skill_tags: taskData.skillTags || [], // 添加技能標籤
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
        } else if (taskStatus === 'daily_completed') {
          nextStatus = 5; // 回復到每日進行中
          nextStatusString = 'daily_in_progress';
          console.log('daily_completed -> daily_in_progress');
        } else if (taskStatus === 'in_progress') {
          nextStatus = 0; // 回復到待處理
          nextStatusString = 'pending';
          console.log('in_progress -> pending');
        } else if (taskStatus === 'daily_in_progress') {
          nextStatus = 0; // 回復到待處理
          nextStatusString = 'pending';
          console.log('daily_in_progress -> pending');
        } else if (taskStatus === 'daily_not_completed') {
          nextStatus = 0; // 回復到待處理
          nextStatusString = 'pending';
          console.log('daily_not_completed -> pending');
        } else {
          nextStatus = 0; // pending狀態無法再往回
          nextStatusString = 'pending';
          console.log('default -> pending');
        }
      } else {
        console.log('執行正向切換邏輯');
        // 正向切換：進入下一個狀態
        if (taskStatus === 'pending') {
          // 檢查是否為重複性任務（如果有is_recurring屬性或parent_task_id）
          if (task?.parent_task_id) {
            nextStatus = 5; // 每日進行中
            nextStatusString = 'daily_in_progress';
          } else {
            nextStatus = 1; // 進行中
            nextStatusString = 'in_progress';
          }
        } else if (taskStatus === 'in_progress') {
          nextStatus = 2; // 已完成
          nextStatusString = 'completed';
        } else if (taskStatus === 'daily_in_progress') {
          nextStatus = 6; // 每日已完成
          nextStatusString = 'daily_completed';
        } else if (taskStatus === 'completed') {
          // 已完成的任務正向切換應該重置到待處理（重做）
          nextStatus = 0; // 重置到待處理
          nextStatusString = 'pending';
        } else if (taskStatus === 'daily_completed') {
          // 每日已完成的任務正向切換應該重置到每日進行中（重做）
          nextStatus = 5; // 重置到每日進行中
          nextStatusString = 'daily_in_progress';
        } else if (taskStatus === 'daily_not_completed') {
          // 每日未完成的任務正向切換應該到每日已完成
          nextStatus = 6; // 每日已完成
          nextStatusString = 'daily_completed';
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
          
          // 根據狀態變化處理經驗值
          if (nextStatusString === 'completed' || nextStatusString === 'daily_completed') {
            // 任務完成，增加經驗值
            if (!task) {
              try {
                const tasksResponse = await apiClient.getTasks();
                if (tasksResponse.success) {
                  const allTasks = tasksResponse.data.map(this.transformBackendTask);
                  task = allTasks.find(t => t.id === taskId) || null;
                }
              } catch (error) {
                console.error('Failed to fetch task for completion handling:', error);
              }
            }
            await this.handleTaskCompletion(task);
          } else if (reverse && (taskStatus === 'completed' || taskStatus === 'daily_completed')) {
            // 從完成狀態回復，扣除經驗值
            if (!task) {
              try {
                const tasksResponse = await apiClient.getTasks();
                if (tasksResponse.success) {
                  const allTasks = tasksResponse.data.map(this.transformBackendTask);
                  task = allTasks.find(t => t.id === taskId) || null;
                }
              } catch (error) {
                console.error('Failed to fetch task for revert handling:', error);
              }
            }
            await this.handleTaskRevert(task);
          }
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
      // 直接使用後端返回的狀態，因為後端已經統一處理了每日任務的狀態
      const status = this.mapBackendStatus(backendTask.status)
      
      return {
        id: backendTask.id || '',
        title: backendTask.title || '',
        description: backendTask.description,
        type: (backendTask.task_type as Task['type']) || this.mapPriorityToType(backendTask.priority),
        difficulty: Math.min(5, Math.max(1, backendTask.difficulty || backendTask.priority || 1)) as Task['difficulty'],
        experience: backendTask.experience || this.calculateExperience(backendTask.difficulty || backendTask.priority || 1),
        estimatedTime: this.estimateTime(backendTask.difficulty || backendTask.priority || 1),
        status: status,
        deadline: backendTask.due_date ? new Date(backendTask.due_date) : undefined,
        task_date: backendTask.task_date, // 任務日期
        attributes: this.generateAttributes(backendTask.difficulty || backendTask.priority || 1),
        skillTags: backendTask.skill_tags, // 解析技能標籤
        // 任務層級相關
        parent_task_id: backendTask.parent_task_id,
        parent_task_title: backendTask.parent_task_title,
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
        case 5: return 'daily_in_progress';
        case 6: return 'daily_completed';
        case 7: return 'daily_not_completed';
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

    // 解析技能標籤JSON字符串
    parseSkillTags(skillTagsJson?: string): string[] {
      if (!skillTagsJson) return [];
      try {
        return JSON.parse(skillTagsJson);
      } catch (error) {
        console.warn('解析技能標籤失敗:', error);
        return [];
      }
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
          skillTags: ['時間管理'] // 直接添加技能標籤
        },
        {
          title: '練習程式設計',
          description: '完成一個小專案',
          type: 'main' as const,
          difficulty: 4 as const,
          skillTags: ['Python 程式設計', '溝通協作'] // 高難度需要多技能
        },
        {
          title: '閱讀技術文章',
          description: '學習新技術知識',
          type: 'side' as const,
          difficulty: 3 as const,
          skillTags: ['時間管理'] // 閱讀相關技能
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

    // 處理任務完成，觸發技能經驗值獲得
    async handleTaskCompletion(task: Task | null) {
      if (!task) {
        console.log('❌ handleTaskCompletion: task 為空');
        return;
      }

      const skillStore = useSkillStore();
      
      try {
        // 基本經驗值計算：使用任務本身的經驗值
        const baseExperience = task.experience;
        
        // 根據任務類型和屬性分配技能經驗值
        const skillExperienceUpdates: Array<{skillId: string, experience: number, reason: string}> = [];
        
        // 獲取所有技能用於查找對應技能
        if (skillStore.skills.length === 0) {
          console.log('📚 技能列表為空，正在獲取...');
          await skillStore.fetchSkills();
        }
        console.log('📚 當前技能列表:', skillStore.skills.map(s => s.name));
        
        // 根據任務技能標籤給相應技能增加經驗值
        if (task.skillTags && task.skillTags.length > 0) {
          console.log(`🏷️ 處理 ${task.skillTags.length} 個技能標籤:`, task.skillTags);
          for (const skillTag of task.skillTags) {
            // 根據技能名稱找到對應的技能
            const targetSkill = skillStore.skills.find(skill => skill.name === skillTag);
            if (targetSkill) {
              console.log(`✅ 找到對應技能: ${skillTag} -> ${targetSkill.id}`);
              skillExperienceUpdates.push({
                skillId: targetSkill.id,
                experience: baseExperience,
                reason: `完成任務: ${task.title}`
              });
            } else {
              console.warn(`❌ 找不到技能: ${skillTag}`);
            }
          }
        } else {
          console.log('⚠️ 任務沒有技能標籤');
        }
        
        // 如果沒有技能標籤，不分配技能經驗值
        if (skillExperienceUpdates.length === 0) {
          console.log('⚠️ 任務沒有技能標籤，跳過技能經驗值分配');
        }
        
        // 批量更新技能經驗值
        for (const update of skillExperienceUpdates) {
          try {
            await skillStore.addSkillExperience(update.skillId, update.experience, update.reason);
          } catch (error) {
            console.error(`更新技能 ${update.skillId} 經驗值失敗:`, error);
          }
        }
        
        console.log(`✅ 任務完成獎勵發放完畢！更新了 ${skillExperienceUpdates.length} 個技能`);
        
      } catch (error) {
        console.error('處理任務完成獎勵時發生錯誤:', error);
      }
    },

    // 處理任務回復，扣除技能經驗值
    async handleTaskRevert(task: Task | null) {
      if (!task) {
        console.log('❌ handleTaskRevert: task 為空');
        return;
      }

      const skillStore = useSkillStore();
      
      try {
        // 基本經驗值計算：使用任務本身的經驗值（負值表示扣除）
        const baseExperience = -task.experience;
        
        // 根據任務類型和屬性分配技能經驗值扣除
        const skillExperienceUpdates: Array<{skillId: string, experience: number, reason: string}> = [];
        
        // 獲取所有技能用於查找對應技能
        if (skillStore.skills.length === 0) {
          console.log('📚 技能列表為空，正在獲取...');
          await skillStore.fetchSkills();
        }
        console.log('📚 當前技能列表:', skillStore.skills.map(s => s.name));
        
        // 根據任務技能標籤給相應技能扣除經驗值
        if (task.skillTags && task.skillTags.length > 0) {
          console.log(`🏷️ 處理 ${task.skillTags.length} 個技能標籤回復:`, task.skillTags);
          for (const skillTag of task.skillTags) {
            // 根據技能名稱找到對應的技能
            const targetSkill = skillStore.skills.find(skill => skill.name === skillTag);
            if (targetSkill) {
              console.log(`✅ 找到對應技能: ${skillTag} -> ${targetSkill.id}`);
              skillExperienceUpdates.push({
                skillId: targetSkill.id,
                experience: baseExperience, // 負值，表示扣除
                reason: `回復任務: ${task.title}`
              });
            } else {
              console.warn(`❌ 找不到技能: ${skillTag}`);
            }
          }
        } else {
          console.log('⚠️ 任務沒有技能標籤');
        }
        
        // 如果沒有技能標籤，不扣除技能經驗值
        if (skillExperienceUpdates.length === 0) {
          console.log('⚠️ 任務沒有技能標籤，跳過技能經驗值扣除');
        }
        
        // 批量更新技能經驗值（扣除）
        for (const update of skillExperienceUpdates) {
          try {
            await skillStore.addSkillExperience(update.skillId, update.experience, update.reason);
          } catch (error) {
            console.error(`扣除技能 ${update.skillId} 經驗值失敗:`, error);
          }
        }
        
        console.log(`✅ 任務回復處理完畢！扣除了 ${skillExperienceUpdates.length} 個技能的經驗值`);
        
      } catch (error) {
        console.error('處理任務回復扣除經驗值時發生錯誤:', error);
      }
    },
  },
});