// src/api/materials.ts
import { API_URL } from './client';

export async function getCourseMaterials(courseId: string, token: string) {
  const response = await fetch(`${API_URL}/courses/${courseId}/materials`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ne mogu da učitam materijale.');
  }

  const data = await response.json();
  return data.data.materials;
}