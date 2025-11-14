import { useEffect, useCallback } from 'react';
import { signalRClient } from '@/services/websocket/signalrClient';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import type { Notification } from '@/types';

/**
 * Hook para gerenciar conexão WebSocket e receber notificações
 */
export function useWebSocket() {
  const { isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useModalStore();

  // Conectar quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      signalRClient.connect().catch((error) => {
        console.error('Erro ao conectar WebSocket:', error);
        showError('Erro ao conectar com o servidor em tempo real');
      });
    } else {
      signalRClient.disconnect().catch((error) => {
        console.error('Erro ao desconectar WebSocket:', error);
      });
    }

    // Cleanup ao desmontar
    return () => {
      if (!isAuthenticated) {
        signalRClient.disconnect().catch(console.error);
      }
    };
  }, [isAuthenticated, showError]);

  // Handler para notificações
  const handleNotification = useCallback((notification: Notification) => {
    console.log('Nova notificação recebida:', notification);
    
    // Mostrar notificação ao usuário (opcional)
    if (notification.type === 'match') {
      showSuccess(`Novo match encontrado: ${notification.title}`);
    } else if (notification.type === 'invitation') {
      showSuccess(`Você recebeu um convite: ${notification.title}`);
    }
  }, [showSuccess]);

  // Handler para atualizações de grupo
  const handleGroupUpdated = useCallback((group: any) => {
    console.log('Grupo atualizado:', group);
    // Aqui você pode atualizar o estado do grupo ou mostrar uma notificação
  }, []);

  // Handler para atualizações de match
  const handleMatchUpdated = useCallback((match: any) => {
    console.log('Match atualizado:', match);
    // Aqui você pode atualizar o estado do match ou mostrar uma notificação
  }, []);

  // Registrar handlers
  useEffect(() => {
    if (isAuthenticated && signalRClient.isConnected()) {
      signalRClient.onNotificationReceived(handleNotification);
      signalRClient.onGroupUpdated(handleGroupUpdated);
      signalRClient.onMatchUpdated(handleMatchUpdated);
    }

    // Cleanup handlers
    return () => {
      signalRClient.removeAllHandlers();
    };
  }, [isAuthenticated, handleNotification, handleGroupUpdated, handleMatchUpdated]);

  return {
    isConnected: signalRClient.isConnected(),
    connectionState: signalRClient.getState()
  };
}

