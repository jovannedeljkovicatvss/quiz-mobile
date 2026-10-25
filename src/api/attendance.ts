// src/api/attendance.ts
import { apiRequest } from './client';

export async function getMyAttendanceStats(courseId: string, token: string) {
  const response = await apiRequest(`/courses/${courseId}/attendance/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  // Backend vraća { data: { stats: [...] } }
  // Pošto je student prijavljen, niz će imati samo njegovu statistiku (jedan element)
  return response.data.stats;
}