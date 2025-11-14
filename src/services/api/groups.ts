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
  isOwner: boolean;
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

/**
 * Serviço de Grupos
 * 
 * Integrado com a API pública: /api/v1/groups
 */
export const groupsApi = {
  /**
   * Buscar todos os grupos do usuário com detalhes completos
   * GET /api/v1/groups?pageNumber=1&pageSize=10
   * Para cada grupo, busca detalhes, membros e matches
   * Retorna grupos e informação se há mais páginas
   */
  async getAllWithDetails(pageNumber = 1, pageSize = 10): Promise<{ groups: Group[]; hasMore: boolean }> {
    const response = await apiClient.get<GetAllGroupsResponse>('/groups', {
      params: { pageNumber, pageSize }
    });

    // Verificar se há mais páginas
    const totalItems = response.data.hits || 0;
    const currentPageItems = response.data.data.length;
    const hasMore = (pageNumber * pageSize) < totalItems;

    // Para cada grupo, buscar detalhes completos
    const groupsWithDetails = await Promise.all(
      response.data.data.map(async (item) => {
        const groupId = item.id;
        
        // Buscar detalhes do grupo (nome e data)
        const groupDetails = await apiClient.get<GetGroupByIdResponse>(`/groups/${groupId}`);
        
        // Buscar membros (hits + 1 para contar o usuário atual)
        const membersResponse = await apiClient.get<{ data: any[]; hits: number }>(`/groups/${groupId}/members`, {
          params: { pageNumber: 1, pageSize: 1 }
        });
        const membersCount = (membersResponse.data.hits || 0) + 1;
        
        // Buscar matches para determinar status
        const matchesResponse = await apiClient.get<{ data: any[]; hits: number }>(`/groups/${groupId}/matches`, {
          params: { pageNumber: 1, pageSize: 1 }
        });
        const hasMatches = (matchesResponse.data.hits || 0) > 0;
        
        // Formatar data
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

  /**
   * Buscar todos os grupos do usuário (versão simples, apenas IDs)
   * GET /api/v1/groups?pageNumber=1&pageSize=10
   */
  async getAll(pageNumber = 1, pageSize = 10): Promise<Group[]> {
    const response = await apiClient.get<GetAllGroupsResponse>('/groups', {
      params: { pageNumber, pageSize }
    });

    // Transformar resposta da API para formato do frontend
    return response.data.data.map((item) => ({
      id: item.id,
      name: `Grupo ${item.id.substring(0, 8)}`, // Nome temporário
      members: 0, // Será preenchido quando buscar detalhes
      status: 'voting' as const,
      avatar: '👥',
      date: new Date(item.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    }));
  },

  /**
   * Buscar grupo por ID
   * GET /api/v1/groups/:groupId
   */
  async getById(id: string): Promise<Group> {
    const response = await apiClient.get<GetGroupByIdResponse>(`/groups/${id}`);

    // Transformar resposta da API para formato do frontend
    return {
      id,
      name: response.data.name,
      members: 0, // Será preenchido quando buscar membros
      status: 'voting' as const,
      avatar: '👥',
      date: new Date(response.data.tripExpectedDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      isOwner: response.data.isOwner
    };
  },

  /**
   * Criar novo grupo
   * POST /api/v1/groups
   */
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

  /**
   * Atualizar grupo
   * PUT /api/v1/groups/:groupId
   */
  async update(id: string, data: Partial<Group>): Promise<Group> {
    await apiClient.put(`/groups/${id}`, {
      name: data.name
      // Adicione outros campos conforme necessário
    });

    // Buscar grupo atualizado
    return this.getById(id);
  },

  /**
   * Deletar grupo
   * DELETE /api/v1/groups/:groupId
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/groups/${id}`);
  },

  /**
   * Sair do grupo
   * PATCH /api/v1/groups/:groupId/leave
   */
  async leave(id: string): Promise<void> {
    await apiClient.patch(`/groups/${id}/leave`);
  },

  /**
   * Obter destinos não votados pelo membro
   * GET /api/v1/groups/:groupId/destinations-not-voted
   */
  async getNotVotedDestinations(groupId: string, pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get(`/groups/${groupId}/destinations-not-voted`, {
      params: { pageNumber, pageSize }
    });
    return response.data;
  }
};

