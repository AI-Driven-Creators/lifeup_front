import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import { useSkillStore } from './skill'
import { useRewardsStore } from './rewards'
import { useUserStore } from './user'
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
        const userStore = useUserStore();
        const response = await apiClient.getTasks(userStore.user.id);
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
      priority?: Task['priority'];
      difficulty: Task['difficulty'];
      skillTags?: string[];
    }) {
      this.loading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        // 將前端數據轉換為後端格式
        const backendTaskData = {
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority ?? 1,
          task_type: taskData.type,
          difficulty: taskData.difficulty,
          experience: this.calculateExperience(taskData.difficulty),
          user_id: userStore.user.id, // 使用當前用戶ID
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
        const userStore = useUserStore();
        const response = await apiClient.getTasksByType(taskType, userStore.user.id);
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
      // 首先嘗試從 store 中找到任務
      let task: Task | null = this.tasks.find(t => t.id === taskId) || null;
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

      if (reverse) {
        // 反向切換：回復到前一個狀態
        if (taskStatus === 'completed') {
          nextStatus = 1; // 回復到進行中
          nextStatusString = 'in_progress';
        } else if (taskStatus === 'daily_completed') {
          nextStatus = 5; // 回復到每日進行中
          nextStatusString = 'daily_in_progress';
        } else if (taskStatus === 'in_progress') {
          nextStatus = 0; // 回復到待處理
          nextStatusString = 'pending';
        } else if (taskStatus === 'daily_in_progress') {
          nextStatus = 0; // 回復到待處理
          nextStatusString = 'pending';
        } else if (taskStatus === 'daily_not_completed') {
          nextStatus = 0; // 回復到待處理
          nextStatusString = 'pending';
        } else {
          nextStatus = 0; // pending狀態無法再往回
          nextStatusString = 'pending';
        }
      } else {
        // 正向切換：進入下一個狀態
        if (taskStatus === 'pending') {
          // 檢查是否為重複性每日任務
          if (task?.type === 'daily' && task?.isRecurring) {
            nextStatus = 5; // 每日進行中
            nextStatusString = 'daily_in_progress';
          } else if (task?.parent_task_id) {
            // 保持舊邏輯作為備選（子任務情況）
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
        // 呼叫後端 API 更新任務狀態
        const response = await apiClient.updateTask(taskId, {
          status: nextStatus
        });

        if (response.success) {
          // 如果任務在 store 中，更新前端狀態
          if (task) {
            task.status = nextStatusString;
          }

          // 根據狀態變化處理經驗值
          if (nextStatusString === 'completed' || nextStatusString === 'daily_completed') {
            // 任務完成，增加經驗值
            // 如果task不存在，使用getTask API獲取(支援子任務)
            if (!task) {
              try {
                const taskResponse = await apiClient.getTask(taskId);
                if (taskResponse.success) {
                  task = this.transformBackendTask(taskResponse.data);
                }
              } catch (error) {
                console.error('從API獲取任務失敗:', error);
              }
            }
            await this.handleTaskCompletion(task);
          } else if (reverse && (taskStatus === 'completed' || taskStatus === 'daily_completed')) {
            // 從完成狀態回復，扣除經驗值
            if (!task) {
              try {
                const taskResponse = await apiClient.getTask(taskId);
                if (taskResponse.success) {
                  task = this.transformBackendTask(taskResponse.data);
                }
              } catch (error) {
                console.error('從API獲取任務失敗:', error);
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

      // 判斷是否為重複性任務 (兼容數字和字串)
      const isRecurring = backendTask.is_recurring === 1 || backendTask.is_recurring === '1' || backendTask.is_recurring === true;

      // 判斷每日任務子類型
      let dailyTaskSubtype: 'simple' | 'recurring' | undefined;
      if (backendTask.task_type === 'daily') {
        dailyTaskSubtype = isRecurring ? 'recurring' : 'simple';
      }

      return {
        id: backendTask.id || '',
        title: backendTask.title || '',
        description: backendTask.description,
        type: (backendTask.task_type as Task['type']) || this.mapPriorityToType(backendTask.priority),
        priority: backendTask.priority ? Math.min(3, Math.max(1, backendTask.priority)) as Task['priority'] : undefined,
        difficulty: Math.min(5, Math.max(1, backendTask.difficulty || backendTask.priority || 1)) as Task['difficulty'],
        experience: backendTask.experience !== null && backendTask.experience !== undefined
          ? backendTask.experience
          : this.calculateExperience(backendTask.difficulty || backendTask.priority || 1),
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
        // 每日任務相關
        isRecurring,
        dailyTaskSubtype,
        // 常駐目標相關
        start_date: backendTask.start_date ? new Date(backendTask.start_date) : undefined,
        end_date: backendTask.end_date ? new Date(backendTask.end_date) : undefined,
        recurrence_pattern: backendTask.recurrence_pattern,
        completion_target: backendTask.completion_target,
        completion_rate: backendTask.completion_rate,
        // 職業任務相關
        task_category: backendTask.task_category,
        career_mainline_id: backendTask.career_mainline_id,
        // 時間戳記
        updated_at: backendTask.updated_at,
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
        return;
      }

      const skillStore = useSkillStore();
      const rewardsStore = useRewardsStore();
      const userStore = useUserStore();

      try {
        // 首先顯示任務完成的經驗值獲得通知
        rewardsStore.addExperienceNotification(task.experience, task.title);

        // 實際增加使用者經驗值
        userStore.updateExperience(task.experience);

        // 處理屬性獎勵（如果任務有屬性設定）
        if (task.attributes && Object.keys(task.attributes).length > 0) {
          try {
            await apiClient.updateUserAttributes(userStore.user.id, task.attributes as Record<string, number>);
            // 重新載入使用者數據以更新屬性
            await userStore.fetchUser(userStore.user.id);
            console.log(`✅ 任務完成，屬性更新: ${JSON.stringify(task.attributes)}`);
          } catch (error) {
            console.error('更新使用者屬性失敗:', error);
          }
        }

        // 基本經驗值計算：使用任務本身的經驗值
        const baseExperience = task.experience;

        // 根據任務類型和屬性分配技能經驗值
        const skillExperienceUpdates: Array<{ skillId: string, skillName: string, experience: number, reason: string }> = [];

        // 獲取所有技能用於查找對應技能
        if (skillStore.skills.length === 0) {
          await skillStore.fetchSkills();
        }

        // 根據任務技能標籤給相應技能增加經驗值
        if (task.skillTags && task.skillTags.length > 0) {
          for (const skillTag of task.skillTags) {
            // 根據技能名稱找到對應的技能
            const targetSkill = skillStore.skills.find(skill => skill.name === skillTag);
            if (targetSkill) {
              skillExperienceUpdates.push({
                skillId: targetSkill.id,
                skillName: targetSkill.name,
                experience: baseExperience,
                reason: `完成任務: ${task.title}`
              });
            }
          }
        }

        // 批量更新技能經驗值並顯示通知
        for (const update of skillExperienceUpdates) {
          try {
            // 先記錄舊的等級
            const skill = skillStore.skills.find(s => s.id === update.skillId);
            const oldLevel = skill?.level || 1;

            // 更新技能經驗值
            const result = await skillStore.addSkillExperience(update.skillId, update.experience, update.reason);

            // 顯示技能經驗值獲得通知
            rewardsStore.addSkillExperienceNotification(
              update.skillName,
              update.experience,
              task.title
            );

            // 如果技能升級了，顯示升級通知
            if (result?.level_up && result.new_level) {
              rewardsStore.addSkillLevelUpNotification(
                update.skillName,
                oldLevel,
                result.new_level
              );
            }
          } catch (error) {
            console.error(`更新技能 ${update.skillId} 經驗值失敗:`, error);
          }
        }

      } catch (error) {
        console.error('處理任務完成獎勵時發生錯誤:', error);
      }
    },

    // 處理任務回復，扣除技能經驗值
    async handleTaskRevert(task: Task | null) {
      if (!task) {
        return;
      }

      const skillStore = useSkillStore();
      const userStore = useUserStore();

      try {
        // 實際扣除使用者經驗值
        userStore.updateExperience(-task.experience);

        // 扣回屬性獎勵（如果任務有屬性設定）
        if (task.attributes && Object.keys(task.attributes).length > 0) {
          try {
            // 將屬性值取反（扣除）
            const revertAttributes: Record<string, number> = {};
            for (const [key, value] of Object.entries(task.attributes)) {
              revertAttributes[key] = -(value as number);
            }
            await apiClient.updateUserAttributes(userStore.user.id, revertAttributes);
            // 重新載入使用者數據以更新屬性
            await userStore.fetchUser(userStore.user.id);
            console.log(`♻️ 任務回復，屬性扣回: ${JSON.stringify(revertAttributes)}`);
          } catch (error) {
            console.error('扣回使用者屬性失敗:', error);
          }
        }

        // 基本經驗值計算：使用任務本身的經驗值（負值表示扣除）
        const baseExperience = -task.experience;

        // 根據任務類型和屬性分配技能經驗值扣除
        const skillExperienceUpdates: Array<{ skillId: string, experience: number, reason: string }> = [];

        // 獲取所有技能用於查找對應技能
        if (skillStore.skills.length === 0) {
          await skillStore.fetchSkills();
        }

        // 根據任務技能標籤給相應技能扣除經驗值
        if (task.skillTags && task.skillTags.length > 0) {
          for (const skillTag of task.skillTags) {
            // 根據技能名稱找到對應的技能
            const targetSkill = skillStore.skills.find(skill => skill.name === skillTag);
            if (targetSkill) {
              skillExperienceUpdates.push({
                skillId: targetSkill.id,
                experience: baseExperience, // 負值，表示扣除
                reason: `回復任務: ${task.title}`
              });
            }
          }
        }

        // 批量更新技能經驗值（扣除）
        for (const update of skillExperienceUpdates) {
          try {
            await skillStore.addSkillExperience(update.skillId, update.experience, update.reason);
          } catch (error) {
            console.error(`扣除技能 ${update.skillId} 經驗值失敗:`, error);
          }
        }

      } catch (error) {
        console.error('處理任務回復扣除經驗值時發生錯誤:', error);
      }
    },

    // 更新任務
    async updateTask(taskId: string, updateData: {
      title?: string;
      description?: string;
      task_type?: string;
      priority?: number;
      difficulty?: number;
      experience?: number;
      due_date?: string;
    }) {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.updateTask(taskId, updateData);
        if (response.success) {
          // 找到並更新 store 中的任務
          const taskIndex = this.tasks.findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            // 更新任務數據
            const updatedTask = {
              ...this.tasks[taskIndex],
              title: updateData.title || this.tasks[taskIndex].title,
              description: updateData.description !== undefined ? updateData.description : this.tasks[taskIndex].description,
              type: (updateData.task_type as any) || this.tasks[taskIndex].type,
              difficulty: (updateData.difficulty as any) || this.tasks[taskIndex].difficulty,
              experience: updateData.experience || this.tasks[taskIndex].experience,
              deadline: updateData.due_date ? new Date(updateData.due_date) : this.tasks[taskIndex].deadline
            };

            this.tasks[taskIndex] = updatedTask;
          }

          return response.data;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新任務失敗';
        console.error('Failed to update task:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 刪除任務
    async deleteTask(taskId: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiClient.deleteTask(taskId);
        if (response.success) {
          // 從 store 中移除任務
          this.tasks = this.tasks.filter(task => task.id !== taskId);
          return true;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '刪除任務失敗';
        console.error('Failed to delete task:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});