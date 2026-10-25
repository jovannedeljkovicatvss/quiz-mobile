// src/api/courses.ts
import { apiRequest } from './client';

export async function getMyCourses(token: string) {
  const response = await apiRequest('/courses', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.data.courses;
}