// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn } = useAuth(); // <-- Ovde se uzima signIn

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Unesite email i lozinku.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await signIn(email, password);
    } catch (error: any) {
      setErrorMsg(error.message || 'Došlo je do greške.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Platform</Text>
      <Text style={styles.subtitle}>Prijavite se na vaš nalog</Text>

      <TextInput
        style={styles.input}
        placeholder="Email adresa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Prijavi se</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9fafb' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1e6bb8', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#1e6bb8', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
});