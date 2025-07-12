<template>
  <header class="bg-primary-100 px-4 py-4 border-b border-primary-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <button
          v-if="showBack"
          @click="$router.go(-1)"
          class="mr-3 p-2 text-primary-700 hover:text-primary-800"
        >
          ←
        </button>
        <h1 class="text-lg font-bold text-primary-900">{{ title }}</h1>
      </div>
      
      <div v-if="showAction" class="flex items-center">
        <slot name="action" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  showBack?: boolean
  showAction?: boolean
}

withDefaults(defineProps<Props>(), {
  showBack: false,
  showAction: false
})
</script>