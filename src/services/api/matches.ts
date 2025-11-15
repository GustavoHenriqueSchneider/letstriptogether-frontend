import apiClient from './client';
import type { Match, Destination } from '@/types';
import { destinationsApi } from './destinations';

interface GetAllGroupMatchesResponse {
  data: Array<{
    id: string;
    createdAt: string;
  }>;
  hits: number;
}

interface GetGroupMatchByIdResponse {
  destinationId: string;
  createdAt: string;
  updatedAt?: string;
}

export const matchesApi = {
  async getByGroup(
    groupId: string | number, 
    pageNumber = 1, 
    pageSize = 10
  ): Promise<{ matches: Match[]; hasMore: boolean; totalHits: number }> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    const response = await apiClient.get<GetAllGroupMatchesResponse>(
      `/groups/${id}/matches`,
      { params: { pageNumber, pageSize } }
    );

    const matchPromises = response.data.data.map(async (item) => {
      try {
        const matchDetails = await this.getById(groupId, item.id);
        
        const destination = await destinationsApi.getById(matchDetails.destinationId);
        
        const preferences = destination.attractions 
          ? [...new Set(destination.attractions.map(attr => attr.category))]
          : [];
        
        return {
          id: item.id,
          destination: {
            ...destination,
            id: matchDetails.destinationId,
            preferences: preferences
          },
          matchPercentage: 100,
          votes: 0,
          totalVotes: 0
        };
      } catch (error) {
        console.error(`Erro ao buscar match ${item.id}:`, error);
        return {
          id: item.id,
          destination: {
            id: item.id,
            name: 'Destino',
            country: '',
            image: '',
            price: '',
            duration: '',
            temperature: '',
            rating: 0,
            description: '',
            highlights: [],
            category: '',
            preferences: [],
            attractions: []
          },
          matchPercentage: 0,
          votes: 0,
          totalVotes: 0
        };
      }
    });

    const matches = await Promise.all(matchPromises);

    const totalHits = response.data.hits || 0;
    const currentPageItems = response.data.data.length;
    const hasMore = (pageNumber * pageSize) < totalHits;

    return {
      matches,
      hasMore,
      totalHits
    };
  },

  async getById(groupId: string | number, matchId: string | number): Promise<{ destinationId: string }> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const matchIdStr = typeof matchId === 'number' ? matchId.toString() : matchId;
    
    const response = await apiClient.get<GetGroupMatchByIdResponse>(
      `/groups/${groupIdStr}/matches/${matchIdStr}`
    );

    return {
      destinationId: response.data.destinationId
    };
  },

  async remove(groupId: string | number, matchId: string | number): Promise<void> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const matchIdStr = typeof matchId === 'number' ? matchId.toString() : matchId;
    
    await apiClient.delete(`/groups/${groupIdStr}/matches/${matchIdStr}`);
  }
};

