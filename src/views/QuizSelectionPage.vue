<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- 標題區域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">
          找到你的理想職業
        </h1>
        <p class="text-lg text-gray-600">
          選擇測驗版本，開始探索職涯方向
        </p>
      </div>

      <!-- 測驗版本選擇卡片 -->
      <div class="grid grid-cols-1 gap-6 max-w-md mx-auto">
        <!-- 簡化版 -->
        <div
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-blue-500"
          @click="selectVersion('compact')"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              推薦
            </div>
          </div>

          <h2 class="text-2xl font-bold text-gray-800 mb-3">快速版測驗</h2>

          <div class="flex items-center text-gray-600 mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">約 15 分鐘</span>
          </div>

          <p class="text-gray-600 mb-6 leading-relaxed">
            精簡高效的職涯探索體驗，快速了解你的興趣、天賦和價值觀，獲得專屬職業建議。
          </p>

          <div class="space-y-2 mb-6">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sm text-gray-700">3個精簡測驗模組</span>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sm text-gray-700">簡潔明瞭的測驗流程</span>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sm text-gray-700">適合快速決策者</span>
            </div>
          </div>

          <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
            開始快速測驗
          </button>
        </div>

        <!-- 完整版 -->
        <div
          class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-purple-500"
          @click="selectVersion('full')"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
              深度分析
            </div>
          </div>

          <h2 class="text-2xl font-bold text-gray-800 mb-3">完整版測驗</h2>

          <div class="flex items-center text-gray-600 mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">約 25 分鐘</span>
          </div>

          <p class="text-gray-600 mb-6 leading-relaxed">
            全面深入的職涯評估體驗，運用 CAT 自適應技術，提供更精準的天賦分析和職業匹配建議。
          </p>

          <div class="space-y-2 mb-6">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sm text-gray-700">4個完整測驗模組</span>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sm text-gray-700">CAT 自適應測驗技術</span>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="text-sm text-gray-700">更詳細的深度報告</span>
            </div>
          </div>

          <button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
            開始完整測驗
          </button>
        </div>
      </div>

      <!-- 返回按鈕 -->
      <div class="text-center mt-8">
        <button
          @click="goBack"
          class="text-gray-600 hover:text-gray-800 font-medium inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          返回首頁
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const selectVersion = (version: 'compact' | 'full') => {
  if (version === 'compact') {
    router.push('/personality-test/compact')
  } else {
    router.push('/personality-test/full')
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
/* 添加一些過渡動畫 */
.cursor-pointer:hover {
  transform: translateY(-4px);
}
</style>
