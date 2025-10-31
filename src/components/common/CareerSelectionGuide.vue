<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 career-guide-overlay"
        @click="handleClose"
      >
        <!-- 半透明遮罩背景 -->
        <div class="absolute inset-0 bg-black/70"></div>

        <!-- 引導內容 - 固定在螢幕中央 -->
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-scale-in">
            <div class="text-center">
              <h3 class="text-xl font-bold text-gray-900 mb-3">選擇你的目標職業</h3>
              <p class="text-gray-700 text-base mb-4 leading-relaxed">
                下方為你推薦了<span class="font-bold text-amber-600">多個匹配的職業</span>，請仔細瀏覽並<span class="font-bold text-amber-600">選擇其中一個</span>作為你的目標。
              </p>
              <p class="text-gray-600 text-sm mb-5 leading-relaxed">
                點擊職業卡片上的<span class="font-semibold text-amber-600">「選擇此職業並開始規劃」</span>按鈕後，系統會為你生成專屬的職業主線任務，一步步引導你達成目標！
              </p>
              <button
                @click="handleClose"
                class="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                知道了，讓我選擇！
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const show = ref(false)
const STORAGE_KEY = 'lifeup_career_selection_guide_completed'

// 檢查是否已經完成過引導
const checkGuideStatus = () => {
  const completed = localStorage.getItem(STORAGE_KEY)
  return completed === 'true'
}

// 關閉引導並標記為已完成
const handleClose = () => {
  show.value = false
  localStorage.setItem(STORAGE_KEY, 'true')
}

// 組件掛載時檢查是否需要顯示引導
onMounted(() => {
  // 延遲顯示，等待頁面完全載入
  setTimeout(() => {
    if (!checkGuideStatus()) {
      show.value = true
    }
  }, 800)
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

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>
