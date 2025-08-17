import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import type { User, UserAttributes } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    error: null as string | null,
    user: {
      id: '',
      name: '載入中...',
      level: 0,
      experience: 0,
      maxExperience: 100,
      title: '載入中...',
      adventureDays: 0,
      consecutiveLoginDays: 0,
      personaType: 'internal' as const,
      attributes: {
        intelligence: 0,
        endurance: 0,
        creativity: 0,
        social: 0,
        focus: 0,
        adaptability: 0
      }
    } as User,
    todayProgress: {
      completedTasks: 0,
      totalTasks: 0,
      experienceGained: 0,
      attributeGains: {}
    }
  }),

  getters: {
    experienceProgress: (state) => {
      if (!state.user || !state.user.maxExperience) return 0
      return (state.user.experience / state.user.maxExperience) * 100
    },
    
    averageAttributes: (state) => {
      if (!state.user || !state.user.attributes) return 0
      const attrs = Object.values(state.user.attributes)
      return Math.round(attrs.reduce((sum, val) => sum + val, 0) / attrs.length)
    }
  },

  actions: {
    async fetchUser(userId: string = '1') {
      this.loading = true;
      this.error = null;
      
      try {
        // 首先嘗試獲取完整的遊戲化用戶數據
        const gamifiedResponse = await apiClient.getGamifiedUserData(userId);
        if (gamifiedResponse.success && gamifiedResponse.data) {
          // 使用從後端獲取的完整遊戲化數據更新用戶資料
          const data = gamifiedResponse.data;
          console.log('收到遊戲化數據:', data);
          
          // 安全地更新用戶資料
          this.user = {
            id: data.id || this.user?.id || '',
            name: data.name || this.user?.name || '載入中...',
            level: data.level || 1,
            experience: data.experience || 0,
            maxExperience: data.maxExperience || 100,
            title: data.title || '新手冒險者',
            adventureDays: data.adventureDays || 1,
            consecutiveLoginDays: data.consecutiveLoginDays || 1,
            personaType: data.personaType || 'internal',
            attributes: {
              intelligence: (data.attributes && data.attributes.intelligence) || 50,
              endurance: (data.attributes && data.attributes.endurance) || 50,
              creativity: (data.attributes && data.attributes.creativity) || 50,
              social: (data.attributes && data.attributes.social) || 50,
              focus: (data.attributes && data.attributes.focus) || 50,
              adaptability: (data.attributes && data.attributes.adaptability) || 50
            }
          };
          
          // 更新今日進度
          if (data.todayProgress) {
            this.todayProgress = {
              completedTasks: data.todayProgress.completedTasks || 0,
              totalTasks: data.todayProgress.totalTasks || 0,
              experienceGained: data.todayProgress.experienceGained || 0,
              attributeGains: data.todayProgress.attributeGains || {}
            };
          }
          
          console.log('已更新用戶資料:', this.user);
        } else {
          // 如果遊戲化數據獲取失敗，嘗試獲取基本用戶數據
          const response = await apiClient.getUser(userId);
          if (response.success && response.data) {
            this.user.id = response.data.id || this.user?.id || '';
            this.user.name = response.data.name || this.user?.name || '載入中...';
          } else {
            this.error = response.message || '獲取用戶資料失敗';
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '網路錯誤';
        console.error('Failed to fetch user:', error);
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: { name: string; email: string }) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.createUser(userData);
        if (response.success && response.data) {
          // 更新用戶資料
          this.user.id = response.data.id;
          this.user.name = response.data.name;
          return response.data;
        } else {
          this.error = response.message || '創建用戶失敗';
          throw new Error(this.error);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '網路錯誤';
        console.error('Failed to create user:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    updateExperience(amount: number) {
      this.user.experience += amount
      if (this.user.experience >= this.user.maxExperience) {
        this.levelUp()
      }
      
      // TODO: 當後端增加經驗值 API 時，同步到伺服器
    },

    levelUp() {
      const oldLevel = this.user.level;
      this.user.level += 1
      this.user.experience = this.user.experience - this.user.maxExperience
      this.user.maxExperience = Math.floor(this.user.maxExperience * 1.1)
      
      console.log(`🎉 升級！從 Lv.${oldLevel} 升到 Lv.${this.user.level}`);
      
      // TODO: 當後端增加等級 API 時，同步到伺服器
    },

    updateAttribute(attribute: keyof UserAttributes, amount: number) {
      const oldValue = this.user.attributes[attribute];
      this.user.attributes[attribute] = Math.min(100, this.user.attributes[attribute] + amount);
      const newValue = this.user.attributes[attribute];
      
      if (newValue > oldValue) {
        console.log(`📈 ${attribute} 提升 +${newValue - oldValue}`);
      }
      
      // TODO: 當後端增加屬性 API 時，同步到伺服器
    },

    togglePersonaType() {
      this.user.personaType = this.user.personaType === 'internal' ? 'external' : 'internal'
      console.log(`🔄 切換到 ${this.user.personaType} 驅動模式`);
      
      // TODO: 當後端增加偏好設定 API 時，同步到伺服器
    },

    // 初始化用戶數據
    async initializeUser() {
      try {
        await this.fetchUser();
      } catch (error) {
        console.warn('Failed to fetch user data, using default values');
        // 使用預設值，不影響應用正常運行
      }
    },

    // 獲取第一個可用用戶
    async fetchFirstAvailableUser() {
      this.loading = true;
      this.error = null;
      
      try {
        // 先獲取用戶列表
        const usersResponse = await apiClient.getUsers();
        if (usersResponse.success && usersResponse.data && usersResponse.data.length > 0) {
          const firstUser = usersResponse.data[0];
          console.log('Found user:', firstUser);
          
          // 使用第一個用戶的ID獲取完整數據
          await this.fetchUser(firstUser.id);
          return true;
        } else {
          console.warn('No users found in database');
          return false;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '網路錯誤';
        console.error('Failed to fetch users:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 重置用戶數據（開發用）
    resetUser() {
      this.user = {
        id: '1',
        name: '小雅',
        level: 1,
        experience: 0,
        maxExperience: 100,
        title: '新手冒險者',
        adventureDays: 1,
        consecutiveLoginDays: 1,
        personaType: 'internal' as const,
        attributes: {
          intelligence: 50,
          endurance: 50,
          creativity: 50,
          social: 50,
          focus: 50,
          adaptability: 50
        }
      };
    },
  }
})