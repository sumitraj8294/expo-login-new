import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { auth } from '../firebase/firebase';
import { router } from 'expo-router';

export default function ProfileSection({ user }: any) {
  const logout = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name[0]}
        </Text>
      </View>

      <Info label="Name" value={user.name} />
      <Info label="Phone" value={user.phone} />
      <Info label="Email" value={user.email} />
      <Info label="Gender" value={user.gender} />

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const Info = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  avatar: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: COLORS.muted,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  logout: {
    backgroundColor: COLORS.danger,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});
