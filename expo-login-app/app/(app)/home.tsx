import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import HeaderActions from '../../components/HeaderActions';
import BookingForm from '../../components/BookingForm';
import BookingList from '../../components/BookingList';
import ProfileSection from '../../components/ProfileSection';

import { auth } from '../../firebase/firebase';
import { API_URL } from '../../constants/api';
import { COLORS } from '../../constants/theme';

export default function HomeScreen() {
  const [tab, setTab] = useState<'form' | 'list' | 'profile'>('form');
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRes = await fetch(
        `${API_URL}/api/auth/user/${currentUser.uid}`
      );
      const entryRes = await fetch(`${API_URL}/api/entries`);

      setUser(await userRes.json());
      setEntries(await entryRes.json());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <HeaderActions active={tab} setActive={setTab} />

      {/* CONTENT */}
      <View style={styles.content}>
        {tab === 'form' && <BookingForm onSuccess={loadAll} />}

        {tab === 'list' && (
          <BookingList data={entries} refresh={loadAll} />
        )}

        {tab === 'profile' && <ProfileSection user={user} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,   // 👈 SIDE SPACING
    paddingTop: 20,         // 👈 TOP GAP
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
