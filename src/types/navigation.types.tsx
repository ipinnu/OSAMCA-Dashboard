// src/types/navigation.types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Applications: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type DashboardStackParamList = {
  UsersList: undefined;
  UserProfile: { userId: number };
};
