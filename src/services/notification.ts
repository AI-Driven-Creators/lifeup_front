/**
 * Web Push Notification Service
 * 處理推送通知的訂閱、取消訂閱和權限管理
 */

import { loadApiConfig } from '../config/api';

// VAPID 公鑰 (需要從後端獲取或配置)
// 這是一個臨時的佔位符，實際使用時需要從環境變數或後端 API 獲取
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationService {
  private baseURL: string;

  constructor() {
    const config = loadApiConfig();
    this.baseURL = config.baseURL;
  }

  /**
   * 檢查瀏覽器是否支持推送通知
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * 獲取當前通知權限狀態
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * 請求通知權限
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('此瀏覽器不支持推送通知');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * 將 Base64 字串轉換為 Uint8Array (用於 VAPID 公鑰)
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * 訂閱推送通知
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      throw new Error('此瀏覽器不支持推送通知');
    }

    // 請求權限
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('用戶拒絕了通知權限');
    }

    // 註冊 Service Worker
    let registration: ServiceWorkerRegistration;
    try {
      registration = await navigator.serviceWorker.ready;
    } catch (error) {
      console.error('Service Worker 未就緒:', error);
      throw new Error('Service Worker 未就緒');
    }

    // 檢查是否已有訂閱
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('已存在推送訂閱');
      return subscription;
    }

    // 創建新訂閱
    if (!VAPID_PUBLIC_KEY) {
      throw new Error('VAPID 公鑰未配置');
    }

    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log('推送訂閱成功:', subscription);
      return subscription;
    } catch (error) {
      console.error('訂閱推送失敗:', error);
      throw error;
    }
  }

  /**
   * 取消訂閱推送通知
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const result = await subscription.unsubscribe();
        console.log('取消訂閱結果:', result);
        return result;
      }
      return true;
    } catch (error) {
      console.error('取消訂閱失敗:', error);
      return false;
    }
  }

  /**
   * 獲取當前訂閱
   */
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('獲取訂閱失敗:', error);
      return null;
    }
  }

  /**
   * 將訂閱信息發送到後端保存
   */
  async saveSubscriptionToServer(
    subscription: PushSubscription,
    userId?: string
  ): Promise<boolean> {
    const subscriptionJSON = subscription.toJSON();

    const payload = {
      endpoint: subscriptionJSON.endpoint,
      keys: {
        p256dh: subscriptionJSON.keys?.p256dh || '',
        auth: subscriptionJSON.keys?.auth || '',
      },
      user_id: userId,
    };

    try {
      const response = await fetch(`${this.baseURL}/api/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('保存訂閱失敗:', response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('訂閱已保存到服務器:', data);
      return data.success || true;
    } catch (error) {
      console.error('保存訂閱到服務器時出錯:', error);
      return false;
    }
  }

  /**
   * 從後端刪除訂閱
   */
  async removeSubscriptionFromServer(
    subscription: PushSubscription
  ): Promise<boolean> {
    const subscriptionJSON = subscription.toJSON();

    try {
      const response = await fetch(`${this.baseURL}/api/push/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: subscriptionJSON.endpoint }),
      });

      if (!response.ok) {
        console.error('刪除訂閱失敗:', response.statusText);
        return false;
      }

      const data = await response.json();
      return data.success || true;
    } catch (error) {
      console.error('從服務器刪除訂閱時出錯:', error);
      return false;
    }
  }

  /**
   * 發送測試通知
   */
  async sendTestNotification(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/push/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('發送測試通知失敗:', response.statusText);
        return false;
      }

      const data = await response.json();
      return data.success || true;
    } catch (error) {
      console.error('發送測試通知時出錯:', error);
      return false;
    }
  }

  /**
   * 完整的訂閱流程（請求權限 + 訂閱 + 保存到後端）
   */
  async setupPushNotification(userId?: string): Promise<boolean> {
    try {
      // 1. 訂閱推送
      const subscription = await this.subscribe();
      if (!subscription) {
        return false;
      }

      // 2. 保存到後端
      const saved = await this.saveSubscriptionToServer(subscription, userId);
      return saved;
    } catch (error) {
      console.error('設置推送通知失敗:', error);
      return false;
    }
  }

  /**
   * 完整的取消訂閱流程（從後端刪除 + 本地取消訂閱）
   */
  async removePushNotification(): Promise<boolean> {
    try {
      // 1. 獲取當前訂閱
      const subscription = await this.getSubscription();
      if (!subscription) {
        return true; // 沒有訂閱，視為成功
      }

      // 2. 從後端刪除
      await this.removeSubscriptionFromServer(subscription);

      // 3. 本地取消訂閱
      const unsubscribed = await this.unsubscribe();
      return unsubscribed;
    } catch (error) {
      console.error('移除推送通知失敗:', error);
      return false;
    }
  }
}

// 導出單例
export const notificationService = new NotificationService();
