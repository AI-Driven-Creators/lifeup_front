import { defineStore } from 'pinia'
import type { User, UserAttributes } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
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
    updateExperience(amount: number) {
      this.user.experience += amount
      if (this.user.experience >= this.user.maxExperience) {
        this.levelUp()
      }
    },

    levelUp() {
      this.user.level += 1
      this.user.experience = this.user.experience - this.user.maxExperience
      this.user.maxExperience = Math.floor(this.user.maxExperience * 1.1)
    },

    updateAttribute(attribute: keyof UserAttributes, amount: number) {
      this.user.attributes[attribute] = Math.min(100, this.user.attributes[attribute] + amount)
    },

    togglePersonaType() {
      this.user.personaType = this.user.personaType === 'internal' ? 'external' : 'internal'
    }
  }
})