import apiClient from './client';
import type { Group } from '@/types';

interface GetAllGroupsResponse {
  data: Array<{
    id: string;
    createdAt: string;
  }>;
  hits: number;
}

interface GetGroupByIdResponse {
  name: string;
  tripExpectedDate: string;
  createdAt: string;
  updatedAt?: string;
  isCurrentMemberOwner: boolean;
  preferences?: {
    likesShopping: boolean;
    food: string[];
    culture: string[];
    entertainment: string[];
    placeTypes: string[];
  };
}

interface CreateGroupResponse {
  id: string;
}

export const groupsApi = {
  async getAllWithDetails(pageNumber = 1, pageSize = 10): Promise<{ groups: Group[]; hasMore: boolean }> {
    const response = await apiClient.get<GetAllGroupsResponse>('/groups', {
      params: { pageNumber, pageSize }
    });

    const totalItems = response.data.hits || 0;
    const currentPageItems = response.data.data.length;
    const hasMore = (pageNumber * pageSize) < totalItems;

    const groupsWithDetails = await Promise.all(
      response.data.data.map(async (item) => {
        const groupId = item.id;
        
        const groupDetails = await apiClient.get<GetGroupByIdResponse>(`/groups/${groupId}`);
        
        const membersResponse = await apiClient.get<{ data: any[]; hits: number }>(`/groups/${groupId}/members`, {
          params: { pageNumber: 1, pageSize: 1 }
        });
        const membersCount = (membersResponse.data.hits || 0) + 1;
        
        const matchesResponse = await apiClient.get<{ data: any[]; hits: number }>(`/groups/${groupId}/matches`, {
          params: { pageNumber: 1, pageSize: 1 }
        });
        const hasMatches = (matchesResponse.data.hits || 0) > 0;
        
        const tripDate = groupDetails.data.tripExpectedDate 
          ? new Date(groupDetails.data.tripExpectedDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          : new Date(item.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        
        return {
          id: groupId,
          name: groupDetails.data.name,
          members: membersCount,
          status: hasMatches ? 'matched' as const : 'voting' as const,
          avatar: '👥',
          date: tripDate
        };
      })
    );

    return {
      groups: groupsWithDetails,
      hasMore
    };
  },

  async getAll(pageNumber = 1, pageSize = 10): Promise<Group[]> {
    const response = await apiClient.get<GetAllGroupsResponse>('/groups', {
      params: { pageNumber, pageSize }
    });

    return response.data.data.map((item) => ({
      id: item.id,
      name: `Grupo ${item.id.substring(0, 8)}`,
      members: 0,
      status: 'voting' as const,
      avatar: '👥',
      date: new Date(item.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    }));
  },

  async getById(id: string): Promise<Group> {
    const response = await apiClient.get<GetGroupByIdResponse>(`/groups/${id}`);

    return {
      id,
      name: response.data.name,
      members: 0,
      status: 'voting' as const,
      avatar: '👥',
      date: new Date(response.data.tripExpectedDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      isCurrentMemberOwner: response.data.isCurrentMemberOwner
    };
  },

  async create(data: { name: string; date: string }): Promise<Group> {
    const response = await apiClient.post<CreateGroupResponse>('/groups', {
      name: data.name,
      tripExpectedDate: data.date
    });

    return {
      id: response.data.id,
      name: data.name,
      members: 1,
      status: 'voting' as const,
      avatar: '🆕',
      date: new Date(data.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    };
  },

  async update(id: string, data: Partial<Group>): Promise<Group> {
    await apiClient.put(`/groups/${id}`, {
      name: data.name
    });

    return this.getById(id);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/groups/${id}`);
  },

  async leave(id: string): Promise<void> {
    await apiClient.patch(`/groups/${id}/leave`);
  },

  async getNotVotedDestinations(groupId: string, pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get(`/groups/${groupId}/destinations-not-voted`, {
      params: { pageNumber, pageSize }
    });
    return response.data;
  }
};

