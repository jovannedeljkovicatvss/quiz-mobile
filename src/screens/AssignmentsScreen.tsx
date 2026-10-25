// src/screens/AssignmentsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAssignments, getAssignmentDetails, submitAssignment } from '../api/assignments';

interface Props {
  courseId: string;
  courseName: string;
  onBack: () => void;
}

export function AssignmentsScreen({ courseId, courseName, onBack }: Props) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const data = await getAssignments(courseId, token);
      setAssignments(data);
    } catch (error: any) {
      console.log("Greška domaći:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (assignmentId: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      const data = await getAssignmentDetails(courseId, assignmentId, token);
      setSelectedAssignment(data);
    } catch (error: any) {
      Alert.alert('Greška', error.message);
    }
  };

  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      Alert.alert('Greška', 'Unesite tekst pre nego što predate.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;
      await submitAssignment(courseId, selectedAssignment.id, submissionText, token);
      Alert.alert('Uspeh', 'Zadatak je uspešno predat!');
      setSubmissionText('');
      setSelectedAssignment(null); // Vrati se na listu
      loadAssignments(); // Osveži listu
    } catch (error: any) {
      Alert.alert('Greška pri predaji', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Ako je izabran zadatak, prikaži detalje
  if (selectedAssignment) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedAssignment(null)} style={styles.backButton}>
            <Text style={styles.backText}>← Nazad</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>Detalji zadatka</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.assignmentTitle}>{selectedAssignment.title}</Text>
          <Text style={styles.metaText}>Rok: {new Date(selectedAssignment.dueAt).toLocaleString('sr-RS')}</Text>
          <Text style={styles.description}>{selectedAssignment.description || 'Nema opisa.'}</Text>
          
          <Text style={styles.sectionTitle}>Vaša predaja</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Unesite tekst vašeg rešenja ovde..."
            value={submissionText}
            onChangeText={setSubmissionText}
          />
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit} 
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Predaj zadatak</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Prikaz liste
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Nazad</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{courseName}</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#1e6bb8" /></View>
      ) : assignments.length === 0 ? (
        <View style={styles.center}><Text>Nema domaćih zadataka.</Text></View>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => loadDetails(item.id)}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDue}>Rok: {new Date(item.dueAt).toLocaleDateString('sr-RS')}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backButton: { marginRight: 15 },
  backText: { color: '#1e6bb8', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  listContainer: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  cardDue: { fontSize: 12, color: '#6b7280', marginTop: 5 },
  
  content: { padding: 20 },
  assignmentTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  metaText: { fontSize: 14, color: '#ef4444', fontWeight: 'bold', marginBottom: 20 },
  description: { fontSize: 16, color: '#4b5563', lineHeight: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e6bb8', marginBottom: 10 },
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 15, minHeight: 120, textAlignVertical: 'top', fontSize: 16, marginBottom: 20 },
  submitButton: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});