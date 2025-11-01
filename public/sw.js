// Service Worker for Web Push Notifications
/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Workbox 预缓存
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// API 缓存策略
registerRoute(
  /^https:\/\/api\..*/i,
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      }),
    ],
  }),
  'GET'
);

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// 處理推送通知
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let notificationData = {
    title: '人生升級系統',
    body: '您有新的提醒！',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'lifeup-notification',
    data: {
      url: '/'
    }
  };

  // 如果推送包含數據，解析它
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        ...notificationData,
        ...payload
      };
    } catch (e) {
      console.error('Failed to parse push data:', e);
      notificationData.body = event.data.text();
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      requireInteraction: false,
      vibrate: [200, 100, 200]
    }
  );

  event.waitUntil(promiseChain);
});

// 處理通知點擊事件
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  const promiseChain = self.clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      // 檢查是否已經有打開的窗口
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // 如果沒有，打開新窗口
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});

// 處理通知關閉事件
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});
