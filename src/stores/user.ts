import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import type { User, UserAttributes } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    loading: false,
    error: null as string | null,
    user: {
      id: '1',
      name: '小雅',
      level: 12,
      experience: 2340,
      maxExperience: 2500,
      title: '自律達人',
      adventureDays: 87,
      consecutiveLoginDays: 12,
      personaType: 'internal' as const,
      attributes: {
        intelligence: 82,
        endurance: 45,
        creativity: 75,
        social: 52,
        focus: 68,
        adaptability: 58
      }
    } as User,
    todayProgress: {
      completedTasks: 3,
      totalTasks: 5,
      experienceGained: 150,
      attributeGains: {
        intelligence: 2,
        endurance: 1
      }
    }
  }),

  getters: {
    experienceProgress: (state) => {
      return (state.user.experience / state.user.maxExperience) * 100
    },
    
    averageAttributes: (state) => {
      const attrs = Object.values(state.user.attributes)
      return Math.round(attrs.reduce((sum, val) => sum + val, 0) / attrs.length)
    }
  },

  actions: {
    async fetchUser(userId: string = '1') {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.getUser(userId);
        if (response.success && response.data) {
          // 更新用戶基本資料，保留現有的遊戲化數據結構
          this.user.id = response.data.id || this.user.id;
          this.user.name = response.data.name || this.user.name;
          
          // 如果後端沒有這些數據，保持現有值
          // TODO: 當後端增加這些欄位時，從 API 獲取
        } else {
          this.error = response.message || '獲取用戶資料失敗';
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