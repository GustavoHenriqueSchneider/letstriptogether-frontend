import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Destination, VoteRequest, Match } from '../types/api';

/**
 * Serviço de votação
 */
export const votingService = {
  /**
   * Lista os destinos não votados pelo membro no grupo
   */
  async getDestinationsNotVoted(groupId: string, pageNumber: number = 1, pageSize: number = 10): Promise<Destination[]> {
    const response = await apiClient.get<Destination[]>(
      `${API_ENDPOINTS.GROUPS.DESTINATIONS_NOT_VOTED(groupId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtém um destino específico por ID
   */
  async getDestination(destinationId: string): Promise<Destination> {
    const response = await apiClient.get<Destination>(
      API_ENDPOINTS.DESTINATIONS.GET(destinationId)
    );
    return response.data!;
  },

  /**
   * Vota em um destino (isApproved: true = like, false = dislike)
   */
  async vote(groupId: string, destinationId: string, isApproved: boolean): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.DESTINATION_VOTES.CREATE(groupId),
      {
        destinationId,
        isApproved,
      }
    );
  },

  /**
   * Lista todos os votos do membro no grupo
   */
  async getVotes(groupId: string, pageNumber: number = 1, pageSize: number = 10): Promise<any[]> {
    const response = await apiClient.get<any[]>(
      `${API_ENDPOINTS.DESTINATION_VOTES.LIST(groupId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Atualiza um voto existente
   */
  async updateVote(groupId: string, voteId: string, isApproved: boolean): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.DESTINATION_VOTES.UPDATE(groupId, voteId),
      {
        isApproved,
      }
    );
  },
};

/**
 * Serviço de matches
 */
export const matchService = {
  /**
   * Lista os matches (destinos combinados) de um grupo
   */
  async getMatches(groupId: string, pageNumber: number = 1, pageSize: number = 10): Promise<Match[]> {
    const response = await apiClient.get<Match[]>(
      `${API_ENDPOINTS.MATCHES.LIST(groupId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Obtém um match específico
   */
  async getMatch(groupId: string, matchId: string): Promise<Match> {
    const response = await apiClient.get<Match>(
      API_ENDPOINTS.MATCHES.GET(groupId, matchId)
    );
    return response.data!;
  },

  /**
   * Remove um match do grupo
   */
  async deleteMatch(groupId: string, matchId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.MATCHES.DELETE(groupId, matchId));
  },
};

