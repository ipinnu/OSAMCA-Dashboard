
// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, DashboardStackParamList } from '../types/navigation.types';

// Screens
import UsersListScreen from '../screens/main/UsersListScreen';
import UserProfileScreen from '../screens/main/UserProfileScreen';
import LoanApplicationScreen from '../screens/main/LoanApplicationScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();

// Dashboard Stack Navigator
const DashboardNavigator: React.FC = () => {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen
        name="UsersList"
        component={UsersListScreen}
        options={{
          title: 'Users Dashboard',
          headerStyle: {
            backgroundColor: '#1e5799',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <DashboardStack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'User Profile',
          headerStyle: {
            backgroundColor: '#1e5799',
          },
          headerTintColor: '#fff',
        }}
      />
    </DashboardStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Applications') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1e5799',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardNavigator}
        options={{ title: 'Users' }}
      />
      <Tab.Screen
        name="Applications"
        component={LoanApplicationScreen}
        options={{
          title: 'Applications',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1e5799',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1e5799',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;