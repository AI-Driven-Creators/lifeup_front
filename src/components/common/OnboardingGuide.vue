<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 onboarding-overlay"
      >
        <!-- 遮罩層：使用 box-shadow 製作挖空效果 -->
        <div
          class="absolute spotlight-mask"
          :style="spotlightStyle"
        ></div>

        <!-- 引導內容 - 放在按鈕下方 -->
        <div
          class="absolute guide-content"
          :style="guideContentStyle"
        >
          <!-- 向上指的箭頭 -->
          <div class="flex justify-center mb-3">
            <div class="animate-bounce">
              <svg class="w-12 h-12 text-amber-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-8 8h5v8h6v-8h5z"/>
              </svg>
            </div>
          </div>

          <!-- 引導文字卡片 -->
          <div class="bg-white rounded-2xl shadow-2xl p-5 max-w-sm mx-4">
            <div class="text-center">
              <div class="text-3xl mb-2">👋</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">歡迎來到 LifeUp！</h3>
              <p class="text-gray-600 text-sm mb-4 leading-relaxed">
                點擊上方的<span class="font-semibold text-amber-600">「找到你的理想職業」</span>按鈕，開始探索最適合你的職涯方向
              </p>
              <button
                @click="handleClose"
                class="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                知道了！
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'

const show = ref(false)
const STORAGE_KEY = 'lifeup_onboarding_completed'

// 測驗按鈕的位置和尺寸
const buttonRect = ref({
  top: 0,
  left: 0,
  width: 0,
  height: 0
})

// 檢查是否已經完成過新手教學
const checkOnboardingStatus = () => {
  const completed = localStorage.getItem(STORAGE_KEY)
  return completed === 'true'
}

// 關閉引導並標記為已完成
const handleClose = () => {
  show.value = false
  localStorage.setItem(STORAGE_KEY, 'true')

  // 恢復按鈕的 z-index
  const button = document.getElementById('personality-test-button') as HTMLElement
  if (button) {
    button.style.zIndex = ''
  }
}

// 找到測驗按鈕並獲取其位置
const locateButton = () => {
  // 等待 DOM 更新
  nextTick(() => {
    // 優先使用 ID 查找
    let button = document.getElementById('personality-test-button') as HTMLElement

    if (!button) {
      // 如果找不到，嘗試透過文字內容尋找
      const buttons = Array.from(document.querySelectorAll('button'))
      button = buttons.find(btn =>
        btn.textContent?.includes('找到你的理想職業') ||
        btn.textContent?.includes('測驗')
      ) as HTMLElement
    }

    if (button) {
      const rect = button.getBoundingClientRect()
      buttonRect.value = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }

      // 讓按鈕在引導期間保持可點擊
      button.style.position = 'relative'
      button.style.zIndex = '60'
    } else {
      // 如果找不到按鈕，使用預設位置（頁面標題下方）
      buttonRect.value = {
        top: 80,
        left: 16,
        width: window.innerWidth - 32,
        height: 70
      }
    }
  })
}

// 聚光燈遮罩樣式：使用 box-shadow 創建挖空效果
const spotlightStyle = computed(() => {
  const { top, left, width, height } = buttonRect.value
  const padding = 8 // 按鈕周圍的留白

  return {
    top: `${top - padding}px`,
    left: `${left - padding}px`,
    width: `${width + padding * 2}px`,
    height: `${height + padding * 2}px`,
    borderRadius: '16px',
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
    pointerEvents: 'none' as const
  }
})

// 引導內容位置：放在按鈕下方
const guideContentStyle = computed(() => {
  const { top, height } = buttonRect.value
  return {
    top: `${top + height + 20}px`,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '400px'
  }
})

// 組件掛載時檢查是否需要顯示引導
onMounted(() => {
  // 延遲一點點顯示，讓頁面先載入
  setTimeout(() => {
    if (!checkOnboardingStatus()) {
      locateButton()
      show.value = true
    }
  }, 800)

  // 監聽視窗大小變化，重新計算位置
  window.addEventListener('resize', locateButton)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.onboarding-overlay {
  pointer-events: none;
}

.spotlight-mask {
  transition: all 0.3s ease;
}

.guide-content {
  pointer-events: auto;
  z-index: 60;
}
</style>
