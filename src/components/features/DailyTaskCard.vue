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
        <!-- 屬性增益顯示 -->
        <div v-if="hasAttributes" class="attributes-row">
          <div
            v-for="(value, attr) in task.attributes"
            :key="attr"
            class="attribute-badge"
          >
            {{ getAttributeLabel(attr as keyof UserAttributes) }} +{{ value }}
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
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- 子任務詳情 Modal -->
  <SubtaskDetailModal
    v-model:visible="showSubtaskModal"
    :task="task"
    @close="showSubtaskModal = false"
    @updated="handleTaskUpdated"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Task, UserAttributes } from '@/types'
import SubtaskDetailModal from './SubtaskDetailModal.vue'

interface Props {
  task: Task
}

interface Emits {
  (e: 'toggle', taskId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

// Modal 控制
const showSubtaskModal = ref(false)

// 是否已完成
const isCompleted = computed(() =>
  props.task.status === 'completed' || props.task.status === 'daily_completed'
)

// 判斷是否為子任務（有 parent_task_id 的任務）
const isSubtask = computed(() => {
  return !!props.task.parent_task_id
})

// 處理卡片點擊
const handleCardClick = () => {
  // 如果是子任務，顯示 Modal
  if (isSubtask.value) {
    showSubtaskModal.value = true
  } else {
    // 單獨任務，導航到詳情頁面
    router.push(`/task/${props.task.id}`)
  }
}

// 處理任務切換
const handleToggle = () => {
  emit('toggle', props.task.id)
}

// 處理任務更新（當 Modal 中的任務狀態改變時）
const handleTaskUpdated = () => {
  // 觸發父組件重新載入任務列表
  emit('toggle', props.task.id)
  // 關閉 Modal 讓用戶看到更新後的卡片狀態
  setTimeout(() => {
    showSubtaskModal.value = false
  }, 500)
}

// 獲取顯示的技能標籤陣列
const getDisplaySkills = () => {
  if (!props.task.skillTags || props.task.skillTags.length === 0) {
    return ['通用']
  }

  // 直接返回完整的技能名稱
  return props.task.skillTags
}

// 檢查是否有屬性值
const hasAttributes = computed(() => {
  return props.task.attributes && Object.keys(props.task.attributes).length > 0
})

// 屬性名稱映射（使用文字標籤）
const getAttributeLabel = (attr: keyof UserAttributes): string => {
  const labels: Record<keyof UserAttributes, string> = {
    intelligence: '智力',
    endurance: '毅力',
    creativity: '創造力',
    social: '社交力',
    focus: '專注力',
    adaptability: '適應力'
  }
  return labels[attr] || attr
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
  font-size: 12px;
  color: #78716c;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  padding: 4px 10px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid #fde68a;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.task-exp:hover {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #fcd34d;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(120, 113, 108, 0.1);
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
  border-radius: 4px;
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
  border-radius: 6px;
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

/* 屬性徽章 */
.attribute-badge {
  font-size: 12px;
  color: #78716c;
  background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%);
  padding: 4px 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border: 1px solid #e7e5e4;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.attribute-badge:hover {
  background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%);
  border-color: #d6d3d1;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(120, 113, 108, 0.1);
}

/* 已完成任務的屬性顯示 */
.completed-card .attribute-badge {
  opacity: 0.7;
  background: linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%);
  border-color: #e7e5e4;
  color: #78716c;
}

/* 已完成任務的技能標籤 */
.completed-card .task-exp {
  opacity: 0.7;
}

/* 屬性行容器 */
.attributes-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}
</style>