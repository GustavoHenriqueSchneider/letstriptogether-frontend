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

/**
 * Serviço de Matches
 * 
 * Integrado com a API pública: /api/v1/groups/:groupId/matches
 */
export const matchesApi = {
  /**
   * Buscar todos os matches de um grupo com paginação
   * GET /api/v1/groups/:groupId/matches?pageNumber=1&pageSize=10
   * Retorna lista de matches completos com informações de paginação
   */
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

    // Para cada matchId, buscar detalhes (destinationId) e depois o destino completo
    const matchPromises = response.data.data.map(async (item) => {
      try {
        // Buscar detalhes do match para obter destinationId
        const matchDetails = await this.getById(groupId, item.id);
        
        // Buscar destino completo usando destinationId
        const destination = await destinationsApi.getById(matchDetails.destinationId);
        
        // Extrair preferências únicas das atrações
        const preferences = destination.attractions 
          ? [...new Set(destination.attractions.map(attr => attr.category))]
          : [];
        
        return {
          id: item.id, // Manter como string (GUID)
          destination: {
            ...destination,
            id: matchDetails.destinationId, // Usar destinationId do match
            preferences: preferences // Adicionar preferências extraídas
          },
          matchPercentage: 100, // Por enquanto 100%, pode ser calculado depois
          votes: 0, // Será implementado depois
          totalVotes: 0 // Será implementado depois
        };
      } catch (error) {
        console.error(`Erro ao buscar match ${item.id}:`, error);
        // Retornar match básico em caso de erro
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

    // Verificar se há mais páginas
    const totalHits = response.data.hits || 0;
    const currentPageItems = response.data.data.length;
    const hasMore = (pageNumber * pageSize) < totalHits;

    return {
      matches,
      hasMore,
      totalHits
    };
  },

  /**
   * Buscar match específico por ID
   * GET /api/v1/groups/:groupId/matches/:matchId
   * Retorna apenas o destinationId
   */
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

  /**
   * Remover match do grupo
   * DELETE /api/v1/groups/:groupId/matches/:matchId
   */
  async remove(groupId: string | number, matchId: string | number): Promise<void> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const matchIdStr = typeof matchId === 'number' ? matchId.toString() : matchId;
    
    await apiClient.delete(`/groups/${groupIdStr}/matches/${matchIdStr}`);
  }
};

