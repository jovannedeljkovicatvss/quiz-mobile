// src/api/notifications.ts
import { apiRequest } from './client';

// Dohvatanje liste notifikacija
export async function getNotifications(token: string) {
  const response = await apiRequest('/notifications', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.data; // Vraća { notifications: [...], unreadCount: broj }
}

// Označavanje jedne notifikacije kao pročitane
export async function markNotificationRead(notificationId: string, token: string) {
  await apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

// Označavanje svih notifikacija kao pročitanih
export async function markAllNotificationsRead(token: string) {
  await apiRequest('/notifications/read-all', {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}