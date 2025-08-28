<template>
  <div class="simple-task-card" :class="{ 'completed-card': isCompleted }" @click="handleCardClick">
    <div class="flex items-center justify-between">
      <!-- 左側：任務核心信息 -->
      <div class="flex-1 min-w-0">
        <h3 class="task-title" :class="{ 'completed': isCompleted }">
          {{ task.title }}
        </h3>
        <div class="task-exp">
          {{ getSkillLabel() }} +{{ task.experience }} EXP
        </div>
      </div>
      
      <!-- 右側：狀態控制 -->
      <div v-if="!isCompleted" 
        class="status-circle"
        @click.stop="handleToggle">
      </div>
      
      <!-- 已完成任務的回復按鈕 -->
      <button v-else
        class="undo-btn"
        @click.stop="handleToggle"
        title="回復為未完成">
        <RotateCcw class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { RotateCcw } from 'lucide-vue-next'
import type { Task } from '@/types'

interface Props {
  task: Task
}

interface Emits {
  (e: 'toggle', taskId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// 是否已完成
const isCompleted = computed(() => 
  props.task.status === 'completed' || props.task.status === 'daily_completed'
)

// 處理卡片點擊，跳轉到任務詳情頁面
const handleCardClick = () => {
  router.push(`/task/${props.task.id}`)
}

// 處理任務切換
const handleToggle = () => {
  emit('toggle', props.task.id)
}

// 獲取技能標籤顯示
const getSkillLabel = () => {
  if (!props.task.skillTags || props.task.skillTags.length === 0) {
    return '通用'
  }
  
  // 顯示第一個技能標籤並簡化名稱
  const firstSkill = props.task.skillTags[0]
  
  const skillMap: Record<string, string> = {
    // 技術技能
    'Vue.js': 'Vue.js',
    'Rust': 'Rust', 
    'JavaScript': 'JS',
    'TypeScript': 'TS',
    'UI/UX 設計': '設計',
    '機器學習': 'ML',
    '程式設計': '程式',
    // 軟技能
    '溝通': '溝通',
    '領導力': '領導',
    '問題解決': '解題',
    '時間管理': '時間',
    '團隊合作': '團隊',
    '適應力': '適應',
    '專注力': '專注',
    '學習': '學習',
    '智慧': '智慧',
    '毅力': '毅力',
    '創意': '創意',
    '觀察力': '觀察'
  }
  
  return skillMap[firstSkill] || firstSkill
}

</script>

<style scoped>
/* 簡潔設計 - 白色 + 金色配色，參考刷新按鈕 */
.simple-task-card {
  background: white;
  padding: 20px;
  margin: 0 16px 12px 16px;
  border-radius: 12px;
  border: 1px solid #f4f4f4;
  cursor: pointer;
  transition: all 0.2s ease;
}

.simple-task-card:hover {
  border-color: #e5e5e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.simple-task-card.completed-card {
  background: #fafafa;
  border-color: #e8e8e8;
  opacity: 0.8;
}

.simple-task-card.completed-card:hover {
  opacity: 1;
  border-color: #d0d0d0;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.task-title.completed {
  color: #888;
  text-decoration: line-through;
}

.task-exp {
  font-size: 13px;
  color: #9e8747;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #fcfaf7 0%, #f4efe5 100%);
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  border: 1px solid #f4efe5;
}

.status-circle {
  width: 24px;
  height: 24px;
  border: 2px solid #b3996b;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.status-circle:hover {
  border-color: #9e8747;
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.undo-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.undo-btn:hover {
  color: #9e8747;
  background: #fcfaf7;
  border-color: #f4efe5;
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>