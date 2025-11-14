import apiClient from './client';

/**
 * Serviço de Usuários
 */

export interface GetCurrentUserResponse {
  name: string;
  email: string;
  preferences: any;
}

export interface UpdateUserRequest {
  name: string;
}

export const usersApi = {
  /**
   * Obter dados do usuário atual
   * GET /api/v1/users/me
   */
  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    const response = await apiClient.get<GetCurrentUserResponse>('/users/me');
    return response.data;
  },

  /**
   * Atualizar dados do usuário atual
   * PUT /api/v1/users/me
   */
  async updateCurrentUser(data: UpdateUserRequest): Promise<void> {
    await apiClient.put('/users/me', data);
  },

  /**
   * Anonimizar conta
   * PATCH /api/v1/users/me/anonymize
   */
  async anonymizeAccount(): Promise<void> {
    await apiClient.patch('/users/me/anonymize');
  },

  /**
   * Excluir conta
   * DELETE /api/v1/users/me
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete('/users/me');
  },

  /**
   * Alterar senha do usuário atual
   * POST /api/v1/users/me/change-password
   */
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await apiClient.post('/users/me/change-password', data);
  },
};

