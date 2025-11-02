<template>
  <header class="header-container bg-white px-4 py-4">
    <div class="flex items-center justify-center h-10 relative">
      <button
        v-if="showBack"
        @click="$router.go(-1)"
        class="absolute left-0 p-2 text-warm-gray-800 hover:text-warm-gray-900"
      >
        ←
      </button>
      <slot name="title">
        <h1 class="header-title text-lg font-bold text-warm-gray-900">{{ title }}</h1>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { UserCircle } from 'lucide-vue-next'

interface Props {
  title: string
  showBack?: boolean
  showAction?: boolean
  showProfileIcon?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: false,
  showAction: false,
  showProfileIcon: true
})
</script>

<style scoped>
.header-container {
  /* 符合 Figma 72px 高度設計 */
  background: rgba(255, 255, 255, 1);
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header-title {
  /* 符合 Figma 字體設置 */
  font-weight: bold;
  font-size: 18px;
  color: rgba(22, 22, 17, 1);
  text-align: center;
}

.profile-icon {
  /* 48x48 圓形按鈕 */
  width: 48px;
  height: 48px;
}

/* Warm gray color utilities for header */
.bg-warm-gray-100 { background-color: rgba(244, 242, 239, 1); }
.bg-warm-gray-200 { background-color: rgba(231, 229, 228, 1); }
.bg-warm-gray-800 { background-color: rgba(22, 22, 17, 1); }
.bg-warm-gray-900 { background-color: rgba(22, 22, 17, 1); }

.text-warm-gray-800 { color: rgba(22, 22, 17, 1); }
.text-warm-gray-900 { color: rgba(22, 22, 17, 1); }

.hover\:bg-warm-gray-200:hover { background-color: rgba(231, 229, 228, 1); }
.hover\:text-warm-gray-900:hover { color: rgba(22, 22, 17, 1); }
</style>
