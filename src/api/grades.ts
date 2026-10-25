// src/api/grades.ts
import { apiRequest } from './client';

export async function getMyGrade(courseId: string, token: string) {
  try {
    const response = await apiRequest(`/courses/${courseId}/grades/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.grade;
  } catch (error: any) {
    // Ako ocena još nije objavljena, backend vraća 403 ili 404
    if (error.message.includes('403') || error.message.includes('404')) {
      return null;
    }
    throw error;
  }
}