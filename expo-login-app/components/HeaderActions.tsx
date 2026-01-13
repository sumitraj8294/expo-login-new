import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function HeaderActions({ active, setActive }: any) {
  return (
    <View style={styles.container}>
      <Tab label="➕ New Booking" active={active === 'form'} onPress={() => setActive('form')} />
      <Tab label="📋 Bookings" active={active === 'list'} onPress={() => setActive('list')} />
      <Tab label="👤 Profile" active={active === 'profile'} onPress={() => setActive('profile')} />
    </View>
  );
}

const Tab = ({ label, active, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.activeTab]}
  >
    <Text style={[styles.text, active && styles.activeText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    marginTop: 40,
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
});
