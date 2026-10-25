// src/screens/CourseDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCourseMaterials } from '../api/materials';
import { getMyGrade } from '../api/grades';
import { getMyAttendanceStats } from '../api/attendance';

interface Props {
  course: any;
  onBack: () => void;
  onOpenAssignments: () => void; // <-- NOVO
}

type Tab = 'INFO' | 'CV' | 'MATERIALS' | 'GRADES' | 'ATTENDANCE';

export function CourseDetailScreen({ course, onBack, onOpenAssignments }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('INFO');
  // ... (ostala stanja ostaju ista)
  const [materials, setMaterials] = useState<any[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [grade, setGrade] = useState<any>(null);
  const [loadingGrade, setLoadingGrade] = useState(false);
  const [attendance, setAttendance] = useState<any>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    if (activeTab === 'MATERIALS' && materials.length === 0) loadMaterials();
    if (activeTab === 'GRADES' && !grade && !loadingGrade) loadGrade();
    if (activeTab === 'ATTENDANCE' && !attendance && !loadingAttendance) loadAttendance();
  }, [activeTab]);

  // ... (ostale load funkcije ostaju iste: loadMaterials, loadGrade, loadAttendance)

  const loadMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const data = await getCourseMaterials(course.id, token);
      setMaterials(data);
    } catch (error: any) { console.log("Greška materijali:", error.message); } finally { setLoadingMaterials(false); }
  };
  const loadGrade = async () => {
    try {
      setLoadingGrade(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const data = await getMyGrade(course.id, token);
      setGrade(data);
    } catch (error: any) { console.log("Greška ocena:", error.message); } finally { setLoadingGrade(false); }
  };
  const loadAttendance = async () => {
    try {
      setLoadingAttendance(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const data = await getMyAttendanceStats(course.id, token);
      if (data && data.length > 0) setAttendance(data[0]); else setAttendance({ lectureTotal: 0, labTotal: 0, overallRate: 0 });
    } catch (error: any) { console.log("Greška prisustvo:", error.message); } finally { setLoadingAttendance(false); }
  };
  const openFile = (url: string) => {
    const fullUrl = `https://quiz-platform-did7.onrender.com${url}`;
    Linking.openURL(fullUrl).catch(() => alert('Ne mogu da otvorim fajl.'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}><Text style={styles.backText}>← Nazad</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{course.name}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'INFO' && styles.activeTab]} onPress={() => setActiveTab('INFO')}><Text style={[styles.tabText, activeTab === 'INFO' && styles.activeTabText]}>Info</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'CV' && styles.activeTab]} onPress={() => setActiveTab('CV')}><Text style={[styles.tabText, activeTab === 'CV' && styles.activeTabText]}>CV</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'MATERIALS' && styles.activeTab]} onPress={() => setActiveTab('MATERIALS')}><Text style={[styles.tabText, activeTab === 'MATERIALS' && styles.activeTabText]}>Mater.</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'GRADES' && styles.activeTab]} onPress={() => setActiveTab('GRADES')}><Text style={[styles.tabText, activeTab === 'GRADES' && styles.activeTabText]}>Ocene</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'ATTENDANCE' && styles.activeTab]} onPress={() => setActiveTab('ATTENDANCE')}><Text style={[styles.tabText, activeTab === 'ATTENDANCE' && styles.activeTabText]}>Pris.</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* INFO TAB - DODATO DUGME ZA DOMAĆE */}
        {activeTab === 'INFO' && (
          <View>
            <Text style={styles.sectionTitle}>O predmetu</Text>
            <Text style={styles.text}>Šifra: {course.code}</Text>
            <Text style={styles.text}>Školska godina: {course.schoolYear}</Text>
            <Text style={styles.text}>ESPB: {course.espb || 'N/A'}</Text>
            <Text style={styles.text}>Semestar: {course.semester || 'N/A'}</Text>
            
            <Text style={styles.sectionTitle}>Profesor</Text>
            <Text style={styles.text}>{course.professor ? `${course.professor.firstName} ${course.professor.lastName}` : 'Nema podataka'}</Text>
            
            <Text style={styles.sectionTitle}>Opis</Text>
            <Text style={styles.text}>{course.description || 'Nema opisa.'}</Text>

            {/* DUGME ZA DOMAĆE */}
            <TouchableOpacity style={styles.assignmentsButton} onPress={onOpenAssignments}>
              <Text style={styles.assignmentsButtonText}>📝 Otvori domaće zadatke</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ... (Ostali tabovi ostaju isti, dodaj ih po potrebi) */}
        {activeTab === 'CV' && ( /* ... */ <View><Text style={styles.text}>CV info...</Text></View> )}
        {activeTab === 'MATERIALS' && ( /* ... */ <View><Text style={styles.text}>Materijali...</Text></View> )}
        {activeTab === 'GRADES' && ( /* ... */ <View><Text style={styles.text}>Ocene...</Text></View> )}
        {activeTab === 'ATTENDANCE' && ( /* ... */ <View><Text style={styles.text}>Prisustvo...</Text></View> )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (svi postojeći stilovi)
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backButton: { marginRight: 15 },
  backText: { color: '#1e6bb8', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', flex: 1 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#1e6bb8' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  activeTabText: { color: '#1e6bb8' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e6bb8', marginTop: 20, marginBottom: 10 },
  text: { fontSize: 16, color: '#4b5563', marginBottom: 5, lineHeight: 22 },
  // Novi stil za dugme
  assignmentsButton: { backgroundColor: '#1e6bb8', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  assignmentsButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  // ... ostali stilovi
});