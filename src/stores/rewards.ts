import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface RewardNotification {
  id: string
  type: 'experience' | 'skill_experience' | 'skill_levelup' | 'user_levelup'
  title: string
  message: string
  icon?: string
  experience?: number
  skillName?: string
  oldLevel?: number
  newLevel?: number
  duration?: number
}

export const useRewardsStore = defineStore('rewards', () => {
  const notifications = ref<RewardNotification[]>([])

  // 添加經驗值獲得通知
  const addExperienceNotification = (experience: number, taskTitle: string) => {
    const notification: RewardNotification = {
      id: generateId(),
      type: 'experience',
      title: '獲得經驗值！',
      message: `完成任務「${taskTitle}」獲得 ${experience} 經驗值`,
      icon: '⭐',
      experience,
      duration: 3000
    }

    notifications.value.push(notification)
    autoRemoveNotification(notification.id)
  }

  // 添加技能經驗值獲得通知
  const addSkillExperienceNotification = (
    skillName: string,
    experience: number,
    taskTitle: string
  ) => {
    const notification: RewardNotification = {
      id: generateId(),
      type: 'skill_experience',
      title: '技能經驗值提升！',
      message: `完成任務「${taskTitle}」，${skillName} 獲得 ${experience} 經驗值`,
      icon: '🎯',
      experience,
      skillName,
      duration: 3000
    }

    notifications.value.push(notification)
    autoRemoveNotification(notification.id)
  }

  // 添加技能升級通知
  const addSkillLevelUpNotification = (
    skillName: string,
    oldLevel: number,
    newLevel: number
  ) => {
    const notification: RewardNotification = {
      id: generateId(),
      type: 'skill_levelup',
      title: '🎉 技能升級！',
      message: `恭喜！${skillName} 從 Lv.${oldLevel} 升級到 Lv.${newLevel}`,
      icon: '🚀',
      skillName,
      oldLevel,
      newLevel,
      duration: 5000
    }

    notifications.value.push(notification)
    autoRemoveNotification(notification.id)
  }

  // 添加使用者升級通知
  const addUserLevelUpNotification = (
    oldLevel: number,
    newLevel: number
  ) => {
    const notification: RewardNotification = {
      id: generateId(),
      type: 'user_levelup',
      title: '🎊 等級提升！',
      message: `恭喜升級！你已經從 Lv.${oldLevel} 成長到 Lv.${newLevel}`,
      icon: '👑',
      oldLevel,
      newLevel,
      duration: 6000
    }

    notifications.value.push(notification)
    autoRemoveNotification(notification.id)
  }

  // 移除通知
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      // 直接從數組中移除，TransitionGroup 會自動處理退場動畫
      notifications.value.splice(index, 1)
    }
  }

  // 自動移除通知
  const autoRemoveNotification = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification?.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  // 清空所有通知
  const clearAllNotifications = () => {
    notifications.value = []
  }

  // 生成唯一ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  return {
    notifications,
    addExperienceNotification,
    addSkillExperienceNotification,
    addSkillLevelUpNotification,
    addUserLevelUpNotification,
    removeNotification,
    clearAllNotifications
  }
})