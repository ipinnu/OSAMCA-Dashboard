// src/screens/auth/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
};

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Personal Info
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [country, setCountry] = useState('Nigeria');

  // Step 2: Phone
  const [phoneNumber, setPhoneNumber] = useState('');

  // Step 3: Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    if (step === 1) {
      if (!lastName || !firstName) {
        Alert.alert('Error', 'Please fill in required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!phoneNumber || phoneNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
      setStep(3);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        lastName,
        middleName,
        firstName,
        country,
        phoneNumber,
        password,
      });
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1e5799', '#207cca', '#2989d8']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Step {step} of 3</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>

          <View style={styles.formContainer}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <>
                <Text style={styles.stepTitle}>Personal Information</Text>
                <Input
                  label="Last Name *"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
                />
                <Input
                  label="Middle Name"
                  value={middleName}
                  onChangeText={setMiddleName}
                  placeholder="Enter your middle name"
                />
                <Input
                  label="First Name *"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                />
                <Button title="Next" onPress={handleNext} />
              </>
            )}

            {/* Step 2: Phone Number */}
            {step === 2 && (
              <>
                <Text style={styles.stepTitle}>Phone Verification</Text>
                <Input
                  label="Phone Number *"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="08012345678"
                  keyboardType="phone-pad"
                  leftIcon="call"
                />
                <View style={styles.buttonRow}>
                  <Button
                    title="Back"
                    onPress={() => setStep(1)}
                    variant="outline"
                    style={styles.halfButton}
                  />
                  <Button title="Next" onPress={handleNext} style={styles.halfButton} />
                </View>
              </>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <>
                <Text style={styles.stepTitle}>Set Your Password</Text>
                <Input
                  label="Password *"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry
                  leftIcon="lock-closed"
                />
                <Input
                  label="Confirm Password *"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  leftIcon="lock-closed"
                />
                <View style={styles.buttonRow}>
                  <Button
                    title="Back"
                    onPress={() => setStep(2)}
                    variant="outline"
                    style={styles.halfButton}
                  />
                  <Button
                    title="Create Account"
                    onPress={handleSignUp}
                    loading={loading}
                    style={styles.halfButton}
                  />
                </View>
              </>
            )}

            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 30,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffcc00',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e5799',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  halfButton: {
    flex: 1,
  },
  signInText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  signInLink: {
    color: '#1e5799',
    fontWeight: '600',
  },
});

export default SignUpScreen;

