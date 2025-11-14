import apiClient from './client';

interface InvitationResponse {
  groupName: string;
  createdBy: string;
  isActive: boolean;
}

export const invitationsApi = {
  async getInvitation(token: string): Promise<InvitationResponse> {
    const response = await apiClient.get<InvitationResponse>('/invitations', {
      params: { token },
    });
    return response.data;
  },

  async acceptInvitation(token: string): Promise<void> {
    await apiClient.post('/invitations/accept', { token });
  },

  async refuseInvitation(token: string): Promise<void> {
    await apiClient.post('/invitations/refuse', { token });
  },
};

