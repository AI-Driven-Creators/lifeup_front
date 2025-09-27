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
  // 新增統計數據字段
  completion_count?: number  // 完成此成就的用戶數量
  total_users?: number       // 應用程式總用戶數量
  completion_rate?: number   // 完成率 (completion_count / total_users)
}

export const useAchievementStore = defineStore('achievement', () => {
  // 狀態
  const achievements = ref<Achievement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const generatingAchievement = ref(false)
  const generationResult = ref<{ achievement: Achievement, isUnlocked: boolean, message: string } | null>(null)
  const syncingStats = ref(false) // 統計同步狀態

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

      // 首先同步成就統計數據
      await syncAchievementStatistics()

      // 獲取用戶成就狀態
      const userAchievementsResponse = await apiClient.getUserAchievementsStatus(userId)

      if (!userAchievementsResponse.success || !userAchievementsResponse.data) {
        error.value = userAchievementsResponse.message || '獲取成就數據失敗'
        return
      }

      // 獲取所有成就（包含統計數據）
      const allAchievementsResponse = await apiClient.getAchievements()

      if (!allAchievementsResponse.success || !allAchievementsResponse.data) {
        error.value = allAchievementsResponse.message || '獲取成就統計數據失敗'
        return
      }

      // 合併用戶成就狀態和統計數據
      const userAchievements = userAchievementsResponse.data
      const allAchievements = allAchievementsResponse.data

      // 創建統計數據映射
      const statsMap = new Map()
      allAchievements.forEach((ach: any) => {
        statsMap.set(ach.id, {
          completion_count: ach.completion_count || 0,
          total_users: ach.total_users || 0,
          completion_rate: ach.completion_rate || 0
        })
      })

      // 將統計數據合併到用戶成就中
      achievements.value = userAchievements.map((userAch: any) => {
        const stats = statsMap.get(userAch.id) || {}
        return {
          ...userAch,
          ...stats
        }
      })

    } catch (err) {
      console.error('獲取成就數據失敗:', err)
      error.value = '網絡錯誤，無法載入成就數據'
    } finally {
      loading.value = false
    }
  }

  // 同步成就統計數據
  async function syncAchievementStatistics() {
    try {
      syncingStats.value = true
      console.log('正在同步成就統計數據...')

      const response = await apiClient.syncAchievementStats()

      if (response.success) {
        console.log('成就統計同步成功:', response.data?.message)
      } else {
        console.warn('成就統計同步失敗:', response.message)
        // 不拋出錯誤，讓數據獲取繼續進行
      }
    } catch (err) {
      console.warn('成就統計同步失敗:', err)
      // 不拋出錯誤，讓數據獲取繼續進行
    } finally {
      syncingStats.value = false
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

  // 從用戶任務數據生成成就
  async function generateAchievementFromTasks(userId: string) {
    try {
      generatingAchievement.value = true
      error.value = null
      generationResult.value = null

      const response = await apiClient.generateAchievementFromTasks(userId)
      
      if (response.success && response.data) {
        const { achievement, is_unlocked, task_summary } = response.data
        
        // 將新生成的成就添加到列表中
        const newAchievement: Achievement = {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description || '',
          icon: achievement.icon || '🎯',
          category: achievement.category || 'generated',
          requirement_type: achievement.requirement_type,
          requirement_value: achievement.requirement_value,
          experience_reward: achievement.experience_reward || 0,
          unlocked: is_unlocked,
          progress: is_unlocked ? 100 : 0,
          achieved_at: is_unlocked ? new Date().toISOString() : undefined
        }
        
        // 檢查是否已存在相同成就，如果沒有則添加
        const existingIndex = achievements.value.findIndex(a => a.id === newAchievement.id)
        if (existingIndex === -1) {
          achievements.value.push(newAchievement)
        } else {
          // 更新現有成就
          achievements.value[existingIndex] = newAchievement
        }
        
        // 設置生成結果
        generationResult.value = {
          achievement: newAchievement,
          isUnlocked: is_unlocked,
          message: response.message
        }
        
        return {
          success: true,
          achievement: newAchievement,
          isUnlocked: is_unlocked,
          message: response.message,
          taskSummary: task_summary
        }
      } else {
        error.value = response.message || '生成成就失敗'
        return {
          success: false,
          message: response.message || '生成成就失敗'
        }
      }
    } catch (err: any) {
      console.error('生成成就失敗:', err)
      const errorMessage = err.message || '網絡錯誤，無法生成成就'
      error.value = errorMessage
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      generatingAchievement.value = false
    }
  }

  // 清除生成結果
  function clearGenerationResult() {
    generationResult.value = null
  }

  function resetStore() {
    achievements.value = []
    loading.value = false
    error.value = null
    generatingAchievement.value = false
    generationResult.value = null
    syncingStats.value = false
  }

  return {
    // 狀態
    achievements,
    loading,
    error,
    generatingAchievement,
    generationResult,
    syncingStats,
    
    // 計算屬性
    unlockedAchievements,
    lockedAchievements,
    achievementsByCategory,
    totalAchievements,
    unlockedCount,
    completionRate,
    
    // 行為
    fetchUserAchievements,
    syncAchievementStatistics,
    unlockAchievement,
    getAchievementById,
    getAchievementsByCategory,
    checkAchievementEligibility,
    autoUnlockAchievements,
    generateAchievementFromTasks,
    clearGenerationResult,
    resetStore
  }
})