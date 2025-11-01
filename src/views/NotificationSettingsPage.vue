<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
    <div class="max-w-2xl mx-auto">
      <!-- 頁首 -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <h1 class="text-3xl font-bold text-gray-900">推送通知設定</h1>
        <p class="text-gray-600 mt-2">管理您的網站推送通知偏好</p>
      </div>

      <!-- 主要內容卡片 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <!-- 瀏覽器支援狀態 -->
        <div v-if="!isSupported" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 class="font-semibold text-yellow-900">瀏覽器不支持</h3>
              <p class="text-yellow-800 text-sm mt-1">您的瀏覽器不支持推送通知功能，請使用最新版的 Chrome、Firefox 或 Edge。</p>
            </div>
          </div>
        </div>

        <!-- 啟用/停用推送通知 -->
        <div class="border-b pb-6">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-900">啟用推送通知</h2>
              <p class="text-sm text-gray-600 mt-1">
                {{ isSubscribed ? '您已訂閱推送通知' : '開啟後可接收網站更新提醒' }}
              </p>
              <div v-if="permissionStatus" class="mt-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="permissionStatusClass"
                >
                  {{ permissionStatusText }}
                </span>
              </div>
            </div>
            <button
              @click="toggleNotification"
              :disabled="!isSupported || isLoading"
              class="relative inline-flex h-10 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="isSubscribed ? 'bg-indigo-600' : 'bg-gray-200'"
            >
              <span
                class="inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform"
                :class="isSubscribed ? 'translate-x-11' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>

        <!-- 當前訂閱狀態 -->
        <div v-if="isSubscribed && subscription" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <h3 class="font-semibold text-green-900">通知已啟用</h3>
              <p class="text-green-800 text-sm mt-1">您將收到定期的網站更新通知</p>
            </div>
          </div>
        </div>

        <!-- 測試通知 -->
        <div class="border-b pb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">測試通知</h2>
          <p class="text-sm text-gray-600 mb-4">發送一個測試通知以確認功能正常運作</p>
          <button
            @click="sendTestNotification"
            :disabled="!isSubscribed || isLoading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading ? '發送中...' : '發送測試通知' }}
          </button>
        </div>

        <!-- 通知頻率說明 -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-3">通知頻率</h2>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="font-semibold text-blue-900">測試階段：每分鐘推送</h3>
                <p class="text-blue-800 text-sm mt-1">
                  目前為測試模式，系統會每分鐘發送一次通知。正式版本將改為每天一次。
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 通知內容說明 -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-3">通知內容</h2>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              網站健康檢查提醒
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              系統狀態更新（測試階段）
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              每日目標總結（正式版）
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              重要任務提醒（正式版）
            </li>
          </ul>
        </div>
      </div>

      <!-- 錯誤提示 -->
      <div v-if="errorMessage" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-900">錯誤</h3>
            <p class="text-red-800 text-sm mt-1">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- 成功提示 -->
      <div v-if="successMessage" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-green-900">成功</h3>
            <p class="text-green-800 text-sm mt-1">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { notificationService } from '../services/notification';

const router = useRouter();

// 狀態
const isSupported = ref(false);
const isSubscribed = ref(false);
const subscription = ref<PushSubscription | null>(null);
const permissionStatus = ref<NotificationPermission>('default');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// 計算屬性
const permissionStatusClass = computed(() => {
  switch (permissionStatus.value) {
    case 'granted':
      return 'bg-green-100 text-green-800';
    case 'denied':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

const permissionStatusText = computed(() => {
  switch (permissionStatus.value) {
    case 'granted':
      return '已授權';
    case 'denied':
      return '已拒絕';
    default:
      return '尚未授權';
  }
});

// 方法
const goBack = () => {
  router.back();
};

const clearMessages = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const showError = (message: string) => {
  clearMessages();
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

const showSuccess = (message: string) => {
  clearMessages();
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

const checkSubscriptionStatus = async () => {
  try {
    subscription.value = await notificationService.getSubscription();
    isSubscribed.value = subscription.value !== null;
  } catch (error) {
    console.error('檢查訂閱狀態失敗:', error);
  }
};

const toggleNotification = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  clearMessages();

  try {
    if (isSubscribed.value) {
      // 取消訂閱
      const success = await notificationService.removePushNotification();
      if (success) {
        isSubscribed.value = false;
        subscription.value = null;
        showSuccess('已成功關閉推送通知');
      } else {
        showError('關閉推送通知失敗，請稍後再試');
      }
    } else {
      // 訂閱
      const success = await notificationService.setupPushNotification();
      if (success) {
        await checkSubscriptionStatus();
        permissionStatus.value = notificationService.getPermissionStatus();
        showSuccess('已成功開啟推送通知');
      } else {
        showError('開啟推送通知失敗，請檢查瀏覽器權限設定');
      }
    }
  } catch (error: any) {
    console.error('切換通知失敗:', error);
    showError(error.message || '操作失敗，請稍後再試');
  } finally {
    isLoading.value = false;
  }
};

const sendTestNotification = async () => {
  if (isLoading.value || !isSubscribed.value) return;

  isLoading.value = true;
  clearMessages();

  try {
    const success = await notificationService.sendTestNotification();
    if (success) {
      showSuccess('測試通知已發送，請檢查您的通知');
    } else {
      showError('發送測試通知失敗，請稍後再試');
    }
  } catch (error) {
    console.error('發送測試通知失敗:', error);
    showError('發送測試通知時發生錯誤');
  } finally {
    isLoading.value = false;
  }
};

// 生命週期
onMounted(async () => {
  isSupported.value = notificationService.isSupported();
  permissionStatus.value = notificationService.getPermissionStatus();

  if (isSupported.value) {
    await checkSubscriptionStatus();
  }
});
</script>

<style scoped>
/* 自定義樣式（如果需要） */
</style>
