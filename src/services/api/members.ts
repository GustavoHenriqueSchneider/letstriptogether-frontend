import apiClient from './client';
import type { Member } from '@/types';

interface GetOtherGroupMembersResponse {
  data: Array<{
    id: string;
  }>;
  hits: number;
}

interface GetGroupMemberByIdResponse {
  name: string;
  isCurrentMemberOwner: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface CreateGroupInvitationResponse {
  id?: string;
  token: string;
}

export const membersApi = {
  async getByGroup(
    groupId: string | number, 
    pageNumber = 1, 
    pageSize = 10
  ): Promise<{ members: Member[]; hasMore: boolean; totalHits: number }> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    const response = await apiClient.get<GetOtherGroupMembersResponse>(
      `/groups/${id}/members`,
      { params: { pageNumber, pageSize } }
    );

    const memberPromises = response.data.data.map(async (item) => {
      try {
        const memberDetails = await this.getById(groupId, item.id);
        return {
          id: item.id,
          name: memberDetails.name,
          email: memberDetails.email,
          avatar: memberDetails.avatar,
          role: memberDetails.role,
          joinedAt: memberDetails.joinedAt,
          votesCount: memberDetails.votesCount
        };
      } catch (error) {
        return {
          id: item.id,
          name: 'Membro',
          email: '',
          avatar: undefined,
          role: 'member' as const,
          joinedAt: new Date().toISOString(),
          votesCount: 0
        };
      }
    });

    const members = await Promise.all(memberPromises);

    const totalHits = response.data.hits || 0;
    const currentPageItems = response.data.data.length;
    const hasMore = (pageNumber * pageSize) < totalHits;

    return {
      members,
      hasMore,
      totalHits
    };
  },

  async getById(groupId: string | number, memberId: string | number): Promise<Member> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const memberIdStr = typeof memberId === 'number' ? memberId.toString() : memberId;
    
    const response = await apiClient.get<GetGroupMemberByIdResponse>(
      `/groups/${groupIdStr}/members/${memberIdStr}`
    );

    return {
      id: memberIdStr,
      name: response.data.name,
      email: '',
      avatar: undefined,
      role: response.data.isCurrentMemberOwner ? 'owner' as const : 'member' as const,
      joinedAt: response.data.createdAt,
      votesCount: 0
    };
  },

  async invite(groupId: string | number): Promise<{ inviteLink: string }> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    const response = await apiClient.post<CreateGroupInvitationResponse>(
      `/groups/${id}/invitations`
    );

    const token = response.data.token || (response.data as any).data?.token;
    
    if (!token) {
      throw new Error('Resposta da API não contém token');
    }

    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/invitations?token=${token}`;

    return {
      inviteLink
    };
  },

  async getActiveInvitation(groupId: string | number): Promise<{ inviteLink: string } | null> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    try {
      const response = await apiClient.get<CreateGroupInvitationResponse>(
        `/groups/${id}/invitations`
      );
      
      const token = response.data.token || (response.data as any).data?.token;
      
      if (!token) {
        return null;
      }

      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/invitations?token=${token}`;

      return {
        inviteLink
      };
    } catch (error: any) {
      return null;
    }
  },

  async cancelInvitation(groupId: string | number): Promise<void> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    await apiClient.patch(`/groups/${id}/invitations/cancel`);
  },

  async remove(groupId: string | number, memberId: string | number): Promise<void> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const memberIdStr = typeof memberId === 'number' ? memberId.toString() : memberId;
    
    await apiClient.delete(`/groups/${groupIdStr}/members/${memberIdStr}`);
  }
};
