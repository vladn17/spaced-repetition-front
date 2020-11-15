import { precacheAndRoute } from 'workbox-precaching';

declare const clients: Clients;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  const tag = event.notification.tag;
  event.notification.close();
  const page = `/repetition/${tag}`;
  event.waitUntil(clients.openWindow(page));
});
