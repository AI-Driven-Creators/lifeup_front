<template>
  <div class="min-h-screen bg-white">
    <!-- 15分鐘快速職涯測驗系統 -->
    <div class="w-full overflow-y-auto h-screen">
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