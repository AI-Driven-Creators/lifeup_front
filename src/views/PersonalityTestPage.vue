<template>
  <div class="min-h-screen bg-white">
    <!-- 返回按鈕 -->
    <div class="bg-white px-4 py-4 flex items-center justify-between border-b">
      <button 
        @click="goBack" 
        class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
      >
        ←
      </button>
      <span class="text-purple-900 font-bold text-lg">人格特質測驗</span>
      <div class="w-12"></div>
    </div>

    <!-- Sider.ai 測驗嵌入 -->
    <div class="w-full" style="height: calc(100vh - 80px);">
      <iframe 
        src="https://sider.ai/zh-TW/agents/web-creator/share/68822c8e1acf42c15cb7a74b"
        class="w-full h-full border-0"
        title="人格特質測驗"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首頁
const goBack = () => {
  router.push('/')
}
</script>