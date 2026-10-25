// src/screens/CalendarScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCalendarEvents } from '../api/calendar';

export function CalendarScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      // Uzimamo događaje za narednih 6 meseci (da pokrijemo semestar)
      const today = new Date();
      const nextYear = new Date();
      nextYear.setMonth(today.getMonth() + 6);

      const from = today.toISOString().split('T')[0];
      const to = nextYear.toISOString().split('T')[0];

      const data = await getCalendarEvents(from, to, token);
      setEvents(data);
    } catch (error: any) {
      console.log("Greška kalendar:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pomoćna funkcija za boje i ikonice po tipu
  const getEventStyle = (type: string) => {
    switch (type) {
      case 'QUIZ': return { bg: '#eff6ff', border: '#3b82f6', icon: '📝', label: 'Kviz' };
      case 'EXAM': return { bg: '#fef2f2', border: '#ef4444', icon: '📄', label: 'Ispit' };
      case 'ASSIGNMENT': return { bg: '#fffbeb', border: '#f59e0b', icon: '📚', label: 'Domaći' };
      default: return { bg: '#f3f4f6', border: '#6b7280', icon: '📌', label: 'Događaj' };
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e6bb8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kalendar obaveza</Text>
      </View>

      {events.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nema zakazanih obaveza u narednom periodu.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const style = getEventStyle(item.type);
            const dateObj = new Date(item.start);
            const dateStr = dateObj.toLocaleDateString('sr-RS', { day: '2-digit', month: 'short', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });

            return (
              <View style={[styles.card, { borderLeftColor: style.border, borderLeftWidth: 5 }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: style.bg }]}>
                    <Text style={[styles.badgeText, { color: style.border }]}>
                      {style.icon} {style.label}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{dateStr}</Text>
                </View>
                
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.courseName}>{item.courseName}</Text>
                
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>🕒 {timeStr}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e6bb8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: '#6b7280', fontSize: 16, textAlign: 'center' },
  listContainer: { padding: 20 },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  dateText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  eventTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
  courseName: { fontSize: 14, color: '#4b5563', marginBottom: 10 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 14, color: '#6b7280' },
});