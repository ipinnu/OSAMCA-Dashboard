import api from './api';
import { LoanApplicationData } from '../types/application.types';

export const applicationsService = {
  async submitApplication(data: LoanApplicationData): Promise<any> {
    return api.post('/applications/', data);
  },

  async getApplication(id: number): Promise<any> {
    return api.get(`/applications/${id}/`);
  },

  async getMyApplications(): Promise<any[]> {
    return api.get('/applications/my/');
  },
};