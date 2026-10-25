// src/api/assignments.ts
import { apiRequest, API_URL } from './client';

// Dohvatanje liste domaćih za predmet
export async function getAssignments(courseId: string, token: string) {
  const response = await apiRequest(`/courses/${courseId}/assignments`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.data.assignments;
}

// Dohvatanje detalja jednog domaćeg
export async function getAssignmentDetails(courseId: string, assignmentId: string, token: string) {
  const response = await apiRequest(`/courses/${courseId}/assignments/${assignmentId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.data.assignment;
}

// Predaja domaćeg (tekstualni odgovor)
export async function submitAssignment(courseId: string, assignmentId: string, textContent: string, token: string) {
  // Koristimo fetch direktno jer šaljemo multipart/form-data (iako za sada samo tekst)
  // Napomena: Za sada šaljemo samo tekst, bez fajla.
  const response = await fetch(`${API_URL}/courses/${courseId}/assignments/${assignmentId}/submission`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textContent }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Greška pri predaji.');
  }

  return await response.json();
}