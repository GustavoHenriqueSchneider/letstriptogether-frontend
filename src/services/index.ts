/**
 * Exporta todos os serviços de forma centralizada
 */
export { apiClient } from './apiClient';
export type { ApiResponse, ApiError } from './apiClient';

export { authService } from './authService';
export { groupService, invitationService } from './groupService';
export { votingService, matchService } from './votingService';
export { notificationService } from './notificationService';
export { preferencesService } from './preferencesService';

// Exporta todos os tipos
export type * from '../types/api';

