<template>
  <div class="bg-primary-100 border-t border-primary-200 p-4 w-full">
    <!-- 輸入區域和創建按鈕 -->
    <div class="mb-3 flex items-start gap-2 w-full">
      <textarea
        v-model="inputMessage"
        @keypress.enter.exact="handleSend"
        placeholder="描述你想創建的任務..."
        :disabled="props.disabled"
        rows="2"
        class="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed resize-none"
      ></textarea>
      <button
        @click="handleSend"
        :disabled="props.disabled || !inputMessage.trim()"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
          (props.disabled || !inputMessage.trim())
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
      >
        創建任務
      </button>
    </div>

    <!-- 用戶技能水平選擇 -->
    <div class="flex items-center justify-center gap-3 overflow-x-auto">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">熟悉程度：</label>
        <select
          v-model="skillLevel"
          class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="beginner">初學者</option>
          <option value="intermediate">有基礎</option>
          <option value="advanced">資深</option>
          <option value="expert">專家</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">已學習時長：</label>
        <select
          v-model="learningDuration"
          class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="0">0個月</option>
          <option value="1-3">1~3個月</option>
          <option value="3-6">3~6個月</option>
          <option value="6-12">6個月到1年</option>
          <option value="1-3years">1~3年</option>
          <option value="3+years">3年以上</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  disabled?: boolean
}

interface Emits {
  (e: 'send', message: string, isTaskMode: boolean, skillLevel: string, learningDuration: string): void
  (e: 'taskModeChange', isTaskMode: boolean): void
}

const props = withDefaults(defineProps<Props>(), { disabled: false })
const emit = defineEmits<Emits>()

const inputMessage = ref('')
const skillLevel = ref('beginner')
const learningDuration = ref('0')

const handleSend = () => {
  if (inputMessage.value.trim()) {
    // 現在只有任務創建模式，並傳遞用戶的技能水平信息
    emit('send', inputMessage.value.trim(), true, skillLevel.value, learningDuration.value)
    inputMessage.value = ''
  }
}
</script>