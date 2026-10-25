// src/app/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { CoursesScreen } from '../screens/CoursesScreen';
import { CalendarScreen } from '../screens/CalendarScreen';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'COURSES' | 'CALENDAR'>('COURSES');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e6bb8' }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>Quiz Platform</Text>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'COURSES' ? <CoursesScreen /> : <CalendarScreen />}
      </View>
      
      {/* Donja traka za navigaciju */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('COURSES')}
        >
          <Text style={[styles.tabIcon, activeTab === 'COURSES' && styles.activeTab]}>📚</Text>
          <Text style={[styles.tabLabel, activeTab === 'COURSES' && styles.activeTabText]}>Predmeti</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('CALENDAR')}
        >
          <Text style={[styles.tabIcon, activeTab === 'CALENDAR' && styles.activeTab]}>📅</Text>
          <Text style={[styles.tabLabel, activeTab === 'CALENDAR' && styles.activeTabText]}>Kalendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppEntry() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 20, // Da ne bi prekrivalo dugme "nazad" na telefonima
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTab: {
    opacity: 1,
  },
  activeTabText: {
    color: '#1e6bb8',
  },
});