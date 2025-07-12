<template>
  <div class="p-4 max-w-4xl mx-auto">
    <PageHeader title="API 測試頁面" />
    
    <!-- 連接狀態 -->
    <div class="mb-6 p-4 rounded-lg" :class="connectionStatus.success ? 'bg-green-100' : 'bg-red-100'">
      <h2 class="text-lg font-semibold mb-2">🔗 後端連接狀態</h2>
      <p class="text-sm" :class="connectionStatus.success ? 'text-green-700' : 'text-red-700'">
        {{ connectionStatus.message }}
      </p>
      <button 
        @click="testConnection" 
        :disabled="loading"
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? '測試中...' : '測試連接' }}
      </button>
    </div>

    <!-- 用戶測試 -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-3">👤 用戶 API 測試</h2>
      <div class="space-y-3">
        <button @click="testGetUsers" :disabled="userStore.loading" class="btn-primary">
          {{ userStore.loading ? '載入中...' : '獲取用戶列表' }}
        </button>
        <button @click="testCreateUser" class="btn-secondary ml-2">
          創建測試用戶
        </button>
        <div v-if="userStore.error" class="text-red-600 text-sm">
          錯誤：{{ userStore.error }}
        </div>
        <div v-if="users.length > 0" class="mt-3">
          <h3 class="font-medium">用戶列表：</h3>
          <ul class="text-sm bg-white p-2 rounded border mt-1">
            <li v-for="user in users" :key="user.id" class="py-1">
              ID: {{ user.id }} | 姓名: {{ user.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 任務測試 -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-3">✅ 任務 API 測試</h2>
      <div class="space-y-3">
        <button @click="testGetTasks" :disabled="taskStore.loading" class="btn-primary">
          {{ taskStore.loading ? '載入中...' : '獲取任務列表' }}
        </button>
        <button @click="testCreateTask" class="btn-secondary ml-2">
          創建測試任務
        </button>
        <button @click="taskStore.addSampleTasks()" class="btn-secondary ml-2">
          添加示例任務
        </button>
        <div v-if="taskStore.error" class="text-red-600 text-sm">
          錯誤：{{ taskStore.error }}
        </div>
        <div v-if="taskStore.tasks.length > 0" class="mt-3">
          <h3 class="font-medium">任務列表 ({{ taskStore.tasks.length }} 個)：</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <div 
              v-for="task in taskStore.tasks" 
              :key="task.id" 
              class="p-3 bg-white rounded border"
              :class="task.status === 'completed' ? 'border-green-300' : 'border-gray-200'"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-sm">{{ task.title }}</h4>
                  <p class="text-xs text-gray-600 mt-1">{{ task.description }}</p>
                  <div class="flex gap-2 mt-2 text-xs">
                    <span class="px-2 py-1 bg-blue-100 rounded">{{ task.type }}</span>
                    <span class="px-2 py-1 bg-yellow-100 rounded">{{ task.difficulty }}⭐</span>
                    <span class="px-2 py-1 bg-green-100 rounded">+{{ task.experience }} EXP</span>
                  </div>
                </div>
                <button 
                  @click="taskStore.toggleTaskStatus(task.id)"
                  class="text-xs px-2 py-1 rounded"
                  :class="getTaskStatusClass(task.status)"
                >
                  {{ getTaskStatusText(task.status) }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能測試 -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-3">🌳 技能 API 測試</h2>
      <div class="space-y-3">
        <button @click="testGetSkills" :disabled="skillStore.loading" class="btn-primary">
          {{ skillStore.loading ? '載入中...' : '獲取技能列表' }}
        </button>
        <button @click="testCreateSkill" class="btn-secondary ml-2">
          創建測試技能
        </button>
        <button @click="skillStore.addSampleSkills()" class="btn-secondary ml-2">
          添加示例技能
        </button>
        <div v-if="skillStore.error" class="text-red-600 text-sm">
          錯誤：{{ skillStore.error }}
        </div>
        <div v-if="skillStore.skills.length > 0" class="mt-3">
          <h3 class="font-medium">技能列表 ({{ skillStore.skills.length }} 個)：</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <div 
              v-for="skill in skillStore.skills" 
              :key="skill.id" 
              class="p-3 bg-white rounded border"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">{{ skill.icon }}</span>
                <div>
                  <h4 class="font-medium text-sm">{{ skill.name }}</h4>
                  <span class="text-xs px-2 py-1 rounded" 
                    :class="skill.category === 'technical' ? 'bg-blue-100' : 'bg-green-100'">
                    {{ skill.category }}
                  </span>
                </div>
              </div>
              <div class="text-xs text-gray-600">
                <p>等級: {{ skill.level }}/5</p>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    class="bg-blue-600 h-2 rounded-full transition-all"
                    :style="{ width: (skill.experience / skill.maxExperience * 100) + '%' }"
                  ></div>
                </div>
                <p class="mt-1">{{ skill.experience }}/{{ skill.maxExperience }} EXP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天測試 -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-3">🤖 AI 教練測試</h2>
      <div class="space-y-3">
        <button @click="testGetChatMessages" :disabled="chatStore.loading" class="btn-primary">
          {{ chatStore.loading ? '載入中...' : '獲取聊天記錄' }}
        </button>
        <div class="flex gap-2">
          <input 
            v-model="testMessage" 
            @keyup.enter="testSendMessage"
            class="flex-1 px-3 py-2 border rounded-lg"
            placeholder="輸入測試訊息..."
          >
          <button @click="testSendMessage" :disabled="!testMessage.trim() || chatStore.loading" class="btn-primary">
            發送
          </button>
        </div>
        <div v-if="chatStore.error" class="text-red-600 text-sm">
          錯誤：{{ chatStore.error }}
        </div>
        <div v-if="chatStore.messages.length > 0" class="mt-3">
          <h3 class="font-medium">聊天記錄 ({{ chatStore.messages.length }} 條)：</h3>
          <div class="mt-2 bg-white rounded border p-3 max-h-64 overflow-y-auto">
            <div 
              v-for="message in chatStore.messages" 
              :key="message.id"
              class="mb-3 last:mb-0"
            >
              <div class="flex items-start gap-2">
                <span class="text-sm px-2 py-1 rounded"
                  :class="message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'">
                  {{ message.role === 'user' ? '👤' : '🤖' }}
                </span>
                <div class="flex-1">
                  <p class="text-sm">{{ message.content }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatTime(message.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/services/api'
import { useUserStore } from '@/stores/user'
import { useTaskStore } from '@/stores/task'
import { useSkillStore } from '@/stores/skill'
import { useChatStore } from '@/stores/chat'
import PageHeader from '@/components/layout/PageHeader.vue'
import type { Task } from '@/types'

const userStore = useUserStore()
const taskStore = useTaskStore()
const skillStore = useSkillStore()
const chatStore = useChatStore()

const loading = ref(false)
const connectionStatus = ref({
  success: false,
  message: '尚未測試連接'
})
const users = ref<any[]>([])
const testMessage = ref('')

// 測試後端連接
async function testConnection() {
  loading.value = true
  try {
    const response = await apiClient.healthCheck()
    connectionStatus.value = {
      success: response.success,
      message: response.success ? `✅ ${response.message}` : `❌ ${response.message}`
    }
  } catch (error) {
    connectionStatus.value = {
      success: false,
      message: `❌ 連接失敗: ${error instanceof Error ? error.message : '未知錯誤'}`
    }
  } finally {
    loading.value = false
  }
}

// 測試用戶 API
async function testGetUsers() {
  try {
    const response = await apiClient.getUsers()
    if (response.success) {
      users.value = response.data
    }
  } catch (error) {
    console.error('Failed to get users:', error)
  }
}

async function testCreateUser() {
  try {
    const userData = {
      name: `測試用戶_${Date.now()}`,
      email: `test_${Date.now()}@example.com`
    }
    await userStore.createUser(userData)
    await testGetUsers() // 重新獲取用戶列表
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}

// 測試任務 API
async function testGetTasks() {
  await taskStore.fetchTasks()
}

async function testCreateTask() {
  try {
    await taskStore.createTask({
      title: `測試任務_${Date.now()}`,
      description: '這是一個API測試任務',
      type: 'side',
      difficulty: 3
    })
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}

// 測試技能 API
async function testGetSkills() {
  await skillStore.fetchSkills()
}

async function testCreateSkill() {
  try {
    await skillStore.createSkill({
      name: `測試技能_${Date.now()}`,
      description: '這是一個API測試技能',
      category: 'technical'
    })
  } catch (error) {
    console.error('Failed to create skill:', error)
  }
}

// 測試聊天 API
async function testGetChatMessages() {
  await chatStore.fetchChatHistory()
}

async function testSendMessage() {
  if (!testMessage.value.trim()) return
  
  try {
    await chatStore.sendMessage(testMessage.value)
    testMessage.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

// 輔助函數
function getTaskStatusClass(status: Task['status']) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'in_progress': return 'bg-blue-100 text-blue-800'  
    case 'completed': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getTaskStatusText(status: Task['status']) {
  switch (status) {
    case 'pending': return '待辦'
    case 'in_progress': return '進行中'
    case 'completed': return '已完成'
    default: return '未知'
  }
}

function formatTime(timestamp: Date) {
  return new Date(timestamp).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 頁面載入時測試連接
onMounted(() => {
  testConnection()
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors;
}
</style>