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
        <div v-if="isSubscribed && subscription" class="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
          <!-- 標題欄（可點擊） -->
          <button
            @click="isSubscriptionDetailsExpanded = !isSubscriptionDetailsExpanded"
            class="w-full p-4 flex items-center justify-between hover:bg-green-100 transition-colors text-left"
          >
            <div class="flex items-start flex-1">
              <svg class="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <h3 class="font-semibold text-green-900">通知已啟用</h3>
                <p class="text-green-800 text-sm mt-1">您將收到定期的網站更新通知</p>
              </div>
            </div>
            <!-- 展開/收起圖標 -->
            <svg
              class="w-5 h-5 text-green-700 ml-3 flex-shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180': isSubscriptionDetailsExpanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- 可折疊的訂閱詳情 -->
          <transition name="slide-fade">
            <div v-show="isSubscriptionDetailsExpanded" class="px-4 pb-4 border-t border-green-200">
              <div class="text-xs text-gray-600 space-y-1 mt-3">
                <p class="flex items-start">
                  <span class="font-medium mr-2 min-w-[60px]">訂閱端點：</span>
                  <span class="break-all">{{ subscription.endpoint.substring(0, 80) }}...</span>
                </p>
                <p class="flex items-start">
                  <span class="font-medium mr-2 min-w-[60px]">狀態：</span>
                  <span class="text-green-600">已訂閱並啟用</span>
                </p>
              </div>
            </div>
          </transition>
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

        <!-- 清除所有訂閱 -->
        <div class="border-b pb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">清除所有訂閱</h2>
          <p class="text-sm text-gray-600 mb-4">清除所有裝置上的推送訂閱記錄。這不會影響您的帳號，但需要重新訂閱才能接收推送。</p>
          <button
            @click="clearAllSubscriptions"
            :disabled="isLoading || clearingAll"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ clearingAll ? '清除中...' : '清除所有訂閱' }}
          </button>
        </div>

        <!-- 工作日/假日設定 -->
        <div v-if="isSubscribed" class="border-b pb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">通知時機設定</h2>
          <p class="text-sm text-gray-600 mb-4">選擇在哪些日子接收通知</p>
          <div class="space-y-3">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="notificationSettings.notify_on_workdays"
                @change="saveSettings"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">工作日接收通知（週一至週五）</span>
            </label>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="notificationSettings.notify_on_holidays"
                @change="saveSettings"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">假日接收通知（週末及國定假日）</span>
            </label>
          </div>
        </div>

        <!-- 通知時段設定 -->
        <div v-if="isSubscribed" class="border-b pb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">通知時段</h2>

          <!-- 早上通知 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="notificationSettings.morning_enabled"
                  @change="saveSettings"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm font-medium text-gray-700">早上任務提醒</span>
              </label>
              <input
                type="time"
                v-model="notificationSettings.morning_time"
                @change="saveSettings"
                :disabled="!notificationSettings.morning_enabled"
                class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <p class="text-xs text-gray-500 ml-6">提醒您今天的待辦任務</p>
          </div>

          <!-- 晚上通知 -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="notificationSettings.evening_enabled"
                  @change="saveSettings"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm font-medium text-gray-700">睡前進度總結</span>
              </label>
              <input
                type="time"
                v-model="notificationSettings.evening_time"
                @change="saveSettings"
                :disabled="!notificationSettings.evening_enabled"
                class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <p class="text-xs text-gray-500 ml-6">總結今天的完成進度和獲得經驗值</p>
          </div>

          <!-- 自定義時段 -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-gray-700">自定義時段</h3>
              <button
                @click="addCustomSchedule"
                class="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                + 新增時段
              </button>
            </div>
            <div v-if="notificationSettings.custom_schedules && notificationSettings.custom_schedules.length > 0" class="space-y-2">
              <div
                v-for="(schedule, index) in notificationSettings.custom_schedules"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="schedule.enabled"
                    @change="saveSettings"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">自定義提醒</span>
                </label>
                <div class="flex items-center gap-2">
                  <input
                    type="time"
                    v-model="schedule.time"
                    @change="saveSettings"
                    :disabled="!schedule.enabled"
                    class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <button
                    @click="removeCustomSchedule(index)"
                    class="p-1 text-red-600 hover:text-red-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500">尚未設定自定義時段</p>
          </div>
        </div>

        <!-- 預覽通知 -->
        <div v-if="isSubscribed" class="border-b pb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">預覽通知</h2>
          <p class="text-sm text-gray-600 mb-4">查看通知內容的實際效果</p>
          <div class="flex gap-2">
            <button
              @click="previewMorningNotification"
              :disabled="isLoading"
              class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              預覽早上通知
            </button>
            <button
              @click="previewEveningNotification"
              :disabled="isLoading"
              class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              預覽晚上通知
            </button>
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
              早上任務提醒 - 顯示待辦任務數量和重點任務
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              晚上進度總結 - 統計完成任務和獲得經驗值
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              自動判斷工作日/假日（根據台灣行事曆）
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

    <!-- 確認對話框 -->
    <ConfirmDialog
      v-model:visible="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :danger="confirmDialog.danger"
      :confirm-text="confirmDialog.confirmText"
      @confirm="confirmDialog.onConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { notificationService } from '../services/notification';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

// 狀態
const isSupported = ref(false);
const isSubscribed = ref(false);
const subscription = ref<PushSubscription | null>(null);
const permissionStatus = ref<NotificationPermission>('default');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const clearingAll = ref(false);

// 通知設定
interface CustomSchedule {
  time: string;
  enabled: boolean;
  schedule_type: string;
}

