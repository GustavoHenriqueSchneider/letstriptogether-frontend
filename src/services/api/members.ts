import apiClient from './client';
import type { Member } from '@/types';

interface GetOtherGroupMembersResponse {
  data: Array<{
    id: string; // GUID do membro
    // A API não retorna name aqui, precisa buscar individualmente
  }>;
  hits: number;
}

interface GetGroupMemberByIdResponse {
  name: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface CreateGroupInvitationResponse {
  id?: string;
  token: string;
  // Adicione outros campos conforme necessário
}

/**
 * Serviço de Membros
 * 
 * Integrado com a API pública: /api/v1/groups/:groupId/members
 */
export const membersApi = {
  /**
   * Buscar outros membros de um grupo (excluindo o usuário atual)
   * GET /api/v1/groups/:groupId/members?pageNumber=1&pageSize=10
   * Retorna lista de membros e informações de paginação
   */
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

    // Buscar detalhes de cada membro
    const memberPromises = response.data.data.map(async (item) => {
      try {
        const memberDetails = await this.getById(groupId, item.id);
        return {
          id: item.id, // Manter como string (GUID)
          name: memberDetails.name,
          email: memberDetails.email,
          avatar: memberDetails.avatar,
          role: memberDetails.role,
          joinedAt: memberDetails.joinedAt,
          votesCount: memberDetails.votesCount
        };
      } catch (error) {
        console.error(`Erro ao buscar detalhes do membro ${item.id}:`, error);
        // Retornar membro básico em caso de erro
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

    // Verificar se há mais páginas
    const totalHits = response.data.hits || 0;
    const currentPageItems = response.data.data.length;
    const hasMore = (pageNumber * pageSize) < totalHits;

    return {
      members,
      hasMore,
      totalHits
    };
  },

  /**
   * Buscar membro específico por ID
   * GET /api/v1/groups/:groupId/members/:memberId
   */
  async getById(groupId: string | number, memberId: string | number): Promise<Member> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const memberIdStr = typeof memberId === 'number' ? memberId.toString() : memberId;
    
    const response = await apiClient.get<GetGroupMemberByIdResponse>(
      `/groups/${groupIdStr}/members/${memberIdStr}`
    );

    return {
      id: memberIdStr, // Manter como string (GUID)
      name: response.data.name,
      email: '', // API não retorna email
      avatar: undefined,
      role: response.data.isOwner ? 'owner' as const : 'member' as const,
      joinedAt: response.data.createdAt,
      votesCount: 0
    };
  },

  /**
   * Criar convite para o grupo
   * POST /api/v1/groups/:groupId/invitations
   */
  async invite(groupId: string | number): Promise<{ inviteLink: string }> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    const response = await apiClient.post<CreateGroupInvitationResponse>(
      `/groups/${id}/invitations`
    );

    // A API retorna o token, precisamos construir o link
    const token = response.data.token || (response.data as any).data?.token;
    
    if (!token) {
      console.error('[membersApi.invite] token não encontrado na resposta:', response.data);
      throw new Error('Resposta da API não contém token');
    }

    // Construir o link usando a rota atual
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/invitation?token=${token}`;

    return {
      inviteLink
    };
  },

  /**
   * Obter convite ativo do grupo
   * GET /api/v1/groups/:groupId/invitations
   */
  async getActiveInvitation(groupId: string | number): Promise<{ inviteLink: string } | null> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    try {
      const response = await apiClient.get<CreateGroupInvitationResponse>(
        `/groups/${id}/invitations`
      );
      
      // A API retorna o token, precisamos construir o link
      const token = response.data.token || (response.data as any).data?.token;
      
      if (!token) {
        console.warn('[membersApi.getActiveInvitation] token não encontrado na resposta:', response.data);
        return null;
      }

      // Construir o link usando a rota atual
      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/invitation?token=${token}`;

      return {
        inviteLink
      };
    } catch (error: any) {
      console.log('[membersApi.getActiveInvitation] Erro ao buscar convite:', error);
      return null;
    }
  },

  /**
   * Cancelar convite ativo do grupo
   * PATCH /api/v1/groups/:groupId/invitations/cancel
   */
  async cancelInvitation(groupId: string | number): Promise<void> {
    const id = typeof groupId === 'number' ? groupId.toString() : groupId;
    await apiClient.patch(`/groups/${id}/invitations/cancel`);
  },

  /**
   * Remover membro do grupo
   * DELETE /api/v1/groups/:groupId/members/:memberId
   */
  async remove(groupId: string | number, memberId: string | number): Promise<void> {
    const groupIdStr = typeof groupId === 'number' ? groupId.toString() : groupId;
    const memberIdStr = typeof memberId === 'number' ? memberId.toString() : memberId;
    
    await apiClient.delete(`/groups/${groupIdStr}/members/${memberIdStr}`);
  }
};
