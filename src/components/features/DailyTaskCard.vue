<template>
  <div class="simple-task-card" :class="{ 'completed-card': isCompleted }" @click="handleCardClick">
    <div class="flex items-center justify-between">
      <!-- 左側：任務核心信息 -->
      <div class="flex-1 min-w-0">
        <h3 class="task-title" :class="{ 'completed': isCompleted }">
          {{ task.title }}
        </h3>
        <div class="skill-tags-container">
          <div
            v-for="skill in getDisplaySkills()"
            :key="skill"
            class="task-exp"
          >
            {{ skill }}
          </div>
        </div>
      </div>

      <!-- 中間：經驗值 -->
      <div class="exp-text">+{{ task.experience }}</div>

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

// 獲取顯示的技能標籤陣列
const getDisplaySkills = () => {
  if (!props.task.skillTags || props.task.skillTags.length === 0) {
    return ['通用']
  }

  // 直接返回完整的技能名稱
  return props.task.skillTags
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

.skill-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
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
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.exp-text {
  font-size: 16px;
  color: #9e8747;
  font-weight: 700;
  margin: 0 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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