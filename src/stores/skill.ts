import { defineStore } from 'pinia'
import { apiClient } from '@/services/api'
import { useUserStore } from './user'
import { getSkillTemplate, getSkillTemplateByName } from '@/config/skillPool'
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
        const userStore = useUserStore();
        const response = await apiClient.getSkills(userStore.user.id);
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

    // 解鎖技能（從技能池創建）
    async unlockSkill(skillId: string) {
      try {
        const userStore = useUserStore();
        const skillTemplate = getSkillTemplate(skillId);

        if (!skillTemplate) {
          throw new Error(`技能模板不存在: ${skillId}`);
        }

        // 檢查是否已解鎖（根據技能名稱判斷，因為同名技能應該是同一個技能）
        const existingSkill = this.skills.find(s => s.name === skillTemplate.name);
        if (existingSkill) {
          console.log(`技能 ${skillTemplate.name} 已經解鎖，跳過重複創建`);
          return existingSkill;
        }

        // 創建技能數據
        const backendSkillData = {
          name: skillTemplate.name,
          description: skillTemplate.description,
          category: skillTemplate.category,
          attribute: skillTemplate.attribute,
          level: 1,
          user_id: userStore.user.id,
        };

        const response = await apiClient.createSkill(backendSkillData);
        if (response.success) {
          // 使用技能池模板構建前端技能對象
          const newSkill: Skill = {
            id: response.data.id || skillId,
            name: skillTemplate.name,
            category: skillTemplate.category,
            attribute: skillTemplate.attribute,
            level: 1,
            experience: 0,
            maxExperience: 100,
            icon: skillTemplate.icon,
            description: skillTemplate.description
          };

          this.skills.push(newSkill);
          console.log(`✨ 解鎖新技能: ${skillTemplate.name}`);
          return newSkill;
        } else {
          this.error = response.message;
          throw new Error(response.message);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '解鎖技能失敗';
        console.error('Failed to unlock skill:', error);
        throw error;
      }
    },

    // 批量解鎖技能
    async unlockSkills(skillIds: string[]) {
      const unlockedSkills: Skill[] = [];
      for (const skillId of skillIds) {
        try {
          const skill = await this.unlockSkill(skillId);
          if (skill) {
            unlockedSkills.push(skill);
          }
        } catch (error) {
          console.error(`解鎖技能 ${skillId} 失敗:`, error);
        }
      }
      return unlockedSkills;
    },

    async createSkill(skillData: {
      name: string;
      description?: string;
      category: Skill['category'];
    }) {
      this.loading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        const backendSkillData = {
          name: skillData.name,
          description: skillData.description,
          level: 1, // 新技能從等級 1 開始
          user_id: userStore.user.id, // 使用當前用戶ID
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
    async addSkillExperience(skillId: string, experience: number, reason?: string) {
      try {
        // 調用後端API更新技能經驗值
        const response = await apiClient.updateSkillExperience(skillId, experience, reason);

        if (response.success && response.data) {
          // 更新本地技能資料
          const skill = this.skills.find(s => s.id === skillId);
          if (skill && response.data.skill) {
            const updatedSkill = response.data.skill;
            skill.experience = updatedSkill.experience || 0;
            skill.level = updatedSkill.level || 1;
            skill.maxExperience = updatedSkill.max_experience || 100;
          }

          // 如果升級了，顯示升級訊息
          if (response.data.level_up) {
            console.log(`🎉 ${skill?.name} 升級到 ${response.data.new_level} 級！獲得經驗值: ${experience}`);
          } else {
            console.log(`⭐ ${skill?.name} 獲得經驗值: ${experience}`);
          }

          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error('更新技能經驗值失敗:', error);
        // 如果API失敗，回退到本地更新（為了不中斷使用者體驗）
        const skill = this.skills.find(s => s.id === skillId);
        if (skill) {
          skill.experience += experience;

          // 檢查是否升級
          while (skill.experience >= skill.maxExperience && skill.level < 5) {
            skill.experience -= skill.maxExperience;
            skill.level += 1;
            skill.maxExperience = this.calculateMaxExperience(skill.level);

            console.log(`${skill.name} 升級到 ${skill.level} 級！（本地更新）`);
          }
        }
        throw error;
      }
    },

    // 將後端技能數據轉換為前端格式
    transformBackendSkill(backendSkill: any): Skill {
      const level = Math.min(5, Math.max(1, backendSkill.level || 1));
      const experience = backendSkill.experience || 0;

      // 優先使用技能名稱從技能池匹配
      const skillTemplate = getSkillTemplateByName(backendSkill.name);

      return {
        id: backendSkill.id || '',
        name: backendSkill.name || '',
        category: skillTemplate?.category || this.inferCategory(backendSkill.name),
        attribute: skillTemplate?.attribute || this.inferAttribute(backendSkill.name),
        level: level,
        experience: experience,
        maxExperience: this.calculateMaxExperience(level),
        icon: skillTemplate?.icon || this.getSkillIcon(backendSkill.name),
        description: backendSkill.description || skillTemplate?.description,
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

    // 根據技能名稱推斷屬性
    inferAttribute(skillName: string): Skill['attribute'] {
      const name = skillName.toLowerCase();

      // 智力相關關鍵字
      if (name.includes('程式') || name.includes('開發') || name.includes('資料') ||
        name.includes('學術') || name.includes('英語') || name.includes('語言')) {
        return 'intelligence';
      }

      // 毅力相關關鍵字
      if (name.includes('運動') || name.includes('健身') || name.includes('跑步') ||
        name.includes('瑜伽') || name.includes('習慣') || name.includes('閱讀')) {
        return 'endurance';
      }

      // 創造力相關關鍵字
      if (name.includes('設計') || name.includes('創作') || name.includes('音樂') ||
        name.includes('繪畫') || name.includes('寫作') || name.includes('攝影')) {
        return 'creativity';
      }

      // 社交力相關關鍵字
      if (name.includes('溝通') || name.includes('簡報') || name.includes('演講') ||
        name.includes('領導') || name.includes('社群') || name.includes('人際')) {
        return 'social';
      }

      // 專注力相關關鍵字
      if (name.includes('時間') || name.includes('專注') || name.includes('管理') ||
        name.includes('筆記') || name.includes('番茄')) {
        return 'focus';
      }

      // 適應力相關關鍵字
      if (name.includes('問題') || name.includes('思考') || name.includes('壓力') ||
        name.includes('決策') || name.includes('創新') || name.includes('適應')) {
        return 'adaptability';
      }

      // 預設為智力
      return 'intelligence';
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