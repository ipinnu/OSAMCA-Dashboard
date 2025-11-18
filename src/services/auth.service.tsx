
// src/services/auth.service.ts
import api from './api';
import * as SecureStore from 'expo-secure-store';
import { SignInData, SignUpData, AuthTokens, User } from '../types/auth.types';

export const authService = {
  async signIn(credentials: SignInData): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await api.post<{ tokens: AuthTokens; user: User }>(
      '/auth/login/',
      credentials
    );

    await SecureStore.setItemAsync('accessToken', response.tokens.access);
    await SecureStore.setItemAsync('refreshToken', response.tokens.refresh);

    return response;
  },

  async signUp(data: SignUpData): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await api.post<{ tokens: AuthTokens; user: User }>(
      '/auth/register/',
      data
    );

    await SecureStore.setItemAsync('accessToken', response.tokens.access);
    await SecureStore.setItemAsync('refreshToken', response.tokens.refresh);

    return response;
  },

  async signOut(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me/');
  },

  async verifyPhone(phoneNumber: string): Promise<void> {
    await api.post('/auth/verify-phone/', { phoneNumber });
  },

  async verifyCode(phoneNumber: string, code: string): Promise<void> {
    await api.post('/auth/verify-code/', { phoneNumber, code });
  },
};
