import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { auth } from '../../firebase/firebase';

export default function RegisterScreen() {
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');

  const submit = async () => {
    if (!name || !email || !gender) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    await fetch('http://10.41.170.154:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user?.uid,
        name,
        email,
        gender,
        phone: user?.phoneNumber,
      }),
    });

    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Profile</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />

        {/* 🔽 Gender Dropdown */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <TextInput
          value={user?.phoneNumber || ''}
          editable={false}
          style={styles.inputDisabled}
        />

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2d3436',
  },
  card: {
    backgroundColor: '#f5f6fa',
    padding: 20,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  inputDisabled: {
    backgroundColor: '#dfe6e9',
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0984e3',
    padding: 15,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
