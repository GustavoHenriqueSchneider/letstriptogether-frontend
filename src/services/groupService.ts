import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  Group,
  CreateGroupRequest,
  GroupMember,
  Invitation,
} from '../types/api';

/**
 * Serviço de grupos
 */
export const groupService = {
  /**
   * Lista todos os grupos do usuário
   */
  async listGroups(pageNumber: number = 1, pageSize: number = 10): Promise<Group[]> {
    const response = await apiClient.get<Group[]>(
      `${API_ENDPOINTS.GROUPS.LIST}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    // A API pode retornar um objeto paginado, ajustar conforme necessário
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtém um grupo específico
   */
  async getGroup(id: string): Promise<Group> {
    const response = await apiClient.get<Group>(API_ENDPOINTS.GROUPS.GET(id));
    return response.data!;
  },

  /**
   * Cria um novo grupo
   */
  async createGroup(data: CreateGroupRequest): Promise<Group> {
    const response = await apiClient.post<Group>(
      API_ENDPOINTS.GROUPS.CREATE,
      {
        name: data.name,
        tripExpectedDate: data.date || new Date().toISOString(),
      }
    );
    return response.data!;
  },

  /**
   * Atualiza um grupo
   */
  async updateGroup(id: string, data: Partial<CreateGroupRequest>): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.GROUPS.UPDATE(id),
      data
    );
  },

  /**
   * Deleta um grupo
   */
  async deleteGroup(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.GROUPS.DELETE(id));
  },

  /**
   * Lista os membros de um grupo
   */
  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const response = await apiClient.get<GroupMember[]>(
      API_ENDPOINTS.GROUP_MEMBERS.LIST(groupId)
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtém o convite ativo de um grupo (retorna o token do convite)
   */
  async getInviteLink(groupId: string): Promise<string> {
    const response = await apiClient.get<{ token: string }>(
      API_ENDPOINTS.GROUP_INVITATIONS.GET_ACTIVE(groupId)
    );
    // Retorna o token do convite que pode ser usado para criar o link
    return response.data?.token || '';
  },

  /**
   * Cria um novo convite para o grupo
   */
  async createInvite(groupId: string): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>(
      API_ENDPOINTS.GROUP_INVITATIONS.CREATE(groupId),
      null
    );
    return response.data!;
  },

  /**
   * Cancela o convite ativo de um grupo
   */
  async cancelInvite(groupId: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.GROUP_INVITATIONS.CANCEL(groupId), null);
  },

  /**
   * Sai de um grupo
   */
  async leaveGroup(groupId: string): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.GROUPS.LEAVE(groupId), null);
  },

  /**
   * Lista destinos não votados pelo membro no grupo
   */
  async getDestinationsNotVoted(groupId: string, pageNumber: number = 1, pageSize: number = 10): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `${API_ENDPOINTS.GROUPS.DESTINATIONS_NOT_VOTED(groupId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },
};

/**
 * Serviço de convites
 */
export const invitationService = {
  /**
   * Aceita um convite usando o token do convite
   */
  async acceptInvitation(token: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.INVITATIONS.ACCEPT, {
      token,
    });
  },

  /**
   * Recusa um convite usando o token do convite
   */
  async refuseInvitation(token: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.INVITATIONS.REFUSE, {
      token,
    });
  },
};

