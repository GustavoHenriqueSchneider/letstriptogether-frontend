import apiClient from './client';

export interface GetCurrentUserResponse {
  name: string;
  email: string;
  preferences: any;
}

export interface UpdateUserRequest {
  name: string;
}

export const usersApi = {
  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    const response = await apiClient.get<GetCurrentUserResponse>('/users/me');
    return response.data;
  },

  async updateCurrentUser(data: UpdateUserRequest): Promise<void> {
    await apiClient.put('/users/me', data);
  },

  async anonymizeAccount(): Promise<void> {
    await apiClient.patch('/users/me/anonymize');
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete('/users/me');
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await apiClient.post('/users/me/change-password', data);
  },
};

