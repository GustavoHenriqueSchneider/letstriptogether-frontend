import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Preferences, UpdatePreferencesRequest } from '../types/api';

/**
 * Serviço de preferências
 */
export const preferencesService = {
  /**
   * Obtém as preferências do usuário
   */
  async getPreferences(): Promise<Preferences> {
    // As preferências vêm junto com o perfil do usuário
    const response = await apiClient.get<any>(API_ENDPOINTS.USER.GET_CURRENT);
    return response.data?.preferences || {};
  },

  /**
   * Atualiza as preferências do usuário
   */
  async updatePreferences(data: UpdatePreferencesRequest): Promise<void> {
    await apiClient.put(API_ENDPOINTS.USER.PREFERENCES, data);
  },
};

