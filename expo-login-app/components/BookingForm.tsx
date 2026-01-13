import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../constants/theme';
import { API_URL } from '../constants/api';

const SLOTS = ['11AM–1PM', '1PM–3PM', '3PM–5PM'];

const isSlotAvailable = (slot: string, selectedDate?: string) => {
  if (!selectedDate) return true;

  const today = new Date().toISOString().split('T')[0];
  if (selectedDate !== today) return true;

  const currentHour = new Date().getHours();

  if (slot === '11AM–1PM' && currentHour >= 13) return false;
  if (slot === '1PM–3PM' && currentHour >= 15) return false;
  if (slot === '3PM–5PM' && currentHour >= 17) return false;

  return true;
};

export default function BookingForm({ onSuccess }: any) {
  const [form, setForm] = useState<any>({
    gender: '',
    timeSlot: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const submit = async () => {
    if (!form.name || !form.phone || !form.date || !form.timeSlot || !form.gender) {
      return Alert.alert('Fill all required fields');
    }

    const res = await fetch(`${API_URL}/api/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) return Alert.alert('Failed');

    Alert.alert('Success', 'Booking added');
    setForm({});
    onSuccess();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>New Booking</Text>

      <Label text="Name" />
      <TextInput
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />

      <Label text="Phone" />
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        onChangeText={(v) => setForm({ ...form, phone: v })}
      />

      <Label text="Email" />
      <TextInput
        style={styles.input}
        onChangeText={(v) => setForm({ ...form, email: v })}
      />

      {/* Gender Dropdown */}
      <Label text="Gender" />
      <View style={styles.dropdown}>
        <Picker
          selectedValue={form.gender}
          onValueChange={(v) => setForm({ ...form, gender: v })}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* Date Picker Main */}
      <Label text="Date" />
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {form.date
            ? new Date(form.date).toDateString()
            : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}

      {showDatePicker && (
        <DateTimePicker
          value={form.date ? new Date(form.date) : new Date()}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setForm({
                ...form,
                date: selectedDate.toISOString().split('T')[0],
              });
            }
          }}
        />
      )}

      {/* Dropdown for Time Slots */}
      <Label text="Time Slot" />
      <View style={styles.dropdown}>
  <Picker
    selectedValue={form.timeSlot}
    onValueChange={(v) => setForm({ ...form, timeSlot: v })}
  >
    <Picker.Item label="Select Time Slot" value="" />
    {SLOTS.map((slot) => {
      const available = isSlotAvailable(slot, form.date);
      return (
        <Picker.Item
          key={slot}
          label={available ? slot : `${slot} (Unavailable)`}
          value={available ? slot : ''}
          enabled={available}   // Gray out unavailable slots
        />
      );
    })}
  </Picker>
</View>

      <TouchableOpacity style={styles.submit} onPress={submit}>
        <Text style={styles.submitText}>Submit Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const Label = ({ text }: any) => (
  <Text style={styles.label}>{text}</Text>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
  },
  label: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    justifyContent: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
  },
  submit: {
    backgroundColor: COLORS.success,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});
