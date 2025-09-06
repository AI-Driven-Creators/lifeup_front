<template>
  <div class="experience-floating-container">
    <TransitionGroup
      name="float"
      tag="div"
      class="floating-list"
    >
      <div
        v-for="item in floatingItems"
        :key="item.id"
        class="floating-experience"
        :class="item.type"
        :style="{ 
          left: item.x + 'px', 
          top: item.y + 'px',
          '--float-distance': item.distance + 'px'
        }"
        @animationend="removeItem(item.id)"
      >
        <div class="experience-content">
          <span class="experience-icon">{{ item.icon }}</span>
          <span class="experience-text">{{ item.text }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface FloatingItem {
  id: string
  type: 'experience' | 'skill' | 'levelup'
  text: string
  icon: string
  x: number
  y: number
  distance: number
}

const floatingItems = ref<FloatingItem[]>([])

// 添加飛出的經驗值動畫
const addFloatingExperience = (
  experience: number, 
  targetElement: HTMLElement, 
  type: 'experience' | 'skill' | 'levelup' = 'experience'
) => {
  const rect = targetElement.getBoundingClientRect()
  const item: FloatingItem = {
    id: generateId(),
    type,
    text: type === 'levelup' ? 'LEVEL UP!' : `+${experience} XP`,
    icon: type === 'levelup' ? '🎉' : type === 'skill' ? '⭐' : '💫',
    x: rect.left + rect.width / 2 - 30, // 中心對齊
    y: rect.top + rect.height / 2 - 10,
    distance: Math.random() * 50 + 80 // 隨機飛行距離
  }
  
  floatingItems.value.push(item)
  
  // 3秒後自動移除（防止動畫事件未觸發）
  setTimeout(() => {
    removeItem(item.id)
  }, 3000)
}

// 移除動畫項目
const removeItem = (id: string) => {
  const index = floatingItems.value.findIndex(item => item.id === id)
  if (index > -1) {
    floatingItems.value.splice(index, 1)
  }
}

// 生成唯一ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// 暴露方法供父組件調用
defineExpose({
  addFloatingExperience
})
</script>

<style scoped>
.experience-floating-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9998;
}

.floating-list {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-experience {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
}

.experience-content {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: floatUp 2s ease-out forwards;
  transform-origin: center bottom;
}

/* 不同類型的樣式 */
.experience .experience-content {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9));
  color: white;
}

.skill .experience-content {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9));
  color: white;
}

.levelup .experience-content {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(239, 68, 68, 0.9));
  color: white;
  font-size: 16px;
  padding: 8px 16px;
  animation: levelUpFloat 2.5s ease-out forwards;
}

.experience-icon {
  font-size: 16px;
  animation: iconBounce 2s ease-out;
}

.experience-text {
  white-space: nowrap;
}

/* 進場動畫 */
.float-enter-active {
  transition: all 0.3s ease-out;
}

.float-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

.float-enter-to {
  opacity: 1;
  transform: scale(1);
}

/* 主要動畫 */
@keyframes floatUp {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  30% {
    opacity: 1;
    transform: translateY(-20px) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(calc(-1 * var(--float-distance))) scale(0.8);
  }
}

@keyframes levelUpFloat {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  15% {
    transform: translateY(-10px) scale(1.2);
  }
  30% {
    opacity: 1;
    transform: translateY(-25px) scale(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(calc(-1 * var(--float-distance))) scale(0.8);
  }
}

@keyframes iconBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  10% {
    transform: translateY(-3px) rotate(-5deg);
  }
  40% {
    transform: translateY(-2px) rotate(5deg);
  }
  60% {
    transform: translateY(-1px) rotate(-3deg);
  }
}
</style>