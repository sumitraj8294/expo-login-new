import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { auth } from '../../firebase/firebase';
import { router } from 'expo-router';

// Home screen component
export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // This runs once when the screen loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get currently logged-in Firebase user
        const user = auth.currentUser;
        if (!user) {
          router.replace('/login');
          return;
        }

        // Fetch user details from backend using Firebase UID
        const res = await fetch(
          `http://10.41.170.154:5000/api/auth/user/${user.uid}`
        );

        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        Alert.alert('Error', 'Unable to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  const logout = async () => {
    await auth.signOut();
    router.replace('/login');
  };
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Main UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome </Text>
      {userData && (
        <View style={styles.card}>
          <Info label="Name" value={userData.name} />
          <Info label="Email" value={userData.email} />
          <Info label="Phone" value={userData.phone} />
          <Info label="Gender" value={userData.gender} />
        </View>
      )}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const Info = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2d3436',
  },
  card: {
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  label: {
    fontSize: 13,
    color: '#636e72',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  logoutBtn: {
    backgroundColor: '#d63031',
    paddingVertical: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
