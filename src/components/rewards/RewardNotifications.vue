<template>
  <div class="reward-notifications-container">
    <TransitionGroup
      name="notification"
      tag="div"
      class="notifications-list"
    >
      <RewardNotificationItem
        v-for="notification in rewardsStore.notifications"
        :key="notification.id"
        :notification="notification"
        @close="rewardsStore.removeNotification"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useRewardsStore } from '@/stores/rewards'
import RewardNotificationItem from './RewardNotificationItem.vue'

const rewardsStore = useRewardsStore()
</script>

<style scoped>
.reward-notifications-container {
  position: fixed;
  top: 80px;
  right: 16px;
  z-index: 9999;
  pointer-events: none;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 進場動畫 */
.notification-enter-active {
  transition: all 0.4s ease-out;
}

.notification-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.notification-enter-to {
  transform: translateX(0) scale(1);
  opacity: 1;
}

/* 退場動畫 */
.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-leave-from {
  transform: translateX(0) scale(1);
  opacity: 1;
}

.notification-leave-to {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

/* 移動動畫 */
.notification-move {
  transition: transform 0.3s ease;
}
</style>