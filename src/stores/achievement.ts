import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/services/api'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  requirement_type: string
  requirement_value: number
  experience_reward: number
  unlocked: boolean
  progress: number
  achieved_at?: string
}

export const useAchievementStore = defineStore('achievement', () => {
  // 狀態
  const achievements = ref<Achievement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 計算屬性
  const unlockedAchievements = computed(() => 
    achievements.value.filter(a => a.unlocked)
  )

  const lockedAchievements = computed(() => 
    achievements.value.filter(a => !a.unlocked)
  )

  const achievementsByCategory = computed(() => {
    const categories: Record<string, Achievement[]> = {}
    achievements.value.forEach(achievement => {
      if (!categories[achievement.category]) {
        categories[achievement.category] = []
      }
      categories[achievement.category].push(achievement)
    })
    return categories
  })

  const totalAchievements = computed(() => achievements.value.length)
  const unlockedCount = computed(() => unlockedAchievements.value.length)
  const completionRate = computed(() => 
    totalAchievements.value > 0 ? (unlockedCount.value / totalAchievements.value) * 100 : 0
  )

  // 行為
  async function fetchUserAchievements(userId: string) {
    try {
      loading.value = true
      error.value = null

      const response = await apiClient.getUserAchievements(userId)
      
      if (response.success && response.data) {
        achievements.value = response.data
      } else {
        error.value = response.message || '獲取成就數據失敗'
      }
    } catch (err) {
      console.error('獲取成就數據失敗:', err)
      error.value = '網絡錯誤，無法載入成就數據'
    } finally {
      loading.value = false
    }
  }

  async function unlockAchievement(userId: string, achievementId: string) {
    try {
      const response = await apiClient.unlockUserAchievement(userId, achievementId)
      
      if (response.success) {
        // 更新本地狀態
        const achievement = achievements.value.find(a => a.id === achievementId)
        if (achievement) {
          achievement.unlocked = true
          achievement.achieved_at = new Date().toISOString()
        }
        
        return response.data
      } else {
        throw new Error(response.message || '解鎖成就失敗')
      }
    } catch (err) {
      console.error('解鎖成就失敗:', err)
      throw err
    }
  }

  function getAchievementById(id: string) {
    return achievements.value.find(a => a.id === id)
  }

  function getAchievementsByCategory(category: string) {
    return achievements.value.filter(a => a.category === category)
  }

  // 檢查是否符合解鎖條件
  function checkAchievementEligibility(userId: string, stats: {
    taskCompleted?: number
    consecutiveDays?: number
    learningTasksCompleted?: number
    skillLevel?: number
    attributes?: Record<string, number>
  }) {
    const eligibleAchievements: string[] = []

    achievements.value.forEach(achievement => {
      if (achievement.unlocked) return

      let isEligible = false

      switch (achievement.requirement_type) {
        case 'task_complete':
          isEligible = (stats.taskCompleted || 0) >= achievement.requirement_value
          break
        case 'consecutive_days':
          isEligible = (stats.consecutiveDays || 0) >= achievement.requirement_value
          break
        case 'learning_task_complete':
          isEligible = (stats.learningTasksCompleted || 0) >= achievement.requirement_value
          break
        case 'skill_level':
          isEligible = (stats.skillLevel || 0) >= achievement.requirement_value
          break
        case 'social_attribute':
          isEligible = (stats.attributes?.social || 0) >= achievement.requirement_value
          break
        case 'focus_attribute':
          isEligible = (stats.attributes?.focus || 0) >= achievement.requirement_value
          break
        case 'creativity_attribute':
          isEligible = (stats.attributes?.creativity || 0) >= achievement.requirement_value
          break
        case 'intelligence_attribute':
          isEligible = (stats.attributes?.intelligence || 0) >= achievement.requirement_value
          break
        case 'endurance_attribute':
          isEligible = (stats.attributes?.endurance || 0) >= achievement.requirement_value
          break
        case 'adaptability_attribute':
          isEligible = (stats.attributes?.adaptability || 0) >= achievement.requirement_value
          break
      }

      if (isEligible) {
        eligibleAchievements.push(achievement.id)
      }
    })

    return eligibleAchievements
  }

  // 自動解鎖符合條件的成就
  async function autoUnlockAchievements(userId: string, stats: any) {
    const eligibleIds = checkAchievementEligibility(userId, stats)
    const unlockedAchievements: Achievement[] = []

    for (const achievementId of eligibleIds) {
      try {
        const result = await unlockAchievement(userId, achievementId)
        const achievement = getAchievementById(achievementId)
        if (achievement) {
          unlockedAchievements.push(achievement)
        }
      } catch (err) {
        console.error(`自動解鎖成就 ${achievementId} 失敗:`, err)
      }
    }

    return unlockedAchievements
  }

  function resetStore() {
    achievements.value = []
    loading.value = false
    error.value = null
  }

  return {
    // 狀態
    achievements,
    loading,
    error,
    
    // 計算屬性
    unlockedAchievements,
    lockedAchievements,
    achievementsByCategory,
    totalAchievements,
    unlockedCount,
    completionRate,
    
    // 行為
    fetchUserAchievements,
    unlockAchievement,
    getAchievementById,
    getAchievementsByCategory,
    checkAchievementEligibility,
    autoUnlockAchievements,
    resetStore
  }
})