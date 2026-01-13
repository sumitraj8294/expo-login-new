import React, { useMemo, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/theme';
import { API_URL } from '../constants/api';

const SLOTS = ['11AM–1PM', '1PM–3PM', '3PM–5PM'];

export default function BookingList({ data, refresh }: any) {
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterSlot, setFilterSlot] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const remove = async (id: string) => {
    await fetch(`${API_URL}/api/entries/${id}`, { method: 'DELETE' });
    refresh();
  };

  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      if (filterDate && item.date !== filterDate) return false;
      if (filterSlot && item.timeSlot !== filterSlot) return false;
      return true;
    });
  }, [data, filterDate, filterSlot]);

  return (
    // ✅ IMPORTANT: flex:1 enables scrolling
    <View style={{ flex: 1 }}>
      {/* FILTER BAR */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>
            {filterDate ? filterDate : 'Filter by Date'}
          </Text>
        </TouchableOpacity>

        <View style={styles.slotDropdown}>
          <Picker
            selectedValue={filterSlot}
            onValueChange={(v) => setFilterSlot(v)}
          >
            <Picker.Item label="All Slots" value="" />
            {SLOTS.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => {
            setFilterDate(null);
            setFilterSlot('');
          }}
        >
          <Text style={{ color: '#fff' }}>Clear</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) {
              setFilterDate(d.toISOString().split('T')[0]);
            }
          }}
        />
      )}

      {/* ✅ SCROLLABLE LIST */}
      <FlatList
        style={{ flex: 1 }}                 // 🔥 enables scroll
        nestedScrollEnabled                // Android fix
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={filteredData}
        keyExtractor={(item: any) => item._id}
        ListEmptyComponent={
          <Text style={styles.empty}>No bookings found</Text>
        }
        renderItem={({ item, index }: any) => (
          <View style={styles.card}>
            <Text style={styles.queue}>Queue #{index + 1}</Text>

            <Row label="Name" value={item.name} />
            <Row label="Phone" value={item.phone} />
            <Row label="Date" value={item.date} />
            <Row label="Time Slot" value={item.timeSlot} />

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => remove(item._id)}
            >
              <Text style={styles.deleteText}>Delete Booking</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const Row = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  filters: {
    padding: 16,
    gap: 10,
  },
  dateBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
  },
  slotDropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  clearBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
  },
  queue: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    color: COLORS.muted,
    fontSize: 13,
  },
  value: {
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: COLORS.danger,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.muted,
  },
});
