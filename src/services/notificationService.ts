import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type { Notification } from '../types/api';

/**
 * Serviço de notificações
 * 
 * NOTA: A API pública atual não tem endpoints de notificações.
 * Este serviço está preparado para quando os endpoints forem adicionados.
 */
export const notificationService = {
  /**
   * Lista todas as notificações do usuário
   * TODO: Implementar quando a API tiver endpoint de notificações
   */
  async listNotifications(): Promise<Notification[]> {
    // TODO: Implementar quando endpoint estiver disponível
    return [];
  },

  /**
   * Marca uma notificação como lida
   * TODO: Implementar quando a API tiver endpoint de notificações
   */
  async markAsRead(notificationId: string): Promise<void> {
    // TODO: Implementar quando endpoint estiver disponível
  },

  /**
   * Marca todas as notificações como lidas
   * TODO: Implementar quando a API tiver endpoint de notificações
   */
  async markAllAsRead(): Promise<void> {
    // TODO: Implementar quando endpoint estiver disponível
  },
};

