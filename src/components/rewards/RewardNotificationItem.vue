<template>
  <div
    class="reward-notification"
    :class="`notification-${notification.type}`"
    @click="handleClick"
  >
    <!-- 背景動效 -->
    <div class="notification-background"></div>
    
    <!-- 主要內容 -->
    <div class="notification-content">
      <!-- 圖標和動畫 -->
      <div class="notification-icon">
        <div class="icon-container" :class="{ 'user-levelup-icon': notification.type === 'user_levelup' }">
          <span class="icon-text">{{ notification.icon }}</span>
          <div v-if="notification.type === 'skill_levelup' || notification.type === 'user_levelup'"
               class="celebration-particles">
            <div v-for="n in 8" :key="n" class="particle" :style="getParticleStyle(n)"></div>
          </div>
          <!-- 使用者升級額外的光環效果 -->
          <div v-if="notification.type === 'user_levelup'" class="level-ring"></div>
        </div>
      </div>
      
      <!-- 文字內容 -->
      <div class="notification-text">
        <div class="notification-title">{{ notification.title }}</div>
        <div class="notification-message">{{ notification.message }}</div>
        
        <!-- 經驗值進度條 (僅限任務完成通知) -->
        <div v-if="notification.experience && notification.type === 'experience'" class="experience-bar">
          <div class="experience-fill" :style="{ width: `${getExperienceWidth()}%` }">
            <div class="experience-glow"></div>
          </div>
          <span class="experience-text">+{{ notification.experience }} XP</span>
        </div>
        
        <!-- 升級特效 -->
        <div v-if="notification.type === 'skill_levelup' || notification.type === 'user_levelup'" class="level-up-display">
          <span class="old-level">Lv.{{ notification.oldLevel }}</span>
          <div class="level-arrow">→</div>
          <span class="new-level">Lv.{{ notification.newLevel }}</span>
        </div>
      </div>
      
      <!-- 關閉按鈕 -->
      <button 
        class="notification-close"
        @click.stop="$emit('close', notification.id)"
        aria-label="關閉通知"
      >
        ×
      </button>
    </div>
    
    <!-- 進度條 -->
    <div class="notification-progress">
      <div 
        class="progress-fill"
        :style="{ animationDuration: `${notification.duration}ms` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { RewardNotification } from '@/stores/rewards'

interface Props {
  notification: RewardNotification
}

interface Emits {
  (e: 'close', id: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const animationProgress = ref(0)

const handleClick = () => {
  // 點擊通知時可以執行一些操作，例如跳轉到技能頁面
  if (props.notification.type === 'skill_levelup' || props.notification.type === 'skill_experience') {
    // 可以跳轉到技能頁面
    console.log('Navigate to skills page')
  }
}

const getExperienceWidth = () => {
  // 動態計算經驗值條寬度，創造填充動畫效果
  return Math.min(100, (props.notification.experience || 0) * 2)
}

const getParticleStyle = (index: number) => {
  const angle = (360 / 6) * index
  const distance = 20 + Math.random() * 10
  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    '--delay': `${index * 0.1}s`
  }
}

// 啟動進度條動畫
onMounted(() => {
  if (props.notification.duration) {
    setTimeout(() => {
      animationProgress.value = 100
    }, 100)
  }
})
</script>

<style scoped>
.reward-notification {
  position: relative;
  min-width: 320px;
  max-width: 400px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.reward-notification:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 不同類型的通知樣式 */
.notification-experience {
  border-left: 4px solid #3b82f6;
}

.notification-skill_experience {
  border-left: 4px solid #8b5cf6;
}

.notification-skill_levelup {
  border-left: 4px solid #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255, 255, 255, 0.95));
}

.notification-user_levelup {
  border-left: 4px solid #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(255, 255, 255, 0.95));
  animation: userLevelUpPulse 2s ease-in-out infinite;
}


.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
  position: relative;
}

.notification-icon {
  flex-shrink: 0;
}

.icon-container {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
}

.icon-text {
  font-size: 20px;
  animation: iconPulse 2s ease-in-out infinite;
}

.user-levelup-icon {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  animation: userLevelUpRotate 3s linear infinite;
}

.user-levelup-icon .icon-text {
  font-size: 24px;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
}

.level-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid #fbbf24;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: levelRingExpand 2s ease-out infinite;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  margin-bottom: 2px;
}

.notification-message {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.notification-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(107, 114, 128, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.experience-bar {
  margin-top: 8px;
  position: relative;
  height: 6px;
  background: rgba(107, 114, 128, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.experience-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
  transition: width 1s ease-out;
  position: relative;
  animation: experienceGlow 2s ease-in-out infinite;
}

.experience-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: shimmer 1.5s ease-out;
}

.experience-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 11px;
  color: #3b82f6;
  font-weight: 600;
}

.level-up-display {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
}

.old-level {
  color: #9ca3af;
}

.level-arrow {
  color: #10b981;
  font-weight: bold;
}

.new-level {
  color: #10b981;
  animation: levelUpBounce 0.6s ease-out;
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(107, 114, 128, 0.1);
}

.progress-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  animation: progressCountdown linear forwards;
}

/* 慶祝粒子效果 */
.celebration-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fbbf24;
  border-radius: 50%;
  animation: particleExplode 1.5s ease-out forwards;
}

/* 動畫定義 */
@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes userLevelUpPulse {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 0 12px 48px rgba(245, 158, 11, 0.4);
  }
}

@keyframes userLevelUpRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes levelRingExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

@keyframes experienceGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes levelUpBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

@keyframes progressCountdown {
  from { width: 100%; }
  to { width: 0%; }
}

@keyframes particleExplode {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--distance))) scale(1);
    opacity: 0;
  }
}
</style>