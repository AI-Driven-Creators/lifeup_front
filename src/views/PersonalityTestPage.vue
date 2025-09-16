<template>
  <div class="min-h-screen bg-white">
    <!-- 返回按鈕 -->
    <div class="bg-white px-4 py-4 border-b">
      <button 
        @click="goBack" 
        class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
      >
        ←
      </button>
    </div>

    <!-- 15分鐘快速職涯測驗系統 -->
    <div class="w-full" style="height: calc(100vh - 80px);">
      <QuizApp />
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import QuizApp from '@/components/quiz/QuizAppCompact.vue'

const router = useRouter()

// 返回首頁
const goBack = () => {
  router.push('/')
}
</script>