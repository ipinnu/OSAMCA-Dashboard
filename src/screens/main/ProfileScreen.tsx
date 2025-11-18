// src/screens/main/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: signOut,
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#1e5799" />
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </Card>

      {/* Menu Items */}
      <Card style={styles.menuCard}>
        <MenuItem
          icon="person-outline"
          title="Edit Profile"
          onPress={() => Alert.alert('Info', 'Edit profile functionality')}
        />
        <MenuItem
          icon="document-text-outline"
          title="My Applications"
          onPress={() => Alert.alert('Info', 'My applications functionality')}
        />
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          onPress={() => Alert.alert('Info', 'Notifications functionality')}
        />
        <MenuItem
          icon="settings-outline"
          title="Settings"
          onPress={() => Alert.alert('Info', 'Settings functionality')}
        />
        <MenuItem
          icon="help-circle-outline"
          title="Help & Support"
          onPress={() => Alert.alert('Info', 'Help & support functionality')}
        />
      </Card>

      {/* Sign Out Button */}
      <View style={styles.signOutContainer}>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
        />
      </View>

      {/* Version Info */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const MenuItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={24} color="#1e5799" />
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 15,
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e5799',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  menuCard: {
    margin: 15,
    marginTop: 0,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  signOutContainer: {
    padding: 15,
  },
  signOutButton: {
    borderColor: '#ff3b30',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginBottom: 30,
  },
});

export default ProfileScreen;