interface NotificationSettings {
  enabled: boolean;
  notify_on_workdays: boolean;
  notify_on_holidays: boolean;
  morning_enabled: boolean;
  morning_time: string;
  evening_enabled: boolean;
  evening_time: string;
  custom_schedules: CustomSchedule[];
}

const notificationSettings = ref<NotificationSettings>({
  enabled: true,
  notify_on_workdays: true,
  notify_on_holidays: false,
  morning_enabled: true,
  morning_time: '08:00',
  evening_enabled: true,
  evening_time: '22:00',
  custom_schedules: []
});

// 訂閱詳情折疊狀態
const isSubscriptionDetailsExpanded = ref(true);

// 確認對話框相關狀態
const showConfirmDialog = ref(false);
const confirmDialog = ref({
  title: '確認',
  message: '',
  danger: false,
  confirmText: '確定',
  onConfirm: () => {}
});

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

const clearAllSubscriptions = () => {
  confirmDialog.value = {
    title: '確認清除所有訂閱',
    message: '確定要清除所有推送訂閱嗎？此操作會移除所有裝置上的訂閱記錄，您需要重新訂閱才能接收推送通知。',
    danger: true,
    confirmText: '確定清除',
    onConfirm: async () => {
      clearingAll.value = true;
      clearMessages();

      try {
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/push/clear-all`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: null // 清除所有訂閱，不限定用戶
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          // 同時取消瀏覽器的訂閱
          await notificationService.removePushNotification();
          // 更新狀態
          isSubscribed.value = false;
          subscription.value = null;
          showSuccess(`成功清除 ${result.data.deleted_count} 個訂閱`);
        } else {
          showError(`清除訂閱失敗：${result.message}`);
        }
      } catch (error) {
        console.error('清除訂閱失敗:', error);
        showError(error instanceof Error ? error.message : '清除訂閱時發生錯誤');
      } finally {
        clearingAll.value = false;
      }
    }
  };
  showConfirmDialog.value = true;
};

// 載入通知設定
const loadSettings = async () => {
  if (!userStore.user?.id) return;

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/notification-settings/${userStore.user.id}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      const data = result.data;
      notificationSettings.value = {
        enabled: data.enabled ?? true,
        notify_on_workdays: data.notify_on_workdays ?? true,
        notify_on_holidays: data.notify_on_holidays ?? false,
        morning_enabled: data.morning_enabled ?? true,
        morning_time: data.morning_time ?? '08:00',
        evening_enabled: data.evening_enabled ?? true,
        evening_time: data.evening_time ?? '22:00',
        custom_schedules: data.custom_schedules
          ? (typeof data.custom_schedules === 'string'
            ? JSON.parse(data.custom_schedules)
            : data.custom_schedules)
          : []
      };
    }
  } catch (error) {
    console.error('載入通知設定失敗:', error);
  }
};

// 保存通知設定
const saveSettings = async () => {
  if (!userStore.user?.id) return;

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/notification-settings/${userStore.user.id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        enabled: notificationSettings.value.enabled,
        notify_on_workdays: notificationSettings.value.notify_on_workdays,
        notify_on_holidays: notificationSettings.value.notify_on_holidays,
        morning_enabled: notificationSettings.value.morning_enabled,
        morning_time: notificationSettings.value.morning_time,
        evening_enabled: notificationSettings.value.evening_enabled,
        evening_time: notificationSettings.value.evening_time,
        custom_schedules: notificationSettings.value.custom_schedules
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      showSuccess('設定已保存');
    } else {
      showError(`保存設定失敗：${result.message}`);
    }
  } catch (error) {
    console.error('保存通知設定失敗:', error);
    showError('保存設定時發生錯誤');
  }
};

// 添加自定義時段
const addCustomSchedule = () => {
  notificationSettings.value.custom_schedules.push({
    time: '12:00',
    enabled: true,
    schedule_type: 'custom'
  });
  saveSettings();
};

// 刪除自定義時段
const removeCustomSchedule = (index: number) => {
  notificationSettings.value.custom_schedules.splice(index, 1);
  saveSettings();
};

// 預覽早上通知
const previewMorningNotification = async () => {
  if (!userStore.user?.id || isLoading.value) return;

  isLoading.value = true;
  clearMessages();

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/notifications/preview-morning/${userStore.user.id}`;
    const response = await fetch(url, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      // 顯示本地通知預覽
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(result.data.title, {
          body: result.data.body,
          icon: result.data.icon,
          badge: result.data.badge
        });
        showSuccess('已發送早上通知預覽');
      } else {
        showSuccess(`通知內容：${result.data.title} - ${result.data.body}`);
      }
    } else {
      showError(`預覽失敗：${result.message}`);
    }
  } catch (error) {
    console.error('預覽早上通知失敗:', error);
    showError('預覽早上通知時發生錯誤');
  } finally {
    isLoading.value = false;
  }
};

// 預覽晚上通知
const previewEveningNotification = async () => {
  if (!userStore.user?.id || isLoading.value) return;

  isLoading.value = true;
  clearMessages();

  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/notifications/preview-evening/${userStore.user.id}`;
    const response = await fetch(url, { method: 'POST' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      // 顯示本地通知預覽
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(result.data.title, {
          body: result.data.body,
          icon: result.data.icon,
          badge: result.data.badge
        });
        showSuccess('已發送晚上通知預覽');
      } else {
        showSuccess(`通知內容：${result.data.title} - ${result.data.body}`);
      }
    } else {
      showError(`預覽失敗：${result.message}`);
    }
  } catch (error) {
    console.error('預覽晚上通知失敗:', error);
    showError('預覽晚上通知時發生錯誤');
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
    await loadSettings();
  }
});
</script>

<style scoped>
/* 折疊展開動畫 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
