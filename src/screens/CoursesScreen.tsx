// src/screens/CoursesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMyCourses } from '../api/courses';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseDetailScreen } from './CourseDetailScreen';
import { AssignmentsScreen } from './AssignmentsScreen'; // <-- Uvoz

export function CoursesScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showAssignments, setShowAssignments] = useState(false); // <-- Novo stanje
  const { signOut } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const data = await getMyCourses(token);
      setCourses(data);
    } catch (error: any) {
      console.log('Greška:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Ako je otvoren ekran za domaće
  if (showAssignments && selectedCourse) {
    return (
      <AssignmentsScreen 
        courseId={selectedCourse.id} 
        courseName={selectedCourse.name} 
        onBack={() => setShowAssignments(false)} 
      />
    );
  }

  // Ako je otvoren detalj predmeta
  if (selectedCourse && !showAssignments) {
    return (
      <CourseDetailScreen 
        course={selectedCourse} 
        onBack={() => setSelectedCourse(null)} 
        onOpenAssignments={() => setShowAssignments(true)} // <-- Šaljemo funkciju
      />
    );
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#1e6bb8" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Moji predmeti</Text>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Odjavi se</Text>
        </TouchableOpacity>
      </View>

      {courses.length === 0 ? (
        <View style={styles.center}><Text style={styles.emptyText}>Nemate upisanih predmeta.</Text></View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedCourse(item)}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseCode}>{item.code} · {item.schoolYear}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... isti stilovi kao pre
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e6bb8' },
  logoutButton: { padding: 8 },
  logoutText: { color: '#ef4444', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#6b7280', fontSize: 16 },
  listContainer: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  courseName: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
  courseCode: { fontSize: 14, color: '#6b7280' },
});