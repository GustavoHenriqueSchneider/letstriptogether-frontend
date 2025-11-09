/**
 * Configuração da API
 * 
 * Para usar uma API diferente em desenvolvimento/produção,
 * crie um arquivo .env.local com:
 * VITE_API_URL=https://sua-api.com/api
 */

export const API_CONFIG = {
  // URL base da API pública - pode ser sobrescrita por variável de ambiente
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5089/api/v1',
  
  // Timeout padrão para requisições (em ms)
  TIMEOUT: 30000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Endpoints da API (baseado na estrutura real da API pública)
export const API_ENDPOINTS = {
  // Usuário
  USER: {
    GET_CURRENT: '/users/me',
    UPDATE: '/users/me',
    DELETE: '/users/me',
    ANONYMIZE: '/users/me/anonymize',
    PREFERENCES: '/users/me/preferences',
  },
  
  // Grupos
  GROUPS: {
    LIST: '/groups',
    CREATE: '/groups',
    GET: (id: string) => `/groups/${id}`,
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
    LEAVE: (id: string) => `/groups/${id}/leave`,
    DESTINATIONS_NOT_VOTED: (id: string) => `/groups/${id}/destinations-not-voted`,
  },
  
  // Membros do grupo
  GROUP_MEMBERS: {
    LIST: (groupId: string) => `/groups/${groupId}/members`,
    GET: (groupId: string, memberId: string) => `/groups/${groupId}/members/${memberId}`,
    DELETE: (groupId: string, memberId: string) => `/groups/${groupId}/members/${memberId}`,
  },
  
  // Convites de grupo
  GROUP_INVITATIONS: {
    CREATE: (groupId: string) => `/groups/${groupId}/invitations`,
    GET_ACTIVE: (groupId: string) => `/groups/${groupId}/invitations`,
    CANCEL: (groupId: string) => `/groups/${groupId}/invitations/cancel`,
  },
  
  // Convites (aceitar/recusar)
  INVITATIONS: {
    ACCEPT: '/invitations/accept',
    REFUSE: '/invitations/refuse',
  },
  
  // Destinos
  DESTINATIONS: {
    GET: (id: string) => `/destinations/${id}`,
  },
  
  // Votação em destinos
  DESTINATION_VOTES: {
    CREATE: (groupId: string) => `/groups/${groupId}/destination-votes`,
    LIST: (groupId: string) => `/groups/${groupId}/destination-votes`,
    GET: (groupId: string, voteId: string) => `/groups/${groupId}/destination-votes/${voteId}`,
    UPDATE: (groupId: string, voteId: string) => `/groups/${groupId}/destination-votes/${voteId}`,
  },
  
  // Matches
  MATCHES: {
    LIST: (groupId: string) => `/groups/${groupId}/matches`,
    GET: (groupId: string, matchId: string) => `/groups/${groupId}/matches/${matchId}`,
    DELETE: (groupId: string, matchId: string) => `/groups/${groupId}/matches/${matchId}`,
  },
} as const;

