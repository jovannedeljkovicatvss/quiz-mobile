// src/api/calendar.ts
import { apiRequest } from './client';

export async function getCalendarEvents(from: string, to: string, token: string) {
  const response = await apiRequest(`/calendar?from=${from}&to=${to}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.data.events;
}