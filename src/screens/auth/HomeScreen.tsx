// src/screens/auth/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <LinearGradient colors={['#1e5799', '#207cca', '#2989d8']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>OSAMCA</Text>
          </View>
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.btnOutline}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.btnOutlineText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFilled}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.btnFilledText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.title}>Empowering Agricultural Growth</Text>
          <Text style={styles.subtitle}>
            Ogun State Agricultural and Multipurpose Credit Agency provides credit
            facilities to small and medium scale agricultural and business enterprises
            to foster economic development.
          </Text>
          <Button
            title="Apply for Credit"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.ctaButton}
          />
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureCard
            icon="leaf"
            title="Agricultural Loans"
            description="Financial support for farmers and agribusinesses to boost production and productivity."
          />
          <FeatureCard
            icon="briefcase"
            title="Business Credit"
            description="Credit facilities for small and medium enterprises to expand operations and create jobs."
          />
          <FeatureCard
            icon="trending-up"
            title="Growth Support"
            description="Comprehensive support services to ensure sustainable growth of beneficiary enterprises."
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const FeatureCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <View style={styles.featureCard}>
    <Ionicons name={icon} size={40} color="#ffcc00" style={styles.featureIcon} />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 100,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  btnOutline: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  btnOutlineText: {
    color: '#fff',
    fontWeight: '600',
  },
  btnFilled: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  btnFilledText: {
    color: '#1e5799',
    fontWeight: '600',
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#ffcc00',
    minWidth: 200,
  },
  features: {
    paddingHorizontal: 20,
    gap: 20,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
});

export default HomeScreen;

