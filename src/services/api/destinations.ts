import apiClient from './client';
import type { Destination } from '@/types';


interface GetNotVotedDestinationsResponse {
  data: Array<{
    id: string;
    createdAt: string;
  }>;
  hits: number;
}

interface GetDestinationByIdResponse {
  id: string;
  place: string;
  description: string;
  image?: string;
  country?: string;
  price?: string;
  duration?: string;
  temperature?: string;
  rating?: number;
  attractions: Array<{
    name: string;
    description: string;
    category: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

interface VoteResponse {
  id: string;
}

export const destinationsApi = {
  async getById(destinationId: string | number): Promise<Destination> {
    const id = typeof destinationId === 'number' ? destinationId.toString() : destinationId;
    const response = await apiClient.get<GetDestinationByIdResponse>(`/destinations/${id}`);

    const attractions = response.data.attractions || [];
    const highlights = attractions.map(attr => attr.name);
    
    return {
      id: response.data.id ?? destinationId,
      name: response.data.place,
      country: response.data.country || '',
      image: response.data.image || '',
      price: response.data.price || '',
      duration: response.data.duration || '',
      temperature: response.data.temperature || '',
      rating: response.data.rating ?? 0,
      description: response.data.description,
      highlights: highlights,
      category: attractions[0]?.category || '',
      preferences: attractions.map(attr => attr.category),
      attractions: attractions.map(attr => ({
        name: attr.name,
        description: attr.description,
        category: attr.category
      }))
    };
  },

  async getNotVotedByGroup(
    groupId: string | number, 
    pageNumber = 1, 
    pageSize = 10
  ): Promise<{ destinations: Destination[]; hasMore: boolean; totalHits: number }> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    const response = await apiClient.get<GetNotVotedDestinationsResponse>(
      `/groups/${id}/destinations-not-voted`,
      { params: { pageNumber, pageSize } }
    );

    const destinationPromises = response.data.data.map(async (item) => {
      try {
        const destination = await this.getById(item.id);
        return {
          ...destination,
          id: item.id
        };
      } catch (error) {
        console.error(`Erro ao buscar destino ${item.id}:`, error);
        return {
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
        };
      }
    });

    const destinations = await Promise.all(destinationPromises);
    
    const totalHits = response.data.hits || 0;
    const currentPageItems = response.data.data.length;
    const hasMore = (pageNumber * pageSize) < totalHits;

    return {
      destinations,
      hasMore,
      totalHits
    };
  },

  async vote(
    groupId: string | number, 
    destinationId: string | number, 
    isApproved: boolean
  ): Promise<VoteResponse> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const destinationIdStr = typeof destinationId === 'number' ? destinationId.toString() : destinationId;
    
    const response = await apiClient.post<VoteResponse>(
      `/groups/${groupIdStr}/destination-votes`,
      {
        destinationId: destinationIdStr,
        isApproved
      }
    );

    return response.data;
  },

  async updateVote(
    groupId: string | number,
    destinationVoteId: string | number,
    isApproved: boolean
  ): Promise<void> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const voteIdStr = typeof destinationVoteId === 'number' ? destinationVoteId.toString() : destinationVoteId;
    
    await apiClient.put(`/groups/${groupIdStr}/destination-votes/${voteIdStr}`, {
      isApproved
    });
  },

  async getVotes(groupId: string | number, pageNumber = 1, pageSize = 10) {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    const response = await apiClient.get(`/groups/${id}/destination-votes`, {
      params: { pageNumber, pageSize }
    });
    return response.data;
  }
};
