import React, { useState, useEffect } from 'react';
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

export default function BookingForm({ onSuccess }: any) {
  const [form, setForm] = useState<any>({
    name: '',
    phone: '',
    email: '',
    gender: '',
    date: '',
    timeSlot: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);

  /* ✅ REAL-TIME PHONE CHECK */
  useEffect(() => {
    if (!form.phone || form.phone.length !== 10) {
      setPhoneExists(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setCheckingPhone(true);
        const res = await fetch(
          `${API_URL}/api/entries/check-phone/${form.phone}`
        );
        const data = await res.json();
        setPhoneExists(data.exists);
      } catch (err) {
        console.log(err);
      } finally {
        setCheckingPhone(false);
      }
    }, 800); // debounce

    return () => clearTimeout(timer);
  }, [form.phone]);

  /* ✅ PHONE MUST BE VALID BEFORE OTHER FIELDS */
  const isPhoneValid = form.phone.length === 10 && !phoneExists;

  const submit = async () => {
    if (!isPhoneValid) {
      return Alert.alert('Invalid phone number');
    }

    if (
      !form.name ||
      !form.email ||
      !form.gender ||
      !form.date ||
      !form.timeSlot
    ) {
      return Alert.alert('Fill all required fields');
    }

    const res = await fetch(`${API_URL}/api/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.status === 409) {
      const data = await res.json();
      return Alert.alert('Booking Failed', data.message);
    }

    if (!res.ok) {
      return Alert.alert('Error', 'Something went wrong');
    }

    Alert.alert('Success', 'Booking added');
    setForm({
      name: '',
      phone: '',
      email: '',
      gender: '',
      date: '',
      timeSlot: '',
    });
    onSuccess();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>New Booking</Text>

      {/* PHONE FIRST */}
      <Label text="Phone" />
      <TextInput
        style={[
          styles.input,
          phoneExists && { borderColor: COLORS.danger },
        ]}
        keyboardType="phone-pad"
        maxLength={10}
        value={form.phone}
        onChangeText={(v) => setForm({ ...form, phone: v })}
      />

      {checkingPhone && <Text style={styles.info}>Checking phone…</Text>}

      {phoneExists && (
        <Text style={styles.error}>
          This phone number already has a booking
        </Text>
      )}

      {!isPhoneValid && (
        <Text style={styles.locked}>
          Enter a unique phone number to continue
        </Text>
      )}

      {/* REST OF FORM (LOCKED UNTIL PHONE VALID) */}
      <Label text="Name" />
      <TextInput
        style={styles.input}
        editable={isPhoneValid}
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />

      <Label text="Email" />
      <TextInput
        style={styles.input}
        editable={isPhoneValid}
        value={form.email}
        onChangeText={(v) => setForm({ ...form, email: v })}
      />

      <Label text="Gender" />
      <View style={[styles.dropdown, !isPhoneValid && styles.disabled]}>
        <Picker
          enabled={isPhoneValid}
          selectedValue={form.gender}
          onValueChange={(v) => setForm({ ...form, gender: v })}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Label text="Date" />
      <TouchableOpacity
        disabled={!isPhoneValid}
        style={[styles.input, !isPhoneValid && styles.disabled]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {form.date ? new Date(form.date).toDateString() : 'Select Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
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

      <Label text="Time Slot" />
      <View style={[styles.dropdown, !isPhoneValid && styles.disabled]}>
        <Picker
          enabled={isPhoneValid}
          selectedValue={form.timeSlot}
          onValueChange={(v) => setForm({ ...form, timeSlot: v })}
        >
          <Picker.Item label="Select Time Slot" value="" />
          {SLOTS.map((slot) => (
            <Picker.Item key={slot} label={slot} value={slot} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[
          styles.submit,
          !isPhoneValid && { backgroundColor: COLORS.border },
        ]}
        disabled={!isPhoneValid}
        onPress={submit}
      >
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
    marginBottom: 8,
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
    marginTop: 12,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: COLORS.danger,
    marginBottom: 6,
    fontSize: 12,
  },
  info: {
    color: COLORS.muted,
    marginBottom: 6,
    fontSize: 12,
  },
  locked: {
    color: COLORS.muted,
    marginBottom: 12,
    fontSize: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});
