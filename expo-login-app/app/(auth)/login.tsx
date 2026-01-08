import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { signInWithPhoneNumber } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../../firebase/firebase';

export let confirmationResult: any = null;

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const recaptchaRef = useRef<any>(null);

  const sendOtp = async () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Enter a valid phone number');
      return;
    }

    try {
      confirmationResult = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        recaptchaRef.current
      );

      router.push({ pathname: '/otp', params: { phone: `+91${phone}` } });
    } catch {
      Alert.alert('OTP failed');
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaRef}
        firebaseConfig={auth.app.options}
      />

      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>Login with your phone number</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Phone Number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={sendOtp}>
          <Text style={styles.btnText}>Send OTP</Text>
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
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2d3436',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#636e72',
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
    marginBottom: 15,
    fontSize: 16,
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
