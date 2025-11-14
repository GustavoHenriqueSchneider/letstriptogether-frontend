/**
 * Serviço de Notificações
 * 
 * ⚠️ A API pública não expõe endpoint de notificações para o frontend
 * As notificações são processadas internamente pela API
 * 
 * Se precisar de notificações, você pode:
 * 1. Usar SignalR/WebSockets para receber notificações em tempo real
 * 2. Criar um endpoint na API interna para buscar notificações
 * 3. Usar polling para verificar novas notificações
 */

import type { Notification } from '@/types';
// TODO: Remover import mock quando tiver endpoint de notificações
import { mockNotifications } from '../mock/data';

export const notificationsApi = {
  /**
   * Buscar todas as notificações
   * TODO: Criar endpoint na API ou usar SignalR
   */
  async getAll(): Promise<Notification[]> {
    // A API pública não tem endpoint de notificações
    // Por enquanto, retornamos dados mockados
    // TODO: Implementar quando tiver endpoint ou SignalR
    return Promise.resolve(mockNotifications);
  },

  /**
   * Marcar notificação como lida
   * TODO: Criar endpoint na API
   */
  async markAsRead(id: number): Promise<void> {
    // A API pública não tem endpoint de notificações
    // TODO: Implementar quando tiver endpoint
    console.log(`Mark notification ${id} as read`);
    return Promise.resolve();
  }
};
