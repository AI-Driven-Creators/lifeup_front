import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import type { Skill } from '@/types'

export const useSkillStore = defineStore('skill', {
  state: () => ({
    skills: [] as Skill[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    technicalSkills: (state) => state.skills.filter(skill => skill.category === 'technical'),
    softSkills: (state) => state.skills.filter(skill => skill.category === 'soft'),
    
    skillsByLevel: (state) => (level: number) => 
      state.skills.filter(skill => skill.level === level),
    
    totalSkillExperience: (state) => 
      state.skills.reduce((total, skill) => total + skill.experience, 0),
      
    averageSkillLevel: (state) => {
      if (state.skills.length === 0) return 0;
      const totalLevel = state.skills.reduce((sum, skill) => sum + skill.level, 0);
      return Math.round(totalLevel / state.skills.length * 10) / 10;
    },
  },

  actions: {
    async fetchSkills() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.getSkills();
        if (response.success) {
          this.skills = response.data.map(this.transformBackendSkill);
        } else {
          this.error = response.message;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '獲取技能失敗';
        console.error('Failed to fetch skills:', error);
      } finally {
        this.loading = false;
      }
    },

    async createSkill(skillData: {
      name: string;
      description?: string;
      category: Skill['category'];
    }) {
      this.loading = true;
      this.error = null;

      try {
        const backendSkillData = {
          name: skillData.name,
          description: skillData.description,
          level: 1, // 新技能從等級 1 開始
        };

        const response = await apiClient.createSkill(backendSkillData);
        if (response.success) {
          const newSkill = this.transformBackendSkill(response.data);
          // 設定前端指定的分類
          newSkill.category = skillData.category;
          this.skills.push(newSkill);
          return newSkill;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '創建技能失敗';
        console.error('Failed to create skill:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 增加技能經驗值
    addSkillExperience(skillId: string, experience: number) {
      const skill = this.skills.find(s => s.id === skillId);
      if (!skill) return;

      skill.experience += experience;
      
      // 檢查是否升級
      while (skill.experience >= skill.maxExperience && skill.level < 5) {
        skill.experience -= skill.maxExperience;
        skill.level += 1;
        skill.maxExperience = this.calculateMaxExperience(skill.level);
        
        console.log(`${skill.name} 升級到 ${skill.level} 級！`);
      }

      // TODO: 當後端增加技能經驗值更新 API 時，在這裡調用
    },

    // 將後端技能數據轉換為前端格式
    transformBackendSkill(backendSkill: any): Skill {
      const level = Math.min(5, Math.max(1, backendSkill.level || 1));
      const experience = Math.floor((backendSkill.progress || 0) * 1000); // 將 0-1 的進度轉換為經驗值
      
      return {
        id: backendSkill.id || '',
        name: backendSkill.name || '',
        category: this.inferCategory(backendSkill.name), // 根據名稱推斷分類
        level: level,
        experience: experience,
        maxExperience: this.calculateMaxExperience(level),
        icon: this.getSkillIcon(backendSkill.name),
        description: backendSkill.description,
      };
    },

    // 根據技能名稱推斷分類
    inferCategory(skillName: string): Skill['category'] {
      const technicalKeywords = ['程式', '程序', 'python', 'javascript', '設計', '開發', '技術', 'ai', '資料'];
      const name = skillName.toLowerCase();
      
      for (const keyword of technicalKeywords) {
        if (name.includes(keyword)) {
          return 'technical';
        }
      }
      
      return 'soft';
    },

    // 根據技能名稱獲取圖示
    getSkillIcon(skillName: string): string {
      const iconMap: Record<string, string> = {
        'python': '🐍',
        'javascript': '🟨',
        '程式': '💻',
        '設計': '🎨',
        '溝通': '💬',
        '時間管理': '⏰',
        '領導': '👑',
      };

      const name = skillName.toLowerCase();
      for (const [keyword, icon] of Object.entries(iconMap)) {
        if (name.includes(keyword)) {
          return icon;
        }
      }

      return '⭐'; // 預設圖示
    },

    // 計算技能升級所需經驗值
    calculateMaxExperience(level: number): number {
      return level * 200 + 100; // 簡單的經驗值計算公式
    },

    // 清空所有技能（開發用）
    clearSkills() {
      this.skills = [];
    },

    // 添加一些示例技能（開發用）
    async addSampleSkills() {
      const sampleSkills = [
        {
          name: 'Python 程式設計',
          description: '學習 Python 程式語言',
          category: 'technical' as const,
        },
        {
          name: '時間管理',
          description: '提升時間規劃能力',
          category: 'soft' as const,
        },
        {
          name: 'UI/UX 設計',
          description: '使用者介面和體驗設計',
          category: 'technical' as const,
        },
        {
          name: '溝通協作',
          description: '提升團隊合作效率',
          category: 'soft' as const,
        },
      ];

      for (const skill of sampleSkills) {
        try {
          await this.createSkill(skill);
        } catch (error) {
          console.error('Failed to create sample skill:', error);
        }
      }
    },
  },
});