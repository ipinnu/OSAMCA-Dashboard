
// src/services/users.service.ts
import api from './api';
import { UserProfile } from '../types/user.types';

export const usersService = {
  async getUsers(filters?: {
    status?: string;
    search?: string;
  }): Promise<UserProfile[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    return api.get<UserProfile[]>(`/users/?${params.toString()}`);
  },

  async getUserById(id: number): Promise<UserProfile> {
    return api.get<UserProfile>(`/users/${id}/`);
  },

  async updateUser(id: number, data: Partial<UserProfile>): Promise<UserProfile> {
    return api.patch<UserProfile>(`/users/${id}/`, data);
  },
};

// src/services/applications.service.ts
